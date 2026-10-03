import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

export type GameButtonVariant = 'pink' | 'teal' | 'yellow';

const palettes: Record<GameButtonVariant, { top: string; bottom: string; shadow: string }> = {
  pink: { top: colors.pink, bottom: colors.pinkDark, shadow: colors.pinkShadow },
  teal: { top: colors.teal, bottom: colors.tealDark, shadow: colors.tealShadow },
  yellow: { top: colors.yellow, bottom: colors.yellowDark, shadow: colors.yellowShadow },
};

const DEPTH = 6;

type Props = {
  label: string;
  icon: ReactNode;
  variant: GameButtonVariant;
  onPress: () => void;
  height?: number;
};

/** Bouton « pilule » en relief : un socle sombre sous un dégradé qui s'enfonce à l'appui. */
export function GameButton({ label, icon, variant, onPress, height = 64 }: Props) {
  const palette = palettes[variant];
  const radius = height / 2;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ height: height + DEPTH }}
    >
      {({ pressed }) => (
        <View style={[styles.base, { height, borderRadius: radius, backgroundColor: palette.shadow, top: DEPTH }]}>
          <LinearGradient
            colors={[palette.top, palette.bottom]}
            style={[
              styles.face,
              { height, borderRadius: radius, transform: [{ translateY: pressed ? -DEPTH / 2 : -DEPTH }] },
            ]}
          >
            <View style={[styles.icon, { left: height * 0.3 }]}>{icon}</View>
            <Text style={[styles.label, { fontSize: height * 0.48 }]} numberOfLines={1}>
              {label}
            </Text>
          </LinearGradient>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  icon: {
    position: 'absolute',
    width: 40,
    alignItems: 'center',
  },
  label: {
    color: colors.white,
    fontFamily: fonts.display,
    letterSpacing: 0.5,
    paddingLeft: 16,
  },
});
