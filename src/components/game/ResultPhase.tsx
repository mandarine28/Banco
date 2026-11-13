import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnswerChips } from '@/components/game/AnswerChips';
import { getAnswers, getSubject, visibleAnswers } from '@/game/answers';
import { contract, currentQuestion, type GameState, isSuccess, opponent } from '@/game/engine';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

// Même lookup que AuctionPhase / PlayPhase
const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

type Props = {
  state: GameState;
  onNext: () => void;
  isLastRound: boolean;
};

export function ResultPhase({ state, onNext, isLastRound }: Props) {
  const { lang } = useLang();
  const t = getT(lang);
  const insets = useSafeAreaInsets();
  const question = currentQuestion(state);
  const { amount } = contract(state);
  const success = isSuccess(state);
  const adversaireIdx = opponent(state);

  const getTeamDelta = (i: number): number => {
    if (success) return state.auction.bids[i] ?? 0;
    return i === adversaireIdx ? amount : 0;
  };

  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();

  const localAnswers = getAnswers(question, lang);
  // Toutes les réponses de la question + éventuelles réponses "validées quand même"
  const allAnswers = visibleAnswers(localAnswers, state.found);

  return (
    <View style={styles.wrapper}>
      {/* ─── Zone bleue : sujet + grille réponses ─── */}
      <Text style={styles.questionText}>{subject}</Text>

      <Text style={styles.someAnswersLabel}>{t.play.someAnswers}</Text>
      <AnswerChips answers={allAnswers} found={state.found} />

      {/* ─── Panel crème (même DA que AuctionPhase) ─── */}
      <View style={[styles.creamPanel, { paddingBottom: Math.max(insets.bottom + 30, 48) }]}>
        <View style={styles.teamsList}>
          {state.teams.map((t, i) => {
            const delta = getTeamDelta(i);
            const badgeTextColor = BADGE_TEXT_COLOR[t.color] ?? colors.purpleDeep;
            return (
              <View key={t.name + String(i)} style={styles.teamRow}>
                <View style={[styles.teamBadge, { backgroundColor: t.color }]}>
                  <Text style={[styles.teamBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
                    {t.name}
                  </Text>
                </View>
                <View style={styles.scoreGroup}>
                  {delta > 0 ? (
                    <Text style={styles.scoreDelta}>+{delta}</Text>
                  ) : null}
                  <Text style={styles.teamScore}>{state.scores[i]}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Bouton outlined — même DA que le bouton PASSER de AuctionPhase */}
        <Pressable
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel={isLastRound ? t.result.finalResults : t.result.nextRound}
          style={({ pressed }) => [styles.btnWrap, pressed && { opacity: 0.85 }]}
        >
          <View style={styles.btnInner}>
            <Text style={styles.btnText}>
              {isLastRound ? t.result.finalResults : t.result.nextRound}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 4,
  },

  // ── Zone bleue ──
  questionText: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 31,
    color: colors.cream,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  someAnswersLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
    paddingHorizontal: 24,
    marginBottom: 10,
  },

  // ── Panel crème — même DA que AuctionPhase creamPanel ──
  creamPanel: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 40,
    paddingHorizontal: 24,
    gap: 36,
    alignItems: 'center',
  },
  teamsList: {
    width: '100%',
    gap: 16,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Badge équipe — même DA que AuctionPhase teamNameBadge
  teamBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  teamBadgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  scoreGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreDelta: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.pink, // '#fb940e' orange accent
  },
  teamScore: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.purpleDeep,
    minWidth: 32,
    textAlign: 'right',
  },

  // Bouton outlined — même DA que AuctionPhase btnPasserWrap / btnPasserInner
  btnWrap: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    shadowColor: colors.purpleDeep,
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnInner: {
    backgroundColor: '#fffbf5',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  btnText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.purpleDeep,
  },
});
