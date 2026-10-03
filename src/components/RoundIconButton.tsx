import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type Props = {
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number;
  /** `purple` : pastille dégradée (paramètres) ; `white` : pastille blanche (réseaux sociaux). */
  tone?: 'purple' | 'white';
};

export function RoundIconButton({ icon, onPress, accessibilityLabel, size = 44, tone = 'white' }: Props) {
  const shape = { width: size, height: size, borderRadius: size / 2 };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.92 : 1 }] })}
    >
      {tone === 'purple' ? (
        <LinearGradient
          colors={[colors.purpleLight, colors.purple]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[styles.center, shape, styles.purpleRing]}
        >
          {icon}
        </LinearGradient>
      ) : (
        <View style={[styles.center, shape, { backgroundColor: colors.white }]}>{icon}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  purpleRing: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
});
