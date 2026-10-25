import { useEffect, useRef, useState } from 'react';
import { Animated, type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

const SHOW_MS = 150;
const HIDE_MS = 250;
const VISIBLE_MS = 2000;

/** Petit message éphémère au-dessus d'un bouton : `show()` l'affiche 2 s. */
export function useToast() {
  const opacity = useState(() => new Animated.Value(0))[0];
  const translateY = useState(() => new Animated.Value(8))[0];
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);
  const show = () => {
    if (timeout.current) clearTimeout(timeout.current);
    translateY.setValue(8);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: SHOW_MS, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: SHOW_MS, useNativeDriver: true }),
    ]).start();
    timeout.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: HIDE_MS, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 8, duration: HIDE_MS, useNativeDriver: true }),
      ]).start();
    }, VISIBLE_MS);
  };
  return { opacity, translateY, show };
}

/**
 * À placer dans le conteneur (position relative) du bouton concerné.
 * light : fond blanc, pour ressortir sur un fond bleu foncé (cartes de la boutique).
 */
export function Toast({
  toast,
  message,
  light = false,
  style,
}: {
  toast: ReturnType<typeof useToast>;
  message: string;
  light?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Animated.View
      style={[styles.toast, light && styles.toastLight, style, { opacity: toast.opacity, transform: [{ translateY: toast.translateY }] }]}
      pointerEvents="none"
    >
      <Text style={[styles.toastText, light && styles.toastTextLight]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: -24,
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
  toastLight: {
    backgroundColor: '#fffbf5',
    borderWidth: 2,
    borderColor: colors.purpleDeep,
  },
  toastTextLight: {
    color: colors.purpleDeep,
  },
  toastText: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.cream,
  },
});
