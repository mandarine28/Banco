import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { colors } from '@/theme';

// ── Icône singe (logo-icone.svg, viewBox 0 0 322 297) ──────────────────────
// Stroke bleu = même couleur que le fond → silhouette crème sur fond bleu
const ICON_BODY =
  'M103.615 17.7715C119.346 12.8555 144 11.7224 165.107 12.1826C175.919 12.4183 186.311 13.0871 194.883 14.0283C202.913 14.9101 210.795 16.1682 215.59 18.0859C228.824 23.3798 239.005 31.8184 245.738 43.0928C252.388 54.2272 255.208 67.332 255.208 81.3711C255.208 95.5156 249.954 109.407 241.277 119.881C233.676 129.056 222.922 136.162 210.186 137.82C224.369 144.769 236.492 154.554 244.397 166.483C260.649 191.009 258.808 220.678 246.474 241.823L246.438 241.882C230.968 268.062 196.03 283.704 162.9 284.238L162.899 284.237C144.915 284.631 125.513 280.808 109.062 273.762C92.9649 266.868 77.5754 255.947 70.7598 240.653L70.7607 240.652C59.9732 216.757 61.0922 190.726 71.9668 168.977H71.9678C78.2598 156.191 89.3488 146.623 101.908 139.874C96.802 137.847 91.8109 135.153 87.1768 131.73C72.7909 121.106 62.3809 103.827 62.3809 79.6602C62.3809 60.1979 66.9308 45.9001 75.3281 35.5811C83.6461 25.3596 94.4706 20.6376 103.605 17.7744L103.615 17.7715ZM163.194 202.114C157.912 202.114 150.062 201.698 142.749 202.312C141.894 202.384 141.115 202.467 140.409 202.556C141.263 203.63 142.566 204.907 144.554 206.312C149.809 210.028 156.724 212.112 162.238 211.675C166.614 211.328 171.824 209.11 175.981 205.885C176.768 205.274 177.458 204.669 178.057 204.092C178.029 204.084 178.002 204.076 177.975 204.068C172.928 202.676 166.654 202.114 163.194 202.114ZM168.586 124.917C168.195 125.405 167.788 125.891 167.369 126.378C168.375 126.448 169.38 126.531 170.385 126.628C169.763 126.07 169.164 125.498 168.586 124.917ZM136.308 80.75C134.429 80.75 132.753 82.4261 132.753 84.3047C132.753 86.5498 134.551 88.1035 136.308 88.1035C138.431 88.1035 140.106 86.4276 140.106 84.3047C140.106 82.5476 138.553 80.75 136.308 80.75ZM192.77 80.75C190.524 80.75 188.97 82.5476 188.97 84.3047C188.97 86.4276 190.647 88.1035 192.77 88.1035C194.526 88.1033 196.324 86.5497 196.324 84.3047C196.324 82.4262 194.648 80.7502 192.77 80.75Z';

const ICON_LEFT_EAR =
  'M49.0166 83.1572C51.8856 83.2106 54.7591 83.4889 57.3506 84.0264C59.6901 84.5116 62.1723 85.2821 64.2246 86.5566L64.6289 86.8184L64.6523 86.834L64.6748 86.8506C67.3572 88.6985 68.7776 91.5694 69.4893 94.0176C70.2301 96.5665 70.4252 99.3812 70.1055 102.005C69.7934 104.565 68.9226 107.47 67.0244 109.793C64.9522 112.329 61.7704 113.962 57.9062 113.531V113.532C49.6693 112.684 47.6184 112.516 44.9834 114.783L44.9668 114.798L44.9492 114.812C42.1036 117.22 40.2789 121.437 40.2012 126.252C40.1264 130.889 41.6922 135.33 44.5918 138.298L44.876 138.58L44.8975 138.6C46.8696 140.517 51.3388 141.582 57.7705 140.074C61.8159 139.113 65.17 140.906 67.1982 143.416C69.0442 145.701 69.9281 148.623 70.2227 151.265C70.7757 156.225 69.4743 163.638 63.3779 167.276L63.3584 167.288L63.3379 167.3C61.3586 168.458 58.8782 169.107 56.6172 169.506C54.2347 169.926 51.5656 170.154 48.8857 170.222C43.6135 170.354 37.6987 169.874 33.2715 168.618L33.2646 168.615L33.2568 168.613C13.574 162.971 5.47754 145.9 5.47754 128.019C5.47761 117.924 7.81141 109.045 12.4766 101.765C17.1464 94.4773 23.9494 89.1136 32.3486 85.7432V85.7422C32.3584 85.7382 32.3682 85.7345 32.3779 85.7305C32.3851 85.7276 32.3922 85.7246 32.3994 85.7217V85.7227C37.1145 83.7943 43.4288 83.0532 49.0166 83.1572Z';

