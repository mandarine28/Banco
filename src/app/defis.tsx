import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import { Pressable } from '@/components/Pressable';
import { questions } from '@/data/questions';
import { themeLabel } from '@/data/themes';
import { getAnswers, getSubject } from '@/game/answers';
import { dailyQuestion } from '@/lib/dailyQuestion';
import { useLang } from '@/lib/LangContext';
import { type DailyRecord, dayKey, nextStreak } from '@/lib/solo';
import { type DailyHistoryEntry, loadDailyHistory, loadDailyRecord } from '@/lib/soloStorage';
import { colors, fonts } from '@/theme';

// Prototype (Outils de test) : textes en français seulement, comme l'écran du défi
const MAX_WIDTH = 500;

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

/** « jeudi 13/11 » : date du défi dans la langue du joueur. */
const dayLabel = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: '2-digit' });

/** Suivi des défis du jour : série, meilleur score, et chaque défi joué avec ses réponses. */
export default function DailyHistoryScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const { lang } = useLang();
  const [savedHistory, setHistory] = useState<DailyHistoryEntry[]>([]);
  const [record, setRecord] = useState<DailyRecord | null>(null);
  useEffect(() => {
    loadDailyHistory().then(setHistory);
    loadDailyRecord().then(setRecord);
  }, []);

  const today = dayKey(new Date());
  // Série encore vivante si le dernier défi date d'aujourd'hui ou d'hier
  const streakAlive = record !== null && (record.day === today || nextStreak(record, today) > 1);
  const streak = streakAlive ? record.streak : 0;
  // Défi joué avant l'historique : connu seulement par la série, sa question se retrouve à partir de la date
  const missing = record !== null && !savedHistory.some((entry) => entry.day === record.day);
  const recovered = missing ? dailyQuestion(lang, record.day) : null;
  const history: DailyHistoryEntry[] = record && recovered
    ? [{ day: record.day, questionId: recovered.id, found: [], total: getAnswers(recovered, lang).length, score: record.score }, ...savedHistory]
    : savedHistory;
  const scoreOf = (entry: DailyHistoryEntry) => entry.score ?? entry.found.length;
  const best = history.reduce((max, entry) => Math.max(max, scoreOf(entry)), 0);
  const panelTop = insets.top + 68;

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>

        <View style={[styles.bluePanel, { top: panelTop }]}>
          <CreamPatternSvg width={width} height={height - panelTop} opacity={0.04} fill="#ffffff" />
          <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Math.max(32, insets.bottom + 24) }]} showsVerticalScrollIndicator={false}>
            <View style={styles.stats}>
              <Stat label="Série" value={`${streak} 🔥`} />
              <Stat label="Défis joués" value={String(history.length)} />
              <Stat label="Meilleur score" value={String(best)} />
            </View>

            {history.length === 0 ? <Text style={styles.empty}>Joue ton premier défi pour commencer ton suivi.</Text> : null}

            {history.map((entry) => {
              const question = questions.find((q) => q.id === entry.questionId);
              const raw = question ? getSubject(question, lang) : '';
              const subject = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
              return (
                <View key={entry.day} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.date}>{dayLabel(entry.day)}</Text>
                    <View style={styles.score}>
                      <Text style={styles.scoreText}>{scoreOf(entry)} / {entry.total}</Text>
                    </View>
                  </View>
                  {question ? <Text style={styles.category}>{themeLabel(question.theme, lang)}</Text> : null}
                  {subject ? <Text style={styles.subject}>{subject}</Text> : null}
                  {entry.found.length > 0 ? (
                    <View style={styles.chips}>
                      {entry.found.map((answer) => (
                        <View key={answer} style={styles.chip}>
                          <Text style={styles.chipText}>{answer.charAt(0).toUpperCase() + answer.slice(1).toLowerCase()}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.none}>{entry.score ? 'Réponses non enregistrées pour ce défi' : 'Aucune réponse trouvée'}</Text>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={[styles.header, { top: insets.top + 14, left: width * 0.06 }]}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Retour" hitSlop={10}>
            <View pointerEvents="none">
              <Svg width={Math.min(width * 0.09, 36)} height={(Math.min(width * 0.09, 36) * 19) / 32} viewBox="0 0 32 19">
                <Path d={ARROW_PATH} fill={colors.purple} />
              </Svg>
            </View>
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">Mes défis du jour</Text>
        </View>
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// Même page que Règles et Réglages : fond crème, panneau bleu arrondi, cartes crème
const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  screen: {
    overflow: 'hidden',
  },
  bluePanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.purple,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    gap: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.purpleDeep,
  },
  statValue: {
    fontFamily: fonts.displayMedium,
    fontSize: 26,
    color: colors.cream,
  },
  statLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.cream,
    opacity: 0.8,
  },
  empty: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    lineHeight: 24,
    color: colors.cream,
    textAlign: 'center',
  },
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.cream,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  date: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  score: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.purpleDeep,
  },
  scoreText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  category: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.purple,
  },
  subject: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 23,
    color: colors.purpleDeep,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  // Réponses trouvées : même pastille que pendant le jeu, en plus petit
  chip: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#4883e5',
  },
  chipText: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.cream,
  },
  none: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.purpleDeep,
    opacity: 0.7,
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.purple,
  },
});
