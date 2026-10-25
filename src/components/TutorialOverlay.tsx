import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path, SvgXml } from 'react-native-svg';

import { MASCOT_NORMAL_XML } from '@/components/mascotIdleXml';
import { Pressable } from '@/components/Pressable';
import { GIFT_PACKS, PACK_THEME_IDS, WELCOME_GAMES } from '@/config/shop';
import { getT, type Lang } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { TUTORIAL_STEPS, useTutorial } from '@/state/tutorial';
import { colors, fonts } from '@/theme';

type Rect = { x: number; y: number; width: number; height: number };

// Marge autour de l'élément éclairé et arrondi du « trou »
const HOLE_PAD = 8;
const HOLE_RADIUS = 18;
// Attente avant de mesurer : le temps que le fondu de navigation se termine
const NAV_SETTLE_MS = 450;
const RETRY_MS = 150;
const MAX_RETRIES = 8;
// Assez grande pour se détacher du logo Banco en arrière-plan
const MASCOT_W = 104;
const MASCOT_H = (MASCOT_W * 249) / 300;
// Mascotte blanche, posée au-dessus de la bulle : elle ressort sur le fond assombri
const MASCOT_WHITE_XML = MASCOT_NORMAL_XML.replace(/#266DE4/gi, '#ffffff');

function stepText(step: number, lang: Lang): string {
  const t = getT(lang);
  const pack = (index: number) => t.shop.packTitles[PACK_THEME_IDS[GIFT_PACKS[index]] ?? ''] ?? '';
  return [
    t.tutorial.welcome,
    t.tutorial.shop,
    t.tutorial.giftFirst(pack(0), WELCOME_GAMES),
    t.tutorial.giftNext(pack(1), WELCOME_GAMES),
    t.tutorial.play,
    t.tutorial.auction,
    t.tutorial.survie,
    t.tutorial.teams,
  ][step];
}

/** Rectangle rond évidé : tout l'écran assombri sauf l'élément expliqué. */
function holePath(w: number, h: number, r: Rect | null): string {
  const outer = `M0 0H${w}V${h}H0Z`;
  if (!r) return outer;
  const x = r.x - HOLE_PAD;
  const y = r.y - HOLE_PAD;
  const rw = r.width + HOLE_PAD * 2;
  const rh = r.height + HOLE_PAD * 2;
  const k = Math.min(HOLE_RADIUS, rw / 2, rh / 2);
  return `${outer}M${x + k} ${y}H${x + rw - k}Q${x + rw} ${y} ${x + rw} ${y + k}V${y + rh - k}Q${x + rw} ${y + rh} ${x + rw - k} ${y + rh}H${x + k}Q${x} ${y + rh} ${x} ${y + rh - k}V${y + k}Q${x} ${y} ${x + k} ${y}Z`;
}

/** Didacticiel du premier lancement, par-dessus toute l'app : la mascotte explique chaque élément éclairé. */
export function TutorialOverlay() {
  const { step, next, skip, getTarget } = useTutorial();
  const { lang } = useLang();
  const t = getT(lang);
  const { width, height } = useWindowDimensions();
  const [rect, setRect] = useState<Rect | null>(null);
  const [shownStep, setShownStep] = useState<number | null>(null);
  const fade = useState(() => new Animated.Value(0))[0];
  const pulse = useState(() => new Animated.Value(0))[0];
  // Arrivée de la mascotte à chaque étape, par la gauche ou la droite
  const enter = useState(() => new Animated.Value(1))[0];
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false));
  }, []);

  // À chaque étape : fondu de sortie, mesure de l'élément (après la navigation), fondu d'entrée
  useEffect(() => {
    if (step === null) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let tries = 0;
    const { target, route } = TUTORIAL_STEPS[step];
    const navigated = step > 0 && TUTORIAL_STEPS[step - 1].route !== route;

    const reveal = (measured: Rect | null) => {
      if (cancelled) return;
      setRect(measured);
      setShownStep(step);
      enter.setValue(0);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(enter, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
      ]).start();
    };
    const measure = () => {
      const node = target ? getTarget(target) : null;
      // Écran pas encore monté : on réessaie, puis on affiche la bulle seule (élément absent, ex. pack déjà gagné)
      if (target && !node && tries++ < MAX_RETRIES) {
        timer = setTimeout(measure, RETRY_MS);
        return;
      }
      if (!node) {
        reveal(null);
        return;
      }
      node.measureInWindow((x, y, w, h) => reveal(w > 0 && h > 0 ? { x, y, width: w, height: h } : null));
    };

    Animated.timing(fade, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
      if (!cancelled) timer = setTimeout(measure, navigated ? NAV_SETTLE_MS : 0);
    });
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [step, fade, enter, getTarget]);

  // Halo qui « respire » autour de l'élément éclairé
  useEffect(() => {
    if (reduceMotion || step === null) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, step, pulse]);

  if (step === null) return null;

  const isLast = step === TUTORIAL_STEPS.length - 1;
  // Bulle sous l'élément s'il est en haut de l'écran, au-dessus sinon ; centrée sans élément
  const below = rect !== null && rect.y + rect.height / 2 < height / 2;
  const bubblePosition = rect
    ? below
      ? { top: rect.y + rect.height + HOLE_PAD + 16 + MASCOT_H + 6 }
      : { bottom: height - rect.y + HOLE_PAD + 16 }
    : { top: height * 0.34 };
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0.4] });
  // Une étape sur deux à droite : la mascotte arrive de son côté en glissant, puis se balance doucement
  const fromRight = (shownStep ?? 0) % 2 === 1;
  const side = fromRight ? 1 : -1;
  const mascotMotion = reduceMotion
    ? []
    : [
        { translateX: enter.interpolate({ inputRange: [0, 1], outputRange: [side * 90, 0] }) },
        { translateY: pulse.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
        { rotate: pulse.interpolate({ inputRange: [0, 1], outputRange: [`${-side * 4}deg`, `${side * 4}deg`] }) },
      ];

  return (
    <View
      style={StyleSheet.absoluteFill}
      // Bloque l'app derrière : on avance avec « Suivant », on sort avec « Passer »
      onStartShouldSetResponder={() => true}
      accessibilityViewIsModal
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]}>
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Path d={holePath(width, height, rect)} fill="rgba(6, 12, 34, 0.84)" fillRule="evenodd" />
        </Svg>

        {rect ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ring,
              {
                left: rect.x - HOLE_PAD,
                top: rect.y - HOLE_PAD,
                width: rect.width + HOLE_PAD * 2,
                height: rect.height + HOLE_PAD * 2,
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
        ) : null}

        {shownStep !== null ? (
          <View style={[styles.bubbleWrap, bubblePosition]}>
            <Animated.View
              style={[styles.mascot, fromRight ? styles.mascotRight : styles.mascotLeft, { opacity: enter, transform: mascotMotion }]}
              pointerEvents="none"
            >
              <SvgXml xml={MASCOT_WHITE_XML} width={MASCOT_W} height={MASCOT_H} />
            </Animated.View>
            <View style={styles.bubble}>
              <Text style={styles.text} accessibilityLiveRegion="polite">
                {stepText(shownStep, lang)}
              </Text>
              <View style={styles.actions}>
                {isLast ? (
                  <View />
                ) : (
                  <Pressable onPress={skip} accessibilityRole="button" accessibilityLabel={t.tutorial.skip} hitSlop={10}>
                    <Text style={styles.skip}>{t.tutorial.skip}</Text>
                  </Pressable>
                )}
                <Text style={styles.counter}>{`${shownStep + 1}/${TUTORIAL_STEPS.length}`}</Text>
                <Pressable onPress={next} accessibilityRole="button" accessibilityLabel={isLast ? t.tutorial.done : t.tutorial.next}>
                  <LinearGradient colors={['#fb940e', '#f2c512']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nextBtn}>
                    <Text style={styles.nextText}>{isLast ? t.tutorial.done : t.tutorial.next}</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderRadius: HOLE_RADIUS,
    borderWidth: 3,
    borderColor: '#f2c512',
  },
  bubbleWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  // Au-dessus de la bulle, hors du cadre blanc
  mascot: {
    position: 'absolute',
    top: -MASCOT_H - 6,
    zIndex: 1,
  },
  mascotLeft: {
    left: 20,
  },
  mascotRight: {
    right: 20,
  },
  bubble: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#fffbf5',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 14,
  },
  text: {
    fontFamily: fonts.displayMedium,
    fontSize: 17,
    lineHeight: 24,
    color: colors.purpleDeep,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skip: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.purpleDeep,
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
  counter: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.purpleDeep,
    opacity: 0.5,
  },
  nextBtn: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#a15c03',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  nextText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.cream,
  },
});
