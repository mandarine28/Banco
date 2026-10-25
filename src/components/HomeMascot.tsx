import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useEffectEvent, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { MASCOT_NORMAL_XML } from '@/components/mascotIdleXml';

// Tête de la mascotte (300 × 249)
const SIZE = 96;
const HEIGHT = (SIZE * 249) / 300;
// Hauteur visible au-dessus du panneau : jusqu'aux yeux
const PEEK = HEIGHT * 0.6;
// Marge latérale : on évite les coins arrondis (48) du panneau bleu
const EDGE = 60;

const FIRST_DELAY_MS = 4000;
const MIN_GAP_MS = 8000;
const MAX_GAP_MS = 15000;
const SMOOTH = Easing.inOut(Easing.ease);

type Props = {
  /** Largeur de l'écran (max 500). */
  width: number;
  /** Ordonnée du haut du panneau bleu ; la mascotte se cache derrière. */
  panelTop: number;
  /** Change à chaque toucher sur l'écran : la mascotte « prend peur » et le timer repart. */
  interactionKey: number;
  /** Didacticiel en cours : sa mascotte suffit, celle de l'accueil reste cachée. */
  paused?: boolean;
};

const randomGap = () => MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);

/**
 * Animation d'inactivité de l'accueil : la mascotte sort la tête de derrière le panneau bleu,
 * regarde à gauche et à droite, puis se recache.
 * Doit être rendue AVANT le panneau bleu pour passer derrière lui.
 */
export function HomeMascot({ width, panelTop, interactionKey, paused = false }: Props) {
  const rise = useState(() => new Animated.Value(0))[0];
  const tilt = useState(() => new Animated.Value(0))[0];
  const [spot, setSpot] = useState(0);
  const [focused, setFocused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  const spots = [EDGE, width * 0.55 - SIZE / 2, width - EDGE - SIZE];
  const active = focused && !reduceMotion && panelTop > 0 && !paused;

  // Une apparition complète ; `next` est rappelé à la fin pour programmer la suivante
  const appear = useEffectEvent((next: () => void) => {
    setSpot((prev) => (prev + 1 + Math.floor(Math.random() * 2)) % 3);
    const turn = (to: number, duration: number) =>
      Animated.timing(tilt, { toValue: to, duration, easing: SMOOTH, useNativeDriver: true });
    const moveTo = (to: number, duration: number) =>
      Animated.timing(rise, { toValue: to, duration, easing: SMOOTH, useNativeDriver: true });

    Animated.sequence([
      moveTo(PEEK, 650),
      turn(-10, 450),
      Animated.delay(250),
      turn(10, 700),
      Animated.delay(250),
      turn(0, 450),
      moveTo(0, 550),
    ]).start(({ finished }) => {
      if (finished) next();
    });
  });

  // Prend peur : se cache vite, sans attendre la fin de l'animation en cours
  const hide = useEffectEvent(() => {
    rise.stopAnimation();
    tilt.stopAnimation();
    Animated.parallel([
      Animated.timing(rise, { toValue: 0, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(tilt, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  });

  // Boucle d'apparitions : relancée (timer remis à zéro) à chaque interaction
  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    const schedule = (delay: number) => {
      timer = setTimeout(() => {
        if (!stopped) appear(() => schedule(randomGap()));
      }, delay);
    };
    schedule(FIRST_DELAY_MS);
    return () => {
      stopped = true;
      clearTimeout(timer);
      hide();
    };
  }, [active, interactionKey]);

  if (!active) return null;

  const translateY = Animated.multiply(rise, -1);
  const rotate = tilt.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] });

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.head, { top: panelTop, left: spots[spot] }]}
    >
      <Animated.View style={[styles.head, styles.fill, { transform: [{ translateY }, { rotate }] }]}>
        <SvgXml xml={MASCOT_NORMAL_XML} width="100%" height="100%" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    position: 'absolute',
    width: SIZE,
    height: HEIGHT,
  },
  fill: {
    top: 0,
    left: 0,
  },
});
