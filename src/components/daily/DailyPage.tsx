import { router } from 'expo-router';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { SETTING_PATH } from '@/components/GameLayout';
import { HomeBackground } from '@/components/HomeBackground';
import { Pressable } from '@/components/Pressable';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';

const MAX_WIDTH = 500;

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

/**
 * Bloque le défilement de la page tant qu'un doigt est posé sur une zone qui gère ses propres glissés (calendrier).
 * L'état vit dans DailyPage : le bloquer ne redessine que la page, pas son contenu, donc il arrive avant que la page ne bouge.
 */
const ScrollLockContext = createContext<(locked: boolean) => void>(() => {});
export const usePageScrollLock = () => useContext(ScrollLockContext);

type DailyPageProps = {
  title: string;
  backLabel: string;
  children: ReactNode;
};

/** Page des défis : fond crème, panneau bleu arrondi qui défile, flèche retour, titre et réglages (comme les autres écrans). */
export function DailyPage({ title, backLabel, children }: DailyPageProps) {
  const t = getT(useLang().lang);
  const [locked, setLocked] = useState(false);
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const panelTop = insets.top + 68;
  const arrow = Math.min(width * 0.09, 36);
  const settingsSize = Math.min(width * 0.08, 32);

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>
        <View style={[styles.bluePanel, { top: panelTop }]}>
          <CreamPatternSvg width={width} height={height - panelTop} opacity={0.04} fill="#ffffff" />
          <ScrollView scrollEnabled={!locked} contentContainerStyle={[styles.content, { paddingBottom: Math.max(32, insets.bottom + 24) }]} showsVerticalScrollIndicator={false}>
            <ScrollLockContext.Provider value={setLocked}>{children}</ScrollLockContext.Provider>
          </ScrollView>
        </View>
        <View style={[styles.header, { top: insets.top + 14, left: width * 0.06, right: width * 0.06 }]}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={backLabel} hitSlop={10}>
            <View pointerEvents="none">
              <Svg width={arrow} height={(arrow * 19) / 32} viewBox="0 0 32 19">
                <Path d={ARROW_PATH} fill={colors.purple} />
              </Svg>
            </View>
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header" numberOfLines={1}>{title}</Text>
          <Pressable onPress={() => router.push('/reglages')} accessibilityRole="button" accessibilityLabel={t.pages.settings} hitSlop={10} style={styles.settings}>
            <View pointerEvents="none">
              <Svg width={settingsSize} height={settingsSize} viewBox="0 0 24 24">
                <Path d={SETTING_PATH} fill={colors.purple} />
              </Svg>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** Titre de section sur le panneau bleu, avec un contrôle facultatif à droite (ex. menu « Filtrer »). */
type SectionTitleProps = {
  title: string;
  /** Petit compteur après le titre (ex. « 12/30 »), et sa version lue par le lecteur d'écran. */
  detail?: string;
  detailLabel?: string;
  children?: ReactNode;
};

export function SectionTitle({ title, detail, detailLabel, children }: SectionTitleProps) {
  return (
    <View style={styles.section}>
      <View style={styles.titleRow} accessible accessibilityRole="header" accessibilityLabel={detailLabel ? `${title}, ${detailLabel}` : title}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {detail ? <Text style={styles.sectionDetail}>{detail}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  screen: {
    overflow: 'hidden',
  },
  bluePanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.purple,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 16,
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    flexShrink: 1,
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.purple,
  },
  // Réglages poussés à droite, comme sur les autres écrans
  settings: {
    marginLeft: 'auto',
  },
  // zIndex : un menu déroulant à droite passe par-dessus le contenu qui suit
  section: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.cream,
  },
  sectionDetail: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
    opacity: 0.75,
  },
});
