import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { Pressable } from '@/components/Pressable';
import type { GameTeam } from '@/game/engine';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';

// Extrait de assets/phone.svg (viewBox 0 0 21 29)
const PHONE_PATH =
  'M4.35571 0.367188C8.27709 0.0440868 12.2234 0.0440867 16.1448 0.367188C16.8068 0.421634 17.4472 0.609479 18.0178 0.916992C18.0985 0.958499 18.1784 1.00282 18.2561 1.04883C18.7671 1.34502 19.1991 1.74091 19.5178 2.20801C19.7967 2.6167 19.9832 3.0708 20.0667 3.54395L20.0959 3.74805V3.74902L20.1067 3.84766H20.1057C20.1208 3.95947 20.13 4.07204 20.1321 4.18555L20.3752 12.2656V12.2734L20.3665 12.5947L20.3752 12.9287V12.9355L20.3665 13.2578L20.3752 13.5918V13.5977L20.3665 13.9229L20.3752 14.2539V14.2607L20.135 23.6729C20.1063 24.7869 19.6258 25.8512 18.7874 26.668C17.9493 27.4842 16.8107 27.9988 15.5842 28.1182C12.0389 28.4612 8.4616 28.4612 4.91626 28.1182C3.68975 27.9988 2.55115 27.4842 1.71313 26.668C0.874721 25.8512 0.394196 24.7869 0.365479 23.6729L0.125244 14.2607V14.2539L0.134033 13.9199L0.125244 13.5977V13.5918L0.134033 13.2588L0.125244 12.9355V12.9287L0.134033 12.5967L0.125244 12.2734V12.2656L0.368408 4.18555L0.377197 4.01074C0.381821 3.95283 0.388034 3.89496 0.395752 3.83789L0.399658 3.79688V3.79395L0.404541 3.75586C0.468728 3.16555 0.69198 2.59863 1.05396 2.10449C1.41549 1.61105 1.90445 1.20455 2.47778 0.918945C2.55541 0.878367 2.63448 0.839708 2.71411 0.802734C3.22463 0.562922 3.78254 0.415018 4.35571 0.367188ZM10.2502 23.2607C9.6898 23.2607 9.15447 23.4595 8.76196 23.8105C8.36995 24.1612 8.15261 24.6339 8.15259 25.123C8.15259 25.6122 8.36997 26.0849 8.76196 26.4355C9.15447 26.7866 9.6898 26.9854 10.2502 26.9854C10.8107 26.9854 11.346 26.7866 11.7385 26.4355C12.1305 26.0849 12.3479 25.6122 12.3479 25.123C12.3479 24.6339 12.1305 24.1612 11.7385 23.8105C11.346 23.4595 10.8107 23.2607 10.2502 23.2607ZM16.219 2.70996C12.2507 2.32645 8.24829 2.32548 4.28149 2.70898C4.08426 2.72929 3.89319 2.78205 3.71704 2.8623C3.25915 3.12353 2.94243 3.55001 2.85962 4.04004C2.85838 4.05285 2.85864 4.06712 2.85864 4.08203V4.08496L2.62524 13.1846L2.81372 19.4453C2.83306 20.0911 3.11638 20.7109 3.6145 21.1865C4.11324 21.6626 4.79316 21.9613 5.52466 22.0215C8.66843 22.2794 11.8321 22.2794 14.9758 22.0215C15.7073 21.9613 16.3872 21.6626 16.886 21.1865C17.3841 20.7109 17.6674 20.0911 17.6868 19.4453L17.8752 13.1846L17.6418 4.08398L17.6409 4.03613C17.5571 3.5498 17.2395 3.12341 16.7844 2.86133C16.6126 2.7814 16.4245 2.73062 16.219 2.70996Z';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

type Props = {
  teams: GameTeam[];
  onDone: () => void;
};

/** Avant la première manche de survie : téléphone posé au centre, visible par toutes les équipes. */
export function SurviePhoneIntro({ teams, onDone }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const t = getT(lang);

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom + 20, 36) }]}>
      <CreamPatternSvg width={Math.min(width, 500)} height={height} opacity={0.01} fill="#ffffff" />

      <View style={styles.content}>
        <Svg width={63} height={87} viewBox="0 0 21 29">
          <Path d={PHONE_PATH} fill={colors.cream} />
        </Svg>
        <Text style={styles.title} accessibilityRole="header">{t.survie.phoneTitle}</Text>
        <Text style={styles.message}>{t.survie.phoneMsg}</Text>
        <View style={styles.teams}>
          {teams.map((team) => (
            <View key={team.name} style={[styles.badge, { backgroundColor: team.color }]}>
              <Text style={[styles.badgeText, { color: BADGE_TEXT_COLOR[team.color] ?? colors.purpleDeep }]} numberOfLines={1}>
                {team.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable onPress={onDone} accessibilityRole="button" accessibilityLabel={t.survie.phoneGo} style={styles.btnWrap}>
        <LinearGradient colors={['#fb940e', '#f2c512']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
          <Text style={styles.btnText}>{t.survie.phoneGo}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    // Bleu marine des transitions (comme « remporte les enchères »)
    backgroundColor: colors.purpleDeep,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    color: colors.cream,
    textAlign: 'center',
  },
  message: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    lineHeight: 26,
    color: colors.white,
    textAlign: 'center',
  },
  teams: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  badgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
  },
  btnWrap: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  btn: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#a15c03',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  btnText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: '#fef6d7',
    letterSpacing: 1,
  },
});
