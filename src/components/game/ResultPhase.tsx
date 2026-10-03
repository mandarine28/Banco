import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card, CardDivider } from '@/components/Card';
import { TeamName } from '@/components/game/TeamName';
import { contract, currentQuestion, type GameState, isSuccess, opponent } from '@/game/engine';
import { colors, fonts } from '@/theme';

export function ResultPhase({ state }: { state: GameState }) {
  const question = currentQuestion(state);
  const { team, amount } = contract(state);
  const success = isSuccess(state);
  const answering = state.teams[team];
  const winner = state.teams[success ? team : opponent(state)];
  // Réponses comptées avec le compteur sans toucher de bouton.
  const manual = Math.max(0, state.progress - state.found.length);
  const missed = question.answers.filter((a) => !state.found.includes(a)).slice(0, 9);
  const headline = success ? 'BANCO !' : state.endReason === 'time' ? 'TEMPS ÉCOULÉ !' : 'ABANDON';

  return (
    <>
      <Card style={styles.summary}>
        <Text style={[styles.headline, { color: success ? colors.tealDark : colors.pink }]}>{headline}</Text>
        <Text style={styles.detail}>
          <TeamName team={answering} /> A TROUVÉ {Math.min(state.progress, amount)}/{amount} RÉPONSE{amount > 1 ? 'S' : ''}
        </Text>
        <Text style={[styles.points, { color: winner.color }]}>
          +{amount} POINT{amount > 1 ? 'S' : ''}
        </Text>
        <Text style={styles.detail}>
          POUR <TeamName team={winner} />
        </Text>
      </Card>

      <Card>
        <Text style={styles.prompt}>{question.prompt}</Text>
        {state.found.map((label) => (
          <View key={label}>
            <CardDivider />
            <View style={styles.row}>
              <MaterialCommunityIcons name="check-circle" size={20} color={colors.tealDark} />
              <Text style={styles.answer}>{label}</Text>
            </View>
          </View>
        ))}
        {manual > 0 ? (
          <View>
            <CardDivider />
            <View style={styles.row}>
              <MaterialCommunityIcons name="counter" size={20} color={colors.tealDark} />
              <Text style={styles.answer}>
                {manual} RÉPONSE{manual > 1 ? 'S' : ''} COMPTÉE{manual > 1 ? 'S' : ''} AU COMPTEUR
              </Text>
            </View>
          </View>
        ) : null}
        <CardDivider />
        <Text style={styles.missedTitle}>RÉPONSES FRÉQUENTES NON CITÉES</Text>
        <Text style={styles.missedList}>{missed.join(' · ')}</Text>
      </Card>

      <Card>
        {state.teams.map((t, i) => (
          <View key={t.name + i}>
            {i > 0 ? <CardDivider /> : null}
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: t.color }]} />
              <Text style={styles.teamName}>{t.name}</Text>
              <Text style={styles.score}>{state.scores[i]}</Text>
            </View>
          </View>
        ))}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  summary: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 22,
    paddingHorizontal: 16,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 32,
  },
  detail: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 15,
    textAlign: 'center',
  },
  points: {
    fontFamily: fonts.display,
    fontSize: 44,
  },
  prompt: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 44,
    paddingHorizontal: 18,
  },
  answer: {
    flex: 1,
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 15,
  },
  missedTitle: {
    paddingTop: 14,
    paddingHorizontal: 18,
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 1,
  },
  missedList: {
    paddingTop: 4,
    paddingBottom: 16,
    paddingHorizontal: 18,
    color: colors.black,
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 21,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  teamName: {
    flex: 1,
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  score: {
    color: colors.black,
    fontFamily: fonts.display,
    fontSize: 20,
  },
});
