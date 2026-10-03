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
  const headline = success ? 'BANCO !' : state.endReason === 'time' ? 'TEMPS ÉCOULÉ !' : 'ABANDON';

  return (
    <>
      <Card style={styles.summary}>
        <Text style={[styles.headline, { color: success ? colors.tealDark : colors.pink }]}>{headline}</Text>
        <Text style={styles.detail}>
          <TeamName team={answering} /> A TROUVÉ {state.found.length}/{amount} RÉPONSE{amount > 1 ? 'S' : ''}
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
        {question.answers
          .map((answer, index) => ({ answer, index }))
          .sort((a, b) => a.answer.label.localeCompare(b.answer.label, 'fr'))
          .map(({ answer, index }) => {
            const found = state.found.includes(index);
            return (
              <View key={index}>
                <CardDivider />
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name={found ? 'check-circle' : 'close-circle-outline'}
                    size={20}
                    color={found ? colors.tealDark : colors.muted}
                  />
                  <Text style={[styles.answer, !found && styles.missed]}>{answer.label}</Text>
                </View>
              </View>
            );
          })}
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
  missed: {
    color: colors.muted,
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
