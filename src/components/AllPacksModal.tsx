import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Modal, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type PackTileLabels, PackTile, type SpecialPack } from '@/components/PackTile';
import { Pressable } from '@/components/Pressable';
import { colors, fonts } from '@/theme';

type Props = {
  visible: boolean;
  title: string;
  closeLabel: string;
  /** Rappel du principe : on gagne les packs en jouant. */
  howTo: string;
  labels: PackTileLabels;
  packs: SpecialPack[];
  onPackPress: (pack: SpecialPack) => void;
  onClose: () => void;
  /** « Tout sélectionner » des packs jouables (absent s'il n'y en a aucun). */
  selectAll?: ReactNode;
  /** Fenêtre ouverte par-dessus (pack verrouillé) : rendue ici pour s'empiler correctement. */
  children?: ReactNode;
};

const MAX_CARD_WIDTH = 420;
const COLUMN_GAP = 24;
const PADDING = 16;
// Maquette : halo vert en bas, bleu nuit en haut
const CARD_GRADIENT = ['#0c2d64', '#114563', '#155d62', '#1e8c60'] as const;
const CARD_GRADIENT_STOPS = [0, 0.25, 0.5, 1] as const;

/** Tous les packs offerts d'un coup d'œil, en grille, sur fond assombri. */
export function AllPacksModal({ visible, title, closeLabel, howTo, labels, packs, onPackPress, onClose, selectAll, children }: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cardWidth = Math.min(width - 28, MAX_CARD_WIDTH);
  const tileWidth = Math.floor((cardWidth - PADDING * 2 - COLUMN_GAP) / 2);
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={[styles.backdrop, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={closeLabel} />
        <LinearGradient colors={CARD_GRADIENT} locations={CARD_GRADIENT_STOPS} style={[styles.card, { width: cardWidth }]}>
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">{title}</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel={closeLabel}>
              <Text style={styles.close}>{closeLabel}</Text>
            </Pressable>
          </View>
          <Text style={styles.howTo}>{howTo}</Text>
          {selectAll ? <View style={styles.selectAll}>{selectAll}</View> : null}
          <ScrollView style={styles.gridScroll} contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
            {packs.map((pack) => (
              <PackTile key={pack.id} pack={pack} width={tileWidth} labels={labels} lockedOpacity={0.2} onPress={onPackPress} />
            ))}
          </ScrollView>
        </LinearGradient>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Bien plus sombre que les autres fenêtres : la grille doit ressortir sur l'écran
  backdrop: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(2,8,20,0.88)',
  },
  card: {
    flexShrink: 1,
    padding: PADDING,
    gap: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  close: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
    textDecorationLine: 'underline',
    textTransform: 'lowercase',
  },
  selectAll: {
    alignItems: 'flex-end',
  },
  howTo: {
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    color: colors.cream,
    opacity: 0.85,
  },
  // S'étend sous la marge de la carte : la pastille « coché » de la 2e colonne n'est pas rognée
  gridScroll: {
    marginHorizontal: -PADDING,
  },
  // Place pour la pastille « coché » qui dépasse au-dessus de la première rangée
  grid: {
    paddingHorizontal: PADDING,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: COLUMN_GAP,
    rowGap: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
});
