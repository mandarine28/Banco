import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';

import { Pressable } from '@/components/Pressable';
import { colors, fonts } from '@/theme';

export type SpecialPack = {
  id: string;
  /** Place dans la chaîne des packs offerts (1 = le premier gagné), gardée quel que soit l'ordre d'affichage. */
  rank: number;
  title: string;
  image: ImageSourcePropType;
  /** Gagné ou en essai : se coche comme une catégorie. */
  playable: boolean;
  trial: boolean;
  selected: boolean;
  /** Parties restantes avant de le gagner (inconnu tant que le compteur n'est pas lu). */
  gamesLeft?: number;
};

export type PackTileLabels = {
  trial: string;
  locked: string;
  freeIn: (games: number) => string;
  gamesCount: (games: number) => string;
};

const CHECK_PATH =
  'M12 0C5.37321 0 0 5.37321 0 12C0 18.6268 5.37321 24 12 24C18.6268 24 24 18.6268 24 12C24 5.37321 18.6268 0 12 0ZM17.183 8.08125L11.542 15.9027C11.4631 16.0127 11.3592 16.1024 11.2388 16.1642C11.1184 16.2261 10.9849 16.2584 10.8496 16.2584C10.7142 16.2584 10.5808 16.2261 10.4603 16.1642C10.3399 16.1024 10.236 16.0127 10.1571 15.9027L6.81696 11.2741C6.71518 11.1321 6.81696 10.9339 6.99107 10.9339H8.24732C8.52054 10.9339 8.78036 11.0652 8.94107 11.2902L10.8482 13.9366L15.0589 8.09732C15.2196 7.875 15.4768 7.74107 15.7527 7.74107H17.0089C17.183 7.74107 17.2848 7.93929 17.183 8.08125Z';
const LOCK_PATH =
  'M19.2 0C12.5832 0 7.2 5.71447 7.2 12.7385V20.3815H4.8C3.52696 20.3815 2.30606 20.9184 1.40589 21.8739C0.505713 22.8295 0 24.1255 0 25.4769V45.8585C0 47.2098 0.505713 48.5059 1.40589 49.4614C2.30606 50.417 3.52696 50.9538 4.8 50.9538H33.6C34.873 50.9538 36.0939 50.417 36.9941 49.4614C37.8943 48.5059 38.4 47.2098 38.4 45.8585V25.4769C38.4 24.1255 37.8943 22.8295 36.9941 21.8739C36.0939 20.9184 34.873 20.3815 33.6 20.3815H31.2V12.7385C31.2 5.71447 25.8168 0 19.2 0ZM12 12.7385C12 8.52458 15.2304 5.09538 19.2 5.09538C23.1696 5.09538 26.4 8.52458 26.4 12.7385V20.3815H12V12.7385ZM21.6 40.0574V45.8585H16.8V40.0574C15.9609 39.5473 15.2872 38.7793 14.8676 37.8545C14.448 36.9298 14.3023 35.8918 14.4496 34.8773C14.597 33.8629 15.0305 32.9197 15.693 32.1721C16.3556 31.4245 17.216 30.9076 18.1608 30.6895C18.8626 30.5243 19.5905 30.5285 20.2906 30.7019C20.9907 30.8753 21.6452 31.2134 22.2057 31.6913C22.7662 32.1691 23.2184 32.7745 23.529 33.4628C23.8395 34.151 24.0005 34.9046 24 35.6677C23.9986 36.5587 23.7761 37.4336 23.3547 38.2043C22.9334 38.9749 22.3281 39.6141 21.6 40.0574Z';

/** Pastille « coché » : cercle crème, coche bleu nuit (ressort sur les gélules et vignettes cochées). */
export function CheckBadge({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={11} r={5} fill={colors.purpleDeep} />
      <Path d={CHECK_PATH} fill={colors.cream} />
    </Svg>
  );
}

// Contour d'une vignette cochée : crème → orange, d'un coin au coin opposé
const SELECTED_BORDER = [colors.cream, colors.pink] as const;
const BORDER_WIDTH = 3;

