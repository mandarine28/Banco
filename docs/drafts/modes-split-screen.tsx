// BROUILLON (2026-11-12) — nouvel écran « Modes de jeu » en deux moitiés (Survie bleu / Enchères orange, éclair crème),
// mis de côté pour la mise à jour App Store suivante. Pour l'activer : remplacer src/app/parametres.tsx par ce fichier.
// Dépend de src/components/modeSplitXml.ts et des clés i18n gameMode.survieChips / auctionChips / playSurvie / playAuction.
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { type ReactNode, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, SvgXml } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { ModeRulesModal, type RulesMode } from '@/components/ModeRules';
import { ENCHERE_SPLIT_XML, SURVIE_SPLIT_XML } from '@/components/modeSplitXml';
import { Pressable } from '@/components/Pressable';
import { Toast, useToast } from '@/components/Toast';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { type GameMode, useGameSettings } from '@/state/gameSettings';
import { useTutorialTarget } from '@/state/tutorial';
import { colors, fonts } from '@/theme';

const MAX_WIDTH = 500;
const NAVY = '#0c2d64';
const ORANGE = '#fb940e';

// Ligne de partage : au repos à mi-hauteur ; le mode choisi gagne de la place, l'éclair glisse vers l'autre
const SPLIT_REST = 0.5;
const SPLIT_SHIFT = 0.035;
// Mode non choisi : estompé
const INACTIVE_OPACITY = 0.5;
// Les deux illustrations ont la même hauteur, proportionnelle à l'écran
const ART_HEIGHT = 0.24;
const SEAM_WIDTH = 10;

/** Éclair de partage, en points relatifs à la ligne (x en fraction de largeur, y en px) : penché, avec un cran au milieu. */
const SEAM: readonly (readonly [number, number])[] = [
  [-0.05, -26],
  [0.5, 4],
  [0.44, -14],
  [1.05, 22],
];

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

const SETTING_PATH =
  'M12.1523 0C12.9816 0 13.7558 0.414588 14.2158 1.10449L15.1445 2.49707C15.7968 3.47551 16.9758 3.96402 18.1289 3.7334L18.4355 3.67188C19.195 3.51999 19.9807 3.75708 20.5283 4.30469L20.624 4.40137C21.2715 5.04885 21.432 6.03842 21.0225 6.85742L20.9902 6.92188C20.6001 7.70222 20.7532 8.64481 21.3701 9.26172C21.5925 9.48412 21.8638 9.65145 22.1621 9.75098L22.2158 9.76953C23.1412 10.078 23.7655 10.9436 23.7656 11.9189V12.7949C23.7655 13.721 23.0961 14.5116 22.1826 14.6641C20.925 14.8737 20.2286 16.2405 20.7988 17.3809L20.9941 17.7705C21.4209 18.6241 21.2529 19.6553 20.5781 20.3301L20.0547 20.8545C19.4148 21.4943 18.4215 21.6159 17.6455 21.1504C16.5637 20.5013 15.1589 21.0211 14.7598 22.2178L14.668 22.4932C14.3678 23.393 13.5257 23.9999 12.5771 24H11.4482C10.5921 23.9999 9.80964 23.5158 9.42676 22.75C8.98292 21.8626 8.01192 21.3682 7.0332 21.5312L6 21.7041C5.09973 21.854 4.18247 21.5594 3.53711 20.9141C2.89174 20.2686 2.59806 19.3515 2.74805 18.4512L2.88672 17.6143C3.066 16.5384 2.4726 15.4824 1.45996 15.0771C0.465873 14.6795 -0.127978 13.6537 0.0234375 12.5938L0.167969 11.582C0.33926 10.3836 1.21916 9.40802 2.39355 9.11426L2.90332 8.9873C3.09371 8.93967 3.26746 8.8409 3.40625 8.70215C3.69636 8.41204 3.79757 7.983 3.66797 7.59375L3.00391 5.59961C2.7116 4.72269 3.04242 3.75883 3.81152 3.24609C4.29202 2.92581 4.88509 2.82283 5.44531 2.96289L7.30859 3.42871C8.38861 3.78864 9.53436 3.09846 9.72168 1.97559L9.76367 1.72754C9.92987 0.730694 10.7921 3.81912e-05 11.8027 0H12.1523ZM11.7656 8C9.5565 8.00001 7.76562 9.79087 7.76562 12C7.76562 14.2091 9.5565 16 11.7656 16C13.9748 16 15.7656 14.2091 15.7656 12C15.7656 9.79086 13.9748 8 11.7656 8Z';

