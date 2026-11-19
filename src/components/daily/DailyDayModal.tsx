import { Modal, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Pressable } from '@/components/Pressable';
import type { Lang } from '@/lib/i18n';
import { getT } from '@/lib/i18n';
import type { DailyHistoryEntry } from '@/lib/soloStorage';
import { colors, fonts } from '@/theme';

import { DailyHistoryList } from './DailyHistoryList';

type Props = {
  /** Jour ouvert (null = fenêtre fermée). */
  day: string | null;
  entries: DailyHistoryEntry[];
  lang: Lang;
  onChangeDay: (day: string) => void;
  onClose: () => void;
};

const ARROW_SIZE = 36;
// Même taille pour tous les jours, quel que soit le nombre de réponses (elles défilent)
const CARD_MAX_HEIGHT = 300;
const CARD_SCREEN_SHARE = 0.4;

/** Défi d'un jour du calendrier, par-dessus l'écran ; flèches vers le défi joué précédent / suivant (comme les packs offerts). */
export function DailyDayModal({ day, entries, lang, onChangeDay, onClose }: Props) {
  const t = getT(lang);
  const { height: screenHeight } = useWindowDimensions();
  const cardHeight = Math.min(CARD_MAX_HEIGHT, screenHeight * CARD_SCREEN_SHARE);
  // Ordre chronologique : la flèche gauche remonte le temps
  const days = entries.map((entry) => entry.day).sort();
  const position = day ? days.indexOf(day) : -1;
  const entry = entries.find((e) => e.day === day);

  const arrow = (step: -1 | 1) => {
    const target = days[position + step];
    // Pas de boucle : au premier ou au dernier défi joué, la flèche disparaît
    if (position < 0 || !target) return null;
    const label = new Date(`${target}T12:00:00`).toLocaleDateString(t.daily.locale, { day: 'numeric', month: 'long' });
    return (
      <Pressable
        style={[styles.arrow, step < 0 ? styles.arrowLeft : styles.arrowRight]}
        onPress={() => onChangeDay(target)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Svg width={12} height={18} viewBox="0 0 12 18">
          <Path d={step < 0 ? 'M9.5 2L3 9l6.5 7' : 'M2.5 2L9 9l-6.5 7'} stroke={colors.purpleDeep} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      </Pressable>
    );
  };

  return (
    <Modal visible={entry !== undefined} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t.shop.close} />
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={{ height: cardHeight }}>
            {entry ? <DailyHistoryList entries={[entry]} lang={lang} openDay={entry.day} onToggle={() => {}} inModal /> : null}
            {arrow(-1)}
            {arrow(1)}
          </View>
          <Pressable style={styles.closeBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel={t.shop.close}>
            <Text style={styles.closeText}>{t.shop.close}</Text>
          </Pressable>
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
  sheet: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  // À cheval sur le bord de la carte, comme dans la fenêtre des packs offerts
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -ARROW_SIZE / 2,
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  arrowLeft: {
    left: -ARROW_SIZE / 2,
  },
  arrowRight: {
    right: -ARROW_SIZE / 2,
  },
  closeBtn: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.cream,
  },
  closeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.cream,
  },
});
