import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, SvgXml } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import {
  ENCHERE_ACTIF_XML,
  ENCHERE_INACTIF_XML,
  SURVIE_ACTIF_XML,
  SURVIE_INACTIF_XML,
} from '@/components/modeIllustrationsXml';
import { ModeRulesModal, type RulesMode } from '@/components/ModeRules';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { type GameMode, useGameSettings } from '@/state/gameSettings';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

const MAX_WIDTH = 500;

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

const SETTING_PATH =
  'M12.1523 0C12.9816 0 13.7558 0.414588 14.2158 1.10449L15.1445 2.49707C15.7968 3.47551 16.9758 3.96402 18.1289 3.7334L18.4355 3.67188C19.195 3.51999 19.9807 3.75708 20.5283 4.30469L20.624 4.40137C21.2715 5.04885 21.432 6.03842 21.0225 6.85742L20.9902 6.92188C20.6001 7.70222 20.7532 8.64481 21.3701 9.26172C21.5925 9.48412 21.8638 9.65145 22.1621 9.75098L22.2158 9.76953C23.1412 10.078 23.7655 10.9436 23.7656 11.9189V12.7949C23.7655 13.721 23.0961 14.5116 22.1826 14.6641C20.925 14.8737 20.2286 16.2405 20.7988 17.3809L20.9941 17.7705C21.4209 18.6241 21.2529 19.6553 20.5781 20.3301L20.0547 20.8545C19.4148 21.4943 18.4215 21.6159 17.6455 21.1504C16.5637 20.5013 15.1589 21.0211 14.7598 22.2178L14.668 22.4932C14.3678 23.393 13.5257 23.9999 12.5771 24H11.4482C10.5921 23.9999 9.80964 23.5158 9.42676 22.75C8.98292 21.8626 8.01192 21.3682 7.0332 21.5312L6 21.7041C5.09973 21.854 4.18247 21.5594 3.53711 20.9141C2.89174 20.2686 2.59806 19.3515 2.74805 18.4512L2.88672 17.6143C3.066 16.5384 2.4726 15.4824 1.45996 15.0771C0.465873 14.6795 -0.127978 13.6537 0.0234375 12.5938L0.167969 11.582C0.33926 10.3836 1.21916 9.40802 2.39355 9.11426L2.90332 8.9873C3.09371 8.93967 3.26746 8.8409 3.40625 8.70215C3.69636 8.41204 3.79757 7.983 3.66797 7.59375L3.00391 5.59961C2.7116 4.72269 3.04242 3.75883 3.81152 3.24609C4.29202 2.92581 4.88509 2.82283 5.44531 2.96289L7.30859 3.42871C8.38861 3.78864 9.53436 3.09846 9.72168 1.97559L9.76367 1.72754C9.92987 0.730694 10.7921 3.81912e-05 11.8027 0H12.1523ZM11.7656 8C9.5565 8.00001 7.76562 9.79087 7.76562 12C7.76562 14.2091 9.5565 16 11.7656 16C13.9748 16 15.7656 14.2091 15.7656 12C15.7656 9.79086 13.9748 8 11.7656 8Z';

function BackArrow({ size }: { size: number }) {
  const h = (size * 19) / 32;
  return (
    <View pointerEvents="none">
      <Svg width={size} height={h} viewBox="0 0 32 19">
        <Path d={ARROW_PATH} fill={colors.purple} />
      </Svg>
    </View>
  );
}

function SettingIcon({ size }: { size: number }) {
  return (
    <View pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={SETTING_PATH} fill={colors.purple} />
      </Svg>
    </View>
  );
}

type ModeCardProps = {
  title: string;
  description: string;
  /** Illustrations Figma : actif quand le mode est sélectionné, inactif sinon. */
  activeXml: string;
  inactiveXml: string;
  onPress: () => void;
  /** Ouvre la fenêtre des règles du mode. */
  onInfo: () => void;
  /** Libellé VoiceOver du bouton info. */
  infoLabel: string;
  selected?: boolean;
  /** Décalage horizontal de l'illustration vers la droite (px). */
  illustrationShift?: number;
  /** Agrandissement de l'illustration (1 = taille Figma). */
  illustrationScale?: number;
};

