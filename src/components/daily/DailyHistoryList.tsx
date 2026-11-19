import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Pressable } from '@/components/Pressable';
import { questions } from '@/data/questions';
import { themeLabel } from '@/data/themes';
import { getSubject } from '@/game/answers';
import { getT, type Lang } from '@/lib/i18n';
import type { DailyHistoryEntry } from '@/lib/soloStorage';
import { colors, fonts } from '@/theme';

import { scoreOf } from './useDailyHistory';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
const date = (day: string, locale: string, options: Intl.DateTimeFormatOptions) =>
  new Date(`${day}T12:00:00`).toLocaleDateString(locale, options);

export type DailySort = 'date' | 'score';

type Props = {
  entries: DailyHistoryEntry[];
  lang: Lang;
  /** Tri choisi dans le menu « Filtrer » de l'écran. */
  sortBy?: DailySort;
  /** Fenêtre d'un jour du calendrier : ni flèche de volet ni catégorie. */
  inModal?: boolean;
  openDay: string | null;
  onToggle: (day: string) => void;
};

/** Défis joués, triés par date ou réussite ; chaque carte est un volet qui dévoile date, catégorie et réponses. */
export function DailyHistoryList({ entries, lang, sortBy = 'date', inModal = false, openDay, onToggle }: Props) {
  const d = getT(lang).daily;
  const sorted = [...entries].sort((a, b) => (sortBy === 'score' ? scoreOf(b) - scoreOf(a) || b.day.localeCompare(a.day) : b.day.localeCompare(a.day)));

  return (
    <View style={[styles.list, inModal && styles.fill]}>
      {sorted.map((entry) => {
        const question = questions.find((q) => q.id === entry.questionId);
        const subject = question ? capitalize(getSubject(question, lang)) : '';
        const isOpen = openDay === entry.day;
        const score = scoreOf(entry);
        return (
          <Pressable
            key={entry.day}
            onPress={() => onToggle(entry.day)}
            // Fenêtre : la carte n'est plus un volet, rien à toucher (ni son)
            disabled={inModal}
            accessibilityRole="button"
            accessibilityState={{ expanded: isOpen }}
            style={[styles.card, inModal && styles.fill]}
          >
            <View style={styles.cardHeader}>
              {/* Pavé date blanc, comme les jours joués du calendrier */}
              <View style={[styles.dateBlock, { backgroundColor: colors.white }]}>
                <Text style={styles.dateDay}>{Number(entry.day.slice(8, 10))}</Text>
                <Text style={styles.dateMonth}>{date(entry.day, d.locale, { month: 'short' }).replace('.', '')}</Text>
              </View>
              <View style={styles.texts}>
                <Text style={styles.subject} numberOfLines={inModal ? 3 : isOpen ? undefined : 2}>{subject}</Text>
                {question && !inModal ? <Text style={styles.meta} numberOfLines={1}>{themeLabel(question.theme, lang)}</Text> : null}
              </View>
              {/* Fenêtre : le score est déjà sur la ligne de la date */}
              {inModal ? null : (
                <View style={styles.score}>
                  <Text style={styles.scoreText}>{score}</Text>
                </View>
              )}
              {inModal ? null : <MaterialCommunityIcons name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} color={colors.cream} />}
            </View>
            {isOpen ? (
              <View style={[styles.details, inModal && styles.fill]}>
                <Text style={styles.meta}>
                  {capitalize(date(entry.day, d.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))} · <Text style={styles.scoreInline}>{score} / {entry.total}</Text>
                </Text>
                {entry.found.length > 0 ? (
                  // Fenêtre de taille fixe : les réponses défilent au lieu de l'agrandir
                  <ScrollView style={inModal && styles.fill} scrollEnabled={inModal} contentContainerStyle={styles.chips}>
                    {entry.found.map((answer) => (
                      <View key={answer} style={styles.chip}>
                        <Text style={styles.chipText}>{capitalize(answer)}</Text>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.none}>{entry.score ? d.notSaved : d.noneFound}</Text>
                )}
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  fill: {
    flex: 1,
  },
  card: {
    gap: 10,
    padding: 12,
    borderRadius: 18,
    // Bleu nuit : le pavé date blanc se détache de la carte
    backgroundColor: colors.purpleDeep,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateBlock: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 22,
    color: colors.purpleDeep,
  },
  dateMonth: {
    fontFamily: fonts.displayMedium,
    fontSize: 13,
    color: colors.purpleDeep,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  subject: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 21,
    color: colors.cream,
  },
  meta: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.lavender,
  },
  score: {
    minWidth: 36,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.cream,
  },
  scoreText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.purpleDeep,
  },
  // Jaune de la charte : bien lisible sur le bleu nuit de la carte
  scoreInline: {
    fontFamily: fonts.display,
    color: colors.yellow,
  },
  details: {
    gap: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  // Réponses trouvées : mêmes pastilles que les réponses trouvées en jeu (AnswerChips)
  chip: {
    borderWidth: 1,
    borderColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fef1cc',
  },
  chipText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  none: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.cream,
    opacity: 0.7,
  },
});
