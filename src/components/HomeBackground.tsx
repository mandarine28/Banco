import { StyleSheet } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

import { colors } from '@/theme';

type Props = {
  width: number;
  height: number;
};

/** Pattern orange sur fond crème — 6 % opacité, scale 140 %. */
export function HomeBackground({ width, height }: Props) {
  // Base ellipse × 1.4 (140 % scale)
  const rx = width * 0.31 * 1.4; // ≈ 170 px sur 393
  const ry = width * 0.23 * 1.4; // ≈ 126 px
  const fill = colors.orange;    // #FBB040 — ambre chaud visible à 6 %
  const op = 0.06;

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      {/* Haut-droite (partiellement hors écran) */}
      <Ellipse
        cx={width * 0.83} cy={height * 0.12}
        rx={rx} ry={ry} fill={fill} opacity={op}
        transform={`rotate(-22, ${width * 0.83}, ${height * 0.12})`}
      />
      {/* Gauche-milieu */}
      <Ellipse
        cx={width * 0.07} cy={height * 0.32}
        rx={rx * 1.1} ry={ry * 0.9} fill={fill} opacity={op}
        transform={`rotate(18, ${width * 0.07}, ${height * 0.32})`}
      />
      {/* Centre-bas (au-dessus du panneau bleu) */}
      <Ellipse
        cx={width * 0.6} cy={height * 0.5}
        rx={rx * 1.15} ry={ry * 0.82} fill={fill} opacity={op}
        transform={`rotate(-8, ${width * 0.6}, ${height * 0.5})`}
      />
    </Svg>
  );
}
