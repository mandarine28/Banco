import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { GameButton } from '@/components/GameButton';
import { TeamName } from '@/components/game/TeamName';
import { ThemeHeader } from '@/components/game/ThemeHeader';
import { contract, type GameState, opponent } from '@/game/engine';
import { colors, fonts } from '@/theme';

type Props = {
  state: GameState;
  onStart: () => void;
};

export function ReadyPhase({ state, onStart }: Props) {
  const { team, amount } = contract(state);
  const answering = state.teams[team];
  const holder = state.teams[opponent(state)];

  return (
    <>
      <Card style={styles.card}>
        <ThemeHeader state={state} />
        <Text style={styles.goal}>
          <TeamName team={answering} /> DOIT TROUVER{'\n'}
          <Text style={styles.amount}>{amount}</Text> RÉPONSE{amount > 1 ? 'S' : ''}
        </Text>
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
        <View style={styles.whoTexts}>
          <Text style={styles.whoText}>
            <TeamName team={holder} /> TIENT L’APPAREIL.{'\n'}
            <TeamName team={answering} /> RÉPOND À LA QUESTION.
          </Text>
          <Text style={styles.stakes}>
            Réussite : +{amount} pour {answering.name}. Échec : +{amount} pour {holder.name}.
          </Text>
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 26,
    paddingTop: 22,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  goal: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 19,
    lineHeight: 30,
    textAlign: 'center',
  },
  amount: {
    color: colors.pink,
    fontFamily: fonts.display,
    fontSize: 30,
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
  whoTexts: {
    flex: 1,
    gap: 6,
  },
  whoText: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  stakes: {
    color: colors.muted,
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
  },
});
