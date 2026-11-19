import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Pressable } from '@/components/Pressable';
import { colors, fonts } from '@/theme';

import type { DailySort } from './DailyHistoryList';

type Props = {
  value: DailySort;
  onChange: (value: DailySort) => void;
  labels: { filter: string; date: string; score: string };
};

const OPTIONS: DailySort[] = ['date', 'score'];

/** Bouton « Filtrer » (icône + libellé) qui déroule le choix du tri : Date ou Réussite. */
export function SortMenu({ value, onChange, labels }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        hitSlop={10}
        style={styles.trigger}
      >
        <MaterialCommunityIcons name="filter-variant" size={20} color={colors.cream} />
        <Text style={styles.triggerText}>{labels.filter}</Text>
      </Pressable>
      {open ? (
        <View style={styles.menu} accessibilityRole="menu">
          {OPTIONS.map((option) => {
            const isSelected = option === value;
            return (
              <Pressable
                key={option}
                onPress={() => {
                  onChange(option);
                  setOpen(false);
                }}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: isSelected }}
                style={styles.item}
              >
                <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>{option === 'date' ? labels.date : labels.score}</Text>
                {isSelected ? <MaterialCommunityIcons name="check" size={18} color={colors.purpleDeep} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  triggerText: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.cream,
  },
  // Sous le bouton, aligné à droite, par-dessus la liste
  menu: {
    position: 'absolute',
    top: 30,
    right: 0,
    minWidth: 150,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.cream,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  itemText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.purpleDeep,
  },
  itemTextSelected: {
    fontFamily: fonts.display,
  },
});
