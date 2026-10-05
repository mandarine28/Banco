import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme';

type PriceProps = {
  price: string;
  onPress: () => void;
  width?: number;
};

/** Pastille turquoise affichant un prix. */
export function PriceButton({ price, onPress, width = 84 }: PriceProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Acheter pour ${price}`}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}
    >
      <LinearGradient colors={[colors.teal, colors.tealDark]} style={[styles.pill, styles.price, { width }]}>
        <Text style={styles.priceLabel}>{price}</Text>
      </LinearGradient>
    </Pressable>
  );
}

type LabelProps = {
  label: string;
  onPress: () => void;
  variant?: 'teal' | 'orange';
};

/** Bouton avec libellé. Variant « teal » (défaut) ou « orange » (style MISER). */
export function LabelButton({ label, onPress, variant = 'teal' }: LabelProps) {
  const isOrange = variant === 'orange';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        isOrange && styles.orangeWrap,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
    >
      <LinearGradient
        colors={isOrange ? ['#fb940e', '#f2c512'] : [colors.teal, colors.tealDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.pill, styles.labelPill, isOrange && styles.orangeInner]}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

type NextProps = {
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Bouton « suivant » (double flèche) en bas à droite des écrans. */
export function NextButton({ onPress, accessibilityLabel = 'Suivant' }: NextProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}
    >
      <LinearGradient colors={[colors.teal, colors.tealDark]} style={[styles.pill, styles.next]}>
        <FontAwesome6 name="forward" solid size={30} color={colors.white} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.tealShadow,
  },
  price: {
    height: 36,
    borderRadius: 18,
  },
  priceLabel: {
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 16,
  },
  labelPill: {
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 26,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 0.5,
  },
  orangeWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  orangeInner: {
    height: undefined,
    borderRadius: 14,
    paddingVertical: 10,
    minHeight: 51,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  next: {
    width: 104,
    height: 50,
    borderRadius: 25,
  },
});
