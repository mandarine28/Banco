import { StyleSheet, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { Pressable } from '@/components/Pressable';
import { colors, fonts } from '@/theme';

type Props = {
  checked: boolean;
  selectLabel: string;
  deselectLabel: string;
  onToggle: () => void;
};

/** « Tout sélectionner / désélectionner » avec sa case, pour une liste de choix. */
export function SelectAllToggle({ checked, selectLabel, deselectLabel, onToggle }: Props) {
  const label = checked ? deselectLabel : selectLabel;
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      style={styles.row}
    >
      <Text style={styles.label}>{label}</Text>
      <Svg width={28} height={28} viewBox="0 0 24 24">
        {checked ? (
          <>
            <Rect x="2" y="2" width="20" height="20" rx="6" fill={colors.cream} />
            <Path d="M9 12l2 2 4-4" stroke={colors.purple} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        ) : (
          <Rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="rgba(254,246,215,0.5)" strokeWidth="2" />
        )}
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.cream,
  },
});
