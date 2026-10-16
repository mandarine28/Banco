import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import { ModeRulesCard, type RulesMode } from '@/components/ModeRules';
import { Pressable } from '@/components/Pressable';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';

const MAX_WIDTH = 500;

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

function BackArrow({ size }: { size: number }) {
  return (
    <View pointerEvents="none">
      <Svg width={size} height={(size * 19) / 32} viewBox="0 0 32 19">
        <Path d={ARROW_PATH} fill={colors.purple} />
      </Svg>
    </View>
  );
}

export default function RulesScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const { lang } = useLang();
  const t = getT(lang);
  const [tab, setTab] = useState<RulesMode>('auction');
  const tabs: { id: RulesMode; label: string }[] = [
    { id: 'auction', label: t.gameMode.classic },
    { id: 'survie', label: t.gameMode.charades },
  ];

  const panelTop = insets.top + 68;

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>

        <View style={[styles.bluePanel, { top: panelTop }]}>
          <CreamPatternSvg width={width} height={height - panelTop} opacity={0.04} fill="#ffffff" />
          <ScrollView
            contentContainerStyle={[styles.panelContent, { paddingBottom: Math.max(32, insets.bottom + 24) }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Onglets Enchères / Survie */}
            <View style={styles.tabs} accessibilityRole="tablist">
              {tabs.map(({ id, label }) => {
                const selected = tab === id;
                return (
                  <Pressable
                    key={id}
                    onPress={() => setTab(id)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected }}
                    style={[styles.tab, selected ? styles.tabSelected : styles.tabIdle]}
                  >
                    <Text style={[styles.tabText, { color: selected ? colors.purpleDeep : colors.cream }]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <ModeRulesCard mode={tab} />
          </ScrollView>
        </View>

        <View style={[styles.header, { top: insets.top + 14, left: width * 0.06 }]}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t.comingSoon.back} hitSlop={10}>
            <BackArrow size={Math.min(width * 0.09, 36)} />
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">{t.pages.rules}</Text>
        </View>
      </View>
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
  panelContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    gap: 24,
  },
  // Gélules d'onglets, mêmes couleurs que les cartes de mode (sélectionnée crème, sinon bleu clair)
  tabs: {
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: '#fef9e6',
  },
  tabIdle: {
    backgroundColor: '#4883E5',
    borderWidth: 1,
    borderColor: colors.cream,
  },
  tabText: {
    fontFamily: fonts.display,
    fontSize: 17,
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.purple,
  },
});
