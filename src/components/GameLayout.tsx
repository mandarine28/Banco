import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RoundIconButton } from '@/components/RoundIconButton';
import { colors, fonts } from '@/theme';

const MAX_WIDTH = 500;

type Props = {
  /** Bandeau du haut : nom et couleur de l'équipe concernée. */
  banner: { label: string; color: string };
  onHome: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

/** Écran de partie : bouton accueil, bandeau d'équipe, fond violet. */
export function GameLayout({ banner, onHome, children, footer }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);

  return (
    <View style={styles.page}>
      <LinearGradient
        colors={[colors.purpleDeep, colors.purpleBright, colors.purpleDeep]}
        locations={[0, 0.6, 1]}
        style={[styles.screen, { width, paddingTop: insets.top + 16 }]}
      >
        <View style={styles.top}>
          <RoundIconButton
            tone="purple"
            size={42}
            accessibilityLabel="Quitter la partie"
            onPress={onHome}
            icon={<MaterialCommunityIcons name="home" size={26} color={colors.white} />}
          />
          <View style={[styles.bannerBase]}>
            <View style={[styles.banner, { backgroundColor: banner.color }]}>
              <Text style={styles.bannerLabel} numberOfLines={1}>
                {banner.label}
              </Text>
            </View>
          </View>
          <View style={styles.balance} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>

        {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>{footer}</View> : null}
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
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  bannerBase: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingBottom: 3,
  },
  banner: {
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  bannerLabel: {
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 24,
  },
  balance: {
    width: 30,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 20,
    gap: 18,
  },
  footer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
});
