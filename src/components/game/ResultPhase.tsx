import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card, CardDivider } from '@/components/Card';
import { currentQuestion, type EndReason, type GameState, turnPoints } from '@/game/engine';
import { colors, fonts } from '@/theme';

const headlines: Record<EndReason, string> = {
  time: 'TEMPS ÉCOULÉ !',
  complete: 'SANS FAUTE !',
  skip: 'TOUR TERMINÉ',
};

export function ResultPhase({ state }: { state: GameState }) {
  const question = currentQuestion(state);
  const team = state.teams[state.turn];
  const points = turnPoints(state);

  return (
    <>
      <Card style={styles.summary}>
        <Text style={styles.headline}>{headlines[state.endReason ?? 'skip']}</Text>
        <Text style={[styles.points, { color: team.color }]}>
          +{points} POINT{points > 1 ? 'S' : ''}
        </Text>
        <Text style={styles.count}>
          {state.found.length}/{question.answers.length} RÉPONSES TROUVÉES
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
                <Text style={[styles.answer, styles.grow, !found && styles.missed]}>{answer.label}</Text>
                <Text style={[styles.answer, !found && styles.missed]}>{answer.points}</Text>
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
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 28,
  },
  points: {
    fontFamily: fonts.display,
    fontSize: 44,
  },
  count: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 15,
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
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 15,
  },
  grow: {
    flex: 1,
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
