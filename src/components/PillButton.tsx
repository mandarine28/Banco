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
  next: {
    width: 104,
    height: 50,
    borderRadius: 25,
  },
});
