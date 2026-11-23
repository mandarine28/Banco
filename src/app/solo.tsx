import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameLayout } from '@/components/GameLayout';
import { Pressable } from '@/components/Pressable';
import { AnswerChips } from '@/components/game/AnswerChips';
import { CategoryBadge } from '@/components/game/CategoryBadge';
import { PlayIntroTransition } from '@/components/game/PlayIntroTransition';
import { SkipIcon } from '@/components/game/PlayPhase';
import { TurnEndTransition } from '@/components/game/TurnEndTransition';
import { PACK_THEME_IDS, type ProductId } from '@/config/shop';
import { questionsFor } from '@/data/questions';
import type { Question } from '@/data/types';
import { getAnswers, getSubject, hiddenAnswers, visibleAnswers } from '@/game/answers';
import { type GameTeam, planQuestions, TURN_SECONDS } from '@/game/engine';
import { CLASSIC_THEMES, dailyQuestion } from '@/lib/dailyQuestion';
import { scheduleDailyReminders } from '@/lib/dailyReminder';
import { playHaptic } from '@/lib/haptics';
import { AnimatedFlame } from '@/components/AnimatedFlame';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { markPacksPlayed } from '@/lib/packHistory';
import { getQuestionHistory, markQuestionSeen } from '@/lib/questionHistory';
import { PUBLIC_STORE_URL } from '@/lib/shareResult';
import { type DailyRecord, dayKey, matchAnswer, nextStreak } from '@/lib/solo';
import { addDailyHistory, type DailyHistoryEntry, loadDailyHistory, loadDailyRecord, loadSoloRecord, saveDailyRecord, saveSoloRecord } from '@/lib/soloStorage';
import { playSound } from '@/lib/sounds';
import { markTrialUsed } from '@/lib/trials';
import { useGameSettings } from '@/state/gameSettings';
import { usePurchases } from '@/state/purchases';
import { colors, fonts, teamColors } from '@/theme';

// Prototype (Outils de test) : textes en français seulement, traduits une fois le concept validé.
// Les transitions des parties annoncent une équipe : en solo, c'est le joueur
const SOLO_TEAM: GameTeam = { name: 'Solo', color: teamColors[0] };
const TICK_MS = 250;
const WARNING_SECONDS = 10;
const ORANGE = ['#fb940e', '#f2c512'] as const;

type Phase = 'intro' | 'play' | 'result';
/** Transition plein écran : 'covering' cache l'écran d'arrivée, 'revealing' = fondu de sortie. */
type Overlay = 'covering' | 'revealing' | null;

const shortDate = (day: string) => `${day.slice(8, 10)}/${day.slice(5, 7)}`;

/**
 * Mode solo (catégories et manches choisies dans les paramètres de partie, le plus de réponses possible en 60 s par manche)
 * et défi du jour (`?daily=1` : même question pour tous, une tentative par jour). */
