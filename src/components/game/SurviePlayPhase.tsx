import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSubject } from '@/game/answers';
import { survieCurrentQuestion, type SurvieState } from '@/game/survie-engine';
import { useCountdown } from '@/hooks/useCountdown';
import { useHapticWarning } from '@/hooks/useHapticWarning';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

/**
 * Barre de temps animée en continu (fil natif) : avec un tour court, les mises à jour du chrono
 * toutes les 100 ms faisaient avancer la barre par à-coups visibles.
 */
function useSmoothElapsed(remainingMs: number, totalMs: number, running: boolean) {
  const elapsed = useState(() => new Animated.Value(totalMs ? 1 - remainingMs / totalMs : 0))[0];
  // Valeur lue au moment du démarrage ou de la reprise, sans relancer l'animation à chaque tick
  const remainingRef = useRef(remainingMs);
  useEffect(() => {
    remainingRef.current = remainingMs;
  });
  useEffect(() => {
    if (!running || !totalMs) return;
    const remaining = remainingRef.current;
    elapsed.setValue(1 - remaining / totalMs);
    const anim = Animated.timing(elapsed, {
      toValue: 1,
      duration: remaining,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [running, totalMs, elapsed]);
  return elapsed;
}
const WARNING_SECONDS = 3;

const PAUSE_PATH =
  'M5.14286 0C5.59751 0 6.03355 0.180612 6.35504 0.502103C6.67653 0.823594 6.85714 1.25963 6.85714 1.71429V22.2857C6.85714 22.7404 6.67653 23.1764 6.35504 23.4979C6.03355 23.8194 5.59751 24 5.14286 24H1.71429C1.25963 24 0.823594 23.8194 0.502103 23.4979C0.180612 23.1764 0 22.7404 0 22.2857V1.71429C0 1.25963 0.180612 0.823594 0.502103 0.502103C0.823594 0.180612 1.25963 0 1.71429 0H5.14286ZM18.8571 0C19.3118 0 19.7478 0.180612 20.0693 0.502103C20.3908 0.823594 20.5714 1.25963 20.5714 1.71429V22.2857C20.5714 22.7404 20.3908 23.1764 20.0693 23.4979C19.7478 23.8194 19.3118 24 18.8571 24H15.4286C14.9739 24 14.5379 23.8194 14.2164 23.4979C13.8949 23.1764 13.7143 22.7404 13.7143 22.2857V1.71429C13.7143 1.25963 13.8949 0.823594 14.2164 0.502103C14.5379 0.180612 14.9739 0 15.4286 0H18.8571Z';

const PLAY_PATH =
  'M23.9911 1.28571C23.9911 0.944722 23.8557 0.617695 23.6145 0.376577C23.3734 0.135459 23.0464 0 22.7054 0C22.3644 0 22.0374 0.135459 21.7963 0.376577C21.5551 0.617695 21.4197 0.944722 21.4197 1.28571V18.4286C21.4197 18.7696 21.5551 19.0966 21.7963 19.3377C22.0374 19.5788 22.3644 19.7143 22.7054 19.7143C23.0464 19.7143 23.3734 19.5788 23.6145 19.3377C23.8557 19.0966 23.9911 18.7696 23.9911 18.4286V1.28571ZM16.6265 8.04857C17.8094 8.964 17.8094 10.7503 16.6265 11.6657C12.9614 14.5019 8.86859 16.7372 4.5014 18.288L3.70254 18.5726C2.21112 19.1006 0.633973 18.0926 0.433402 16.5531C-0.144467 12.1078 -0.144467 7.60644 0.433402 3.16114C0.635688 1.62171 2.21112 0.613714 3.70254 1.14343L4.5014 1.42629C8.86859 2.97704 12.9614 5.21238 16.6265 8.04857Z';

type Props = {
  state: SurvieState;
  onValidate: () => void;
  onPass: () => void;
  onTimeout: () => void;
  /** Secondes par tour ; null = sans chrono (barre et pause masquées). */
  turnSeconds: number | null;
  isPaused?: boolean;
  onTogglePause: () => void;
};

export function SurviePlayPhase({
  state,
  onValidate,
  onPass,
  onTimeout,
  turnSeconds,
  isPaused = false,
  onTogglePause,
}: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const t = getT(lang);
  const remainingMs = useCountdown(turnSeconds !== null, isPaused, turnSeconds ?? 0, onTimeout);
  useHapticWarning(remainingMs, 5);
  const question = survieCurrentQuestion(state);
  const currentTeam = state.teams[state.currentTeam];

  const seconds = Math.ceil(remainingMs / 1000);
  const elapsed = useSmoothElapsed(remainingMs, (turnSeconds ?? 0) * 1000, turnSeconds !== null && !isPaused);
  const [trackWidth, setTrackWidth] = useState(0);
  // La barre pleine glisse depuis la gauche : translateX reste animable sur le fil natif, pas width
  const fillTranslateX = elapsed.interpolate({ inputRange: [0, 1], outputRange: [-trackWidth, 0], extrapolate: 'clamp' });
  const isWarning = seconds <= WARNING_SECONDS;
  const fillColor = isWarning ? colors.pink : '#fb940e';

  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();
  const badgeTextColor = BADGE_TEXT_COLOR[currentTeam.color] ?? colors.purpleDeep;

  return (
    <View style={styles.wrapper}>
      {/* Timer row — absente quand le chrono est désactivé dans les paramètres */}
      {turnSeconds !== null ? (
      <View style={styles.timerRow}>
        <View
          style={[styles.track, isPaused && styles.trackPaused]}
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View
            style={[styles.fill, { width: trackWidth, backgroundColor: fillColor, transform: [{ translateX: fillTranslateX }] }]}
          />
        </View>
        <Text style={[styles.seconds, isWarning && styles.secondsWarning]}>{seconds}</Text>
        <Pressable
          onPress={onTogglePause}
          accessibilityRole="button"
          accessibilityLabel={isPaused ? t.play.resume : t.play.pause}
          style={styles.pauseBtn}
        >
          <View pointerEvents="none">
            {isPaused ? (
              <Svg width={24} height={20} viewBox="0 0 24 20">
                <Path d={PLAY_PATH} fill={colors.cream} />
              </Svg>
            ) : (
              <Svg width={21} height={24} viewBox="0 0 21 24">
                <Path d={PAUSE_PATH} fill={colors.cream} />
              </Svg>
            )}
          </View>
        </Pressable>
      </View>
      ) : null}

      {/* Badge équipe + question */}
      <View style={{ gap: 20 }}>
        <View style={styles.badgeRow}>
          <View style={[styles.teamBadge, { backgroundColor: currentTeam.color }]}>
            <Text style={[styles.teamBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
              {currentTeam.name}
            </Text>
          </View>
        </View>
        <Text style={styles.questionText}>{subject}</Text>
      </View>

      {/* Boutons — centrés dans l'espace restant */}
      <View style={styles.buttons}>
        <Pressable
          onPress={onValidate}
          sound="bid"
          accessibilityRole="button"
          accessibilityLabel={t.survie.validateA11y}
          style={styles.validerWrap}
        >
          {({ pressed }) => (
            <LinearGradient
              colors={['#fb940e', '#f2c512']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.validerInner, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.btnContent}>
                <MaterialCommunityIcons name="check-bold" size={24} color={colors.cream} />
                <Text style={styles.validerText}>{t.survie.validate}</Text>
              </View>
            </LinearGradient>
          )}
        </Pressable>

        <Pressable
          onPress={onPass}
          accessibilityRole="button"
          accessibilityLabel={t.survie.passA11y}
          style={({ pressed }) => [styles.passerWrap, pressed && { opacity: 0.8 }]}
        >
          <View style={styles.passerInner}>
            <View style={styles.btnContent}>
              <MaterialCommunityIcons name="skull" size={24} color={colors.purpleDeep} />
              <Text style={styles.passerText}>{t.survie.noAnswer}</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* Pactole en bas, comme le compteur du mode enchères */}
      <View style={[styles.jackpotFooter, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
        <View style={styles.jackpotCard}>
          <Text style={styles.jackpotValue}>{state.jackpot}</Text>
        </View>
        {/* Libellé sous le chiffre : sans les deux-points de « Points en jeu : » */}
        <Text style={styles.jackpotLabel}>{t.result.pointsAtStake.replace(/\s*:\s*$/, '')}</Text>
      </View>
    </View>
  );
}

const BTN_RADIUS = 16;
const BTN_SHADOW = {
  shadowOffset: { width: -1, height: 2 },
  shadowOpacity: 1 as const,
  shadowRadius: 0,
  elevation: 3,
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 4,
    paddingHorizontal: 24,
    gap: 20,
  },

  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  track: {
    flex: 1,
    height: 16,
    borderRadius: 60,
    backgroundColor: '#fef1cc',
    overflow: 'hidden',
  },
  trackPaused: {
    opacity: 0.45,
  },
  fill: {
    height: '100%',
    borderRadius: 60,
  },
  seconds: {
    fontFamily: fonts.displayMedium,
    fontSize: 24,
    color: colors.cream,
    minWidth: 36,
    textAlign: 'right',
  },
  secondsWarning: {
    color: colors.pink,
  },
  pauseBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.purpleDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '70%',
  },
  teamBadgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  questionText: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 31,
    color: colors.cream,
  },

  buttons: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  // Mêmes proportions que CounterFooter (mode enchères)
  jackpotFooter: {
    alignItems: 'center',
    gap: 16,
  },
  jackpotCard: {
    minWidth: 64,
    height: 64,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jackpotValue: {
    fontFamily: fonts.displayMedium,
    fontSize: 40,
    color: colors.purpleDeep,
  },
  jackpotLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  validerWrap: {
    width: '100%',
    borderRadius: BTN_RADIUS,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
    ...BTN_SHADOW,
  },
  validerInner: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  validerText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
  },
  passerWrap: {
    width: '100%',
    borderRadius: BTN_RADIUS,
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    shadowColor: colors.purpleDeep,
    ...BTN_SHADOW,
  },
  passerInner: {
    backgroundColor: '#fffbf5',
    borderRadius: BTN_RADIUS - 2,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  passerText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.purpleDeep,
  },
});
