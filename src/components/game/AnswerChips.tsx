import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

const THUMB_MIN_H = 28;

type Props = {
  answers: readonly string[];
  /** Réponses surlignées (crème) ; les autres restent bleues. */
  found: readonly string[];
};

/** Grille des réponses d'une question, avec sa barre de défilement à gauche (écrans de résultat). */
export function AnswerChips({ answers, found }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [contentH, setContentH] = useState(0);
  const [containerH, setContainerH] = useState(0);

  const isScrollable = contentH > containerH + 4;
  const thumbH = isScrollable ? Math.max(THUMB_MIN_H, containerH * (containerH / contentH)) : containerH;
  const scrollProgress = isScrollable ? scrollY / (contentH - containerH) : 0;
  const thumbTop = scrollProgress * (containerH - thumbH);

  return (
    <View style={styles.chipsArea}>
      <View style={styles.scrollTrack} onLayout={(e) => setContainerH(e.nativeEvent.layout.height)}>
        <View style={[styles.scrollThumb, { height: thumbH, top: thumbTop }]} />
      </View>
      <ScrollView
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsGrid}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        onContentSizeChange={(_, h) => setContentH(h)}
      >
        {answers.map((answer) => {
          const isFound = found.includes(answer);
          const label = answer.charAt(0).toUpperCase() + answer.slice(1).toLowerCase();
          return (
            <View key={answer} style={[styles.chip, isFound ? styles.chipFound : styles.chipMissed]}>
              <Text style={[styles.chipLabel, isFound ? styles.chipLabelFound : styles.chipLabelMissed]}>{label}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chipsArea: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
  },
  scrollTrack: {
    width: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollThumb: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  chipsScroll: {
    flex: 1,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 16,
  },
  // Chips — mêmes valeurs que PlayPhase
  chip: {
    borderWidth: 1,
    borderColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipFound: {
    backgroundColor: '#fef1cc',
  },
  chipMissed: {
    backgroundColor: '#4883e5',
  },
  chipLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  chipLabelFound: {
    color: colors.purpleDeep,
  },
  chipLabelMissed: {
    color: colors.cream,
  },
});
