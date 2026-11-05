import { useState } from 'react';

import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Animated, Easing, Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { PACK_INTROS, type PackIntro } from '@/config/packIntros';
import { useOverlayTimeline } from '@/hooks/useOverlayTimeline';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { coverFrame, focusOffset } from '@/lib/packIntro';

const SLIDE_MS = 1100;
const HOLD_MS = 700;
const REDUCED_MOTION_MS = 900;
// L'écran suivant arrive en fondu : le fondu de la pile de navigation fait la sortie
const EXIT_MS = 1;

/** Déroulé de la transition, lancé une fois l'image affichée ; un appui n'importe où la passe. */
function IntroTimeline({ camera, title }: { camera: Animated.Value; title: string }) {
  const [opacity] = useState(() => new Animated.Value(1));
  const skip = useOverlayTimeline({
    opacity,
    intro: (reduceMotion) => {
      if (reduceMotion) {
        camera.setValue(1);
        return Animated.delay(REDUCED_MOTION_MS);
      }
      return Animated.sequence([
        Animated.timing(camera, {
          toValue: 1,
          duration: SLIDE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.delay(HOLD_MS),
      ]);
    },
    exitMs: EXIT_MS,
    exitEasing: Easing.linear,
    onReveal: () => router.replace('/equipes'),
    onDone: () => {},
  });
  return <Pressable style={StyleSheet.absoluteFill} onPress={skip} accessibilityRole="button" accessibilityLabel={title} />;
}

function PackIntroScene({ intro, title }: { intro: PackIntro; title: string }) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const source = Image.resolveAssetSource(intro.image);
  const aspect = source?.width && source.height ? source.width / source.height : 1;
  const { width, height } = coverFrame(aspect, screenWidth, screenHeight);
  const fromX = focusOffset(width, screenWidth, intro.from);
  const toX = focusOffset(width, screenWidth, intro.to);

  const [camera] = useState(() => new Animated.Value(0));
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <Animated.View
        style={{
          width,
          height,
          top: (screenHeight - height) / 2,
          transform: [{ translateX: camera.interpolate({ inputRange: [0, 1], outputRange: [fromX, toX] }) }],
        }}
      >
        <Image
          source={intro.image}
          style={StyleSheet.absoluteFill}
          fadeDuration={0}
          onLoad={() => setLoaded(true)}
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
      {loaded ? <IntroTimeline camera={camera} title={title} /> : null}
    </View>
  );
}

/** Transition d'ambiance : l'illustration du pack choisi, plein écran, avant la création des équipes. */
export default function PackIntroScreen() {
  const { theme } = useLocalSearchParams<{ theme: string }>();
  const { lang } = useLang();
  const intro = PACK_INTROS[theme];
  if (!intro) return <Redirect href="/equipes" />;
  return <PackIntroScene intro={intro} title={getT(lang).shop.packTitles[theme] ?? theme} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
});
