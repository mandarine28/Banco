import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { GameButton } from '@/components/GameButton';
import { TeamName } from '@/components/game/TeamName';
import { themeById } from '@/data/themes';
import { currentQuestion, type GameState, holderIndex } from '@/game/engine';
import { colors, fonts } from '@/theme';

type Props = {
  state: GameState;
  onStart: () => void;
};

export function IntroPhase({ state, onStart }: Props) {
  const question = currentQuestion(state);
  const theme = themeById(question.theme);
  const answering = state.teams[state.turn];
  const holder = state.teams[holderIndex(state)];

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.round}>
          {theme ? (
            <MaterialCommunityIcons
              name={theme.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={30}
              color={colors.orange}
            />
          ) : null}
          <Text style={styles.roundLabel}>
            ROUND {state.round + 1}/{state.roundCount}
          </Text>
        </View>
        <Text style={styles.prompt}>{question.prompt}</Text>
        <Text style={styles.go}>C’EST PARTI!</Text>
        <View style={styles.button}>
          <GameButton
            variant="pink"
            label="JOUER"
            height={58}
            onPress={onStart}
            icon={<FontAwesome6 name="play" solid size={28} color={colors.white} />}
          />
        </View>
      </Card>

      <View style={styles.spacer} />

      <Card style={styles.who}>
        <View style={styles.phone}>
          <MaterialCommunityIcons name="cellphone-text" size={44} color={colors.white} />
        </View>
        <Text style={styles.whoText}>
          <TeamName team={holder} /> TIENT L’APPAREIL.{'\n'}
          <TeamName team={answering} /> RÉPOND À LA QUESTION.
        </Text>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 34,
    paddingTop: 22,
    paddingBottom: 34,
    paddingHorizontal: 20,
  },
  round: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundLabel: {
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 24,
  },
  prompt: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 19,
    textAlign: 'center',
  },
  go: {
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 46,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
  },
  spacer: {
    flex: 1,
    minHeight: 8,
  },
  who: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
  },
  phone: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lavender,
  },
  whoText: {
    flex: 1,
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
});
