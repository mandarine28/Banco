import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { Pressable } from '@/components/Pressable';
import { colors, fonts } from '@/theme';

type YearMonth = { year: number; month: number };

type Props = {
  /** Mois affiché à l'ouverture (la fenêtre n'est montée que lorsqu'elle est ouverte). */
  value: YearMonth;
  /** Mois d'aujourd'hui : rien après lui n'est jouable, donc pas sélectionnable. */
  latest: YearMonth;
  locale: string;
  labels: { title: string; prev: string; next: string; close: string };
  onPick: (value: YearMonth) => void;
  onClose: () => void;
};

/** Choix rapide d'un mois : année avec flèches, puis les 12 mois ; évite de remonter le calendrier mois par mois. */
export function MonthPicker({ value, latest, locale, labels, onPick, onClose }: Props) {
  const [year, setYear] = useState(value.year);
  const months = Array.from({ length: 12 }, (_, month) => {
    const name = new Date(year, month, 1).toLocaleDateString(locale, { month: 'short' }).replace('.', '');
    return { month, name: name.charAt(0).toUpperCase() + name.slice(1) };
  });
  const canGoNext = year < latest.year;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={labels.close} sound={false} />
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title} accessibilityRole="header">{labels.title}</Text>
          <View style={styles.yearRow}>
            <Pressable onPress={() => setYear((y) => y - 1)} accessibilityRole="button" accessibilityLabel={labels.prev} hitSlop={10}>
              <MaterialCommunityIcons name="chevron-left" size={30} color={colors.cream} />
            </Pressable>
            <Text style={styles.year}>{year}</Text>
            <Pressable
              onPress={() => setYear((y) => y + 1)}
              disabled={!canGoNext}
              accessibilityRole="button"
              accessibilityLabel={labels.next}
              accessibilityState={{ disabled: !canGoNext }}
              hitSlop={10}
              style={!canGoNext && styles.disabled}
            >
              <MaterialCommunityIcons name="chevron-right" size={30} color={colors.cream} />
            </Pressable>
          </View>
          <View style={styles.grid}>
            {months.map(({ month, name }) => {
              const isFuture = year > latest.year || (year === latest.year && month > latest.month);
              const isSelected = year === value.year && month === value.month;
              return (
                <Pressable
                  key={month}
                  onPress={() => onPick({ year, month })}
                  disabled={isFuture}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isFuture, selected: isSelected }}
                  style={[styles.month, isSelected && styles.monthSelected, isFuture && styles.disabled]}
                >
                  <Text style={[styles.monthText, isSelected && styles.monthTextSelected]}>{name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Même voile que les autres fenêtres de l'app
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(5,20,46,0.80)',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    gap: 14,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lavender,
    backgroundColor: colors.purpleDeep,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.cream,
    textAlign: 'center',
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  year: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  month: {
    width: '31%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(254,246,215,0.35)',
  },
  monthSelected: {
    backgroundColor: colors.cream,
    borderColor: colors.cream,
  },
  monthText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  monthTextSelected: {
    fontFamily: fonts.display,
    color: colors.purpleDeep,
  },
  disabled: {
    opacity: 0.3,
  },
});
