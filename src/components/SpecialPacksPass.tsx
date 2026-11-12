import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { type PackTileLabels, PackTile, type SpecialPack } from '@/components/PackTile';
import { Pressable } from '@/components/Pressable';
import { colors, fonts } from '@/theme';

type Props = {
  title: string;
  seeAllLabel: string;
  labels: PackTileLabels;
  packs: SpecialPack[];
  onPackPress: (pack: SpecialPack) => void;
  onSeeAll: () => void;
  /** « Tout sélectionner » des packs jouables (absent s'il n'y en a aucun). */
  selectAll?: ReactNode;
};

const TILE_WIDTH = 130;
const TILE_GAP = 16;
const NODE_SIZE = 32;
// Vert « gagné » et gris-vert « à gagner » de la maquette
const GREEN = { light: '#0efb84', end: '#33ff5c', line: '#00d62b' } as const;
// Maquette : bleu nuit → #33ff5c sur toute la piste ; seule sa première moitié tient à l'écran
export const CARD_GRADIENT_END = '#1e8c60';
const GREY = { node: '#6c9d84', line: '#56815e', lineLight: '#568164' } as const;

/** Packs offerts sur une piste numérotée : la ligne verte avance au fil des packs gagnés. */
export function SpecialPacksPass({ title, seeAllLabel, labels, packs, onPackPress, onSeeAll, selectAll }: Props) {
  // Tout est gagné (un essai ne compte pas) : la progression n'a plus rien à montrer
  const showProgress = !packs.every((pack) => pack.playable && !pack.trial);
  return (
    <LinearGradient colors={[colors.purpleDeep, CARD_GRADIENT_END]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.card}>
      <View style={styles.header}>
        {/* Le titre ouvre la grille de tous les packs */}
        <Pressable onPress={onSeeAll} hitSlop={12} accessibilityRole="button" accessibilityLabel={`${title} — ${seeAllLabel}`} style={styles.titleButton}>
          <Text style={styles.title}>{title}</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.cream} style={styles.chevron} />
        </Pressable>
        {/* Rien de débloqué : pas de « Tout sélectionner », un lien « Tout voir » à la place */}
        {selectAll ?? (
          <Pressable onPress={onSeeAll} hitSlop={12} accessibilityRole="button" accessibilityLabel={seeAllLabel}>
            <Text style={styles.seeAll}>{seeAllLabel}</Text>
          </Pressable>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.track, !showProgress && styles.trackNoProgress]}>
        {packs.map((pack, i) => (
          <View key={pack.id} style={styles.column}>
            {/* Trait depuis le pack précédent : vert quand ce pack est atteint */}
            {showProgress && i > 0 ? (
              <View style={styles.link} pointerEvents="none">
                <View style={[styles.linkTop, { backgroundColor: pack.playable ? GREEN.line : GREY.line }]} />
                <View style={[styles.linkBottom, { backgroundColor: pack.playable ? GREEN.light : GREY.lineLight }]} />
              </View>
            ) : null}
            {showProgress ? (
            <View style={styles.nodeWrap}>
              {pack.playable ? (
                <LinearGradient colors={[GREEN.light, GREEN.end]} style={styles.node}>
                  <Text style={styles.nodeText}>{pack.rank}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.node, { backgroundColor: GREY.node }]}>
                  <Text style={styles.nodeText}>{pack.rank}</Text>
                </View>
              )}
            </View>
            ) : null}
            <PackTile pack={pack} width={TILE_WIDTH} labels={labels} lockedOpacity={0.3} onPress={onPackPress} />
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Déborde à droite de l'écran : invite à faire défiler la piste
  card: {
    marginRight: -24,
    paddingVertical: 16,
    paddingLeft: 16,
    gap: 12,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 21,
  },
  // Centrée sur les minuscules du titre, pas sur la hauteur de ligne (la police a un haut de ligne généreux)
  chevron: {
    marginTop: 3,
  },
  seeAll: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
    textDecorationLine: 'underline',
  },
  titleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  track: {
    gap: TILE_GAP,
    paddingRight: 16,
    // Laisse dépasser les pastilles numérotées au-dessus de la piste
    paddingTop: 4,
  },
  // Sans pastilles numérotées : place pour la coche qui dépasse au-dessus des vignettes
  trackNoProgress: {
    paddingTop: 14,
  },
  column: {
    width: TILE_WIDTH,
    alignItems: 'center',
    gap: 18,
  },
  // Part du bord de la pastille précédente (dessinée avant : le trait passerait dessus) jusque sous celle-ci
  link: {
    position: 'absolute',
    top: 7,
    left: NODE_SIZE / 2 - TILE_WIDTH / 2 - TILE_GAP,
    width: TILE_WIDTH + TILE_GAP - NODE_SIZE / 2,
  },
  linkTop: {
    height: 2,
  },
  linkBottom: {
    height: 3,
  },
  nodeWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.purpleDeep,
  },
});
