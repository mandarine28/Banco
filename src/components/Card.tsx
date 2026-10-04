import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

/** Carte blanche arrondie posée sur un socle lavande. */
export function Card({ children, style }: Props) {
  return (
    <View style={styles.base}>
      <View style={[styles.face, style]}>{children}</View>
    </View>
  );
}

/** Séparateur violet entre deux lignes d'une carte. */
export function CardDivider() {
  return <View style={styles.divider} />;
}

const RADIUS = 28;

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS,
    backgroundColor: colors.lavender,
    paddingBottom: 6,
  },
  face: {
    borderRadius: RADIUS,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  divider: {
    height: 4,
    backgroundColor: colors.purple,
  },
});