/** Cadenas orange → vert des packs à gagner. */
export function GradientLock({ height }: { height: number }) {
  return (
    <Svg width={(height * 38.4) / 50.9538} height={height} viewBox="0 0 38.4 50.9538">
      <Defs>
        <SvgGradient id="lock" x1="19.2" y1="0" x2="19.2" y2="50.9538" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FB940E" />
          <Stop offset={1} stopColor="#33FF5C" />
        </SvgGradient>
      </Defs>
      <Path d={LOCK_PATH} fill="url(#lock)" />
    </Svg>
  );
}

// Proportions de la maquette (vignette 130 × 100, pastille 24)
const IMAGE_RATIO = 100 / 130;
const CHECK_RATIO = 24 / 130;
const LOCK_HEIGHT = 48;

type Props = {
  pack: SpecialPack;
  width: number;
  labels: PackTileLabels;
  /** Atténuation des packs verrouillés (piste 0.3, grille 0.2) : le cadenas, lui, reste net. */
  lockedOpacity: number;
  onPress: (pack: SpecialPack) => void;
};

/** Vignette d'un pack offert : cochée, en essai ou verrouillée avec les parties restantes. */
export function PackTile({ pack, width, labels, lockedOpacity, onPress }: Props) {
  const imageHeight = Math.round(width * IMAGE_RATIO);
  const checkSize = Math.round(width * CHECK_RATIO);
  const dimmed = !pack.playable && { opacity: lockedOpacity };
  const gamesLeft = !pack.playable && pack.gamesLeft ? pack.gamesLeft : null;
  const freeIn = gamesLeft ? labels.freeIn(gamesLeft) : null;
  return (
    <Pressable
      style={[styles.tile, { width }]}
      onPress={() => onPress(pack)}
      // Dans une liste qui défile : pas de son si le doigt ne fait que la faire glisser
      soundOnRelease
      sound={!pack.playable || pack.selected ? 'tap' : 'correct'}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: pack.selected, disabled: !pack.playable }}
      accessibilityLabel={pack.playable ? pack.title : `${pack.title} — ${labels.locked}${freeIn ? `, ${freeIn}` : ''}`}
    >
      {pack.selected ? (
        <LinearGradient colors={SELECTED_BORDER} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.selectedBorder, { height: imageHeight }]}>
          <View style={styles.selectedInner}>
            <Image source={pack.image} style={styles.image} accessibilityIgnoresInvertColors />
          </View>
        </LinearGradient>
      ) : (
        <View style={[styles.imageFrame, { height: imageHeight }, dimmed]}>
          <Image source={pack.image} style={styles.image} accessibilityIgnoresInvertColors />
        </View>
      )}
      <Text style={[styles.label, dimmed]} numberOfLines={1}>
        {pack.title}
      </Text>
      {pack.trial ? (
        <View style={[styles.pill, styles.trialPill]}>
          <Text style={styles.pillText}>{labels.trial}</Text>
        </View>
      ) : null}
      {!pack.playable ? (
        <View style={[styles.lockLayer, { height: imageHeight }]} pointerEvents="none">
          <GradientLock height={LOCK_HEIGHT} />
          {/* Rappelle qu'on gagne le pack en jouant ; la phrase complète est lue au lecteur d'écran */}
          {gamesLeft ? (
            <View style={[styles.pill, styles.gamesPill]}>
              <MaterialCommunityIcons name="gamepad-variant" size={14} color={colors.cream} />
              <Text style={styles.pillText} numberOfLines={1}>{labels.gamesCount(gamesLeft)}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      {pack.selected ? (
        <View style={[styles.check, { top: -checkSize / 2 - 2, right: -checkSize / 3 }]} pointerEvents="none">
          <CheckBadge size={checkSize} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    gap: 8,
  },
  imageFrame: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedBorder: {
    borderRadius: 12,
    padding: BORDER_WIDTH,
  },
  selectedInner: {
    flex: 1,
    borderRadius: 12 - BORDER_WIDTH,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  lockLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  check: {
    position: 'absolute',
  },
  pill: {
    maxWidth: '92%',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.pink,
  },
  gamesPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trialPill: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  pillText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.cream,
  },
});
