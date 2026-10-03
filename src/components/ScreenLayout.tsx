import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/theme';

// Même largeur maximale que l'accueil : au-delà, l'écran reste au format téléphone.
const MAX_WIDTH = 500;

type Props = {
  title: string;
  children: ReactNode;
  /** Contenu fixé en bas d'écran (ex. bouton « suivant »). */
  footer?: ReactNode;
  onBack?: () => void;
};

/** Écran standard : en-tête blanc avec retour et titre, fond violet dégradé. */
export function ScreenLayout({ title, children, footer, onBack = () => router.back() }: Props) {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);

  return (
    <View style={styles.page}>
      <LinearGradient
        colors={[colors.purpleDeep, colors.purpleBright, colors.purpleDeep]}
        locations={[0, 0.55, 1]}
        style={[styles.screen, { width }]}
      >
        <View style={[styles.header, { paddingTop: insets.top + Math.min(40, height * 0.03), paddingBottom: Math.min(26, height * 0.025) }]}>
          <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Retour" hitSlop={10}>
            <View style={styles.back}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
            </View>
          </Pressable>
          <Text style={[styles.title, { fontSize: Math.min(width * 0.068, 30) }]} numberOfLines={1} adjustsFontSizeToFit>
            {title}
          </Text>
        </View>
        <View style={styles.band} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>

        {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>{footer}</View> : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.purpleDeep,
  },
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingBottom: 26,
    backgroundColor: colors.white,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purple,
  },
  title: {
    flex: 1,
    color: colors.purple,
    fontFamily: fonts.display,
  },
  band: {
    height: 14,
    backgroundColor: colors.lavender,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 24,
    gap: 18,
  },
  footer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
