import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getAnswers, getSubject } from '@/game/answers';
import { survieCurrentQuestion, type SurvieState } from '@/game/survie-engine';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

type Props = {
  state: SurvieState;
  onNext: () => void;
  isLastRound: boolean;
};

export function SurvieResultPhase({ state, onNext, isLastRound }: Props) {
  const { lang } = useLang();
  const t = getT(lang);
  const insets = useSafeAreaInsets();
  const question = survieCurrentQuestion(state);

  const [chipsScrollY, setChipsScrollY] = useState(0);
  const [chipsContentH, setChipsContentH] = useState(0);
  const [chipsContainerH, setChipsContainerH] = useState(0);

  const THUMB_MIN_H = 28;
  const isScrollable = chipsContentH > chipsContainerH + 4;
  const thumbH = isScrollable
    ? Math.max(THUMB_MIN_H, chipsContainerH * (chipsContainerH / chipsContentH))
    : chipsContainerH;
  const thumbMaxTop = chipsContainerH - thumbH;
  const scrollProgress = isScrollable ? chipsScrollY / (chipsContentH - chipsContainerH) : 0;
  const thumbTop = scrollProgress * thumbMaxTop;

  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();

  const localAnswers = getAnswers(question, lang);
  const allAnswers = [
    ...localAnswers,
    ...state.found.filter((a) => !localAnswers.includes(a)),
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.questionText}>{subject}</Text>

      <Text style={styles.someAnswersLabel}>Quelques réponses qui étaient possibles</Text>
      <View style={styles.chipsArea}>
        <View
          style={styles.scrollTrack}
          onLayout={(e) => setChipsContainerH(e.nativeEvent.layout.height)}
        >
          {isScrollable ? (
            <View style={[styles.scrollThumb, { height: thumbH, top: thumbTop }]} />
          ) : (
            <View style={[styles.scrollThumb, { height: chipsContainerH, top: 0 }]} />
          )}
        </View>
        <ScrollView
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsGrid}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => setChipsScrollY(e.nativeEvent.contentOffset.y)}
          onContentSizeChange={(_, h) => setChipsContentH(h)}
        >
          {allAnswers.map((answer) => {
            const found = state.found.includes(answer);
            const label = answer.charAt(0).toUpperCase() + answer.slice(1).toLowerCase();
            return (
              <View key={answer} style={[styles.chip, found ? styles.chipFound : styles.chipMissed]}>
                <Text style={[styles.chipLabel, found ? styles.chipLabelFound : styles.chipLabelMissed]}>
                  {label}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={[styles.creamPanel, { paddingBottom: Math.max(insets.bottom + 30, 48) }]}>
        <View style={styles.teamsList}>
          {state.teams.map((team, i) => {
            const isWinner = i === state.roundWinner;
            const delta = isWinner && state.jackpot > 0 ? state.jackpot : 0;
            const badgeTextColor = BADGE_TEXT_COLOR[team.color] ?? colors.purpleDeep;
            return (
              <View key={team.name + String(i)} style={styles.teamRow}>
                <View style={[styles.teamBadge, { backgroundColor: team.color }]}>
                  <Text style={[styles.teamBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
                    {team.name}
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
  chipsArea: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
  },
  scrollTrack: {
    width: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollThumb: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  chipsScroll: {
    flex: 1,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipFound: {
    backgroundColor: '#fef1cc',
  },
  chipMissed: {
    backgroundColor: '#4883e5',
  },
  chipLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  chipLabelFound: {
    color: colors.purpleDeep,
  },
  chipLabelMissed: {
    color: colors.cream,
  },

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
    color: colors.pink,
  },
  teamScore: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.purpleDeep,
    minWidth: 32,
    textAlign: 'right',
  },
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
