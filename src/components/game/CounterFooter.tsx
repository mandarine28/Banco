import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

type Props = {
  left: number;
  amount: number;
  onAdjust: (delta: 1 | -1) => void;
};

export function CounterFooter({ left, amount, onAdjust }: Props) {
  const plusDisabled = left >= amount;

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Pressable
          onPress={() => onAdjust(1)}
          // − compte une réponse trouvée : même son qu'une réponse cochée
          sound="correct"
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel="Valider une réponse"
          style={styles.btn}
        >
          <Text style={styles.btnText}>−</Text>
        </Pressable>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{left}</Text>
        </View>

        <Pressable
          onPress={() => onAdjust(-1)}
          sound="upDown"
          disabled={plusDisabled}
          accessibilityRole="button"
          accessibilityLabel="Annuler une réponse"
          style={[styles.btn, plusDisabled && styles.btnDisabled]}
        >
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.caption}>
        réponse{left > 1 ? 's' : ''} restante{left > 1 ? 's' : ''} à trouver
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fef1cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.35,
  },
  btnText: {
    fontFamily: fonts.displayMedium,
    fontSize: 24,
    color: colors.purpleDeep,
    lineHeight: 28,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 40,
    color: colors.purpleDeep,
  },
  caption: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
});
