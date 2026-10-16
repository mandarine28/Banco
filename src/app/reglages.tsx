import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import { privacyUrl, supportEmail } from '@/config/links';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { playSound, setSoundEnabled, useSoundEnabled } from '@/lib/sounds';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

const MAX_WIDTH = 500;
const APP_VERSION = Constants.expoConfig?.version ?? '';

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

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      style={styles.card}
      onPress={() => setOpen((o) => !o)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
    >
      <View style={styles.faqRow}>
        <Text style={[styles.cardTitle, styles.faqQuestion]}>{q}</Text>
        <Text style={styles.faqToggle}>{open ? '–' : '+'}</Text>
      </View>
      {open ? <Text style={styles.cardText}>{a}</Text> : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const { lang } = useLang();
  const t = getT(lang);
  const s = t.support;
  const soundEnabled = useSoundEnabled();

  const panelTop = insets.top + 68;

  const contact = () => {
    // Version + OS pré-remplis : premières infos demandées pour reproduire un bug
    const body = `\n\n—\nBanco ${APP_VERSION} · ${Platform.OS} ${Platform.Version}`;
    const url = `mailto:${supportEmail}?subject=${encodeURIComponent(s.mailSubject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(url).catch(() => Alert.alert(s.title, `${s.noMailApp}\n${supportEmail}`));
  };

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>

        <View style={[styles.bluePanel, { top: panelTop }]}>
          <CreamPatternSvg width={width} height={height - panelTop} opacity={0.04} fill="#ffffff" />
          <ScrollView
            contentContainerStyle={[styles.panelContent, { paddingBottom: Math.max(24, insets.bottom + 16) }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle} accessibilityRole="header">{t.prefs.title}</Text>
              <View style={[styles.card, styles.switchRow]}>
                <Text style={[styles.cardTitle, styles.switchLabel]}>{t.prefs.soundEffects}</Text>
                <Switch
                  value={soundEnabled}
                  onValueChange={(value) => {
                    setSoundEnabled(value);
                    // Retour immédiat : on entend tout de suite que le son est réactivé
                    if (value) playSound('tap');
                  }}
                  trackColor={{ false: colors.lavender, true: colors.purple }}
                  accessibilityLabel={t.prefs.soundEffects}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle} accessibilityRole="header">{s.title}</Text>
              <View style={styles.card}>
                <Text style={styles.cardText}>{s.intro}</Text>
                <Pressable onPress={contact} accessibilityRole="button" accessibilityLabel={s.contactBtn}>
                  <LinearGradient
                    colors={['#fb940e', '#f2c512']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.btn}
                  >
                    <Text style={styles.btnText}>{s.contactBtn}</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle} accessibilityRole="header">{s.faqTitle}</Text>
              <View style={styles.list}>
                {s.faq.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <Pressable
                onPress={() => WebBrowser.openBrowserAsync(privacyUrl).catch(() => {})}
                accessibilityRole="link"
                hitSlop={10}
              >
                <Text style={styles.link}>{s.privacy}</Text>
              </Pressable>
              <Text style={styles.version}>{`${s.version} ${APP_VERSION}`}</Text>
            </View>
          </ScrollView>
        </View>

        <View style={[styles.header, { top: insets.top + 14, left: width * 0.06 }]}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t.comingSoon.back} hitSlop={10}>
            <BackArrow size={Math.min(width * 0.09, 36)} />
          </Pressable>
          <Text style={styles.headerTitle}>{t.pages.settings}</Text>
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
    paddingTop: 48,
    gap: 40,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fef1cc',
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#fef9e6',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.purpleDeep,
  },
  cardText: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.purpleDeep,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    flex: 1,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
  },
  faqToggle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.purple,
  },
  btn: {
    height: 51,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#a15c03',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  btnText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  link: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.cream,
    textDecorationLine: 'underline',
  },
  version: {
    fontFamily: fonts.displayMedium,
    fontSize: 13,
    color: colors.cream,
    opacity: 0.7,
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
