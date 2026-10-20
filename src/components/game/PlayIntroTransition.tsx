import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { TransitionTitle } from '@/components/game/TransitionTitle';
import type { GameTeam } from '@/game/engine';
import { useOverlayTimeline } from '@/hooks/useOverlayTimeline';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

// Figma « transitions » (430:3655) : entrée ease-in-out 300 ms → délai 1200 ms → sortie ease-out 300 ms
// classic : délai allongé, le temps de lire l'équipe qui joue et celle qui tient le téléphone (tap pour passer)
// survieNext (après VALIDER) : version rapide pour ne pas casser le rythme de la chaîne
const TIMINGS = {
  classic: { enter: 300, hold: 2200, fade: 300 },
  survieStart: { enter: 300, hold: 1200, fade: 300 },
  survieNext: { enter: 200, hold: 600, fade: 200 },
} as const;
// Fond bleu des écrans de jeu, pattern à 4 %
const PATTERN_OPACITY = 0.04;
// Compte à rebours 3-2-1 après l'annonce de l'équipe, pour ne pas lancer le chrono par surprise
const COUNTDOWN_FROM = 3;
const COUNTDOWN_STEP_MS = 1000;
const WITH_COUNTDOWN: Record<keyof typeof TIMINGS, boolean> = { classic: true, survieStart: true, survieNext: false };
// Figma (classic) : titre centré à 98 pt au-dessus du milieu, pour laisser la place au bloc du bas.
// Survie (pas de bloc du bas) : titre centré verticalement.
const TITLE_OFFSET = 98;

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

type Props = {
  /** Équipe qui répond. */
  team: GameTeam;
  /** Équipe qui tient l'appareil — absente en mode survie. */
  holder?: GameTeam;
  /** classic : « à vous de jouer ! » ; survieStart : « à vous de commencer » ; survieNext : « à vous de répondre ! » (rapide). */
  variant?: keyof typeof TIMINGS;
  onReveal: () => void;
  onDone: () => void;
};

export function PlayIntroTransition({ team, holder, variant = 'classic', onReveal, onDone }: Props) {
  const { width, height } = useWindowDimensions();
  const { lang } = useLang();
  const t = getT(lang);
  const opacity = useState(() => new Animated.Value(0))[0];
  const timing = TIMINGS[variant];
  const countdown = useState(() => new Animated.Value(COUNTDOWN_FROM))[0];
  // null tant que l'annonce de l'équipe est affichée
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const id = countdown.addListener(({ value }) => setCount(Math.max(1, Math.ceil(value))));
    return () => countdown.removeListener(id);
  }, [countdown]);
  const skip = useOverlayTimeline({
    opacity,
    exitMs: timing.fade,
    exitEasing: Easing.out(Easing.ease),
    onReveal,
    onDone,
    intro: (reduceMotion) => {
      if (reduceMotion) {
        opacity.setValue(1);
        return Animated.delay(timing.hold);
      }
      return Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: timing.enter,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(timing.hold),
      ]);
    },
    // Un tap passe l'annonce de l'équipe, jamais le compte à rebours
    outro: WITH_COUNTDOWN[variant]
      ? () =>
          Animated.timing(countdown, {
            toValue: 0,
            duration: COUNTDOWN_FROM * COUNTDOWN_STEP_MS,
            easing: Easing.linear,
            useNativeDriver: false,
          })
      : undefined,
  });

  const subtitle = { classic: t.ready.yourTurn, survieStart: t.ready.yourStart, survieNext: t.ready.yourGo }[variant];
  const holderTextColor = holder ? (BADGE_TEXT_COLOR[holder.color] ?? colors.purpleDeep) : undefined;
  const holderLabel = holder ? ` ${holder.name} ${t.ready.holdsPhone}` : '';

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
      <Pressable
        style={[styles.root, variant === 'classic' && count === null && styles.rootRaised]}
        onPress={skip}
        accessibilityRole="button"
        accessibilityLabel={`${team.name} ${subtitle}${holderLabel}`}
      >
        {/* Même largeur max que GameLayout */}
        <CreamPatternSvg width={Math.min(width, 500)} height={height} opacity={PATTERN_OPACITY} fill="#ffffff" />

        {count !== null ? (
          <Text style={styles.countdown} accessibilityLiveRegion="polite">
            {count}
          </Text>
        ) : (
          <View style={styles.title}>
            <TransitionTitle team={team} subtitle={subtitle} />
          </View>
        )}

        {holder && count === null ? (
          <View style={styles.holderRow}>
            <View style={[styles.holderBadge, { backgroundColor: holder.color }]}>
              <Text style={[styles.holderName, { color: holderTextColor }]} numberOfLines={1}>
                {holder.name}
              </Text>
            </View>
            <Text style={styles.holderText}>{t.ready.holdsPhone}</Text>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
    overflow: 'hidden',
  },
  rootRaised: {
    paddingBottom: TITLE_OFFSET * 2,
  },
  title: {
    maxWidth: '90%',
  },
  countdown: {
    fontFamily: fonts.display,
    fontSize: 160,
    color: colors.white,
  },
  // Figma : bottom 54 + padding 24
  holderRow: {
    position: 'absolute',
    bottom: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    maxWidth: '90%',
  },
  holderBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexShrink: 1,
  },
  holderName: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
  },
  holderText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.white,
  },
});
