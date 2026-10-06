import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Paths extraits de assets/confetti.svg et confetti_orange.svg (même forme, couleurs différentes)
const PATH_BODY =
  'M2.83893 0C-0.889217 0.18318 -0.442029 3.66706 1.31586 5.89366C1.45713 8.38577 0.728339 11.2765 1.9118 13.6084C3.85306 17.467 8.48309 17.0076 11.9764 18.1187C14.6521 18.9697 14.6511 22.7059 13.8017 24.8604C14.2049 26.2765 14.6118 26.6923 16.0891 26.922C16.3613 26.9103 16.6326 26.8742 16.8993 26.8143C19.3831 26.2771 19.3915 21.1391 18.9256 19.1601C18.0416 15.3972 15.2461 13.2971 11.6696 12.3597C9.65626 11.8321 8.84233 11.9917 7.0545 10.8626C6.95346 8.34517 7.78236 6.19126 6.84308 3.62739C6.0516 1.46647 5.1067 0.379738 2.83893 0Z';
const PATH_DOT =
  'M5.23946 21.4747C3.45538 21.2566 1.82939 22.5169 1.59551 24.2988C1.36162 26.0806 2.60777 27.718 4.38718 27.9677C6.18905 28.2205 7.85151 26.9555 8.08913 25.1512C8.32583 23.347 7.046 21.6956 5.23946 21.4747Z';

const COLOR_CREAM = '#FEF1CB';
const COLOR_ORANGE = '#FCB24D';

const COUNT = 60;
const BURST_MS = 5000;
const FLY_MIN_MS = 1200;
const FLY_MAX_MS = 3200;

const r = (min: number, max: number) => min + Math.random() * (max - min);

type Config = {
  startX: number;
  driftX: number;
  startY: number;
  flyDuration: number;
  delay: number;
  scale: number;
  flipX: number;
  flipY: number;
  initRot: number;
  spin: number;
  color: string;
};

type Particle = {
  config: Config;
  tx: Animated.Value;
  ty: Animated.Value;
  rot: Animated.Value;
  op: Animated.Value;
};

function buildParticles(screenW: number, screenH: number): Particle[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const fromLeft = i % 2 === 0;
    const startX = fromLeft
      ? r(-10, screenW * 0.3)
      : r(screenW * 0.7, screenW + 10);
    const driftX = fromLeft ? r(40, 130) : r(-130, -40);
    const startY = r(-110, -10);
    const flyDuration = r(FLY_MIN_MS, FLY_MAX_MS);
    const delay = r(0, Math.max(BURST_MS - flyDuration - 200, 0));

    const config: Config = {
      startX,
      driftX,
      startY,
      flyDuration,
      delay,
      scale: r(0.38, 0.72),
      flipX: Math.random() > 0.5 ? 1 : -1,
      flipY: Math.random() > 0.5 ? 1 : -1,
      initRot: r(0, 360),
      spin: (Math.random() > 0.5 ? 1 : -1) * r(400, 900),
      color: Math.random() > 0.5 ? COLOR_CREAM : COLOR_ORANGE,
    };

    return {
      config,
      tx: new Animated.Value(startX),
      ty: new Animated.Value(startY),
      rot: new Animated.Value(0),
      op: new Animated.Value(0),
    };
  });
}

export function ConfettiOverlay() {
  const { width, height } = useWindowDimensions();

  // Initialisation paresseuse — une seule fois au montage
  const particlesRef = useRef<Particle[] | null>(null);
  if (!particlesRef.current) {
    particlesRef.current = buildParticles(width, height);
  }
  const particles = particlesRef.current;

  useEffect(() => {
    const anims = particles.map(({ config, tx, ty, rot, op }) =>
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.parallel([
          // Dérive horizontale décélérée (résistance de l'air)
          Animated.timing(tx, {
            toValue: config.startX + config.driftX,
            duration: config.flyDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          // Chute accélérée (gravité)
          Animated.timing(ty, {
            toValue: height + 90,
            duration: config.flyDuration,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          // Rotation continue (tournoiement)
          Animated.timing(rot, {
            toValue: 1,
            duration: config.flyDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // Opacité : apparition rapide → maintien → disparition douce
          Animated.sequence([
            Animated.timing(op, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.delay(Math.max(config.flyDuration - 650, 100)),
            Animated.timing(op, { toValue: 0, duration: 550, useNativeDriver: true }),
          ]),
        ]),
      ])
    );

    const master = Animated.parallel(anims);
    master.start();
    return () => master.stop();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map(({ config, tx, ty, rot, op }, i) => {
        const rotateDeg = rot.interpolate({
          inputRange: [0, 1],
          outputRange: [`${config.initRot}deg`, `${config.initRot + config.spin}deg`],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                opacity: op,
                transform: [
                  { translateX: tx },
                  { translateY: ty },
                  { rotate: rotateDeg },
                  { scaleX: config.flipX },
                  { scaleY: config.flipY },
                  { scale: config.scale },
                ],
              },
            ]}
          >
            <Svg width={20} height={28} viewBox="0 0 20 28">
              <Path d={PATH_BODY} fill={config.color} />
              <Path d={PATH_DOT} fill={config.color} />
            </Svg>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
