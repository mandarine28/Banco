import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { screenCornerRadius } from '@/lib/screenCorner';

const STROKE = 7;
// Quart de cercle (Bézier) : une courbe plus carrée amincit le cadre dans les coins
const K = 0.5523;

type Props = { color: string };

/** Rectangle aux coins arrondis (rayon r), tracé dans le sens horaire. */
function roundedRect(x1: number, y1: number, x2: number, y2: number, r: number): string {
  const c = r * (1 - K);
  return [
    `M ${x1 + r} ${y1}`,
    `L ${x2 - r} ${y1}`,
    `C ${x2 - c} ${y1} ${x2} ${y1 + c} ${x2} ${y1 + r}`,
    `L ${x2} ${y2 - r}`,
    `C ${x2} ${y2 - c} ${x2 - c} ${y2} ${x2 - r} ${y2}`,
    `L ${x1 + r} ${y2}`,
    `C ${x1 + c} ${y2} ${x1} ${y2 - c} ${x1} ${y2 - r}`,
    `L ${x1} ${y1 + r}`,
    `C ${x1} ${y1 + c} ${x1 + c} ${y1} ${x1 + r} ${y1}`,
    'Z',
  ].join(' ');
}

export function SurviePulseBorder({ color }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Cadre rempli jusqu'au bord : l'écran du téléphone arrondit l'extérieur, l'intérieur suit le même centre de courbe
  const inner = Math.max(screenCornerRadius(Platform.OS, insets.top) - STROKE, 0);
  const d = `M 0 0 H ${width} V ${height} H 0 Z ${roundedRect(STROKE, STROKE, width - STROKE, height - STROKE, inner)}`;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height} pointerEvents="none">
        <Path d={d} fill={color} fillRule="evenodd" />
      </Svg>
    </View>
  );
}
