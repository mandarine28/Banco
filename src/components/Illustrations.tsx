import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Rect, Stop, Text } from 'react-native-svg';

import { BULB_PATH } from '@/components/Logo';
import { colors, fonts } from '@/theme';

const TEAL = '#3CC8BC';

/** Ampoule « 9 » du mode Classique (même dessin que dans le logo). */
export function Bulb({ height }: { height: number }) {
  // Cadre autour de l'ampoule dans le repère du logo : x 205→345, y 65→296.
  const width = (height * 140) / 231;
  return (
    <Svg width={width} height={height} viewBox="205 65 140 231">
      <Defs>
        <LinearGradient id="bulbFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFD86B" />
          <Stop offset="1" stopColor={colors.orange} />
        </LinearGradient>
      </Defs>
      <Path d={BULB_PATH} fill="url(#bulbFill)" />
      <Text x={275} y={168} fontSize={92} fontFamily={fonts.display} fontWeight="bold" fill={colors.white} textAnchor="middle">
        9
      </Text>
      {[244, 256, 268, 280].map((y) => (
        <Rect key={y} x={250} y={y} width={50} height={8} rx={4} fill={TEAL} />
      ))}
    </Svg>
  );
}

/** Chapeau de bouffon (Jokers). */
export function JesterHat({ width }: { width: number }) {
  return (
    <Svg width={width} height={(width * 60) / 104} viewBox="-2 -4 104 60">
      <Path d="M26 42 C22 27 14 21 4 20 C14 28 18 36 20 44 Z" fill={TEAL} />
      <Path d="M38 42 C38 24 45 12 52 4 C55 18 59 30 62 42 Z" fill={colors.purple} />
      <Path d="M62 42 C66 28 82 21 96 20 C86 28 81 36 80 44 Z" fill={TEAL} />
      <Circle cx={4} cy={20} r={5} fill={colors.orange} />
      <Circle cx={52} cy={4} r={5} fill={colors.orange} />
      <Circle cx={96} cy={20} r={5} fill={colors.orange} />
      <Rect x={20} y={40} width={60} height={13} rx={4} fill="#F6B23E" />
      {[32, 44, 56, 68].map((x) => (
        <Circle key={x} cx={x} cy={46.5} r={2.6} fill="#FFE9A8" />
      ))}
    </Svg>
  );
}

/** Ballon posé sur une ombre turquoise (pack Football). */
export function SoccerBall({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size * 1.1, alignItems: 'center' }}>
      <Svg width={size} height={size * 0.3} style={[StyleSheet.absoluteFill, { top: size * 0.8 }]}>
        <Ellipse cx={size / 2} cy={size * 0.15} rx={size * 0.48} ry={size * 0.13} fill={TEAL} opacity={0.6} />
      </Svg>
      <View style={[styles.ball, { width: size * 0.92, height: size * 0.92, borderRadius: size }]}>
        <MaterialCommunityIcons name="soccer" size={size * 0.92} color={colors.black} />
      </View>
    </View>
  );
}

/** Bouffon + ballon de l'offre « La Totale ». */
export function TotaleIcon({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size * 1.15, alignItems: 'center', justifyContent: 'flex-end' }}>
      <SoccerBall size={size * 0.62} />
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center' }]}>
        <View style={{ transform: [{ rotate: '-12deg' }] }}>
          <JesterHat width={size * 0.85} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ball: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
});
