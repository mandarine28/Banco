import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { survieRanking, type SurvieState } from '@/game/survie-engine';
import { getT } from '@/lib/i18n';
import { playHaptic } from '@/lib/haptics';
import { useLang } from '@/lib/LangContext';
import { playSound } from '@/lib/sounds';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

type Props = {
  state: SurvieState;
  onReplay: () => void;
  onHome: () => void;
};

export function SurvieFinalPhase({ state, onReplay, onHome }: Props) {
  const { lang } = useLang();
  const t = getT(lang);

  useEffect(() => {
    playSound('gameWon');
    playHaptic('success');
  }, []);
  const insets = useSafeAreaInsets();
  const rows = survieRanking(state);
  const winners = rows.filter((r) => r.rank === 1);
  const isEquality = winners.length > 1;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom + 20, 36) }]}>
      <View style={styles.topSection}>
        <View style={styles.titleSection}>
          {isEquality ? (
            <Text style={styles.titleText}>{t.final.tie}</Text>
          ) : (
            <>
              <Text style={styles.titleText}>{t.final.victoryOf}</Text>
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

      <View style={styles.buttons}>
        <Pressable onPress={onReplay} accessibilityRole="button" accessibilityLabel={t.final.rematch} style={styles.btnWrapOrange}>
          <LinearGradient
            colors={['#fb940e', '#f2c512']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnOrangeInner}
          >
            <Text style={styles.btnOrangeText}>{t.final.rematch}</Text>
          </LinearGradient>
        </Pressable>

        <Pressable onPress={onHome} accessibilityRole="button" accessibilityLabel={t.final.home} style={styles.btnWrapWhite}>
          <View style={styles.btnWhiteInner}>
            <Text style={styles.btnWhiteText}>{t.final.home}</Text>
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
  topSection: {
    gap: 24,
  },
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
  buttons: {
    gap: 16,
  },
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
