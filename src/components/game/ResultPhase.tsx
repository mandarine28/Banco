import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { contract, currentQuestion, type GameState, isSuccess, opponent } from '@/game/engine';
import { colors, fonts } from '@/theme';

// Même lookup que AuctionPhase / PlayPhase
const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': colors.cream };

type Props = {
  state: GameState;
  onNext: () => void;
  isLastRound: boolean;
};

export function ResultPhase({ state, onNext, isLastRound }: Props) {
  const insets = useSafeAreaInsets();
  const question = currentQuestion(state);
  const { team, amount } = contract(state);
  const success = isSuccess(state);
  const winnerIdx = success ? team : opponent(state);

  const subject = question.subject.charAt(0).toUpperCase() + question.subject.slice(1).toLowerCase();

  // Toutes les réponses de la question + éventuelles réponses "validées quand même"
  const allAnswers = [
    ...question.answers,
    ...state.found.filter((a) => !question.answers.includes(a)),
  ];

  return (
    <View style={styles.wrapper}>
      {/* ─── Zone bleue : sujet + grille réponses ─── */}
      <Text style={styles.questionText}>{subject}</Text>

      <ScrollView
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsGrid}
        showsVerticalScrollIndicator={false}
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

      {/* ─── Panel crème (même DA que AuctionPhase) ─── */}
      <View style={[styles.creamPanel, { paddingBottom: Math.max(insets.bottom + 30, 48) }]}>
        <View style={styles.teamsList}>
          {state.teams.map((t, i) => {
            const isWinner = i === winnerIdx;
            const badgeTextColor = BADGE_TEXT_COLOR[t.color] ?? colors.purpleDeep;
            return (
              <View key={t.name + String(i)} style={styles.teamRow}>
                {/* Badge équipe — même style que AuctionPhase teamNameBadge */}
                <View style={[styles.teamBadge, { backgroundColor: t.color }]}>
                  <Text style={[styles.teamBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
                    {t.name}
                  </Text>
                </View>
                <View style={styles.scoreGroup}>
                  {isWinner ? (
                    <Text style={styles.scoreDelta}>+{amount}</Text>
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
          accessibilityLabel={isLastRound ? 'Résultats finaux' : 'Manche suivante'}
          style={({ pressed }) => [styles.btnWrap, pressed && { opacity: 0.85 }]}
        >
          <View style={styles.btnInner}>
            <Text style={styles.btnText}>
              {isLastRound ? 'RÉSULTATS' : 'MANCHE SUIVANTE'}
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
    paddingBottom: 24,
  },
  chipsScroll: {
    flex: 1,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  // Chips — mêmes valeurs que PlayPhase
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
    gap: 16,
  },

  // Badge équipe — même DA que AuctionPhase teamNameBadge
  teamBadge: {
    flex: 1,
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
