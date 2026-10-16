import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { TransitionTitle } from '@/components/game/TransitionTitle';
import type { GameTeam } from '@/game/engine';
import { useOverlayTimeline } from '@/hooks/useOverlayTimeline';
import { useLang } from '@/lib/LangContext';
import { playSound } from '@/lib/sounds';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

// Figma « transitions end » (453:6153) :
// - missedBid : bleu des écrans de jeu → gris
// - madeBid : bleu, rebond du badge + confettis
// - eliminated (survie, PASSER / temps écoulé) : même rendu que missedBid
// Timings : entrée ease-out 300 ms → délai 1 ms → étape 2 ease-in-out 800 ms → délai 1200 ms → sortie ease-out 300 ms
const ENTER_MS = 300;
const STEP1_HOLD_MS = 1;
const STEP2_MS = 800;
const HOLD_MS = 1200;
const FADE_MS = 300;
const FAILURE_GREY = '#798291';
// Pattern à 4 % sur bleu/gris
const PATTERN_OPACITY = 0.04;
// Figma : titre centré à 98 pt au-dessus du milieu de l'écran
const TITLE_OFFSET = 98;
const BADGE_POP_SCALE = 1.12;
const GENTLE_SPRING = { stiffness: 100, damping: 15, mass: 1 };

export type TurnEndKind = 'madeBid' | 'missedBid' | 'eliminated';

type Props = {
  team: GameTeam;
  kind: TurnEndKind;
  /** madeBid : réponses trouvées ; missedBid : objectif de la mise ; eliminated : points en jeu. */
  count: number;
  onReveal: () => void;
  onDone: () => void;
};

export function TurnEndTransition({ team, kind, count, onReveal, onDone }: Props) {
  const { width, height } = useWindowDimensions();
  const { lang } = useLang();
  const t = getT(lang);
  const success = kind === 'madeBid';

  useEffect(() => {
    if (success) playSound('roundWon');
  }, [success]);

  const opacity = useState(() => new Animated.Value(0))[0];
  const step2 = useState(() => new Animated.Value(0))[0];
  const badgeScale = useState(() => new Animated.Value(1))[0];

  const skip = useOverlayTimeline({
    opacity,
    exitMs: FADE_MS,
    exitEasing: Easing.out(Easing.ease),
    onReveal,
    onDone,
    intro: (reduceMotion) => {
      if (reduceMotion) {
        opacity.setValue(1);
        step2.setValue(1);
        return Animated.delay(STEP1_HOLD_MS + STEP2_MS + HOLD_MS);
      }
      const toStep2 = success
        ? Animated.sequence([
            Animated.timing(badgeScale, {
              toValue: BADGE_POP_SCALE,
              duration: 200,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.spring(badgeScale, { toValue: 1, ...GENTLE_SPRING, useNativeDriver: true }),
          ])
        : Animated.timing(step2, {
            toValue: 1,
            duration: STEP2_MS,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          });
      return Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: ENTER_MS, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.delay(STEP1_HOLD_MS),
        toStep2,
        Animated.delay(HOLD_MS),
      ]);
    },
  });

  const subtitle = { madeBid: t.result.madeBid, missedBid: t.result.missedBid, eliminated: t.result.eliminated }[kind];
  const label = { madeBid: t.result.foundCount, missedBid: t.result.toFind, eliminated: t.result.pointsAtStake }[kind];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
      <Pressable
        style={styles.root}
        onPress={skip}
        accessibilityRole="button"
        accessibilityLabel={`${team.name} ${subtitle}. ${label} ${count}`}
      >
        {success ? null : <Animated.View style={[StyleSheet.absoluteFill, styles.grey, { opacity: step2 }]} />}
        {/* Même largeur max que GameLayout */}
        <CreamPatternSvg
          width={Math.min(width, 500)}
          height={height}
          opacity={PATTERN_OPACITY}
          fill="#ffffff"
        />

        <Animated.View style={[styles.title, { transform: [{ scale: badgeScale }] }]}>
          <TransitionTitle team={team} subtitle={subtitle} />
        </Animated.View>

        <View style={styles.countBlock}>
          <Text style={styles.countLabel}>{label}</Text>
          <View style={styles.countBox}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </View>

        {/* Confettis dès la 1re frame : la réussite se comprend immédiatement */}
        {success ? <ConfettiOverlay /> : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TITLE_OFFSET * 2,
    backgroundColor: colors.purple,
    overflow: 'hidden',
  },
  grey: {
    backgroundColor: FAILURE_GREY,
  },
  title: {
    maxWidth: '90%',
  },
  // Figma : bloc collé à 54 pt du bas
  countBlock: {
    position: 'absolute',
    bottom: 54,
    alignItems: 'center',
    gap: 24,
  },
  countLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  countBox: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    height: 85,
    minWidth: 85,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: fonts.displayMedium,
    fontSize: 48,
    color: colors.purpleDeep,
  },
});
