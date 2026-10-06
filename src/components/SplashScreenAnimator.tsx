import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { colors } from '@/theme';

// ── Icône singe (logo-icone.svg, viewBox 0 0 300 249) ──────────────────────
const ICON_HEAD =
  'M156.591 77.5784C156.591 77.5784 149.739 105.478 120.126 108.414C97.856 110.372 63.5938 96.1779 63.5938 55.5527C63.5938 20.3115 79.9907 10.2775 96.3876 5.1382C123.797 -3.42737 188.162 0.243589 200.398 5.1382C222.424 13.9485 232.458 32.3033 232.458 57.2658C232.458 79.781 215.571 102.051 193.79 102.051C170.786 101.807 163.444 91.0386 156.591 77.5784ZM109.848 60.2026C109.848 69.0128 116.945 76.11 125.511 76.11C134.321 76.11 141.418 69.0128 141.418 60.2026C141.418 51.637 134.321 44.5398 125.511 44.5398C116.945 44.5398 109.848 51.637 109.848 60.2026ZM166.136 60.2026C166.136 69.0128 173.233 76.11 182.043 76.11C190.609 76.11 197.706 69.0128 197.706 60.2026C197.706 51.637 190.609 44.5398 182.043 44.5398C173.233 44.5398 166.136 51.637 166.136 60.2026Z';

const ICON_BODY =
  'M225.36 211.821C212.635 233.358 182.288 247.797 151.941 248.286C119.392 249.021 80.9695 234.337 70.9356 211.821C61.6358 191.264 62.6147 168.994 71.9145 150.394C83.6616 126.411 119.147 113.685 150.473 114.174C180.575 114.663 210.187 128.858 223.647 149.171C237.108 169.483 235.639 194.201 225.36 211.821ZM116.07 173.146C113.696 187.154 134.88 201.19 152.431 199.799C166.874 198.654 182.043 186.261 182.043 177.451C182.043 168.64 160.996 166.057 152.431 166.057C143.621 166.057 116.07 164.336 116.07 173.146Z';

// Bouche seule — incluse dans le layer tête pour pivoter avec elle
// Rendue en couleur fond (purple) pour simuler le trou du torse original
const ICON_MOUTH =
  'M116.07 173.146C113.696 187.154 134.88 201.19 152.431 199.799C166.874 198.654 182.043 186.261 182.043 177.451C182.043 168.64 160.996 166.057 152.431 166.057C143.621 166.057 116.07 164.336 116.07 173.146Z';

const ICON_LEFT_EAR =
  'M48.126 121.382C54.5576 119.829 56.5536 134.467 49.6785 138.57C45.132 141.231 31.2708 141.453 23.8412 139.346C7.20782 134.577 0 120.273 0 103.972C0 85.4535 8.53848 72.7012 23.5085 66.7132C31.049 63.6083 45.5755 63.83 50.6765 67.2676C55.6665 70.7052 55.0011 84.899 47.5716 84.0119C40.0311 83.2357 35.2628 82.4595 30.4946 86.5624C21.8452 93.8811 21.4017 110.071 30.1619 118.499C34.1539 122.38 41.0291 123.045 48.126 121.382Z';

const ICON_RIGHT_EAR =
  'M251.874 121.382C245.442 119.829 243.446 134.467 250.322 138.57C254.868 141.231 268.729 141.453 276.159 139.346C292.792 134.577 300 120.273 300 103.972C300 85.4535 291.462 72.7012 276.491 66.7132C268.951 63.6083 254.424 63.83 249.324 67.2676C244.334 70.7052 244.999 84.899 252.428 84.0119C259.969 83.2357 264.737 82.4595 269.505 86.5624C278.155 93.8811 278.598 110.071 269.838 118.499C265.846 122.38 258.971 123.045 251.874 121.382Z';

