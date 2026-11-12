import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Rect } from 'react-native-svg';

import { colors, fonts } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const WARNING_SECONDS = 3;
const PULSE_SCALE = 1.06;
// Proportions du chronomètre, en fraction du diamètre du boîtier
const RING = 0.065;
const CROWN = 0.14;
const SHADOW = 0.035;
// Secteur du temps restant : blanc cassé des boutons secondaires
const WEDGE = '#fffbf5';

/** Mélange une couleur #RRGGBB avec du blanc (0 = inchangée, 1 = blanc), en composantes 0-255. */
function lighten(hex: string, amount: number): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return [mix((n >> 16) & 255), mix((n >> 8) & 255), mix(n & 255)];
}

/** Luminance relative (WCAG) d'une couleur 0-255. */
function luminance(rgb: readonly number[]): number {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Contraste visé entre le chiffre bleu nuit et le cadran (le rose en manquait)
const MIN_CONTRAST = 7;
const NAVY_LUMINANCE = luminance([12, 45, 100]);

/** Cadran : couleur de l'équipe éclaircie juste assez pour que le chiffre reste bien lisible. */
function faceColor(team: string): string {
  for (let amount = 0.25; amount < 1; amount += 0.05) {
    const rgb = lighten(team, amount);
    if ((luminance(rgb) + 0.05) / (NAVY_LUMINANCE + 0.05) >= MIN_CONTRAST) return `rgb(${rgb.join(',')})`;
  }
  return 'rgb(255,255,255)';
}

type Props = {
  /** Diamètre du boîtier ; le bouton du haut s'ajoute au-dessus. */
  size: number;
  /** Couleur de l'équipe qui joue : teinte le cadran. */
  color: string;
  remainingMs: number;
  totalMs: number;
  paused: boolean;
};

/**
 * Chrono de survie façon chronomètre : boîtier bleu nuit, cadran à la couleur de l'équipe, secteur clair du temps
 * restant qui se creuse dans le sens des aiguilles d'une montre, gros chiffre et pulsation sur les dernières secondes.
 */
export function SurvieTimerDisc({ size, color, remainingMs, totalMs, paused }: Props) {
  const [left] = useState(() => new Animated.Value(totalMs ? remainingMs / totalMs : 0));
  const [pulse] = useState(() => new Animated.Value(1));
  // Valeur lue au démarrage ou à la reprise, sans relancer l'animation à chaque tick du compte à rebours
  const remainingRef = useRef(remainingMs);
  useEffect(() => {
    remainingRef.current = remainingMs;
  });

  useEffect(() => {
    if (paused || !totalMs) return;
    const remaining = remainingRef.current;
    left.setValue(remaining / totalMs);
    // Propriété SVG : pas de fil natif, mais un seul trait à animer
    const anim = Animated.timing(left, { toValue: 0, duration: remaining, easing: Easing.linear, useNativeDriver: false });
    anim.start();
    return () => anim.stop();
  }, [paused, totalMs, left]);

  const seconds = Math.ceil(remainingMs / 1000);
  const warning = !paused && seconds <= WARNING_SECONDS;
  useEffect(() => {
    if (!warning) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: PULSE_SCALE, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 820, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => {
      loop.stop();
      pulse.setValue(1);
    };
  }, [warning, pulse]);

  const ring = size * RING;
  const crown = size * CROWN;
  const shadow = size * SHADOW;
  const cx = size / 2;
  const cy = crown + size / 2;
  const caseR = size / 2 - ring / 2;
  const faceR = size / 2 - ring;
  // Trait de largeur = rayon sur un cercle de rayon moitié : il remplit un secteur du cadran
  const pieR = faceR / 2;
  const circumference = 2 * Math.PI * pieR;
  // Décalage négatif : le secteur restant finit toujours à 12 h, le temps écoulé se creuse dans le sens des aiguilles d'une montre
  const dashOffset = left.interpolate({ inputRange: [0, 1], outputRange: [-circumference, 0], extrapolate: 'clamp' });
  const tickR = size * 0.02;
  const tickDist = faceR * 0.84;
  const nubR = ring * 0.75;
  // Alerte sur le boîtier, en crème : s'accorde avec toutes les couleurs d'équipe (l'orange jurait avec le rose)
  const caseColor = warning ? colors.cream : colors.purpleDeep;

  return (
    <Animated.View
      style={[{ width: size, height: size + crown + shadow, transform: [{ scale: pulse }] }, paused && styles.paused]}
      accessibilityRole="timer"
      accessibilityLabel={`${seconds}`}
    >
      <Svg width={size} height={size + crown + shadow}>
        {/* Ombre portée, décalée vers le bas */}
        <Circle cx={cx} cy={cy + shadow} r={size / 2} fill="rgba(12,45,100,0.3)" />
        {/* Bouton du chronomètre : tige puis poussoir */}
        <Rect x={cx - size * 0.045} y={crown * 0.45} width={size * 0.09} height={crown * 0.75} fill={caseColor} />
        <Rect x={cx - size * 0.12} y={0} width={size * 0.24} height={crown * 0.5} rx={crown * 0.25} fill={caseColor} />
        {/* Cadran à la couleur de l'équipe, éclaircie pour garder le chiffre lisible */}
        <Circle cx={cx} cy={cy} r={faceR} fill={faceColor(color)} />
        <Circle cx={cx} cy={cy} r={faceR * 0.62} fill="rgba(255,255,255,0.12)" />
        {/* Temps restant : de l'aiguille jusqu'à 12 h */}
        <G transform={`rotate(-90 ${cx} ${cy})`}>
          <AnimatedCircle
            cx={cx}
            cy={cy}
            r={pieR}
            fill="none"
            stroke={WEDGE}
            strokeWidth={faceR}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
          />
        </G>
        {/* Repères à 12, 3, 6 et 9 h */}
        {[0, 1, 2, 3].map((quarter) => {
          const angle = (quarter * Math.PI) / 2;
          return (
            <Circle key={quarter} cx={cx + Math.sin(angle) * tickDist} cy={cy - Math.cos(angle) * tickDist} r={tickR} fill={colors.purpleDeep} />
          );
        })}
        {/* Boîtier et ses ergots à 3, 6 et 9 h */}
        <Circle cx={cx} cy={cy} r={caseR} fill="none" stroke={caseColor} strokeWidth={ring} />
        <Circle cx={cx + caseR} cy={cy} r={nubR} fill={caseColor} />
        <Circle cx={cx - caseR} cy={cy} r={nubR} fill={caseColor} />
        <Circle cx={cx} cy={cy + caseR} r={nubR} fill={caseColor} />
      </Svg>
      <View style={[styles.numberArea, { top: crown, height: size }]} pointerEvents="none">
        <Text
          style={[styles.seconds, { fontSize: size * 0.5, color: colors.purpleDeep }]}
          allowFontScaling={false}
        >
          {seconds}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  numberArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seconds: {
    fontFamily: fonts.display,
    includeFontPadding: false,
  },
  paused: {
    opacity: 0.55,
  },
});