function ModeCard({ title, description, activeXml, inactiveXml, onPress, onInfo, infoLabel, selected = false, illustrationShift = 0, illustrationScale = 1 }: ModeCardProps) {
  const textColor = selected ? colors.purpleDeep : colors.cream;
  return (
    <Pressable
      style={[styles.modeCard, selected ? styles.modeCardSelected : styles.modeCardBlue]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityState={{ selected, checked: selected }}
    >
      <View style={styles.modeText}>
        <View style={styles.modeTitleRow}>
          <Text style={[styles.modeTitle, { color: textColor }]}>{title}</Text>
          {/* Pressable imbriqué : ouvre les règles sans sélectionner le mode */}
          <Pressable onPress={onInfo} hitSlop={12} accessibilityRole="button" accessibilityLabel={infoLabel}>
            <View style={[styles.infoIcon, { borderColor: textColor }]}>
              <Text style={[styles.infoIconText, { color: textColor }]}>i</Text>
            </View>
          </Pressable>
        </View>
        <Text style={[styles.modeDesc, { color: textColor }]}>{description}</Text>
      </View>
      <View style={[styles.modeIllustration, { transform: [{ translateX: illustrationShift }, { scale: illustrationScale }] }]} pointerEvents="none">
        <SvgXml xml={selected ? activeXml : inactiveXml} width="100%" height="100%" />
      </View>
    </Pressable>
  );
}

export default function GameConfigScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const { mode, setMode } = useGameSettings();
  const { lang } = useLang();
  const t = getT(lang);
  const [rulesMode, setRulesMode] = useState<RulesMode | null>(null);
  // Aucun mode présélectionné : le joueur doit en choisir un avant de continuer
  const [hasPickedMode, setHasPickedMode] = useState(false);
  const pickMode = (next: GameMode) => {
    setHasPickedMode(true);
    setMode(next);
  };

  const toastOpacity = useState(() => new Animated.Value(0))[0];
  const toastTranslateY = useState(() => new Animated.Value(8))[0];
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
  }, []);
  const triggerToast = () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTranslateY.setValue(8);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
    toastTimeout.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(toastTranslateY, { toValue: 8, duration: 250, useNativeDriver: true }),
      ]).start();
    }, 2000);
  };

  // Panneau bleu juste sous l'en-tête (flèche ~21px + offset 14px + marge 20px)
  const panelTop = insets.top + 68;

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        {/* Fond crème + blobs orange */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>

        {/* Panneau bleu */}
        <View style={[styles.bluePanel, { top: panelTop }]}>
          <CreamPatternSvg width={width} height={height - panelTop} opacity={0.04} fill="#ffffff" />
          <ScrollView
            style={styles.panelScroll}
            contentContainerStyle={[styles.panelContent, { paddingBottom: 24 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Modes de jeux */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.gameMode.modesTitle}</Text>
              <View style={styles.modeList} accessibilityRole="radiogroup">
                <ModeCard
                  title={t.gameMode.classic}
                  description={t.gameMode.classicDesc}
                  activeXml={ENCHERE_ACTIF_XML}
                  inactiveXml={ENCHERE_INACTIF_XML}
                  selected={hasPickedMode && mode === 'classique'}
                  onPress={() => pickMode('classique')}
                  onInfo={() => setRulesMode('auction')}
                  infoLabel={`${t.pages.rules} : ${t.gameMode.classic}`}
                />
                <ModeCard
                  title={t.gameMode.charades}
                  description={t.gameMode.survieDesc}
                  activeXml={SURVIE_ACTIF_XML}
                  inactiveXml={SURVIE_INACTIF_XML}
                  illustrationShift={5}
                  illustrationScale={1.1}
                  selected={hasPickedMode && mode === 'survie'}
                  onPress={() => pickMode('survie')}
                  onInfo={() => setRulesMode('survie')}
                  infoLabel={`${t.pages.rules} : ${t.gameMode.charades}`}
                />
              </View>
            </View>

          </ScrollView>

          {/* Continuer — toujours visible, comme sur les autres écrans */}
          <View style={[styles.continuerWrapper, { paddingBottom: Math.max(24, insets.bottom + 16) }]}>
            <Animated.View
              style={[styles.toast, { opacity: toastOpacity, transform: [{ translateY: toastTranslateY }] }]}
              pointerEvents="none"
            >
              <Text style={styles.toastText}>{t.gameMode.pickModeFirst}</Text>
            </Animated.View>
            {/* Reste pressable même inactif : un appui explique pourquoi on ne peut pas continuer */}
            <Pressable
              onPress={hasPickedMode ? () => router.push('/parametres-partie') : triggerToast}
              style={!hasPickedMode && styles.btnInactive}
              accessibilityRole="button"
              accessibilityLabel={t.gameMode.continueBtn}
              accessibilityHint={hasPickedMode ? undefined : t.gameMode.pickModeFirst}
              accessibilityState={{ disabled: !hasPickedMode }}
            >
              <LinearGradient
                colors={['#fb940e', '#f2c512']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnContinuer}
              >
                <Text style={styles.btnContinuerText}>{t.gameMode.continueBtn}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* En-tête : retour + drapeau + paramètres */}
        <View
          style={[
            styles.header,
            { top: insets.top + 14, left: width * 0.06, right: width * 0.06 },
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={10}
          >
            <BackArrow size={Math.min(width * 0.09, 36)} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/reglages')}
            accessibilityRole="button"
            accessibilityLabel="Paramètres"
            hitSlop={10}
          >
            <SettingIcon size={Math.min(width * 0.08, 32)} />
          </Pressable>
        </View>
      </View>

      <ModeRulesModal mode={rulesMode} onClose={() => setRulesMode(null)} />
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
  panelScroll: {
    flex: 1,
  },
  continuerWrapper: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  btnInactive: {
    opacity: 0.4,
  },
  toast: {
    position: 'absolute',
    top: -24,
    alignSelf: 'center',
    backgroundColor: colors.purpleDeep,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.cream,
  },
  panelContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    gap: 48,
  },
  section: {
    gap: 24,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fef1cc',
  },
  modeList: {
    gap: 16,
  },
  // Figma 62:323 : carte pleine largeur, texte à gauche, illustration débordante à droite
  modeCard: {
    borderRadius: 16,
    padding: 24,
    minHeight: 150,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  modeCardSelected: {
    backgroundColor: '#fef9e6',
    // Même bordure (invisible) que l'état inactif : le texte ne bouge pas au changement d'état
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modeCardBlue: {
    backgroundColor: '#4883E5',
    borderWidth: 1,
    borderColor: colors.cream,
  },
  modeText: {
    width: '48%',
    gap: 6,
  },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontFamily: fonts.display,
    fontSize: 13,
    lineHeight: 16,
  },
  modeTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
  },
  modeDesc: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
  },
  modeIllustration: {
    position: 'absolute',
    right: -8,
    bottom: 0,
    width: 184,
    height: 145,
  },
  btnContinuer: {
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
  btnContinuerText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
