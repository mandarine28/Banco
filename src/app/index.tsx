import { type Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import { LanguagePicker } from '@/components/LanguagePicker';
import { Logo } from '@/components/Logo';
import { colors, fonts } from '@/theme';

const MAX_WIDTH = 500;

const SETTING_PATH =
  'M12.1523 0C12.9816 0 13.7558 0.414588 14.2158 1.10449L15.1445 2.49707C15.7968 3.47551 16.9758 3.96402 18.1289 3.7334L18.4355 3.67188C19.195 3.51999 19.9807 3.75708 20.5283 4.30469L20.624 4.40137C21.2715 5.04885 21.432 6.03842 21.0225 6.85742L20.9902 6.92188C20.6001 7.70222 20.7532 8.64481 21.3701 9.26172C21.5925 9.48412 21.8638 9.65145 22.1621 9.75098L22.2158 9.76953C23.1412 10.078 23.7655 10.9436 23.7656 11.9189V12.7949C23.7655 13.721 23.0961 14.5116 22.1826 14.6641C20.925 14.8737 20.2286 16.2405 20.7988 17.3809L20.9941 17.7705C21.4209 18.6241 21.2529 19.6553 20.5781 20.3301L20.0547 20.8545C19.4148 21.4943 18.4215 21.6159 17.6455 21.1504C16.5637 20.5013 15.1589 21.0211 14.7598 22.2178L14.668 22.4932C14.3678 23.393 13.5257 23.9999 12.5771 24H11.4482C10.5921 23.9999 9.80964 23.5158 9.42676 22.75C8.98292 21.8626 8.01192 21.3682 7.0332 21.5312L6 21.7041C5.09973 21.854 4.18247 21.5594 3.53711 20.9141C2.89174 20.2686 2.59806 19.3515 2.74805 18.4512L2.88672 17.6143C3.066 16.5384 2.4726 15.4824 1.45996 15.0771C0.465873 14.6795 -0.127978 13.6537 0.0234375 12.5938L0.167969 11.582C0.33926 10.3836 1.21916 9.40802 2.39355 9.11426L2.90332 8.9873C3.09371 8.93967 3.26746 8.8409 3.40625 8.70215C3.69636 8.41204 3.79757 7.983 3.66797 7.59375L3.00391 5.59961C2.7116 4.72269 3.04242 3.75883 3.81152 3.24609C4.29202 2.92581 4.88509 2.82283 5.44531 2.96289L7.30859 3.42871C8.38861 3.78864 9.53436 3.09846 9.72168 1.97559L9.76367 1.72754C9.92987 0.730694 10.7921 3.81912e-05 11.8027 0H12.1523ZM11.7656 8C9.5565 8.00001 7.76562 9.79087 7.76562 12C7.76562 14.2091 9.5565 16 11.7656 16C13.9748 16 15.7656 14.2091 15.7656 12C15.7656 9.79086 13.9748 8 11.7656 8Z';

function SettingIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={SETTING_PATH} fill={colors.purple} />
    </Svg>
  );
}


export default function HomeScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);

  // Logo BANCO paysage 324 × 84
  const logoWidth = Math.min(width * 0.78, 310);
  const logoHeight = (logoWidth * 84) / 324;

  // Centre le logo+subtitle dans la zone crème visible au-dessus du panneau bleu
  const estimatedPanelHeight = 264 + Math.max(64, insets.bottom + 30);
  const creamHeight = height - estimatedPanelHeight;
  const logoGroupHeight = logoHeight + 12 + 36;
  const logoTop = Math.max(insets.top + 20, (creamHeight - logoGroupHeight) / 2);
  const subtitleTop = logoTop + logoHeight + 12;

  const go = (href: Href) => () => router.push(href);

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>

        {/* Fond crème + pattern blobs orange */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>

        {/* Panneau bleu (arrondi en haut) — auto-sized, collé en bas */}
        <View style={[styles.bluePanel, { width }]}>
          <CreamPatternSvg width={width} height={360} opacity={0.04} fill="#ffffff" />
          <View style={[styles.panelContent, { paddingBottom: Math.max(64, insets.bottom + 30) }]}>
            {/* Jouer — fond crème, texte marine */}
            <Pressable
              onPress={go('/parametres')}
              accessibilityRole="button"
              accessibilityLabel="Jouer"
              style={styles.btnJouer}
            >
              <Text style={[styles.btnText, { color: colors.purpleDeep }]}>Jouer</Text>
            </Pressable>

            {/* Boutique — fond orange, texte crème */}
            <Pressable
              onPress={go('/boutique')}
              accessibilityRole="button"
              accessibilityLabel="Boutique"
              style={styles.btnBoutique}
            >
              <Text style={[styles.btnText, { color: colors.cream }]}>Boutique</Text>
            </Pressable>

            {/* Règle — contour blanc, texte crème */}
            <Pressable
              onPress={go('/regles')}
              accessibilityRole="button"
              accessibilityLabel="Règle"
              style={styles.btnRegle}
            >
              <Text style={[styles.btnText, { color: colors.cream }]}>Règle</Text>
            </Pressable>
          </View>
        </View>

        {/* En-tête : drapeau gauche + paramètres droite */}
        <View style={[styles.header, { top: insets.top + 14, left: width * 0.06, right: width * 0.06 }]}>
          <LanguagePicker />
          <Pressable
            onPress={go('/reglages')}
            accessibilityRole="button"
            accessibilityLabel="Paramètres"
            hitSlop={10}
          >
            <SettingIcon size={Math.min(width * 0.08, 32)} />
          </Pressable>
        </View>

        {/* Logo BANCO */}
        <View style={[styles.logoWrap, { top: logoTop }]}>
          <Logo width={logoWidth} />
        </View>

        {/* Sous-titre */}
        <Text style={[styles.subtitle, { top: subtitleTop }]}>
          C'est partie pour Banco !
        </Text>

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
  // Panneau bleu
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
    paddingTop: 64,
    gap: 16,
  },
  // Boutons plats
  btnJouer: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBoutique: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRegle: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#4883E5',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    letterSpacing: 0.2,
  },
  // En-tête
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Logo
  logoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  // Sous-titre
  subtitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: colors.purpleDeep,
    fontFamily: fonts.displayMedium,
    fontSize: 24,
    lineHeight: 36,
  },
});
