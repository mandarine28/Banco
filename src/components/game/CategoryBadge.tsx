import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { themeLabel } from '@/data/themes';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';

const BREATH_MS = 1400;

/**
 * Catégorie de la question, à sa découverte : sans elle, un sujet de pack (ex. Poudlard) reste obscur.
 * Un léger battement attire l'œil sans agresser.
 */
export function CategoryBadge({ themeId }: { themeId: string }) {
  const { lang } = useLang();
  const [reduceMotion, setReduceMotion] = useState(true);
  const pulse = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => setReduceMotion(false));
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const ease = Easing.inOut(Easing.sin);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: BREATH_MS, easing: ease, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: BREATH_MS, easing: ease, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });

  return (
    // Contour dessiné par deux fonds superposés : un borderWidth mis à l'échelle crée des artefacts sur iOS
    <Animated.View style={[styles.outline, { transform: [{ scale }] }]}>
      <View style={styles.badge}>
        <Text style={styles.text} numberOfLines={1}>
          {themeLabel(themeId, lang)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outline: {
    backgroundColor: colors.purpleDeep,
    borderRadius: 12,
    padding: 2,
    flexShrink: 1,
  },
  badge: {
    backgroundColor: '#fffbf5',
    borderRadius: 10,
    paddingHorizontal: 10,
    // 4 + contour 2 : même hauteur que la gélule du round
    paddingVertical: 4,
  },
  text: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.purpleDeep,
  },
});