function BackArrow({ size }: { size: number }) {
  const h = (size * 19) / 32;
  return (
    <View pointerEvents="none">
      <Svg width={size} height={h} viewBox="0 0 32 19">
        <Path d={ARROW_PATH} fill={colors.cream} />
      </Svg>
    </View>
  );
}

function SettingIcon({ size }: { size: number }) {
  return (
    <View pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={SETTING_PATH} fill={colors.cream} />
      </Svg>
    </View>
  );
}

type ChipIcon = keyof typeof MaterialCommunityIcons.glyphMap;

type TicketProps = {
  title: string;
  chips: readonly [string, string];
  icons: readonly [ChipIcon, ChipIcon];
  /** Penché à gauche (-) ou à droite (+), en degrés : effet d'autocollant. */
  tilt: number;
  selected: boolean;
  dimmed: boolean;
  onPress: () => void;
  onInfo: () => void;
  infoLabel: string;
  align: 'left' | 'right';
};

/** Ticket du mode : titre sur un autocollant crème penché, pastilles de règles, « i » pour le détail. */
function ModeTicket({ title, chips, icons, tilt, selected, dimmed, onPress, onInfo, infoLabel, align }: TicketProps) {
  const [pop] = useState(() => new Animated.Value(selected ? 1 : 0));
  useEffect(() => {
    Animated.spring(pop, { toValue: selected ? 1 : 0, friction: 5, tension: 180, useNativeDriver: true }).start();
  }, [pop, selected]);
  const stampScale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] });

  return (
    <View style={[styles.ticketBlock, align === 'right' && styles.ticketBlockRight, dimmed && styles.dimmed]}>
      <View style={[styles.ticketRow, align === 'right' && styles.ticketRowRight]}>
        <Pressable
          onPress={onPress}
          accessibilityRole="radio"
          accessibilityLabel={`${title}. ${chips.join(', ')}`}
          accessibilityState={{ selected, checked: selected }}
          style={{ transform: [{ rotate: `${tilt}deg` }] }}
        >
          {/* Ombre pleine décalée, comme les boutons du jeu */}
          <View style={styles.ticketShadow} />
          <View style={styles.ticket}>
            <Text style={styles.ticketText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
              {title.toUpperCase()}
            </Text>
          </View>
          <Animated.View style={[styles.stamp, { opacity: pop, transform: [{ scale: stampScale }] }]} pointerEvents="none">
            <MaterialCommunityIcons name="check-bold" size={16} color={colors.cream} />
          </Animated.View>
        </Pressable>
        <Pressable onPress={onInfo} hitSlop={12} accessibilityRole="button" accessibilityLabel={infoLabel}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>
        </Pressable>
      </View>
      <View style={[styles.chips, align === 'right' && styles.chipsRight]}>
        {chips.map((label, i) => (
          <View key={label} style={styles.chip}>
            <MaterialCommunityIcons name={icons[i]} size={15} color={colors.cream} />
            <Text style={styles.chipText} numberOfLines={1}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Moitié d'écran tappable : toute sa surface choisit le mode. */
function Half({ children, onPress, style }: { children?: ReactNode; onPress: () => void; style: object }) {
  return (
    <Pressable onPress={onPress} accessible={false} style={[StyleSheet.absoluteFill, style]}>
      {children}
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

  const toast = useToast();
  const auctionTarget = useTutorialTarget('mode-auction');
  const survieTarget = useTutorialTarget('mode-survie');

  const survieChosen = hasPickedMode && mode === 'survie';
  const auctionChosen = hasPickedMode && mode === 'classique';

  // Position de l'éclair, animée : la moitié choisie grandit
  const restY = height * SPLIT_REST;
  const targetY = restY + (survieChosen ? 1 : auctionChosen ? -1 : 0) * height * SPLIT_SHIFT;
  const [splitY] = useState(() => new Animated.Value(restY));
  useEffect(() => {
    Animated.spring(splitY, { toValue: targetY, friction: 7, tension: 70, useNativeDriver: true }).start();
  }, [splitY, targetY]);
  // Calque de la moitié basse : deux écrans de haut, l'éclair à y = height, déplacé pour suivre la ligne
  const layerShift = Animated.subtract(splitY, height);

  const seamPath = SEAM.map(([fx, dy], i) => `${i ? 'L' : 'M'}${fx * width},${height + dy}`).join(' ');
  const orangePath = `${seamPath} L${width * 1.05},${height * 2} L${-width * 0.05},${height * 2} Z`;

  const artH = height * ART_HEIGHT;
  const playLabel = survieChosen ? t.gameMode.playSurvie : auctionChosen ? t.gameMode.playAuction : t.gameMode.continueBtn;

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        {/* Moitié haute : Survie, sur le bleu */}
        <Half onPress={() => pickMode('survie')} style={styles.survieHalf}>
          <CreamPatternSvg width={width} height={height} opacity={0.04} fill="#ffffff" />
          <View
            pointerEvents="none"
            style={[styles.survieArt, { top: insets.top + 96, height: artH, width: (artH * 285.7) / 239.4 }, auctionChosen && styles.dimmed]}
          >
            <SvgXml xml={SURVIE_SPLIT_XML} width="100%" height="100%" />
          </View>
        </Half>

        {/* Moitié basse : Enchères, sur l'orange ; tout le calque suit l'éclair */}
        <Animated.View
          pointerEvents="box-none"
          style={[styles.lowerLayer, { height: height * 2, transform: [{ translateY: layerShift }] }]}
        >
          <Svg width={width} height={height * 2} style={StyleSheet.absoluteFill} pointerEvents="none">
            <Path d={orangePath} fill={ORANGE} />
            <Path d={seamPath} stroke={colors.cream} strokeWidth={SEAM_WIDTH} strokeLinejoin="round" fill="none" />
          </Svg>
          {/* Zone tappable de l'orange, sous l'éclair */}
          <Pressable
            onPress={() => pickMode('classique')}
            accessible={false}
            style={[styles.auctionHit, { top: height + 24, height }]}
          />
          {/* Ticket Survie : au-dessus de l'éclair */}
          <View ref={survieTarget} collapsable={false} style={[styles.survieTicket, { bottom: height + 44 }]}>
            <ModeTicket
              title={t.gameMode.charades}
              chips={t.gameMode.survieChips}
              icons={['account-switch', 'timer-sand']}
              tilt={-4}
              selected={survieChosen}
              dimmed={auctionChosen}
              onPress={() => pickMode('survie')}
              onInfo={() => setRulesMode('survie')}
              infoLabel={`${t.pages.rules} : ${t.gameMode.charades}`}
              align="left"
            />
          </View>
          {/* Ticket Enchères : sous l'éclair, à droite */}
          <View ref={auctionTarget} collapsable={false} style={[styles.auctionTicket, { top: height + 52 }]}>
            <ModeTicket
              title={t.gameMode.classic}
              chips={t.gameMode.auctionChips}
              icons={['cash-multiple', 'timer-outline']}
              tilt={4}
              selected={auctionChosen}
              dimmed={survieChosen}
              onPress={() => pickMode('classique')}
              onInfo={() => setRulesMode('auction')}
              infoLabel={`${t.pages.rules} : ${t.gameMode.classic}`}
              align="right"
            />
          </View>
        </Animated.View>

        {/* Mascotte Enchères : accoudée à la table, en bas à gauche */}
        <View
          pointerEvents="none"
          style={[styles.auctionArt, { height: artH * 1.1, width: (artH * 1.1 * 333.4) / 264.2, left: -width * 0.09 }, survieChosen && styles.dimmed]}
        >
          <SvgXml xml={ENCHERE_SPLIT_XML} width="100%" height="100%" />
        </View>

        <Text style={[styles.sectionTitle, { top: insets.top + 60 }]} pointerEvents="none">
          {t.gameMode.modesTitle}
        </Text>

        {/* Bouton crème : ressort sur l'orange et dit quel mode on lance */}
        <View style={[styles.continuerWrapper, { paddingBottom: Math.max(24, insets.bottom + 16) }]} pointerEvents="box-none">
          <Toast toast={toast} message={t.gameMode.pickModeFirst} />
          {/* Reste pressable même inactif : un appui explique pourquoi on ne peut pas continuer */}
          <Pressable
            onPress={hasPickedMode ? () => router.push('/parametres-partie') : toast.show}
            accessibilityRole="button"
            accessibilityLabel={playLabel}
            accessibilityHint={hasPickedMode ? undefined : t.gameMode.pickModeFirst}
            accessibilityState={{ disabled: !hasPickedMode }}
          >
            <View style={styles.btnPlay}>
              <Text style={[styles.btnPlayText, !hasPickedMode && styles.btnPlayTextInactive]} numberOfLines={1} adjustsFontSizeToFit>{playLabel}</Text>
            </View>
          </Pressable>
        </View>

        {/* En-tête : retour + paramètres */}
        <View style={[styles.header, { top: insets.top + 14, left: width * 0.06, right: width * 0.06 }]}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={t.comingSoon.back} hitSlop={10}>
            <BackArrow size={Math.min(width * 0.09, 36)} />
          </Pressable>
          <Pressable onPress={() => router.push('/reglages')} accessibilityRole="button" accessibilityLabel={t.pages.settings} hitSlop={10}>
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
    backgroundColor: colors.purple,
  },
  screen: {
    overflow: 'hidden',
    backgroundColor: colors.purple,
  },
  survieHalf: {
    backgroundColor: colors.purple,
  },
  survieArt: {
    position: 'absolute',
    right: 4,
  },
  lowerLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  auctionHit: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  survieTicket: {
    position: 'absolute',
    left: 24,
    right: 24,
  },
  auctionTicket: {
    position: 'absolute',
    left: 24,
    right: 24,
  },
  auctionArt: {
    position: 'absolute',
    bottom: 0,
  },
  dimmed: {
    opacity: INACTIVE_OPACITY,
  },
  sectionTitle: {
    position: 'absolute',
    left: 24,
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fef1cc',
  },
  ticketBlock: {
    alignItems: 'flex-start',
    gap: 12,
  },
  ticketBlockRight: {
    alignItems: 'flex-end',
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ticketRowRight: {
    flexDirection: 'row-reverse',
  },
  ticketShadow: {
    ...StyleSheet.absoluteFill,
    top: 4,
    left: -3,
    right: 3,
    bottom: -4,
    borderRadius: 10,
    backgroundColor: NAVY,
  },
  ticket: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: NAVY,
    backgroundColor: colors.cream,
  },
  ticketText: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: NAVY,
  },
  // Tampon « choisi » au coin du ticket
  stamp: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.cream,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipsRight: {
    justifyContent: 'flex-end',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(12,45,100,0.45)',
  },
  chipText: {
    fontFamily: fonts.displayMedium,
    fontSize: 13,
    color: colors.cream,
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontFamily: fonts.display,
    fontSize: 13,
    lineHeight: 16,
    color: colors.cream,
  },
  continuerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
  },

  btnPlay: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: NAVY,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NAVY,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  btnPlayText: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: NAVY,
  },
  // Aucun mode choisi : bouton plein (la mascotte ne transparaît pas), seul le texte s'estompe
  btnPlayTextInactive: {
    opacity: 0.4,
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
