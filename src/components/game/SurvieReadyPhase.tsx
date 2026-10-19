import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSubject } from '@/game/answers';
import { survieCurrentQuestion, type SurvieState } from '@/game/survie-engine';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

type Props = {
  state: SurvieState;
  onStart: () => void;
};

export function SurvieReadyPhase({ state, onStart }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const t = getT(lang);
  const question = survieCurrentQuestion(state);
  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();
  const team = state.teams[state.currentTeam];
  const badgeTextColor = BADGE_TEXT_COLOR[team.color] ?? colors.purpleDeep;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom + 20, 36) }]}>
      <View style={styles.topGroup}>
        <View style={styles.roundBadge}>
          <Text style={styles.roundText}>
            {t.ready.round} {state.round + 1}/{state.roundCount}
          </Text>
        </View>

        <View style={styles.teamRow}>
          <View style={[styles.teamBadge, { backgroundColor: team.color }]}>
            <Text style={[styles.teamBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
              {team.name}
            </Text>
          </View>
          <Text style={styles.opensText}>{t.survie.opens}</Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{subject}</Text>
        </View>
      </View>

      <View style={styles.bottomGroup}>
        <Pressable
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel={t.ready.play}
          style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
        >
          <LinearGradient
            colors={['#fb940e', '#f2c512']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.jouerBtn}
          >
            <Text style={styles.jouerText}>{t.ready.play}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    justifyContent: 'space-between',
  },
  topGroup: {
    gap: 28,
  },
  roundBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roundText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: '#fef6d7',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  teamBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  teamBadgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  opensText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: '#fef6d7',
  },
  questionCard: {
    backgroundColor: '#fef1cc',
    borderRadius: 16,
    paddingHorizontal: 16, // même carte question que l'écran des mises (3 lignes max)
    paddingVertical: 20,
  },
  questionText: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.purpleDeep,
    lineHeight: 44,
  },
  bottomGroup: {
    gap: 20,
  },
  jouerBtn: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#a15c03',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  jouerText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: '#fef6d7',
    letterSpacing: 1,
  },
});
