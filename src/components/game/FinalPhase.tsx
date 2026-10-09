import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type GameState, ranking } from '@/game/engine';
import { colors, fonts } from '@/theme';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

type Props = {
  state: GameState;
  onReplay: () => void;
  onHome: () => void;
};

export function FinalPhase({ state, onReplay, onHome }: Props) {
  const insets = useSafeAreaInsets();
  const rows = ranking(state);
  const winners = rows.filter((r) => r.rank === 1);
  const isEquality = winners.length > 1;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom + 20, 36) }]}>
      {/* Top: title + leaderboard card */}
      <View style={styles.topSection}>
        {/* Title + winner badge — centré */}
        <View style={styles.titleSection}>
          {isEquality ? (
            <Text style={styles.titleText}>ÉGALITÉ !</Text>
          ) : (
            <>
              <Text style={styles.titleText}>Victoire de</Text>
              <View style={[styles.winnerBadge, { backgroundColor: winners[0].team.color }]}>
                <Text
                  style={[styles.winnerBadgeText, { color: BADGE_TEXT_COLOR[winners[0].team.color] ?? colors.purpleDeep }]}
                  numberOfLines={1}
                >
                  {winners[0].team.name}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Leaderboard card */}
        <View style={styles.card}>
          {rows.map(({ team, index, score, rank }) => {
            const badgeTextColor = BADGE_TEXT_COLOR[team.color] ?? colors.purpleDeep;
            return (
              <View key={index} style={styles.row}>
                <View style={styles.rankCircle}>
                  <Text style={styles.rankText}>{rank}</Text>
                </View>
                <View style={[styles.teamPill, { backgroundColor: team.color }]}>
                  <Text style={[styles.teamName, { color: badgeTextColor }]} numberOfLines={1}>
                    {team.name}
                  </Text>
                </View>
                <Text style={styles.scoreText}>{score}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Bottom: action buttons */}
      <View style={styles.buttons}>
        {/* Revanche */}
        <Pressable
          onPress={onReplay}
          accessibilityRole="button"
          accessibilityLabel="Revanche"
          style={styles.btnWrapOrange}
        >
          <LinearGradient
            colors={['#fb940e', '#f2c512']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnOrangeInner}
          >
            <Text style={styles.btnOrangeText}>Revanche</Text>
          </LinearGradient>
        </Pressable>

        {/* Menu principal */}
        <Pressable
          onPress={onHome}
          accessibilityRole="button"
          accessibilityLabel="Menu principal"
          style={styles.btnWrapWhite}
        >
          <View style={styles.btnWhiteInner}>
            <Text style={styles.btnWhiteText}>Menu principal</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const BTN_RADIUS = 16;
const BTN_SHADOW = {
  shadowOffset: { width: -1, height: 2 },
  shadowOpacity: 1 as const,
  shadowRadius: 0,
  elevation: 3,
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    justifyContent: 'space-between',
  },

  // ── Top section (title + card) ──
  topSection: {
    gap: 24,
  },

  // Title — centré
  titleSection: {
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontFamily: fonts.display,
    fontSize: 42,
    color: colors.cream,
    textAlign: 'center',
  },
  winnerBadge: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  winnerBadgeText: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.purpleDeep,
    textAlign: 'center',
  },

  // ── Leaderboard card (hauteur naturelle selon nb équipes) ──
  card: {
    backgroundColor: '#fef1cb',
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  rankCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.purpleDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontFamily: fonts.displayMedium,
    fontSize: 13,
    color: colors.cream,
  },
  teamPill: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  teamName: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
  },
  scoreText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.purpleDeep,
    minWidth: 32,
    textAlign: 'right',
  },

  // ── Buttons — même DA que AuctionPhase/ResultPhase ──
  buttons: {
    gap: 16,
  },

  // Jouer — orange gradient (même que btnMiserWrap/btnInner)
  btnWrapOrange: {
    width: '100%',
    borderRadius: BTN_RADIUS,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
    ...BTN_SHADOW,
  },
  btnOrangeInner: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  btnOrangeText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
  },

  // Boutique — outlined (même que btnPasserWrap/btnPasserInner)
  btnWrapWhite: {
    width: '100%',
    borderRadius: BTN_RADIUS,
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    shadowColor: colors.purpleDeep,
    ...BTN_SHADOW,
  },
  btnWhiteInner: {
    backgroundColor: '#fffbf5',
    borderRadius: BTN_RADIUS - 2,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  btnWhiteText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.purpleDeep,
  },

});
