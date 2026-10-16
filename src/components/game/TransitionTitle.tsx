import { StyleSheet, Text, View } from 'react-native';

import type { GameTeam } from '@/game/engine';
import { colors, fonts } from '@/theme';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

/** Badge d'équipe géant + sous-titre blanc, commun aux écrans de transition Figma. */
export function TransitionTitle({ team, subtitle }: { team: GameTeam; subtitle: string }) {
  const textColor = BADGE_TEXT_COLOR[team.color] ?? colors.purpleDeep;
  return (
    <View style={styles.block}>
      <View style={[styles.badge, { backgroundColor: team.color }]}>
        <Text style={[styles.badgeText, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
          {team.name}
        </Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    gap: 16,
  },
  badge: {
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    maxWidth: '100%',
  },
  badgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 45,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 28,
    color: colors.white,
    textAlign: 'center',
  },
});
