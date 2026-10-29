import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import { HomeMascot } from '@/components/HomeMascot';
import { ConfirmModal } from '@/components/InfoModal';
import { LanguagePicker } from '@/components/LanguagePicker';
import { AnimatedLogo } from '@/components/Logo';
import { PACK_THEME_IDS, WELCOME_GAMES, WELCOME_PACK } from '@/config/shop';
import { afterAdsConsent } from '@/lib/ads';
import { UpdateModal } from '@/components/UpdateModal';
import { fetchStoreVersion, isNewerVersion } from '@/lib/appUpdate';
import { loadWelcomeIntroSeen, markWelcomeIntroSeen } from '@/lib/gifts';
import { loadTutorialSeen } from '@/lib/tutorial';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';
import { usePurchases } from '@/state/purchases';
import { useGiftChain } from '@/state/useGifts';
import { useTutorial, useTutorialTarget } from '@/state/tutorial';

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
  const { lang } = useLang();
  const t = getT(lang);

  // Logo BANGO paysage 324 × 84
  const logoWidth = Math.min(width * 0.78, 310);
  const logoHeight = (logoWidth * 84) / 324;

  // Centre le logo+subtitle dans la zone crème visible au-dessus du panneau bleu
  const estimatedPanelHeight = 264 + Math.max(64, insets.bottom + 30);
  const creamHeight = height - estimatedPanelHeight;
  const logoGroupHeight = logoHeight + 12 + 36;
  const logoTop = Math.max(insets.top + 20, (creamHeight - logoGroupHeight) / 2);
  const subtitleTop = logoTop + logoHeight + 12;

  const go = (href: Href) => () => router.push(href);

  // Haut du panneau bleu (mesuré) : la mascotte se cache derrière
  const [panelTop, setPanelTop] = useState(0);
  // Incrémenté à chaque toucher : la mascotte prend peur et son timer repart
  const [interactionKey, setInteractionKey] = useState(0);

  // Premier lancement : annonce du pack offert après WELCOME_GAMES parties
  const { welcomeUnlocked } = useGiftChain();
  const { giftedPacks, isLoading: purchasesLoading } = usePurchases();
  const [showWelcome, setShowWelcome] = useState(false);
  // Premier lancement : le didacticiel présente les packs offerts ; s'il est passé, la fenêtre cadeau prend le relais
  const { start: startTutorial, step: tutorialStep } = useTutorial();
  const playTarget = useTutorialTarget('home-play');
  const shopTarget = useTutorialTarget('home-shop');
  // Nouvelle version sur l'App Store : proposée à chaque lancement, tant que l'app n'est pas à jour
  const [showUpdate, setShowUpdate] = useState(false);
  useEffect(() => {
    Promise.all([loadWelcomeIntroSeen(), loadTutorialSeen(), afterAdsConsent()]).then(([seen, tutorialSeen]) => {
      if (tutorialSeen) {
        setShowWelcome(!seen);
        // Jamais par-dessus la fenêtre cadeau : deux modales qui s'enchaînent figent l'écran sur iOS
        if (seen) {
          fetchStoreVersion().then((latest) => {
            const current = Constants.expoConfig?.version;
            if (latest && current && isNewerVersion(latest, current)) setShowUpdate(true);
          });
        }
        return;
      }
      startTutorial((completed) => {
        if (completed) markWelcomeIntroSeen();
        else setShowWelcome(!seen);
      });
    });
  }, [startTutorial]);
  // Après réinstallation, le pack reste dans le trousseau : attendre sa lecture évite d'ouvrir puis refermer aussitôt la modale (écran figé sur iOS)
  const welcomeReady = giftedPacks !== undefined && !purchasesLoading;
  const closeWelcome = () => {
    setShowWelcome(false);
    markWelcomeIntroSeen();
  };
  const welcomePackTitle = t.shop.packTitles[PACK_THEME_IDS[WELCOME_PACK] ?? ''] ?? '';

  return (
    <View style={styles.page}>
      <View
        style={[styles.screen, { width, height }]}
        // Phase de capture : voit chaque toucher sans le voler aux boutons
        onStartShouldSetResponderCapture={() => {
          setInteractionKey((k) => k + 1);
          return false;
        }}
      >

        {/* Fond crème + pattern blobs orange */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>

        {/* Mascotte en idle — rendue avant le panneau pour passer derrière */}
        <HomeMascot width={width} panelTop={panelTop} interactionKey={interactionKey} paused={tutorialStep !== null} />

        {/* Panneau bleu (arrondi en haut) — auto-sized, collé en bas */}
        <View style={[styles.bluePanel, { width }]} onLayout={(e) => setPanelTop(e.nativeEvent.layout.y)}>
          <CreamPatternSvg width={width} height={360} opacity={0.04} fill="#ffffff" />
          <View style={[styles.panelContent, { paddingBottom: Math.max(64, insets.bottom + 30) }]}>
            {/* Jouer — dégradé orange, même style que « Miser » et « Continuer » */}
            <View ref={playTarget} collapsable={false}>
            <Pressable
              onPress={go('/parametres')}
              accessibilityRole="button"
              accessibilityLabel={t.home.play}
            >
              <LinearGradient
                colors={['#fb940e', '#f2c512']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnJouer}
              >
                <Text style={[styles.btnText, { color: colors.cream }]}>{t.home.play}</Text>
              </LinearGradient>
            </Pressable>
            </View>

            {/* Boutique — fond crème, contour marine, comme « Suivant » (équipes) */}
            <View ref={shopTarget} collapsable={false}>
              <Pressable
                onPress={go('/boutique')}
                accessibilityRole="button"
                accessibilityLabel={t.home.shop}
                style={styles.btnBoutique}
              >
                <Text style={[styles.btnText, { color: colors.purpleDeep }]}>{t.home.shop}</Text>
              </Pressable>
            </View>

            {/* Règle — contour blanc, texte crème */}
            <Pressable
              onPress={go('/regles')}
              accessibilityRole="button"
              accessibilityLabel={t.home.rules}
              style={styles.btnRegle}
            >
              <Text style={[styles.btnText, { color: colors.cream }]}>{t.home.rules}</Text>
            </Pressable>
          </View>
        </View>

        {/* En-tête : drapeau gauche + paramètres droite */}
        <View style={[styles.header, { top: insets.top + 14, left: width * 0.06, right: width * 0.06 }]}>
          <LanguagePicker />
          <Pressable
            onPress={go('/reglages')}
            accessibilityRole="button"
            accessibilityLabel={t.pages.settings}
            hitSlop={10}
          >
            <SettingIcon size={Math.min(width * 0.08, 32)} />
          </Pressable>
        </View>

        {/* Logo BANGO */}
        <View style={[styles.logoWrap, { top: logoTop }]}>
          <AnimatedLogo width={logoWidth} />
        </View>

        {/* Sous-titre */}
        <Text style={[styles.subtitle, { top: subtitleTop }]}>
          {t.home.subtitle}
        </Text>

        <ConfirmModal
          visible={showWelcome && welcomeReady && !welcomeUnlocked}
          title={t.gift.welcomeTitle}
          message={t.gift.welcomeMsg(welcomePackTitle, WELCOME_GAMES)}
          confirmLabel={t.gift.gotIt}
          confirmIcon="gift"
          onConfirm={closeWelcome}
          onDismiss={closeWelcome}
        />

        <UpdateModal visible={showUpdate} onClose={() => setShowUpdate(false)} />

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
    borderWidth: 2,
    borderColor: '#a15c03',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  btnBoutique: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fffbf5',
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.purpleDeep,
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
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
