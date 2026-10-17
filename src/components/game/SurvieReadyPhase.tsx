import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { getSubject } from '@/game/answers';
import { survieCurrentQuestion, type SurvieState } from '@/game/survie-engine';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

const BULB_PATH =
  'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z';

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

        <View style={styles.tipCard}>
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path d={BULB_PATH} fill={colors.purpleDeep} />
          </Svg>
          <Text style={styles.tipText}>
            {t.survie.tip}
          </Text>
        </View>
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
  tipCard: {
    backgroundColor: '#fef1cb',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.purpleDeep,
    flex: 1,
    lineHeight: 21,
  },
});
