import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';

const FLICKER_MS = 520;
// Cœur jaune qui scintille plus vite que la flamme ne danse
const SPARKLE_MS = 260;
// Flamme vive : contour orange brûlé (lisible sur fond clair), corps orange vif, cœur jaune
const VIVID = { edge: '#C2410C', body: '#FF8A00', core: '#FFD23F' };
const EDGE_SCALE = 1.12;
const CORE_SCALE = 0.55;

type Props = {
  size?: number;
  color?: string;
  /** Flamme en trois couches (contour, corps, cœur scintillant) : reste vive et lisible sur un fond clair. */
  vivid?: boolean;
};

/** Flamme de la série du défi du jour : elle vacille (grossit, penche) en boucle, figée si les animations sont réduites. */
export function AnimatedFlame({ size = 24, color = '#fb940e', vivid = false }: Props) {
  const [reduceMotion, setReduceMotion] = useState(true);
  const flicker = useState(() => new Animated.Value(0))[0];
  const sparkle = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false));
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const ease = Easing.inOut(Easing.sin);
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(flicker, { toValue: 1, duration: FLICKER_MS, easing: ease, useNativeDriver: true }),
          Animated.timing(flicker, { toValue: -1, duration: FLICKER_MS, easing: ease, useNativeDriver: true }),
          Animated.timing(flicker, { toValue: 0, duration: FLICKER_MS, easing: ease, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(sparkle, { toValue: 0.45, duration: SPARKLE_MS, easing: ease, useNativeDriver: true }),
          Animated.timing(sparkle, { toValue: 1, duration: SPARKLE_MS, easing: ease, useNativeDriver: true }),
          Animated.timing(sparkle, { toValue: 0.6, duration: SPARKLE_MS, easing: ease, useNativeDriver: true }),
          Animated.timing(sparkle, { toValue: 1, duration: SPARKLE_MS, easing: ease, useNativeDriver: true }),
          Animated.timing(sparkle, { toValue: 0.5, duration: SPARKLE_MS, easing: ease, useNativeDriver: true }),
          Animated.timing(sparkle, { toValue: 1, duration: SPARKLE_MS, easing: ease, useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, flicker, sparkle]);

  const scale = flicker.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.94, 1, 1.12] });
  const rotate = flicker.interpolate({ inputRange: [-1, 1], outputRange: ['-7deg', '7deg'] });
  const box = vivid ? size * EDGE_SCALE : size;

  return (
    // Pivot en bas de la flamme : elle danse sur sa base au lieu de tourner autour de son centre
    <Animated.View style={{ width: box, height: box, transform: [{ translateY: box / 2 }, { rotate }, { scale }, { translateY: -box / 2 }] }}>
      {vivid ? (
        <>
          <View style={styles.layer}>
            <MaterialCommunityIcons name="fire" size={size * EDGE_SCALE} color={VIVID.edge} />
          </View>
          <View style={styles.layer}>
            <MaterialCommunityIcons name="fire" size={size} color={VIVID.body} />
          </View>
          {/* Cœur posé dans le bas de la flamme */}
          <Animated.View style={[styles.layer, styles.core, { opacity: sparkle, paddingBottom: size * 0.06 }]}>
            <MaterialCommunityIcons name="fire" size={size * CORE_SCALE} color={VIVID.core} />
          </Animated.View>
        </>
      ) : (
        <MaterialCommunityIcons name="fire" size={size} color={color} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  core: {
    justifyContent: 'flex-end',
  },
});
