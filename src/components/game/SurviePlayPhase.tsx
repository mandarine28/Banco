import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSubject } from '@/game/answers';
import { survieCurrentQuestion, SURVIE_TURN_SECONDS, type SurvieState } from '@/game/survie-engine';
import { useCountdown } from '@/hooks/useCountdown';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };
const WARNING_SECONDS = 3;

type Props = {
  state: SurvieState;
  onValidate: () => void;
  onPass: () => void;
  onTimeout: () => void;
};

export function SurviePlayPhase({ state, onValidate, onPass, onTimeout }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const remainingMs = useCountdown(true, false, SURVIE_TURN_SECONDS, onTimeout);
  const question = survieCurrentQuestion(state);
  const currentTeam = state.teams[state.currentTeam];

  const seconds = Math.ceil(remainingMs / 1000);
  const elapsedFraction = Math.max(0, Math.min(1, 1 - remainingMs / (SURVIE_TURN_SECONDS * 1000)));
  const isWarning = seconds <= WARNING_SECONDS;
  const fillColor = isWarning ? colors.pink : '#fb940e';

  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();
  const badgeTextColor = BADGE_TEXT_COLOR[currentTeam.color] ?? colors.purpleDeep;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom + 24, 40) }]}>
      {/* Question */}
      <Text style={styles.questionText}>{subject}</Text>

      {/* Jackpot */}
      <View style={styles.jackpotCard}>
        <Text style={styles.jackpotLabel}>PACTOLE</Text>
        <Text style={styles.jackpotValue}>{state.jackpot}</Text>
      </View>

      {/* Timer + active team badge */}
      <View style={styles.timerSection}>
        <View style={styles.timerRow}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${elapsedFraction * 100}%`, backgroundColor: fillColor }]} />
          </View>
          <Text style={[styles.seconds, isWarning && styles.secondsWarning]}>{seconds}</Text>
        </View>
        <View style={styles.activeBadgeRow}>
          <View style={[styles.teamBadge, { backgroundColor: currentTeam.color }]}>
            <Text style={[styles.teamBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
              {currentTeam.name}
            </Text>
          </View>
          <Text style={styles.turnLabel}>À toi !</Text>
        </View>
      </View>

      {/* Teams status */}
      <View style={styles.teamsRow}>
        {state.teams.map((team, i) => {
          const alive = state.aliveTeams[i];
          const txtColor = BADGE_TEXT_COLOR[team.color] ?? colors.purpleDeep;
          return (
            <View
              key={i}
              style={[styles.statusBadge, { backgroundColor: alive ? team.color : 'rgba(255,255,255,0.12)' }]}
            >
              <Text
                style={[styles.statusName, { color: alive ? txtColor : 'rgba(255,255,255,0.3)' }]}
                numberOfLines={1}
              >
                {alive ? team.name : '✕'}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Pressable
          onPress={onValidate}
          accessibilityRole="button"
          accessibilityLabel="Valider la réponse"
          style={styles.validerWrap}
        >
          {({ pressed }) => (
            <LinearGradient
              colors={['#fb940e', '#f2c512']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.validerInner, pressed && styles.btnPressed]}
            >
              <Text style={styles.validerText}>VALIDER</Text>
            </LinearGradient>
          )}
        </Pressable>

        <Pressable
          onPress={onPass}
          accessibilityRole="button"
          accessibilityLabel="Passer — élimination"
          style={({ pressed }) => [styles.passerWrap, pressed && { opacity: 0.8 }]}
        >
          <View style={styles.passerInner}>
            <Text style={styles.passerText}>PASSER</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const BTN_RADIUS = 16;
const BTN_SHADOW = {
  shadowOffset: { width: -1, height: 2 },
  shadowOpacity: 1 as const,
  shadowRadius: 0,
  elevation: 3,
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 4,
    paddingHorizontal: 24,
    gap: 20,
  },

  questionText: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 31,
    color: colors.cream,
  },

  jackpotCard: {
    backgroundColor: 'rgba(254,246,215,0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(254,246,215,0.25)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 4,
  },
  jackpotLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 13,
    color: 'rgba(254,246,215,0.6)',
    letterSpacing: 2,
  },
  jackpotValue: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 72,
    color: colors.cream,
  },

  timerSection: {
    gap: 12,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  track: {
    flex: 1,
    height: 16,
    borderRadius: 60,
    backgroundColor: '#fef1cc',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 60,
  },
  seconds: {
    fontFamily: fonts.displayMedium,
    fontSize: 24,
    color: colors.cream,
    minWidth: 36,
    textAlign: 'right',
  },
  secondsWarning: {
    color: colors.pink,
  },
  activeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '70%',
  },
  teamBadgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  turnLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: 'rgba(254,246,215,0.7)',
  },

  teamsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusName: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
  },

  buttons: {
    gap: 12,
    marginTop: 'auto',
  },

  validerWrap: {
    width: '100%',
    borderRadius: BTN_RADIUS,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
    ...BTN_SHADOW,
  },
  validerInner: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
  },
  btnPressed: {
    opacity: 0.85,
  },
  validerText: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.cream,
  },

  passerWrap: {
    width: '100%',
    borderRadius: BTN_RADIUS,
    borderWidth: 2,
    borderColor: 'rgba(254,246,215,0.5)',
    shadowColor: 'rgba(254,246,215,0.3)',
    ...BTN_SHADOW,
  },
  passerInner: {
    backgroundColor: 'transparent',
    borderRadius: BTN_RADIUS - 2,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  passerText: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: 'rgba(254,246,215,0.7)',
  },
});
