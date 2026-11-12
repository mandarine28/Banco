import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getSubject } from '@/game/answers';
import { survieCurrentQuestion, type SurvieState } from '@/game/survie-engine';
import { useCountdown } from '@/hooks/useCountdown';
import { useHapticWarning } from '@/hooks/useHapticWarning';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';
import { SkipIcon } from '@/components/game/PlayPhase';
import { SurvieTimerDisc } from '@/components/game/SurvieTimerDisc';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };

const PAUSE_PATH =
  'M5.14286 0C5.59751 0 6.03355 0.180612 6.35504 0.502103C6.67653 0.823594 6.85714 1.25963 6.85714 1.71429V22.2857C6.85714 22.7404 6.67653 23.1764 6.35504 23.4979C6.03355 23.8194 5.59751 24 5.14286 24H1.71429C1.25963 24 0.823594 23.8194 0.502103 23.4979C0.180612 23.1764 0 22.7404 0 22.2857V1.71429C0 1.25963 0.180612 0.823594 0.502103 0.502103C0.823594 0.180612 1.25963 0 1.71429 0H5.14286ZM18.8571 0C19.3118 0 19.7478 0.180612 20.0693 0.502103C20.3908 0.823594 20.5714 1.25963 20.5714 1.71429V22.2857C20.5714 22.7404 20.3908 23.1764 20.0693 23.4979C19.7478 23.8194 19.3118 24 18.8571 24H15.4286C14.9739 24 14.5379 23.8194 14.2164 23.4979C13.8949 23.1764 13.7143 22.7404 13.7143 22.2857V1.71429C13.7143 1.25963 13.8949 0.823594 14.2164 0.502103C14.5379 0.180612 14.9739 0 15.4286 0H18.8571Z';

const PLAY_PATH =
  'M23.9911 1.28571C23.9911 0.944722 23.8557 0.617695 23.6145 0.376577C23.3734 0.135459 23.0464 0 22.7054 0C22.3644 0 22.0374 0.135459 21.7963 0.376577C21.5551 0.617695 21.4197 0.944722 21.4197 1.28571V18.4286C21.4197 18.7696 21.5551 19.0966 21.7963 19.3377C22.0374 19.5788 22.3644 19.7143 22.7054 19.7143C23.0464 19.7143 23.3734 19.5788 23.6145 19.3377C23.8557 19.0966 23.9911 18.7696 23.9911 18.4286V1.28571ZM16.6265 8.04857C17.8094 8.964 17.8094 10.7503 16.6265 11.6657C12.9614 14.5019 8.86859 16.7372 4.5014 18.288L3.70254 18.5726C2.21112 19.1006 0.633973 18.0926 0.433402 16.5531C-0.144467 12.1078 -0.144467 7.60644 0.433402 3.16114C0.635688 1.62171 2.21112 0.613714 3.70254 1.14343L4.5014 1.42629C8.86859 2.97704 12.9614 5.21238 16.6265 8.04857Z';

type Props = {
  state: SurvieState;
  onValidate: () => void;
  onPass: () => void;
  onTimeout: () => void;
  /** Secondes par tour ; null = sans chrono (barre et pause masquées). */
  turnSeconds: number | null;
  isPaused?: boolean;
  onTogglePause: () => void;
  onEndRound: () => void;
};