// ── Lettres BANCO (viewBox 0 0 324 84) ─────────────────────────────────────
const LETTER_PATHS = [
  'M38.4575 37.6088C38.4575 37.6088 52.2878 41.0057 53.7436 55.6853C54.7142 66.7253 47.6777 83.7099 27.5388 83.7099C10.0689 83.7099 5.09482 75.5815 2.54713 67.4532C-1.69903 53.8655 0.120753 21.9587 2.54713 15.8928C6.9146 4.97407 16.0135 0 28.388 0C39.5493 0 50.5893 8.37099 50.5893 19.1684C50.468 30.5723 45.13 34.2119 38.4575 37.6088ZM29.8438 60.7807C34.2113 60.7807 37.7295 57.2624 37.7295 53.0163C37.7295 48.6488 34.2113 45.1306 29.8438 45.1306C25.5977 45.1306 22.0794 48.6488 22.0794 53.0163C22.0794 57.2624 25.5977 60.7807 29.8438 60.7807ZM29.8438 32.8774C34.2113 32.8774 37.7295 29.3591 37.7295 24.9917C37.7295 20.7455 34.2113 17.2273 29.8438 17.2273C25.5977 17.2273 22.0794 20.7455 22.0794 24.9917C22.0794 29.3591 25.5977 32.8774 29.8438 32.8774Z',
  'M99.7187 8.73495C102.873 15.8928 114.156 52.167 117.189 65.8761C122.163 89.0479 94.502 88.9266 94.502 70.1222C94.502 58.4756 82.734 58.4756 82.734 69.5156C82.734 88.5627 54.1028 89.5332 58.9556 66.7253C65.0215 38.822 73.6351 17.9552 77.396 9.09891C82.3701 -2.42637 94.2593 -3.2756 99.7187 8.73495ZM88.6787 47.3143C92.1969 47.3143 95.1086 44.4026 95.1086 40.7631C95.1086 37.2448 92.1969 34.3332 88.6787 34.3332C85.0391 34.3332 82.1274 37.2448 82.1274 40.7631C82.1274 44.4026 85.0391 47.3143 88.6787 47.3143Z',
  'M177.022 0C182.239 0 187.456 3.15429 188.062 10.4334C188.79 17.7125 188.912 61.2659 188.062 71.4567C187.456 79.8277 183.21 83.7099 177.022 83.7099C174.717 83.7099 172.655 82.982 171.078 81.7688C170.956 81.6475 170.835 81.5262 170.714 81.4048C170.35 81.0409 169.986 80.6769 169.622 80.1917C164.041 73.5191 154.214 53.7442 153.487 52.4097C151.06 48.2848 147.178 48.7701 147.057 52.7736C146.935 61.8725 146.693 69.5156 146.329 72.1846C145.358 78.8572 141.84 83.7099 135.774 83.7099C129.587 83.7099 125.462 79.8277 124.734 71.4567C123.885 61.2659 124.006 17.7125 124.734 10.4334C125.462 3.15429 130.557 0 135.774 0C137.472 0 138.928 0.363959 140.141 0.849234C147.906 3.39693 153.244 23.7785 159.31 30.5723C161.615 33.2413 165.497 32.8774 165.618 29.8444C165.618 29.7231 165.618 29.7231 165.618 29.6018C165.618 20.5029 165.861 12.7385 166.225 10.1908C167.074 4.73143 170.35 0 177.022 0Z',
  'M249.873 62.4791C256.91 60.7807 259.093 76.7947 251.572 81.2835C246.598 84.1952 231.433 84.4378 223.304 82.1328C205.107 76.9161 197.221 61.2659 197.221 43.4321C197.221 23.1719 206.562 9.22022 222.941 2.66901C231.19 -0.72791 247.083 -0.485269 252.664 3.27561C258.123 7.03649 257.395 22.5653 249.267 21.5947C241.017 20.7455 235.8 19.8963 230.584 24.3851C221.121 32.3921 220.635 50.1046 230.22 59.3248C234.587 63.571 242.109 64.2989 249.873 62.4791Z',
  'M305.7 4.00352C316.376 10.3121 323.534 25.3556 323.776 40.3991C324.14 56.5345 316.861 75.5816 305.7 80.5556C295.509 85.1657 284.469 84.6805 275.249 80.0703C263.36 74.247 257.051 56.6558 257.294 41.127C257.536 26.2048 264.573 11.5253 274.642 4.85275C284.712 -1.81978 296.965 -1.09186 305.7 4.00352ZM290.778 48.0422C295.145 48.0422 298.663 44.524 298.663 40.1565C298.663 35.9103 295.145 32.3921 290.778 32.3921C286.41 32.3921 283.013 35.9103 283.013 40.1565C283.013 44.524 286.41 48.0422 290.778 48.0422Z',
];

// ── Layout constants ────────────────────────────────────────────────────────
const ICON_W = 178;
const ICON_H = Math.round((ICON_W * 249) / 300); // 148

const TEXT_W = 256;
const SCALE = TEXT_W / 324; // ≈ 0.790
const TEXT_H = Math.round(84 * SCALE); // 66

