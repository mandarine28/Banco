import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSubject } from '@/game/answers';
import { survieCurrentQuestion, type SurvieState } from '@/game/survie-engine';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';
import { CategoryBadge } from './CategoryBadge';

type Props = {
  state: SurvieState;
  onStart: () => void;
  /** Au moins 2 catégories choisies : on rappelle celle de la question. */
  showCategory?: boolean;
};

export function SurvieReadyPhase({ state, onStart, showCategory = false }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const t = getT(lang);
  const question = survieCurrentQuestion(state);
  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();
  // Après une élimination la manche continue : « Commencer » laissait croire à un redémarrage
  const resuming = state.aliveTeams.includes(false);
  const startLabel = resuming ? t.survie.resume : t.ready.start;
  const aliveTeams = state.teams.filter((_, i) => state.aliveTeams[i]);

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom + 20, 36) }]}>
      {/* Round + question centrés entre l'en-tête et le bouton : même écart au-dessus et en dessous */}
      <View style={styles.questionArea}>
        <View style={styles.pillRow}>
          <View style={styles.roundBadge}>
            <Text style={styles.roundText}>
              {t.ready.round} {state.round + 1}/{state.roundCount}
            </Text>
          </View>
          {showCategory ? <CategoryBadge themeId={question.theme} /> : null}
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{subject}</Text>
        </View>

        {resuming ? (
          <View style={styles.stillIn}>
            <Text style={styles.stillInLabel}>{t.survie.stillIn}</Text>
            <View style={styles.stillInRow}>
              {aliveTeams.map((team) => (
                <View key={team.color} style={[styles.teamBadge, { backgroundColor: team.color }]}>
                  <Text style={[styles.teamBadgeText, { color: BADGE_TEXT_COLOR[team.color] ?? colors.purpleDeep }]} numberOfLines={1}>
                    {team.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={startLabel}
        style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}
      >
        <LinearGradient
          colors={['#fb940e', '#f2c512']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.jouerBtn}
        >
          <Text style={styles.jouerText}>{startLabel}</Text>
        </LinearGradient>
      </Pressable>

      <View style={styles.bottomSpacer} />
    </View>
  );
}

// Espace sous le bouton, relatif à la zone de la question (flex 1)
const BUTTON_BOTTOM_SPACE = 0.45;
const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

const styles = StyleSheet.create({
  stillIn: {
    alignItems: 'center',
    gap: 10,
  },
  stillInLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: '#fef6d7',
  },
  stillInRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  teamBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  teamBadgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  questionArea: {
    flex: 1,
    justifyContent: 'center',
    gap: 28,
  },
  // Garde le bouton à peu près à sa hauteur d'avant (sous le milieu de l'écran) au lieu de le coller en bas
  bottomSpacer: {
    flex: BUTTON_BOTTOM_SPACE,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
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
