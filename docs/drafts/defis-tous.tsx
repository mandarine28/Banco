// Mis de côté le 2026-11-19 : écran « Voir tout » des défis (thèmes les mieux réussis + liste). À remettre dans src/app/ et rebrancher depuis defis.tsx (SectionTitle action).
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { type ComponentProps, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { DailyHistoryList } from '@/components/daily/DailyHistoryList';
import { DailyPage, SectionTitle } from '@/components/daily/DailyPage';
import { scoreOf, useDailyHistory } from '@/components/daily/useDailyHistory';
import { questions } from '@/data/questions';
import { themeById, themeLabel } from '@/data/themes';
import { themeRanking } from '@/lib/dailyStats';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts, teamColors } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** « Voir tout » des défis : thèmes les mieux réussis en cartes, puis tous les défis joués. */
export default function AllDailyChallengesScreen() {
  const { lang } = useLang();
  const t = getT(lang);
  const d = t.daily;
  const { history } = useDailyHistory(lang);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const ranking = themeRanking(history, (entry) => questions.find((q) => q.id === entry.questionId)?.theme, scoreOf);

  return (
    <DailyPage title={d.allTitle} backLabel={t.comingSoon.back}>
      {ranking.length > 0 ? (
        <>
          <SectionTitle title={d.bestThemes} />
          {/* Cartes qui débordent du panneau : on fait défiler sur toute la largeur */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll} contentContainerStyle={styles.cards}>
            {ranking.map((stat, i) => (
              <View key={stat.theme} style={[styles.themeCard, { backgroundColor: teamColors[i % teamColors.length] }]}>
                <View style={styles.themeIcon}>
                  <MaterialCommunityIcons name={(themeById(stat.theme)?.icon ?? 'star') as IconName} size={26} color={colors.purpleDeep} />
                </View>
                <Text style={styles.themeName} numberOfLines={2}>{themeLabel(stat.theme, lang)}</Text>
                <Text style={styles.themeMeta}>{d.themeCount(stat.count)}</Text>
                <Text style={styles.themeMeta}>{d.average(stat.average)}</Text>
              </View>
            ))}
          </ScrollView>
        </>
      ) : null}

      <SectionTitle title={d.recentTitle} />
      {history.length === 0 ? <Text style={styles.empty}>{d.empty}</Text> : null}
      <DailyHistoryList entries={history} lang={lang} openDay={openDay} onToggle={(day) => setOpenDay((c) => (c === day ? null : day))} />
    </DailyPage>
  );
}

const styles = StyleSheet.create({
  cardsScroll: {
    marginHorizontal: -24,
  },
  cards: {
    gap: 12,
    paddingHorizontal: 24,
  },
  themeCard: {
    width: 140,
    minHeight: 170,
    gap: 6,
    padding: 14,
    borderRadius: 22,
  },
  themeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginBottom: 4,
  },
  themeName: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 21,
    color: colors.purpleDeep,
  },
  themeMeta: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
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
