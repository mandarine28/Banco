import { StyleSheet } from 'react-native';
import Svg, { Defs, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme';

type Props = {
  width: number;
  height: number;
  /** Ordonnée du point le plus bas de la courbe blanche. */
  curveBottom: number;
  /** Ordonnée de la courbe blanche sur les bords de l'écran. */
  curveEdge: number;
  /** Centre des rayons du soleil. */
  burstY: number;
};

const RAY_COUNT = 64;
const BAND = 16;

/** Arc de cercle passant par (width, edge), (width / 2, bottom) et (0, edge). */
function curvePath(width: number, edge: number, bottom: number) {
  const sag = bottom - edge;
  const r = ((width / 2) ** 2 + sag ** 2) / (2 * sag);
  return `M0 0 H${width} V${edge} A${r} ${r} 0 0 1 0 ${edge} Z`;
}

function sunburstPath(cx: number, cy: number, radius: number) {
  const step = (Math.PI * 2) / RAY_COUNT;
  let d = '';
  for (let i = 0; i < RAY_COUNT; i += 2) {
    const a1 = i * step;
    const a2 = a1 + step;
    d += `M${cx} ${cy} L${cx + radius * Math.cos(a1)} ${cy + radius * Math.sin(a1)} `;
    d += `L${cx + radius * Math.cos(a2)} ${cy + radius * Math.sin(a2)} Z `;
  }
  return d;
}

export function HomeBackground({ width, height, curveBottom, curveEdge, burstY }: Props) {
  const radius = Math.hypot(width, height);

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="glow" cx={width / 2} cy={burstY} r={height * 0.6} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={colors.purpleLight} />
          <Stop offset="0.55" stopColor={colors.purple} />
          <Stop offset="1" stopColor={colors.purpleDeep} />
        </RadialGradient>
      </Defs>

      <Rect x={0} y={0} width={width} height={height} fill="url(#glow)" />
      <G opacity={0.07}>
        <Path d={sunburstPath(width / 2, burstY, radius)} fill={colors.white} />
      </G>

      <Path d={curvePath(width, curveEdge + BAND * 1.3, curveBottom + BAND * 0.9)} fill={colors.lavender} />
      <Path d={curvePath(width, curveEdge, curveBottom)} fill={colors.white} />
    </Svg>
  );
}
