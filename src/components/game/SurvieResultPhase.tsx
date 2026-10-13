import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { survieCurrentQuestion, type SurvieState } from '@/game/survie-engine';
import { getSubject } from '@/game/answers';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

type Props = {
  state: SurvieState;
  onNext: () => void;
  isLastRound: boolean;
};

export function SurvieResultPhase({ state, onNext, isLastRound }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const question = survieCurrentQuestion(state);
  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();
  const winner = state.roundWinner !== null ? state.teams[state.roundWinner] : null;
  const winnerBadgeText = winner ? (BADGE_TEXT_COLOR[winner.color] ?? colors.purpleDeep) : colors.purpleDeep;

  return (
    <View style={styles.wrapper}>
      {/* Question answered */}
      <Text style={styles.questionText}>{subject}</Text>

      {/* Cream panel */}
      <View style={[styles.creamPanel, { paddingBottom: Math.max(insets.bottom + 30, 48) }]}>
        {/* Winner + jackpot */}
        <View style={styles.winnerSection}>
          {winner ? (
            <>
              <Text style={styles.winnerLabel}>Vainqueur de la manche</Text>
              <View style={[styles.winnerBadge, { backgroundColor: winner.color }]}>
                <Text style={[styles.winnerName, { color: winnerBadgeText }]} numberOfLines={1}>
                  {winner.name}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.winnerLabel}>Manche nulle</Text>
          )}
          <View style={styles.jackpotRow}>
            <Text style={styles.jackpotLabel}>+{state.jackpot} point{state.jackpot !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Scores */}
        <View style={styles.teamsList}>
          {state.teams.map((team, i) => {
            const isWinner = i === state.roundWinner;
            const badgeTextColor = BADGE_TEXT_COLOR[team.color] ?? colors.purpleDeep;
            return (
              <View key={i} style={styles.teamRow}>
                <View style={[styles.teamBadge, { backgroundColor: team.color }]}>
                  <Text style={[styles.teamBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
                    {team.name}
                  </Text>
                </View>
                <View style={styles.scoreGroup}>
                  {isWinner && state.jackpot > 0 ? (
                    <Text style={styles.scoreDelta}>+{state.jackpot}</Text>
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
          accessibilityLabel={isLastRound ? 'Résultats finaux' : 'Manche suivante'}
          style={({ pressed }) => [styles.btnWrap, pressed && { opacity: 0.85 }]}
        >
          <View style={styles.btnInner}>
            <Text style={styles.btnText}>
              {isLastRound ? 'Résultats finaux' : 'Manche suivante'}
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
    paddingBottom: 20,
  },

  creamPanel: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 32,
    paddingHorizontal: 24,
    gap: 28,
    alignItems: 'center',
    flex: 1,
  },

  winnerSection: {
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  winnerLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.purpleDeep,
    opacity: 0.6,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  winnerBadge: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  winnerName: {
    fontFamily: fonts.display,
    fontSize: 28,
  },
  jackpotRow: {
    backgroundColor: colors.purpleDeep,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  jackpotLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },

  teamsList: {
    width: '100%',
    gap: 12,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
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
