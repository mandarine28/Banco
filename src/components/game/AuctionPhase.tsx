import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSubject } from '@/game/answers';
import { canPass, currentQuestion, type GameState, MAX_BID, minimumBid, passConcludesAuction } from '@/game/engine';
import { playHaptic } from '@/lib/haptics';
import { useLang } from '@/lib/LangContext';
import { playSound } from '@/lib/sounds';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

// Pulse du carré de mise après une surenchère : gonfle vite (+18 %), la nouvelle mise s'affiche au sommet, puis revient
const PULSE_SCALE = 0.18;
const PULSE_UP_MS = 70;
const PULSE_DOWN_MS = 160;

const BADGE_TEXT_COLOR: Record<string, string> = {
  '#EF1ACC': '#FEF1CC',
};

type Props = {
  state: GameState;
  onBid: (amount: number) => void;
  onPass: () => void;
  /** L'équipe précédente vient de miser (pas de passer) : pulse de la nouvelle mise à l'arrivée. */
  justRaised?: boolean;
};

export function AuctionPhase({ state, onBid, onPass, justRaised = false }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const t = getT(lang);
  const { auction } = state;
  const bidder = state.teams[auction.current];
  const min = minimumBid(state);
  const [bidText, setBidText] = useState(String(justRaised && auction.highest ? auction.highest.amount : min));
  const parsed = parseInt(bidText, 10);
  const amount = isNaN(parsed) ? min : Math.max(Math.min(parsed, MAX_BID), min);
  const passAllowed = canPass(state);
  const passLabel = passConcludesAuction(state) ? t.auction.concludeAuction : t.auction.passTurn;
  const rawSubject = getSubject(currentQuestion(state), lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();

  // Ref synchronisé à chaque render pour les callbacks d'interval
  const currentAmountRef = useRef(amount);
  currentAmountRef.current = amount;

  const pulse = useState(() => new Animated.Value(0))[0];

  // Surenchère : on arrive sur la mise qui vient d'être faite, le carré gonfle et passe à la mise à battre.
  // Une seule fois à l'arrivée : les + / − ensuite ne déclenchent rien.
  const popOnRaise = useEffectEvent(() => {
    if (!justRaised || !auction.highest) return;
    const showMin = () => setBidText(String(min));
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduceMotion) => {
        if (reduceMotion) return showMin();
        Animated.timing(pulse, { toValue: 1, duration: PULSE_UP_MS, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() => {
          showMin();
          Animated.timing(pulse, { toValue: 0, duration: PULSE_DOWN_MS, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
        });
      });
  });
  useEffect(() => {
    popOnRaise();
  }, []);

  const decTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const incTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Toast
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(8)).current;
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerToast = () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTranslateY.setValue(8);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
    toastTimeout.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(toastTranslateY, { toValue: 8, duration: 250, useNativeDriver: true }),
      ]).start();
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (decTimeoutRef.current) clearTimeout(decTimeoutRef.current);
      if (decIntervalRef.current) clearInterval(decIntervalRef.current);
      if (incTimeoutRef.current) clearTimeout(incTimeoutRef.current);
      if (incIntervalRef.current) clearInterval(incIntervalRef.current);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    playSound('upDown');
    setBidText((prev) => {
      const n = parseInt(prev, 10);
      const cur = isNaN(n) ? min : Math.max(Math.min(n, MAX_BID), min);
      return String(Math.max(min, Math.min(MAX_BID, cur + dir)));
    });
  };

  const stopHold = (dir: 1 | -1) => {
    const timeoutRef = dir === -1 ? decTimeoutRef : incTimeoutRef;
    const intervalRef = dir === -1 ? decIntervalRef : incIntervalRef;
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const startHold = (dir: 1 | -1) => {
    stopHold(dir);
    if (dir === 1 && currentAmountRef.current >= MAX_BID) {
      triggerToast();
      return;
    }
    playHaptic('selection');
    step(dir);
    const timeoutRef = dir === -1 ? decTimeoutRef : incTimeoutRef;
    const intervalRef = dir === -1 ? decIntervalRef : incIntervalRef;
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (dir === 1 && currentAmountRef.current >= MAX_BID) {
          triggerToast();
          stopHold(1);
          return;
        }
        step(dir);
      }, 80);
    }, 400);
  };

  const handleBidTextChange = (text: string) => {
    setBidText(text);
    const n = parseInt(text, 10);
    if (!isNaN(n) && n > MAX_BID) triggerToast();
  };

  const normalizeBid = () => setBidText(String(amount));

  return (
    <View style={styles.wrapper}>
      {/* Zone bleue — round + carte question + instruction */}
      <View style={styles.blueZone}>
        <View style={styles.roundPill}>
          <Text style={styles.roundLabel}>{t.ready.round} {state.round + 1}/{state.roundCount}</Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{subject}</Text>
        </View>

        <Text style={styles.instruction}>{t.auction.instruction}</Text>
      </View>

      {/* Panel crème — qui ouvre + stepper + boutons */}
      <View style={[styles.creamPanel, { paddingBottom: Math.max(insets.bottom + 30, 48) }]}>
        {/* Toast flottant au-dessus du panel */}
        <Animated.View
          style={[
            styles.toast,
            { opacity: toastOpacity, transform: [{ translateY: toastTranslateY }] },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.toastText}>{t.auction.max(MAX_BID)}</Text>
        </Animated.View>

        <View style={styles.opensRow}>
          <View style={[styles.teamNameBadge, { backgroundColor: bidder.color }]}>
            <Text
              style={[styles.teamNameText, { color: BADGE_TEXT_COLOR[bidder.color] ?? colors.purpleDeep }]}
              numberOfLines={1}
            >
              {bidder.name}
            </Text>
          </View>
          <Text style={styles.opensText}>
            {auction.highest ? t.auction.raises : t.auction.opens}
          </Text>
        </View>

        <View style={styles.stepperRow}>
          <Pressable
            onPressIn={() => startHold(-1)}
            onPressOut={() => stopHold(-1)}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel="Diminuer la mise"
            style={{ opacity: amount <= min ? 0.3 : 1 }}
          >
            <Text style={styles.stepBtn}>-</Text>
          </Pressable>

          <Animated.View style={[styles.bidBadge, { transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1 + PULSE_SCALE] }) }] }]}>
            <TextInput
              value={bidText}
              onChangeText={handleBidTextChange}
              onBlur={normalizeBid}
              keyboardType="number-pad"
              selectTextOnFocus
              style={styles.bidValue}
              accessibilityLabel="Montant de la mise"
            />
          </Animated.View>

          <Pressable
            onPressIn={() => startHold(1)}
            onPressOut={() => stopHold(1)}
            hitSlop={16}
            accessibilityRole="button"
            accessibilityLabel="Augmenter la mise"
          >
            <Text style={styles.stepBtn}>+</Text>
          </Pressable>
        </View>

        <View style={styles.btnStack}>
          <Pressable
            onPress={() => onBid(amount)}
            sound="bid"
            accessibilityRole="button"
            accessibilityLabel={t.auction.bid(amount)}
            style={styles.btnMiserWrap}
          >
            <LinearGradient
              colors={['#fb940e', '#f2c512']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnInner}
            >
              <Text style={styles.btnMiserText} numberOfLines={1} adjustsFontSizeToFit>{t.auction.bid(amount)}</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={onPass}
            accessibilityRole="button"
            accessibilityLabel={passLabel}
            style={[styles.btnPasserWrap, !passAllowed && styles.hidden]}
            pointerEvents={passAllowed ? 'auto' : 'none'}
          >
            <View style={styles.btnPasserInner}>
              <Text style={styles.btnPasserText} numberOfLines={1} adjustsFontSizeToFit>{passLabel}</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  blueZone: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 32,
    alignItems: 'center',
  },
  roundPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roundLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  questionCard: {
    backgroundColor: colors.cream,
    borderRadius: 16,
    // 16 (et non 24) : avec les intitulés raccourcis, garantit 3 lignes max dès 375pt de large
    paddingHorizontal: 16,
    paddingVertical: 13,
    width: '100%',
  },
  questionText: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.purpleDeep,
  },
  instruction: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
    textAlign: 'center',
    lineHeight: 26,
  },
  creamPanel: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 40,
    paddingHorizontal: 24,
    gap: 36,
    alignItems: 'center',
  },
  toast: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    backgroundColor: colors.purpleDeep,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.cream,
  },
  opensRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
    width: '100%',
  },
  teamNameBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '60%',
  },
  teamNameText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  opensText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  stepBtn: {
    fontFamily: fonts.displayMedium,
    fontSize: 40,
    color: colors.purpleDeep,
    width: 32,
    textAlign: 'center',
    lineHeight: 50,
  },
  // zIndex : le carré gonflé passe par-dessus les boutons voisins sans les pousser
  bidBadge: {
    zIndex: 1,
    backgroundColor: colors.purpleDeep,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 55,
    alignItems: 'center',
  },
  bidValue: {
    fontFamily: fonts.displayMedium,
    fontSize: 40,
    color: colors.cream,
    textAlign: 'center',
    padding: 0,
    minWidth: 40,
  },
  btnStack: {
    width: '100%',
    gap: 16,
  },
  btnMiserWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnInner: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  btnMiserText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
  },
  btnPasserWrap: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    shadowColor: colors.purpleDeep,
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnPasserInner: {
    backgroundColor: '#fffbf5',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  btnPasserText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.purpleDeep,
  },
  hidden: {
    opacity: 0,
  },
});