// Per-letter crop: [minX, minY, cropW, cropH] in SVG units (viewBox 0 0 324 84)
const CROPS: [number, number, number, number][] = [
  [0,   0, 56, 84], // B
  [54,  0, 68, 84], // A
  [124, 0, 65, 84], // N
  [197, 0, 62, 84], // C
  [257, 0, 67, 84], // O
];

// Letter center X offsets relative to BANCO text center (pixels)
// Source: (svgCenterX - 162) * SCALE, where 162 = half of 324
const LETTER_X = [
  Math.round(-134 * SCALE), // B  → -106
  Math.round(-74  * SCALE), // A  →  -58
  Math.round(-5.5 * SCALE), // N  →   -4
  Math.round(66   * SCALE), // C  →   52
  Math.round(128.5 * SCALE),// O  →  101
];

// ── Sub-components ──────────────────────────────────────────────────────────
function IconHead() {
  return (
    <Svg width={ICON_W} height={ICON_H} viewBox="0 0 300 249">
      <Path d={ICON_HEAD} fill={colors.cream} />
      <Path d={ICON_MOUTH} fill={colors.purple} />
    </Svg>
  );
}

function IconBody() {
  return (
    <Svg width={ICON_W} height={ICON_H} viewBox="0 0 300 249">
      <Path d={ICON_BODY} fill={colors.cream} />
    </Svg>
  );
}

function LeftEar() {
  return (
    <Svg width={ICON_W} height={ICON_H} viewBox="0 0 300 249">
      <Path d={ICON_LEFT_EAR} fill={colors.cream} />
    </Svg>
  );
}

function RightEar() {
  return (
    <Svg width={ICON_W} height={ICON_H} viewBox="0 0 300 249">
      <Path d={ICON_RIGHT_EAR} fill={colors.cream} />
    </Svg>
  );
}