export function SurviePlayPhase({
  state,
  onValidate,
  onPass,
  onTimeout,
  turnSeconds,
  isPaused = false,
  onTogglePause,
  onEndRound,
}: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const t = getT(lang);
  const remainingMs = useCountdown(turnSeconds !== null, isPaused, turnSeconds ?? 0, onTimeout);
  useHapticWarning(remainingMs, 5);
  const question = survieCurrentQuestion(state);
  const currentTeam = state.teams[state.currentTeam];

  const { height } = useWindowDimensions();
  // Le chrono prend la place libérée par l'ancienne barre ; plus petit sur les petits écrans
  const discSize = Math.round(Math.min(192, height * 0.22));
  const hasTimer = turnSeconds !== null;

  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();
  const badgeTextColor = BADGE_TEXT_COLOR[currentTeam.color] ?? colors.purpleDeep;

  return (
    <View style={styles.wrapper}>
      {/* Badge équipe + question */}
      <View style={styles.questionBlock}>
        <View style={styles.badgeRow}>
          <View style={[styles.teamBadge, { backgroundColor: currentTeam.color }]}>
            <Text style={[styles.teamBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
              {currentTeam.name}
            </Text>
          </View>
        </View>
        <Text style={styles.questionText}>{subject}</Text>
      </View>

      {/* Chrono mis en avant, à la couleur de l'équipe ; pause et fin de manche juste dessous */}
      <View style={styles.timerBlock}>
        {hasTimer ? (
          <SurvieTimerDisc
            size={discSize}
            color={currentTeam.color}
            remainingMs={remainingMs}
            totalMs={(turnSeconds ?? 0) * 1000}
            paused={isPaused}
          />
        ) : null}
        <View style={styles.controls}>
          {/* Sans chrono (paramètres) : pas de pause, mais on peut toujours terminer la manche */}
          {hasTimer ? (
            <Pressable
              onPress={onTogglePause}
              accessibilityRole="button"
              accessibilityLabel={isPaused ? t.play.resume : t.play.pause}
              style={styles.roundBtn}
            >
              <View pointerEvents="none">
                {isPaused ? (
                  <Svg width={31} height={26} viewBox="0 0 24 20">
                    <Path d={PLAY_PATH} fill={colors.cream} />
                  </Svg>
                ) : (
                  <Svg width={26} height={30} viewBox="0 0 21 24">
                    <Path d={PAUSE_PATH} fill={colors.cream} />
                  </Svg>
                )}
              </View>
            </Pressable>
          ) : null}
          <Pressable
            onPress={onEndRound}
            accessibilityRole="button"
            accessibilityLabel={t.survie.endRoundTitle}
            style={styles.roundBtn}
          >
            <SkipIcon color={colors.cream} size={42} />
          </Pressable>
        </View>
      </View>

      <View style={styles.buttons}>
        <Pressable
          onPress={onValidate}
          sound="bid"
          accessibilityRole="button"
          accessibilityLabel={t.survie.validateA11y}
          style={styles.validerWrap}
        >
          {({ pressed }) => (
            <LinearGradient
              colors={['#fb940e', '#f2c512']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.validerInner, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.validerText}>{t.survie.validate}</Text>
            </LinearGradient>
          )}
        </Pressable>

        <Pressable
          onPress={onPass}
          accessibilityRole="button"
          accessibilityLabel={t.survie.passA11y}
          style={({ pressed }) => [styles.passerWrap, pressed && { opacity: 0.8 }]}
        >
          <View style={styles.passerInner}>
            <Text style={styles.passerText}>{t.survie.noAnswer}</Text>
          </View>
        </Pressable>
      </View>

      {/* Pactole en bas, comme le compteur du mode enchères */}
      <View style={[styles.jackpotFooter, { paddingBottom: Math.max(insets.bottom - 4, 12) }]}>
        <View style={styles.jackpotCard}>
          <Text style={styles.jackpotValue}>{state.jackpot}</Text>
        </View>
        {/* Libellé sous le chiffre : sans les deux-points de « Points en jeu : » */}
        <Text style={styles.jackpotLabel}>{t.result.pointsAtStake.replace(/\s*:\s*$/, '')}</Text>
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

  questionBlock: {
    gap: 20,
  },
  timerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Les zones de toucher (54 px) espacent déjà les boutons du chrono
    gap: 0,
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  // Icônes seules, crème sur le fond bleu : la zone de toucher garde 54 × 54
  roundBtn: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  questionText: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 33,
    color: colors.cream,
  },

  buttons: {
    gap: 16,
  },
  // Mêmes proportions que CounterFooter (mode enchères)
  jackpotFooter: {
    alignItems: 'center',
    gap: 6,
  },
  // Maquette : pastille bleu nuit, chiffre crème
  jackpotCard: {
    minWidth: 64,
    height: 64,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.purpleDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jackpotValue: {
    fontFamily: fonts.displayMedium,
    fontSize: 40,
    color: colors.cream,
  },
  jackpotLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
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
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  validerText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
  },
  passerWrap: {
    width: '100%',
    borderRadius: BTN_RADIUS,
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    shadowColor: colors.purpleDeep,
    ...BTN_SHADOW,
  },
  passerInner: {
    backgroundColor: '#fffbf5',
    borderRadius: BTN_RADIUS - 2,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  passerText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.purpleDeep,
  },
});
