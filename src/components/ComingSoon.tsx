import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';

/** Écran provisoire pour les routes pas encore développées. */
export function ComingSoon({ title }: { title: string }) {
  const { lang } = useLang();
  const t = getT(lang);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{t.comingSoon.subtitle}</Text>
      <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.back}>
        <Text style={styles.backLabel}>{t.comingSoon.back}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.purple,
  },
  title: { color: colors.white, fontFamily: fonts.display, fontSize: 32 },
  subtitle: { color: colors.white, fontFamily: fonts.bodyRegular, fontSize: 16 },
  back: { marginTop: 24, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24, backgroundColor: colors.white },
  backLabel: { color: colors.purple, fontFamily: fonts.display, fontSize: 18 },
});