const ICON_RIGHT_EAR =
  'M272.517 83.1572C269.648 83.2106 266.774 83.4889 264.183 84.0264C261.843 84.5116 259.361 85.2821 257.309 86.5566L256.904 86.8184L256.881 86.834L256.858 86.8506C254.176 88.6985 252.756 91.5694 252.044 94.0176C251.303 96.5665 251.108 99.3812 251.428 102.005C251.74 104.565 252.611 107.47 254.509 109.793C256.581 112.329 259.763 113.962 263.627 113.531V113.532C271.864 112.684 273.915 112.516 276.55 114.783L276.566 114.798L276.584 114.812C279.43 117.22 281.254 121.437 281.332 126.252C281.407 130.889 279.841 135.33 276.941 138.298L276.657 138.58L276.636 138.6C274.664 140.517 270.194 141.582 263.763 140.074C259.717 139.113 256.363 140.906 254.335 143.416C252.489 145.701 251.605 148.623 251.311 151.265C250.757 156.225 252.059 163.638 258.155 167.276L258.175 167.288L258.195 167.3C260.175 168.458 262.655 169.107 264.916 169.506C267.299 169.926 269.968 170.154 272.647 170.222C277.92 170.354 283.834 169.874 288.262 168.618L288.269 168.615L288.276 168.613C307.959 162.971 316.056 145.9 316.056 128.019C316.056 117.924 313.722 109.045 309.057 101.765C304.387 94.4773 297.584 89.1136 289.185 85.7432V85.7422C289.175 85.7382 289.165 85.7345 289.155 85.7305C289.148 85.7276 289.141 85.7246 289.134 85.7217V85.7227C284.419 83.7943 278.104 83.0532 272.517 83.1572Z';

// ── Lettres BANCO (Logo.tsx LETTER_PATHS, viewBox 0 0 324 84) ───────────────
const LETTER_PATHS = [
  'M38.4575 37.6088C38.4575 37.6088 52.2878 41.0057 53.7436 55.6853C54.7142 66.7253 47.6777 83.7099 27.5388 83.7099C10.0689 83.7099 5.09482 75.5815 2.54713 67.4532C-1.69903 53.8655 0.120753 21.9587 2.54713 15.8928C6.9146 4.97407 16.0135 0 28.388 0C39.5493 0 50.5893 8.37099 50.5893 19.1684C50.468 30.5723 45.13 34.2119 38.4575 37.6088ZM29.8438 60.7807C34.2113 60.7807 37.7295 57.2624 37.7295 53.0163C37.7295 48.6488 34.2113 45.1306 29.8438 45.1306C25.5977 45.1306 22.0794 48.6488 22.0794 53.0163C22.0794 57.2624 25.5977 60.7807 29.8438 60.7807ZM29.8438 32.8774C34.2113 32.8774 37.7295 29.3591 37.7295 24.9917C37.7295 20.7455 34.2113 17.2273 29.8438 17.2273C25.5977 17.2273 22.0794 20.7455 22.0794 24.9917C22.0794 29.3591 25.5977 32.8774 29.8438 32.8774Z',
  'M99.7187 8.73495C102.873 15.8928 114.156 52.167 117.189 65.8761C122.163 89.0479 94.502 88.9266 94.502 70.1222C94.502 58.4756 82.734 58.4756 82.734 69.5156C82.734 88.5627 54.1028 89.5332 58.9556 66.7253C65.0215 38.822 73.6351 17.9552 77.396 9.09891C82.3701 -2.42637 94.2593 -3.2756 99.7187 8.73495ZM88.6787 47.3143C92.1969 47.3143 95.1086 44.4026 95.1086 40.7631C95.1086 37.2448 92.1969 34.3332 88.6787 34.3332C85.0391 34.3332 82.1274 37.2448 82.1274 40.7631C82.1274 44.4026 85.0391 47.3143 88.6787 47.3143Z',
  'M177.022 0C182.239 0 187.456 3.15429 188.062 10.4334C188.79 17.7125 188.912 61.2659 188.062 71.4567C187.456 79.8277 183.21 83.7099 177.022 83.7099C174.717 83.7099 172.655 82.982 171.078 81.7688C170.956 81.6475 170.835 81.5262 170.714 81.4048C170.35 81.0409 169.986 80.6769 169.622 80.1917C164.041 73.5191 154.214 53.7442 153.487 52.4097C151.06 48.2848 147.178 48.7701 147.057 52.7736C146.935 61.8725 146.693 69.5156 146.329 72.1846C145.358 78.8572 141.84 83.7099 135.774 83.7099C129.587 83.7099 125.462 79.8277 124.734 71.4567C123.885 61.2659 124.006 17.7125 124.734 10.4334C125.462 3.15429 130.557 0 135.774 0C137.472 0 138.928 0.363959 140.141 0.849234C147.906 3.39693 153.244 23.7785 159.31 30.5723C161.615 33.2413 165.497 32.8774 165.618 29.8444C165.618 29.7231 165.618 29.7231 165.618 29.6018C165.618 20.5029 165.861 12.7385 166.225 10.1908C167.074 4.73143 170.35 0 177.022 0Z',
  'M249.873 62.4791C256.91 60.7807 259.093 76.7947 251.572 81.2835C246.598 84.1952 231.433 84.4378 223.304 82.1328C205.107 76.9161 197.221 61.2659 197.221 43.4321C197.221 23.1719 206.562 9.22022 222.941 2.66901C231.19 -0.72791 247.083 -0.485269 252.664 3.27561C258.123 7.03649 257.395 22.5653 249.267 21.5947C241.017 20.7455 235.8 19.8963 230.584 24.3851C221.121 32.3921 220.635 50.1046 230.22 59.3248C234.587 63.571 242.109 64.2989 249.873 62.4791Z',
  'M305.7 4.00352C316.376 10.3121 323.534 25.3556 323.776 40.3991C324.14 56.5345 316.861 75.5816 305.7 80.5556C295.509 85.1657 284.469 84.6805 275.249 80.0703C263.36 74.247 257.051 56.6558 257.294 41.127C257.536 26.2048 264.573 11.5253 274.642 4.85275C284.712 -1.81978 296.965 -1.09186 305.7 4.00352ZM290.778 48.0422C295.145 48.0422 298.663 44.524 298.663 40.1565C298.663 35.9103 295.145 32.3921 290.778 32.3921C286.41 32.3921 283.013 35.9103 283.013 40.1565C283.013 44.524 286.41 48.0422 290.778 48.0422Z',
];

