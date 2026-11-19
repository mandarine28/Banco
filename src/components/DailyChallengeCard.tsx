import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Pressable } from '@/components/Pressable';
import { themeLabel } from '@/data/themes';
import { dailyQuestion } from '@/lib/dailyQuestion';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { type DailyRecord, dayKey, nextStreak } from '@/lib/solo';
import { loadDailyRecord } from '@/lib/soloStorage';
import { colors, fonts } from '@/theme';

/** Hauteur de la carte : l'accueil la réserve pour centrer le logo au-dessus du panneau. */
export const DAILY_CARD_HEIGHT = 60;

/** Défi du jour sur l'accueil : catégorie et série à jouer, ou score une fois joué. */
export function DailyChallengeCard() {
  const { lang } = useLang();
  const d = getT(lang).daily;
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const today = dayKey(new Date());
  // Relu à chaque retour sur l'accueil : la carte passe à « joué » juste après le défi
  useFocusEffect(
    useCallback(() => {
      loadDailyRecord().then(setRecord);
    }, []),
  );

  const played = record?.day === today;
  const streak = record ? nextStreak(record, today) : 1;
  // Série encore vivante (défi joué hier) : on la montre pour donner envie de la prolonger
  const streakAlive = record !== null && !played && streak > 1;
  const subtitle = played
    ? d.cardPlayed(record.score)
    : `${themeLabel(dailyQuestion(today).theme, lang)}${streakAlive ? ` · 🔥 ${d.cardStreak(record.streak)}` : ''}`;

  return (
    <Pressable
      // Joué : le suivi des défis ; sinon le défi du jour
      onPress={() => router.push(played ? '/defis' : '/solo?daily=1')}
      accessibilityRole="button"
      accessibilityLabel={`${d.title}, ${subtitle}`}
      style={[styles.card, played ? styles.cardPlayed : styles.cardToPlay]}
    >
      <View style={[styles.icon, played && styles.iconPlayed]}>
        <MaterialCommunityIcons name={played ? 'check-bold' : 'fire'} size={22} color={colors.cream} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>{played ? d.titleDone : d.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={26} color={colors.purpleDeep} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: DAILY_CARD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    // Sur le fond crème de l'accueil : même carte que le bouton Boutique
    backgroundColor: '#fffbf5',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  // À jouer : contour orange des actions ; joué : contour bleu nuit, comme Boutique
  cardToPlay: {
    borderColor: '#fb940e',
    shadowColor: '#a15c03',
  },
  cardPlayed: {
    borderColor: colors.purpleDeep,
    shadowColor: colors.purpleDeep,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fb940e',
  },
  iconPlayed: {
    backgroundColor: colors.purple,
  },
  texts: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  subtitle: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.purpleDeep,
    opacity: 0.75,
  },
});
