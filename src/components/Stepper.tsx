import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  color: string;
  shadowColor: string;
  label: string;
};

/** Compteur − valeur + ; les boutons grisent aux limites. */
export function Stepper({ value, min, max, onChange, color, shadowColor, label }: Props) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(value - 1)}
        disabled={!canDecrease}
        accessibilityRole="button"
        accessibilityLabel={`Diminuer ${label}`}
        hitSlop={8}
      >
        <MaterialCommunityIcons name="minus-circle-outline" size={30} color={canDecrease ? colors.black : colors.muted} />
      </Pressable>
      <View style={[styles.valueBase, { backgroundColor: shadowColor }]}>
        <View style={[styles.value, { backgroundColor: color }]}>
          <Text style={styles.valueLabel} accessibilityLabel={`${label} : ${value}`}>
            {value}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => onChange(value + 1)}
        disabled={!canIncrease}
        accessibilityRole="button"
        accessibilityLabel={`Augmenter ${label}`}
        hitSlop={8}
      >
        <MaterialCommunityIcons name="plus-circle-outline" size={30} color={canIncrease ? colors.black : colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  valueBase: {
    borderRadius: 12,
    paddingBottom: 3,
  },
  value: {
    width: 48,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueLabel: {
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 26,
  },
});
