import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { type ReactNode, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedFlame } from '@/components/AnimatedFlame';
import { DailyCalendar } from '@/components/daily/DailyCalendar';
import { DailyDayModal } from '@/components/daily/DailyDayModal';
import { DailyHistoryList, type DailySort } from '@/components/daily/DailyHistoryList';
import { DailyPage, SectionTitle } from '@/components/daily/DailyPage';
import { SortMenu } from '@/components/daily/SortMenu';
import { useDailyHistory } from '@/components/daily/useDailyHistory';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts, teamColors } from '@/theme';

const SECTION_SPACING = 16;
// Exactement le bleu et le jaune des équipes (le texte bleu nuit y dépasse déjà 7:1, comme sur le cadran du chrono)
const STREAK_COLOR = teamColors[2];
const BEST_COLOR = teamColors[0];
const STAT_ICON = 44;

/** Suivi des défis du jour : série et meilleur score, calendrier des défis joués, puis tous les défis réalisés (triables date / réussite). */
export default function DailyHistoryScreen() {
  const { lang } = useLang();
  const t = getT(lang);
  const d = t.daily;
  const { today, history, streak, best, firstDay, possible } = useDailyHistory(lang);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<DailySort>('date');
  // Jour touché dans le calendrier : son défi s'ouvre en fenêtre
  const [calendarDay, setCalendarDay] = useState<string | null>(null);
  const toggle = (day: string) => setOpenDay((current) => (current === day ? null : day));

  return (
    <DailyPage title={d.historyTitle} backLabel={t.comingSoon.back}>
      <View style={styles.stats}>
        {/* Flamme vive : contour orange brûlé pour le contraste sur le bleu clair, corps orange et cœur jaune qui scintille */}
        <StatCard color={STREAK_COLOR} label={d.streak} value={streak} icon={<AnimatedFlame size={STAT_ICON} vivid />} />
        <StatCard color={BEST_COLOR} label={d.best} value={best} icon={<MaterialCommunityIcons name="trophy" size={STAT_ICON - 4} color={colors.purpleDeep} />} />
      </View>

      <View style={styles.calendar}>
        <DailyCalendar
          entries={history}
          locale={d.locale}
          today={today}
          firstDay={firstDay}
          selectedDay={calendarDay}
          onSelectDay={(day) => setCalendarDay((current) => (current === day ? null : day))}
          labels={{ prev: d.prevPeriod, next: d.nextPeriod, monthView: d.monthView, weeksView: d.weeksView, pickMonth: d.pickMonth, close: t.shop.close }}
        />
      </View>
      {/* Défi du jour touché : en fenêtre par-dessus le calendrier, la page ne s'allonge pas */}
      <DailyDayModal day={calendarDay} entries={history} lang={lang} onChangeDay={setCalendarDay} onClose={() => setCalendarDay(null)} />

      {history.length === 0 ? (
        <Text style={styles.empty}>{d.empty}</Text>
      ) : (
        <>
          {/* Défis réalisés sur ceux possibles depuis l'installation */}
          <SectionTitle title={d.recentTitle} detail={`${history.length}/${possible}`} detailLabel={`${d.played} : ${history.length} / ${possible}`}>
            {history.length > 1 ? (
              <SortMenu value={sortBy} onChange={setSortBy} labels={{ filter: d.filter, date: d.sortDate, score: d.sortScore }} />
            ) : null}
          </SectionTitle>
          <DailyHistoryList entries={history} lang={lang} sortBy={sortBy} openDay={openDay} onToggle={toggle} />
        </>
      )}
    </DailyPage>
  );
}

/** Chiffre et libellé à gauche, grande icône à droite, sans pastille. */
function StatCard({ color, label, value, icon }: { color: string; label: string; value: number; icon: ReactNode }) {
  return (
    <View style={[styles.stat, { backgroundColor: color }]} accessible accessibilityLabel={`${label} : ${value}`}>
      <View style={styles.statTexts}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel} numberOfLines={2}>{label}</Text>
      </View>
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  // Marge sous les cartes et sous le calendrier : trois blocs bien séparés (cartes, agenda, défis réalisés)
  stats: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: SECTION_SPACING,
  },
  calendar: {
    marginBottom: SECTION_SPACING,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 22,
  },
  statTexts: {
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    color: colors.purpleDeep,
  },
  statLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    lineHeight: 17,
    color: colors.purpleDeep,
  },
  empty: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    lineHeight: 24,
    color: colors.cream,
    textAlign: 'center',
  },
});
