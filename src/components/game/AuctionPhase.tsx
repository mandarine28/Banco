import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card, CardDivider } from '@/components/Card';
import { GameButton } from '@/components/GameButton';
import { TeamName } from '@/components/game/TeamName';
import { ThemeHeader } from '@/components/game/ThemeHeader';
import { Stepper } from '@/components/Stepper';
import { canPass, type GameState, MAX_BID, minimumBid } from '@/game/engine';
import { colors, fonts } from '@/theme';

type Props = {
  state: GameState;
  onBid: (amount: number) => void;
  onPass: () => void;
};

export function AuctionPhase({ state, onBid, onPass }: Props) {
  const { auction } = state;
  const bidder = state.teams[auction.current];
  const min = minimumBid(state);
  // Remonte au minimum quand une autre équipe vient de surenchérir.
  const [chosen, setChosen] = useState(min);
  const amount = Math.max(chosen, min);
  const highest = auction.highest;

  return (
    <>
      <Card style={styles.card}>
        <ThemeHeader state={state} />
        <Text style={styles.question}>COMBIEN DE RÉPONSES SUR 9 POUVEZ-VOUS TROUVER ?</Text>

        <View style={styles.current}>
          <Text style={styles.currentLabel}>MISE ACTUELLE</Text>
          {highest ? (
            <Text style={styles.currentValue}>
              <TeamName team={state.teams[highest.team]} /> : {highest.amount}
            </Text>
          ) : (
            <Text style={[styles.currentValue, styles.none]}>AUCUNE</Text>
          )}
        </View>

        <Text style={styles.turn}>
          À <TeamName team={bidder} /> {highest ? 'DE SURENCHÉRIR OU PASSER' : 'D’OUVRIR LES ENCHÈRES'}
        </Text>

        <Stepper
          label="mise"
          value={amount}
          min={min}
          max={MAX_BID}
          onChange={setChosen}
          color={bidder.color}
          shadowColor={colors.lavender}
        />

        <View style={styles.buttons}>
          <GameButton
            variant="pink"
            label={`MISER ${amount}`}
            height={56}
            onPress={() => onBid(amount)}
            icon={<MaterialCommunityIcons name="gavel" size={30} color={colors.white} />}
          />
          {canPass(state) ? (
            <GameButton
              variant="yellow"
              label="PASSER"
              height={56}
              onPress={onPass}
              icon={<MaterialCommunityIcons name="hand-back-left" size={28} color={colors.white} />}
            />
          ) : null}
        </View>
      </Card>

      <Card>
        {state.teams.map((team, i) => {
          const status = auction.passed[i]
            ? 'PASSE'
            : highest?.team === i
              ? `MISE ${highest.amount}`
              : i === auction.current
                ? 'DOIT PARLER'
                : 'EN LICE';
          return (
            <View key={team.name + i}>
              {i > 0 ? <CardDivider /> : null}
              <View style={[styles.row, auction.passed[i] && styles.rowOut]}>
                <View style={[styles.dot, { backgroundColor: team.color }]} />
                <Text style={styles.teamName} numberOfLines={1}>
                  {team.name}
                </Text>
                <Text style={styles.status}>{status}</Text>
              </View>
            </View>
          );
        })}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
  question: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 15,
    textAlign: 'center',
  },
  current: {
    alignItems: 'center',
    gap: 2,
  },
  currentLabel: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: 1,
  },
  currentValue: {
    color: colors.black,
    fontFamily: fonts.display,
    fontSize: 26,
  },
  none: {
    color: colors.muted,
  },
  turn: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 15,
    textAlign: 'center',
  },
  buttons: {
    alignSelf: 'stretch',
    gap: 12,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 50,
    paddingHorizontal: 18,
  },
  rowOut: {
    opacity: 0.4,
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
  status: {
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 15,
  },
});