export default function SoloScreen() {
  const isDaily = useLocalSearchParams<{ daily?: string }>().daily === '1';
  const { lang } = useLang();
  const t = getT(lang);
  const d = t.daily;
  const insets = useSafeAreaInsets();
  const [today] = useState(() => dayKey(new Date()));
  const settings = useGameSettings();
  const { hasPurchased } = usePurchases();
  // Packs offerts pas encore gagnés : jouables seulement le temps d'un essai
  const lockedPackThemes = (Object.keys(PACK_THEME_IDS) as ProductId[]).filter((product) => !hasPurchased(product)).map((product) => PACK_THEME_IDS[product] ?? '');
  const [soloThemes, setSoloThemes] = useState(() => (settings.selectedThemes.length > 0 ? settings.selectedThemes : CLASSIC_THEMES));

  // Solo : une question à la fois, tirée dans les catégories choisies ; jamais vues et plus anciennes d'abord
  const pickQuestion = (themeIds: readonly string[], previousId?: string): Question => {
    if (isDaily) return dailyQuestion(today);
    const all = questionsFor(lang, themeIds);
    const pool = all.length > 0 ? all : questionsFor(lang, CLASSIC_THEMES);
    const fresh = pool.length > 1 ? pool.filter((q) => q.id !== previousId) : pool;
    return planQuestions(fresh, 1, Math.random, getQuestionHistory())[0];
  };
  const [question, setQuestion] = useState<Question>(() => pickQuestion(soloThemes));
  useEffect(() => {
    markQuestionSeen(question.id);
  }, [question.id]);

  // Comme une partie : packs datés pour l'ordre des paramètres, essai consommé dès le lancement
  const trialTheme = isDaily ? undefined : soloThemes.find((id) => lockedPackThemes.includes(id));
  const { removeTrialPack } = settings;
  useEffect(() => {
    if (!trialTheme) return;
    markTrialUsed(trialTheme);
    removeTrialPack(trialTheme);
  }, [trialTheme, removeTrialPack]);
  const playedPacksKey = isDaily ? '' : soloThemes.filter((id) => Object.values(PACK_THEME_IDS).includes(id)).join(',');
  useEffect(() => {
    if (playedPacksKey) markPacksPlayed(playedPacksKey.split(','));
  }, [question, playedPacksKey]);
  const [phase, setPhase] = useState<Phase>('intro');
  const [intro, setIntro] = useState<Overlay>(null);
  const [outro, setOutro] = useState<Overlay>(null);
  const [newRecord, setNewRecord] = useState(false);
  const [record, setRecord] = useState(0);
  const [daily, setDaily] = useState<DailyRecord | null>(null);
  // Défi déjà joué aujourd'hui : ses réponses, pour les remontrer en revenant sur l'écran
  const [todayEntry, setTodayEntry] = useState<DailyHistoryEntry | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [miss, setMiss] = useState(false);
  const [remainingMs, setRemainingMs] = useState(TURN_SECONDS * 1000);
  const foundRef = useRef<string[]>([]);
  const startedAt = useRef(0);
  const finished = useRef(false);
  const chipsRef = useRef<ScrollViewInstance>(null);

  const answers = useMemo(() => [...getAnswers(question, lang), ...hiddenAnswers(question, lang)], [question, lang]);
  const playedToday = isDaily && daily?.day === today;
  const shownPhase: Phase = playedToday && phase === 'intro' ? 'result' : phase;

  useEffect(() => {
    if (isDaily) {
      loadDailyRecord().then(setDaily);
      loadDailyHistory().then((history) => setTodayEntry(history.find((entry) => entry.day === today) ?? null));
    } else {
      loadSoloRecord().then(setRecord);
    }
  }, [isDaily, today]);

  // Sons et vibrations de fin : joués par la transition de fin, comme en partie
  const finish = (finalFound: string[]) => {
    if (finished.current) return;
    finished.current = true;
    Keyboard.dismiss();
    setPhase('result');
    setOutro('covering');
    if (isDaily) {
      const next = { day: today, score: finalFound.length, streak: nextStreak(daily, today) };
      setDaily(next);
      saveDailyRecord(next);
      const entry = { day: today, questionId: question.id, found: finalFound, total: getAnswers(question, lang).length };
      setTodayEntry(entry);
      addDailyHistory(entry);
      scheduleDailyReminders(next.streak, d, TURN_SECONDS);
      return;
    }
    const beaten = finalFound.length > record;
    setNewRecord(beaten);
    if (beaten) {
      setRecord(finalFound.length);
      saveSoloRecord(finalFound.length);
    }
  };
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  });

  // Chrono calculé depuis l'heure de départ : juste même si l'app ralentit. Il attend la fin du 3-2-1
  useEffect(() => {
    if (phase !== 'play' || intro === 'covering') return;
    const id = setInterval(() => {
      const left = Math.max(0, TURN_SECONDS * 1000 - (Date.now() - startedAt.current));
      setRemainingMs(left);
      if (left === 0) finishRef.current(foundRef.current);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [phase, intro]);

  const start = () => {
    foundRef.current = [];
    finished.current = false;
    setFound([]);
    setInput('');
    setMiss(false);
    setRemainingMs(TURN_SECONDS * 1000);
    setNewRecord(false);
    setIntro('covering');
    setPhase('play');
  };

  const submit = () => {
    if (!input.trim()) return;
    const match = matchAnswer(input, answers, foundRef.current);
    if (!match) {
      setMiss(true);
      playHaptic('error');
      return;
    }
    const next = [...foundRef.current, match];
    foundRef.current = next;
    setFound(next);
    setInput('');
    setMiss(false);
    playSound('correct');
    playHaptic('light');
  };

  // Nouvelle partie : un pack en essai ne valait que pour une partie
  const replay = () => {
    const kept = soloThemes.filter((id) => !lockedPackThemes.includes(id));
    const themeIds = kept.length > 0 ? kept : CLASSIC_THEMES;
    setSoloThemes(themeIds);
    setQuestion(pickQuestion(themeIds, question.id));
    setPhase('intro');
  };

  const shareDaily = () => {
    if (!daily) return;
    const message = d.shareMsg(shortDate(daily.day), daily.score, TURN_SECONDS, daily.streak, PUBLIC_STORE_URL);
    Share.share({ message }).catch(() => {});
  };

  const rawSubject = getSubject(question, lang);
  // Même casse que les questions des parties : majuscule initiale, reste en minuscules
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();
  // Fin de partie : toute la liste (une autre question tombera en rejouant), plus les réponses trouvées hors liste affichée
  // Réponses à surligner : celles de la partie qui vient de finir, ou celles enregistrées pour le défi du jour
  const resultFound = phase === 'result' ? found : (todayEntry?.found ?? null);
  const allAnswers = visibleAnswers(getAnswers(question, lang), resultFound ?? []);
  const seconds = Math.ceil(remainingMs / 1000);
  const isWarning = seconds <= WARNING_SECONDS;

  return (
    <GameLayout
      onHome={() => router.back()}
      closeIcon={shownPhase === 'play'}
      // Pendant le chrono, la roue des réglages collait au bouton « Terminer »
      showSettings={shownPhase !== 'play'}
      scrollDisabled
      overlay={
        intro && phase === 'play' ? (
          <PlayIntroTransition
            team={SOLO_TEAM}
            variant="countdown"
            onReveal={() => {
              startedAt.current = Date.now();
              setIntro('revealing');
            }}
            onDone={() => setIntro(null)}
          />
        ) : outro && phase === 'result' ? (
          <TurnEndTransition
            kind={found.length > 0 ? 'madeBid' : 'missedBid'}
            count={found.length}
            subtitle={remainingMs === 0 ? t.survie.elimTimeoutTitle : d.finished}
            label={`${d.foundLabel} :`}
            onReveal={() => setOutro('revealing')}
            onDone={() => setOutro(null)}
          />
        ) : undefined
      }
    >
      {shownPhase === 'intro' ? (
        <View style={styles.fill}>
          <View style={styles.blueZone}>
            <View style={styles.pillRow}>
              {isDaily ? (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{d.dateLabel(shortDate(today))}</Text>
                </View>
              ) : null}
              <CategoryBadge themeId={question.theme} />
            </View>
            <View style={styles.questionCard}>
              <Text style={styles.questionCardText}>{subject}</Text>
            </View>
            <Text style={styles.instruction}>
              {isDaily ? d.instructionDaily(TURN_SECONDS) : d.instructionSolo(TURN_SECONDS)}
            </Text>
          </View>

          <View style={[styles.creamPanel, { paddingBottom: Math.max(insets.bottom + 30, 48) }]}>
            {isDaily && daily && nextStreak(daily, today) > 1 ? (
              <View style={styles.streakRow}>
                <AnimatedFlame size={28} />
                <Text style={styles.panelText}>{d.streakOn(daily.streak)}</Text>
              </View>
            ) : (
              <Text style={styles.panelText}>
                {isDaily ? d.comeBackDaily : record > 0 ? d.record(record) : d.noRecord}
              </Text>
            )}
            <OrangeButton label={t.ready.start} onPress={start} />
          </View>
        </View>
      ) : null}

      {shownPhase === 'play' && intro !== 'covering' ? (
        <View style={styles.play}>
          <View style={styles.timerRow}>
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: `${(1 - remainingMs / (TURN_SECONDS * 1000)) * 100}%`, backgroundColor: isWarning ? colors.pink : '#fb940e' }]} />
            </View>
            <Text style={[styles.seconds, isWarning && styles.secondsWarning]}>{seconds}</Text>
            <Pressable onPress={() => finish(foundRef.current)} accessibilityRole="button" accessibilityLabel={d.endA11y} style={styles.skipBtn}>
              <SkipIcon size={24} />
            </Pressable>
          </View>
          {/* Compteur en pastille à côté de la question : ne recouvre jamais les réponses */}
          <View style={styles.questionRow}>
            <Text style={[styles.questionText, styles.fill]}>{subject}</Text>
            <View style={styles.counterBadge} accessibilityLabel={d.foundCount(found.length)}>
              <Text style={styles.counterText} numberOfLines={1} adjustsFontSizeToFit>{found.length}</Text>
            </View>
          </View>
          {/* Réponses trouvées au-dessus de la saisie, la plus récente juste au-dessus du champ */}
          <ScrollView
            ref={chipsRef}
            style={styles.fill}
            contentContainerStyle={styles.chips}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => chipsRef.current?.scrollToEnd({ animated: true })}
          >
            {found.map((answer) => (
              <View key={answer} style={styles.chip}>
                <Text style={styles.chipText}>{answer}</Text>
              </View>
            ))}
          </ScrollView>
          {miss ? <Text style={styles.miss}>{d.miss}</Text> : null}
          <View style={[styles.inputRow, miss && styles.inputRowMiss]}>
            <TextInput
              value={input}
              onChangeText={(text) => {
                setInput(text);
                setMiss(false);
              }}
              onSubmitEditing={submit}
              submitBehavior="submit"
              autoFocus
              autoCorrect
              spellCheck
              autoCapitalize="words"
              returnKeyType="send"
              placeholder={d.placeholder}
              placeholderTextColor="rgba(254,246,215,0.5)"
              accessibilityLabel={d.inputA11y}
              style={styles.input}
            />
          </View>
        </View>
      ) : null}

      {shownPhase === 'result' && outro !== 'covering' ? (
        // Même écran que le résultat d'une manche d'Enchères : question, réponses, panneau crème
        <View style={styles.result}>
          <Text style={styles.resultQuestion}>{subject}</Text>
          {resultFound ? (
            <>
              {/* Listes pas encore exhaustives : on ne prétend pas tout montrer */}
              <Text style={styles.answersTitle}>{t.play.someAnswers}</Text>
              <AnswerChips answers={allAnswers} found={resultFound} />
            </>
          ) : (
            <View style={styles.fill}>
              <Text style={styles.answersTitle}>{d.alreadyPlayed}</Text>
            </View>
          )}
          <View style={[styles.creamPanel, { paddingBottom: Math.max(insets.bottom + 30, 48) }]}>
            <View style={styles.resultRows}>
              <ResultRow label={d.foundLabel} value={String(isDaily ? (daily?.score ?? found.length) : found.length)} />
              {isDaily ? <ResultRow label={d.streak} value={String(daily?.streak ?? 1)} flame /> : null}
              {isDaily ? null : <ResultRow label={d.recordLabel} value={String(record)} highlight={newRecord ? d.newRecord : undefined} />}
            </View>
            {isDaily ? <Text style={styles.panelText}>{d.comeBackTomorrow}</Text> : null}
            <View style={styles.buttons}>
              {isDaily ? (
                <OrangeButton label={d.share} onPress={shareDaily} />
              ) : (
                <OrangeButton label={d.replay} onPress={replay} />
              )}
              <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t.comingSoon.back} style={styles.whiteWrap}>
                <View style={styles.whiteInner}>
                  <Text style={styles.whiteText}>{t.comingSoon.back}</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </GameLayout>
  );
}

function OrangeButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} sound="bid" accessibilityRole="button" accessibilityLabel={label} style={styles.orangeWrap}>
      <LinearGradient colors={ORANGE} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.orangeInner}>
        <Text style={styles.orangeText} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function ResultRow({ label, value, highlight, flame = false }: { label: string; value: string; highlight?: string; flame?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowValueGroup}>
        {highlight ? <Text style={styles.rowHighlight}>{highlight}</Text> : null}
        <Text style={styles.rowValue}>{value}</Text>
        {flame ? <AnimatedFlame size={26} /> : null}
      </View>
    </View>
  );
}

const BTN_SHADOW = {
  shadowOffset: { width: -1, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 3,
} as const;

// Repris des écrans de partie (AuctionPhase, PlayPhase, FinalPhase) pour garder la même allure
const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  blueZone: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 32,
    alignItems: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  questionCard: {
    backgroundColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    width: '100%',
  },
  questionCardText: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.purpleDeep,
  },
  instruction: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    lineHeight: 26,
    color: colors.cream,
    alignSelf: 'stretch',
  },
  creamPanel: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 40,
    paddingHorizontal: 24,
    gap: 28,
    alignItems: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  panelText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
    textAlign: 'center',
  },
  play: {
    flex: 1,
    paddingHorizontal: 24,
    // Écart avec le clavier, comme « Ajouter une équipe »
    paddingBottom: 8,
    gap: 16,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  track: {
    flex: 1,
    height: 16,
    borderRadius: 60,
    backgroundColor: '#fef1cc',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 60,
  },
  seconds: {
    minWidth: 36,
    fontFamily: fonts.displayMedium,
    fontSize: 24,
    color: colors.cream,
    textAlign: 'right',
  },
  secondsWarning: {
    color: colors.pink,
  },
  skipBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purpleDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 31,
    color: colors.cream,
  },
  inputRow: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cream,
    backgroundColor: 'rgba(254,246,215,0.2)',
  },
  inputRowMiss: {
    borderColor: colors.pink,
  },
  input: {
    padding: 0,
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.cream,
  },
  miss: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 16,
  },
  chip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fef1cc',
  },
  chipText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBadge: {
    minWidth: 56,
    height: 48,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontFamily: fonts.displayMedium,
    fontSize: 26,
    color: colors.purpleDeep,
  },
  result: {
    flex: 1,
    paddingTop: 4,
  },
  resultQuestion: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 31,
    color: colors.cream,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  resultRows: {
    width: '100%',
    gap: 16,
  },
  rowValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // Même accent que les points gagnés au résultat d'une manche
  rowHighlight: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.pink,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  rowLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  rowValue: {
    fontFamily: fonts.displayMedium,
    fontSize: 24,
    color: colors.purpleDeep,
  },
  answersTitle: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  orangeWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
    ...BTN_SHADOW,
  },
  orangeInner: {
    minHeight: 51,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orangeText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
  },
  whiteWrap: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    shadowColor: colors.purpleDeep,
    ...BTN_SHADOW,
  },
  whiteInner: {
    minHeight: 51,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#fffbf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.purpleDeep,
  },
});