function LogoIcon() {
  const w = 178;
  const h = (w * 297) / 322;
  return (
    <Svg width={w} height={h} viewBox="0 0 322 297">
      <Path d={ICON_BODY} fill={colors.cream} stroke={colors.purple} strokeWidth={24.18} />
      <Path d={ICON_LEFT_EAR} fill={colors.cream} stroke={colors.purple} strokeWidth={10.95} />
      <Path d={ICON_RIGHT_EAR} fill={colors.cream} stroke={colors.purple} strokeWidth={10.95} />
    </Svg>
  );
}

function LogoText() {
  const w = 256;
  const h = (w * 84) / 324;
  return (
    <Svg width={w} height={h} viewBox="0 0 324 84">
      {LETTER_PATHS.map((d, i) => (
        <Path key={i} d={d} fill={colors.cream} />
      ))}
    </Svg>
  );
}

type Props = { onFinish: () => void };

export function SplashScreenAnimator({ onFinish }: Props) {
  const { width, height } = useWindowDimensions();

  const iconOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const iconTranslateY = useRef(new Animated.Value(0)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(1.15)).current;
  const textTranslateY = useRef(new Animated.Value(48)).current;

  const creamOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const easeOut = Easing.out(Easing.cubic);
    const easeIn = Easing.in(Easing.cubic);

    Animated.sequence([
      Animated.delay(160),
      // Phase 1 : icône apparaît (fade + scale)
      Animated.parallel([
        Animated.timing(iconOpacity, { toValue: 1, duration: 360, easing: easeOut, useNativeDriver: true }),
        Animated.timing(iconScale, { toValue: 1, duration: 420, easing: easeOut, useNativeDriver: true }),
      ]),
      Animated.delay(420),
      // Phase 2a : icône zoome (visage remplit l'écran)
      Animated.parallel([
        Animated.timing(iconScale, { toValue: 3.6, duration: 420, easing: easeOut, useNativeDriver: true }),
        Animated.timing(iconTranslateY, { toValue: -190, duration: 420, easing: easeOut, useNativeDriver: true }),
      ]),
      // Phase 2b : icône sort par le haut, BANCO glisse depuis le bas
      Animated.parallel([
        Animated.timing(iconTranslateY, { toValue: -660, duration: 380, easing: easeIn, useNativeDriver: true }),
        Animated.timing(iconOpacity, { toValue: 0, duration: 260, easing: easeIn, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 1, duration: 360, easing: easeOut, useNativeDriver: true }),
        Animated.timing(textScale, { toValue: 1, duration: 380, easing: easeOut, useNativeDriver: true }),
        Animated.timing(textTranslateY, { toValue: 0, duration: 380, easing: easeOut, useNativeDriver: true }),
      ]),
      Animated.delay(520),
      // Phase 3 : fondu vers fond crème (transition vers le home)
      Animated.timing(creamOpacity, { toValue: 1, duration: 420, easing: easeOut, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, []);

  // Vue plein-écran centrée — width/height explicites pour garantir justifyContent: 'center'
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
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.purple }]} />

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <CreamPatternSvg width={width} height={height} opacity={0.05} fill="#ffffff" />
      </View>

      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream, opacity: creamOpacity }]}
        pointerEvents="none"
      />

      <Animated.View
        style={[
          fullCenter,
          {
            opacity: iconOpacity,
            transform: [{ scale: iconScale }, { translateY: iconTranslateY }],
          },
        ]}
        pointerEvents="none"
      >
        <LogoIcon />
      </Animated.View>

      <Animated.View
        style={[
          fullCenter,
          {
            opacity: textOpacity,
            transform: [{ scale: textScale }, { translateY: textTranslateY }],
          },
        ]}
        pointerEvents="none"
      >
        <LogoText />
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
