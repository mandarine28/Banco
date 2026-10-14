import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const STROKE = 7;
const CORNER_R = 44;
const K = 0.761;

type Props = { color: string };

export function SurviePulseBorder({ color }: Props) {
  const { width, height } = useWindowDimensions();

  const i = STROKE / 2;
  const r = CORNER_R - i;
  const c = 1 - K;
  const x1 = i, y1 = i;
  const x2 = width - i, y2 = height - i;

  const d = [
    `M ${x1 + r} ${y1}`,
    `L ${x2 - r} ${y1}`,
    `C ${x2 - r * c} ${y1} ${x2} ${y1 + r * c} ${x2} ${y1 + r}`,
    `L ${x2} ${y2 - r}`,
    `C ${x2} ${y2 - r * c} ${x2 - r * c} ${y2} ${x2 - r} ${y2}`,
    `L ${x1 + r} ${y2}`,
    `C ${x1 + r * c} ${y2} ${x1} ${y2 - r * c} ${x1} ${y2 - r}`,
    `L ${x1} ${y1 + r}`,
    `C ${x1} ${y1 + r * c} ${x1 + r * c} ${y1} ${x1 + r} ${y1}`,
    `Z`,
  ].join(' ');

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height} pointerEvents="none">
        <Path d={d} fill="none" stroke={color} strokeWidth={STROKE} />
      </Svg>
    </View>
  );
}
