import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop, Text } from 'react-native-svg';

import { appName } from '@/config/app';
import { colors, fonts } from '@/theme';

/** Contour de l'ampoule (repère du logo : centre du globe en 275, 135). */
export const BULB_PATH =
  'M275 70 C239 70 210 99 210 135 C210 165 232 182 246 205 C252 216 254 226 254 236 L296 236 C296 226 298 216 304 205 C318 182 340 165 340 135 C340 99 311 70 275 70 Z';

const VIEW_W = 380;
const VIEW_H = 600;
const TEAL = '#3CC8BC';
const LOGO_PINK = '#DB1E5B';

type Props = {
  width: number;
};

/** Éclair stylisé centré sur (x, y), incliné de `angle` degrés. */
function Spark({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <Path
      d="M2 -22 L-6 2 L1 2 L-3 22 L7 -4 L0 -4 Z"
      fill="#F9B21C"
      transform={`translate(${x} ${y}) rotate(${angle})`}
    />
  );
}

export function Logo({ width }: Props) {
  const height = (width * VIEW_H) / VIEW_W;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} accessibilityLabel={appName}>
      <Defs>
        <LinearGradient id="bulb" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFD86B" />
          <Stop offset="1" stopColor={colors.orange} />
        </LinearGradient>
        <LinearGradient id="title" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={LOGO_PINK} />
          <Stop offset="1" stopColor={colors.orange} />
        </LinearGradient>
      </Defs>

      {/* Le « d » */}
      <Circle cx={130} cy={325} r={73} stroke={LOGO_PINK} strokeWidth={74} fill="none" />
      <Rect x={118} y={112} width={68} height={215} rx={34} fill={LOGO_PINK} />
      <Circle cx={186} cy={292} r={34} fill={colors.orange} />

      {/* L'ampoule et son « 9 » */}
      <G>
        <Spark x={270} y={22} angle={8} />
        <Spark x={204} y={60} angle={-38} />
        <Spark x={346} y={60} angle={52} />
        <Path d={BULB_PATH} fill="url(#bulb)" />
        <Text
          x={275}
          y={168}
          fontSize={92}
          fontFamily={fonts.display}
          fontWeight="bold"
          fill={colors.white}
          textAnchor="middle"
        >
          9
        </Text>
        {[244, 256, 268, 280].map((y) => (
          <Rect key={y} x={250} y={y} width={50} height={8} rx={4} fill={TEAL} />
        ))}
      </G>

      {/* Le câble et l'étiquette */}
      <Path d="M275 288 V470" stroke={TEAL} strokeWidth={6} />
      <Rect x={28} y={470} width={322} height={92} rx={46} stroke={TEAL} strokeWidth={6} fill={colors.white} />
      <Path d="M14 584 H160" stroke={TEAL} strokeWidth={6} strokeLinecap="round" />
      <Circle cx={14} cy={584} r={10} fill={TEAL} />
      <Text
        x={189}
        y={538}
        fontSize={66}
        fontFamily={fonts.display}
        fontWeight="bold"
        fill="url(#title)"
        textAnchor="middle"
      >
        {appName}
      </Text>
    </Svg>
  );
}
