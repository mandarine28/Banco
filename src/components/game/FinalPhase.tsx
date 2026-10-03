import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card, CardDivider } from '@/components/Card';
import { GameButton } from '@/components/GameButton';
import { type GameState, ranking } from '@/game/engine';
import { colors, fonts } from '@/theme';

type Props = {
  state: GameState;
  onReplay: () => void;
  onHome: () => void;
};

export function FinalPhase({ state, onReplay, onHome }: Props) {
  const rows = ranking(state);
  const winners = rows.filter((r) => r.rank === 1);
  const title = winners.length > 1 ? 'ÉGALITÉ !' : `VICTOIRE DE ${winners[0].team.name} !`;

  return (
    <>
      <Card style={styles.podium}>
        <MaterialCommunityIcons name="trophy" size={64} color={colors.orange} />
        <Text style={styles.title}>{title}</Text>
      </Card>

      <Card>
        {rows.map(({ team, index, score, rank }, i) => (
          <View key={index}>
            {i > 0 ? <CardDivider /> : null}
            <View style={[styles.row, rank === 1 && styles.rowWinner]}>
              <Text style={styles.rank}>{rank}</Text>
              <View style={[styles.dot, { backgroundColor: team.color }]} />
              <Text style={styles.name} numberOfLines={1}>
                {team.name}
              </Text>
              {rank === 1 ? <MaterialCommunityIcons name="crown" size={22} color={colors.orange} /> : null}
              <Text style={styles.score}>{score}</Text>
            </View>
          </View>
        ))}
      </Card>

      <View style={styles.actions}>
        <GameButton
          variant="pink"
          label="REJOUER"
          height={56}
          onPress={onReplay}
          icon={<FontAwesome6 name="rotate-right" solid size={24} color={colors.white} />}
        />
        <GameButton
          variant="teal"
          label="ACCUEIL"
          height={56}
          onPress={onHome}
          icon={<MaterialCommunityIcons name="home" size={30} color={colors.white} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  podium: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 22,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 28,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 18,
  },
  rowWinner: {
    backgroundColor: '#FFF4DF',
  },
  rank: {
    width: 22,
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 22,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  name: {
    flex: 1,
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 17,
  },
  score: {
    minWidth: 30,
    textAlign: 'right',
    color: colors.black,
    fontFamily: fonts.display,
    fontSize: 24,
  },
  actions: {
    gap: 14,
    paddingHorizontal: 30,
    paddingTop: 6,
  },
});