function Letter({ idx }: { idx: number }) {
  const [minX, minY, cropW, cropH] = CROPS[idx];
  return (
    <Svg
      width={Math.round(cropW * SCALE)}
      height={TEXT_H}
      viewBox={`${minX} ${minY} ${cropW} ${cropH}`}
    >
      <Path d={LETTER_PATHS[idx]} fill={colors.cream} />
    </Svg>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
type Props = { onFinish: () => void };

export function SplashScreenAnimator({ onFinish }: Props) {
  const { width, height } = useWindowDimensions();

  // Phase 1 — monkey appear
  const iconScale    = useRef(new Animated.Value(0.7)).current;
  const headOpacity  = useRef(new Animated.Value(0)).current;
  const earOpacity   = useRef(new Animated.Value(0)).current;
  const bodyOpacity  = useRef(new Animated.Value(0)).current;

  // Phase 2 — ears fly off, head rotates then fades
  const earSlideY   = useRef(new Animated.Value(0)).current;
  const headRotate  = useRef(new Animated.Value(0)).current;

  // Phase 3 — B and O appear and spread
  const boOpacity   = useRef(new Animated.Value(0)).current;
  const bX          = useRef(new Animated.Value(-55)).current;
  const oX          = useRef(new Animated.Value(55)).current;
  const boLetterSc  = useRef(new Animated.Value(2.0)).current;

  // Phase 4 — A, N, C slide in
  const ancOpacity  = useRef(new Animated.Value(0)).current;
  const ancY        = useRef(new Animated.Value(16)).current;

  // Phase 5 — final exponential zoom
  const bancoScale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const out = Easing.out(Easing.cubic);
    const inn = Easing.in(Easing.cubic);

    Animated.sequence([
      Animated.delay(180),

      // 1 — Full mascot (head + body + ears) fades and scales in
      Animated.parallel([
        Animated.timing(iconScale,   { toValue: 1, duration: 400, easing: out, useNativeDriver: true }),
        Animated.timing(headOpacity, { toValue: 1, duration: 300, easing: out, useNativeDriver: true }),
        Animated.timing(bodyOpacity, { toValue: 1, duration: 320, easing: out, useNativeDriver: true }),
        Animated.timing(earOpacity,  { toValue: 1, duration: 340, easing: out, useNativeDriver: true }),
      ]),

      Animated.delay(500),

      // 2 — Ears + body disappear; head rotates 90° then crossfades to B/O
      Animated.parallel([
        Animated.timing(earSlideY,   { toValue: -520, duration: 360, easing: inn, useNativeDriver: true }),
        Animated.timing(earOpacity,  { toValue: 0,    duration: 240, easing: inn, useNativeDriver: true }),
        Animated.timing(bodyOpacity, { toValue: 0,    duration: 280, easing: inn, useNativeDriver: true }),
        Animated.timing(headRotate, { toValue: 1,    duration: 380, easing: out, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(180),
          Animated.timing(headOpacity, { toValue: 0, duration: 220, easing: inn, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.delay(180),
          Animated.timing(boOpacity, { toValue: 1, duration: 240, easing: out, useNativeDriver: true }),
        ]),
      ]),

      // 3+4 — B/O s'écartent ET A,N,C apparaissent en même temps (décalé de 100ms)
      Animated.parallel([
        Animated.timing(bX,         { toValue: LETTER_X[0], duration: 320, easing: out, useNativeDriver: true }),
        Animated.timing(oX,         { toValue: LETTER_X[4], duration: 320, easing: out, useNativeDriver: true }),
        Animated.timing(boLetterSc, { toValue: 1,           duration: 320, easing: out, useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel([
            Animated.timing(ancOpacity, { toValue: 1, duration: 240, easing: out, useNativeDriver: true }),
            Animated.timing(ancY,       { toValue: 0, duration: 240, easing: out, useNativeDriver: true }),
          ]),
        ]),
      ]),

      // 5 — Exponential zoom: letters fill screen
      Animated.timing(bancoScale, {
        toValue: 80,
        duration: 380,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, []);

  const headRotateDeg = headRotate.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  // Explicit dimensions are required so justifyContent:'center' resolves
  const fullCenter = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width,
    height,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Blue background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.purple }]} />

      {/* Decorative cream pattern */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <CreamPatternSvg width={width} height={height} opacity={0.05} fill="#ffffff" />
      </View>

      {/* Left ear — slides up off screen */}
      <Animated.View
        style={[
          fullCenter,
          { opacity: earOpacity, transform: [{ scale: iconScale }, { translateY: earSlideY }] },
        ]}
        pointerEvents="none"
      >
        <LeftEar />
      </Animated.View>

      {/* Right ear — slides up off screen */}
      <Animated.View
        style={[
          fullCenter,
          { opacity: earOpacity, transform: [{ scale: iconScale }, { translateY: earSlideY }] },
        ]}
        pointerEvents="none"
      >
        <RightEar />
      </Animated.View>

      {/* Body — fades out when ears fly off */}
      <Animated.View
        style={[
          fullCenter,
          { opacity: bodyOpacity, transform: [{ scale: iconScale }] },
        ]}
        pointerEvents="none"
      >
        <IconBody />
      </Animated.View>

      {/* Head — rotates 90° then fades (crossfades to B/O) */}
      <Animated.View
        style={[
          fullCenter,
          {
            opacity: headOpacity,
            transform: [{ scale: iconScale }, { rotate: headRotateDeg }],
          },
        ]}
        pointerEvents="none"
      >
        <IconHead />
      </Animated.View>

      {/* BANCO group — all letters share this container for the final zoom */}
      <Animated.View
        style={[fullCenter, { transform: [{ scale: bancoScale }] }]}
        pointerEvents="none"
      >
        {/* B — appears near center, spreads left */}
        <Animated.View
          style={[
            fullCenter,
            { opacity: boOpacity, transform: [{ translateX: bX }, { scale: boLetterSc }] },
          ]}
        >
          <Letter idx={0} />
        </Animated.View>

        {/* O — appears near center, spreads right */}
        <Animated.View
          style={[
            fullCenter,
            { opacity: boOpacity, transform: [{ translateX: oX }, { scale: boLetterSc }] },
          ]}
        >
          <Letter idx={4} />
        </Animated.View>

        {/* A — slides up into gap */}
        <Animated.View
          style={[
            fullCenter,
            { opacity: ancOpacity, transform: [{ translateX: LETTER_X[1] }, { translateY: ancY }] },
          ]}
        >
          <Letter idx={1} />
        </Animated.View>

        {/* N — slides up into center */}
        <Animated.View
          style={[
            fullCenter,
            { opacity: ancOpacity, transform: [{ translateX: LETTER_X[2] }, { translateY: ancY }] },
          ]}
        >
          <Letter idx={2} />
        </Animated.View>

        {/* C — slides up into gap */}
        <Animated.View
          style={[
            fullCenter,
            { opacity: ancOpacity, transform: [{ translateX: LETTER_X[3] }, { translateY: ancY }] },
          ]}
        >
          <Letter idx={3} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: 'hidden',
  },
});
