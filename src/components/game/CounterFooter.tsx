import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

type Props = {
  /** Réponses trouvées. */
  progress: number;
  /** Mise à atteindre. */
  amount: number;
  onAdjust: (delta: 1 | -1) => void;
};

export function CounterFooter({ progress, amount, onAdjust }: Props) {
  const minusDisabled = progress <= 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Pressable
          onPress={() => onAdjust(-1)}
          sound="upDown"
          disabled={minusDisabled}
          accessibilityRole="button"
          accessibilityLabel="Annuler une réponse"
          style={[styles.btn, minusDisabled && styles.btnDisabled]}
        >
          <Text style={styles.btnText}>−</Text>
        </Pressable>

        <View style={styles.badge} accessibilityLabel={`${progress} sur ${amount}`}>
          <Text style={styles.badgeText}>
            {progress}/{amount}
          </Text>
        </View>

        <Pressable
          onPress={() => onAdjust(1)}
          // + compte une réponse trouvée : même son qu'une réponse cochée
          sound="correct"
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel="Valider une réponse"
          style={styles.btn}
        >
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.caption}>
        réponse{progress > 1 ? 's' : ''} trouvée{progress > 1 ? 's' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 6,
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
    minWidth: 64,
    paddingHorizontal: 12,
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
