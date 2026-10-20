import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { MASCOTTE_REMPORTE_XML } from '@/components/game/mascotteRemporteXml';
import { TransitionTitle } from '@/components/game/TransitionTitle';
import type { GameTeam } from '@/game/engine';
import { useOverlayTimeline } from '@/hooks/useOverlayTimeline';
import { playHaptic } from '@/lib/haptics';
import { useLang } from '@/lib/LangContext';
import { playSound } from '@/lib/sounds';
import { getT } from '@/lib/i18n';
import { colors } from '@/theme';
import { Pressable } from '@/components/Pressable';

// Figma « transition-1 » : étape 1 (fond bleu, badge) → étape 2 (fond navy, badge descend, mascotte monte)
// Timings Figma : entrée ease-out 300 ms → délai 1 ms → spring « Gentle » 800 ms → délai 800 ms → sortie ease-in-out 300 ms
const ENTER_MS = 300;
const STEP1_HOLD_MS = 1;
const STEP2_HOLD_MS = 800;
const FADE_MS = 300;
// Preset Figma « Gentle » (mass 1, stiffness 100, damping 15) ; seuil de repos réglé pour s'arrêter vers 800 ms
const GENTLE_SPRING = { stiffness: 100, damping: 15, mass: 1, restDisplacementThreshold: 0.0025, restSpeedThreshold: 0.02 };
const BADGE_SHIFT = 48;
// Distance du titre sous la safe area
const TITLE_TOP = 70;
// Pattern : 4 % sur fond bleu, 1 % sur fond navy (0.04 × 0.25)
const PATTERN_OPACITY = 0.04;
const PATTERN_NAVY_RATIO = 0.25;

type Props = {
  team: GameTeam;
  onReveal: () => void;
  onDone: () => void;
};

export function AuctionWonTransition({ team, onReveal, onDone }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const t = getT(lang);

  const opacity = useState(() => new Animated.Value(0))[0];
  const badgeIn = useState(() => new Animated.Value(0))[0];
  const step2 = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    playSound('roundWon');
    playHaptic('heavy');
  }, []);

  const skip = useOverlayTimeline({
    opacity,
    exitMs: FADE_MS,
    exitEasing: Easing.inOut(Easing.ease),
    onReveal,
    onDone,
    intro: (reduceMotion) => {
      if (reduceMotion) {
        opacity.setValue(1);
        badgeIn.setValue(1);
        step2.setValue(1);
        return Animated.delay(STEP1_HOLD_MS + STEP2_HOLD_MS);
      }
      const enter = { toValue: 1, duration: ENTER_MS, easing: Easing.out(Easing.ease), useNativeDriver: true };
      return Animated.sequence([
        Animated.parallel([Animated.timing(opacity, enter), Animated.timing(badgeIn, enter)]),
        Animated.delay(STEP1_HOLD_MS),
        Animated.spring(step2, { toValue: 1, ...GENTLE_SPRING, useNativeDriver: true }),
        Animated.delay(STEP2_HOLD_MS),
      ]);
    },
  });

  const badgeScale = badgeIn.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const badgeY = step2.interpolate({ inputRange: [0, 1], outputRange: [0, BADGE_SHIFT] });
  const mascotY = step2.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });
  const patternOpacity = step2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, PATTERN_NAVY_RATIO],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
      <Pressable
        style={[styles.root, { paddingTop: insets.top + TITLE_TOP }]}
        onPress={skip}
        accessibilityRole="button"
        accessibilityLabel={`${team.name} ${t.ready.wonAuction}`}
      >
        <Animated.View style={[StyleSheet.absoluteFill, styles.navy, { opacity: step2 }]} />
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: patternOpacity }]}>
          {/* Même largeur max que GameLayout */}
          <CreamPatternSvg width={Math.min(width, 500)} height={height} opacity={PATTERN_OPACITY} fill="#ffffff" />
        </Animated.View>

        <Animated.View
          style={[styles.title, { opacity: badgeIn, transform: [{ translateY: badgeY }, { scale: badgeScale }] }]}
        >
          <TransitionTitle team={team} subtitle={t.ready.wonAuction} />
        </Animated.View>

        <Animated.View style={[styles.mascot, { transform: [{ translateY: mascotY }] }]} pointerEvents="none">
          <SvgXml xml={MASCOTTE_REMPORTE_XML} width="100%" height="100%" />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.purple,
    overflow: 'hidden',
  },
  navy: {
    backgroundColor: colors.purpleDeep,
  },
  title: {
    maxWidth: '90%',
  },
  // Figma : 552 px pour un écran de 393 (140 %), légèrement réduit à 125 % → déborde de 12,5 % de chaque côté
  mascot: {
    position: 'absolute',
    bottom: 0,
    left: '-12.5%',
    width: '125%',
    aspectRatio: 554 / 439,
  },
});
