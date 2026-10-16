import { useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { TransitionTitle } from '@/components/game/TransitionTitle';
import type { GameTeam } from '@/game/engine';
import { useOverlayTimeline } from '@/hooks/useOverlayTimeline';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';

// Figma « transitions » (430:3655) : entrée ease-in-out 300 ms → délai 1200 ms → sortie ease-out 300 ms
const ENTER_MS = 300;
const HOLD_MS = 1200;
const FADE_MS = 300;
// Pattern à 1 % sur fond navy
const PATTERN_OPACITY = 0.01;
// Figma : titre centré à 98 pt au-dessus du milieu de l'écran
const TITLE_OFFSET = 98;

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

type Props = {
  /** Équipe qui répond. */
  team: GameTeam;
  /** Équipe qui tient l'appareil — absente en mode survie. */
  holder?: GameTeam;
  /** Survie : « à vous de commencer » au lieu de « à vous de jouer ! ». */
  isSurvie?: boolean;
  onReveal: () => void;
  onDone: () => void;
};

export function PlayIntroTransition({ team, holder, isSurvie = false, onReveal, onDone }: Props) {
  const { width, height } = useWindowDimensions();
  const { lang } = useLang();
  const t = getT(lang);
  const opacity = useState(() => new Animated.Value(0))[0];

  const skip = useOverlayTimeline({
    opacity,
    exitMs: FADE_MS,
    exitEasing: Easing.out(Easing.ease),
    onReveal,
    onDone,
    intro: (reduceMotion) => {
      if (reduceMotion) {
        opacity.setValue(1);
        return Animated.delay(HOLD_MS);
      }
      return Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ENTER_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(HOLD_MS),
      ]);
    },
  });

  const subtitle = isSurvie ? t.ready.yourStart : t.ready.yourTurn;
  const holderTextColor = holder ? (BADGE_TEXT_COLOR[holder.color] ?? colors.purpleDeep) : undefined;
  const holderLabel = holder ? ` ${holder.name} ${t.ready.holdsPhone}` : '';

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
      <Pressable
        style={styles.root}
        onPress={skip}
        accessibilityRole="button"
        accessibilityLabel={`${team.name} ${subtitle}${holderLabel}`}
      >
        {/* Même largeur max que GameLayout */}
        <CreamPatternSvg width={Math.min(width, 500)} height={height} opacity={PATTERN_OPACITY} fill="#ffffff" />

        <View style={styles.title}>
          <TransitionTitle team={team} subtitle={subtitle} />
        </View>

        {holder ? (
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
    paddingBottom: TITLE_OFFSET * 2,
    backgroundColor: colors.purpleDeep,
    overflow: 'hidden',
  },
  title: {
    maxWidth: '90%',
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
