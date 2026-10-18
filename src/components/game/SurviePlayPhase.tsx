import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getAnswers, getSubject, normalize } from '@/game/answers';
import { survieCurrentQuestion, SURVIE_TURN_SECONDS, type SurvieState } from '@/game/survie-engine';
import { useCountdown } from '@/hooks/useCountdown';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };
const WARNING_SECONDS = 3;

const PAUSE_PATH =
  'M5.14286 0C5.59751 0 6.03355 0.180612 6.35504 0.502103C6.67653 0.823594 6.85714 1.25963 6.85714 1.71429V22.2857C6.85714 22.7404 6.67653 23.1764 6.35504 23.4979C6.03355 23.8194 5.59751 24 5.14286 24H1.71429C1.25963 24 0.823594 23.8194 0.502103 23.4979C0.180612 23.1764 0 22.7404 0 22.2857V1.71429C0 1.25963 0.180612 0.823594 0.502103 0.502103C0.823594 0.180612 1.25963 0 1.71429 0H5.14286ZM18.8571 0C19.3118 0 19.7478 0.180612 20.0693 0.502103C20.3908 0.823594 20.5714 1.25963 20.5714 1.71429V22.2857C20.5714 22.7404 20.3908 23.1764 20.0693 23.4979C19.7478 23.8194 19.3118 24 18.8571 24H15.4286C14.9739 24 14.5379 23.8194 14.2164 23.4979C13.8949 23.1764 13.7143 22.7404 13.7143 22.2857V1.71429C13.7143 1.25963 13.8949 0.823594 14.2164 0.502103C14.5379 0.180612 14.9739 0 15.4286 0H18.8571Z';

const PLAY_PATH =
  'M23.9911 1.28571C23.9911 0.944722 23.8557 0.617695 23.6145 0.376577C23.3734 0.135459 23.0464 0 22.7054 0C22.3644 0 22.0374 0.135459 21.7963 0.376577C21.5551 0.617695 21.4197 0.944722 21.4197 1.28571V18.4286C21.4197 18.7696 21.5551 19.0966 21.7963 19.3377C22.0374 19.5788 22.3644 19.7143 22.7054 19.7143C23.0464 19.7143 23.3734 19.5788 23.6145 19.3377C23.8557 19.0966 23.9911 18.7696 23.9911 18.4286V1.28571ZM16.6265 8.04857C17.8094 8.964 17.8094 10.7503 16.6265 11.6657C12.9614 14.5019 8.86859 16.7372 4.5014 18.288L3.70254 18.5726C2.21112 19.1006 0.633973 18.0926 0.433402 16.5531C-0.144467 12.1078 -0.144467 7.60644 0.433402 3.16114C0.635688 1.62171 2.21112 0.613714 3.70254 1.14343L4.5014 1.42629C8.86859 2.97704 12.9614 5.21238 16.6265 8.04857Z';

function SearchOnlineIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1.5 12C1.5 14.7848 2.60625 17.4555 4.57538 19.4246C6.54451 21.3938 9.21523 22.5 12 22.5C14.7848 22.5 17.4555 21.3938 19.4246 19.4246C21.3938 17.4555 22.5 14.7848 22.5 12C22.5 9.21523 21.3938 6.54451 19.4246 4.57538C17.4555 2.60625 14.7848 1.5 12 1.5C9.21523 1.5 6.54451 2.60625 4.57538 4.57538C2.60625 6.54451 1.5 9.21523 1.5 12Z"
        fill="rgba(254,246,215,0.18)"
        stroke={colors.cream}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M8.81819 4.57549C8.81819 4.57549 8.00009 9.33546 8.00009 12.1202C8.00009 14.905 7.97428 17.4556 8.81819 19.4247C9.66211 21.3939 10.8065 22.1202 12 22.1202C13.1935 22.1202 13.6562 21.3939 14.5001 19.4247C15.344 17.4556 16.0002 14.7849 16.0002 12.0001C16.0002 9.21534 16.129 7.34104 15.285 5.37191C14.4411 3.40278 13.2965 1.75179 12.1031 1.75179C10.9096 1.75179 8.81819 4.57549 8.81819 4.57549Z"
        stroke={colors.cream}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 15.5H21.5M2.5 8.5H21.5"
        stroke={colors.cream}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Plus court préfixe qui identifie chaque réponse de façon unique dans la liste.
function minDisambiguatingPrefix(answers: string[]): number {
  const normalized = answers.map((a) => normalize(a)).filter((a) => a.length > 0);
  if (normalized.length <= 1) return 2;
  for (let len = 2; len <= 10; len++) {
    const prefixes = new Set(normalized.map((a) => a.slice(0, len)));
    if (prefixes.size === normalized.length) return len;
  }
  return 5;
}

type Props = {
  state: SurvieState;
  onValidate: (answer: string) => void;
  onPass: () => void;
  onTimeout: () => void;
  isPaused?: boolean;
  onTogglePause: () => void;
  onWebSearch: (query: string) => void;
};

export function SurviePlayPhase({
  state,
  onValidate,
  onPass,
  onTimeout,
  isPaused = false,
  onTogglePause,
  onWebSearch,
}: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const t = getT(lang);
  const remainingMs = useCountdown(true, isPaused, SURVIE_TURN_SECONDS, onTimeout);
  const question = survieCurrentQuestion(state);
  const currentTeam = state.teams[state.currentTeam];

  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  // true quand la pause a été déclenchée par le focus de la barre de recherche
  // → on ne blure pas l'input dans cet cas (l'effet blur sert uniquement pour le web search)
  const pausedByFocus = useRef(false);
  const pingScale = useRef(new Animated.Value(0.6)).current;
  const pingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ping = () => {
      pingScale.setValue(0.6);
      pingOpacity.setValue(0.65);
      Animated.parallel([
        Animated.timing(pingScale, { toValue: 2.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pingOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]).start();
    };
    const id = setInterval(ping, 10000);
    return () => clearInterval(id);
  }, [pingScale, pingOpacity]);

  useEffect(() => {
    if (!isPaused) {
      pausedByFocus.current = false;
      return;
    }
    // Ne pas blurer si c'est nous qui avons déclenché la pause via le focus
    if (pausedByFocus.current) return;
    inputRef.current?.blur();
    setSearchFocused(false);
    setQuery('');
    Keyboard.dismiss();
  }, [isPaused]);

  const seconds = Math.ceil(remainingMs / 1000);
  const elapsedFraction = Math.max(0, Math.min(1, 1 - remainingMs / (SURVIE_TURN_SECONDS * 1000)));
  const isWarning = seconds <= WARNING_SECONDS;
  const fillColor = isWarning ? colors.pink : '#fb940e';

  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();
  const badgeTextColor = BADGE_TEXT_COLOR[currentTeam.color] ?? colors.purpleDeep;

  // Recherche par préfixe dynamique — rien ne s'affiche tant que le seuil n'est pas atteint
  const localAnswers = getAnswers(question, lang);
  const minPrefix = minDisambiguatingPrefix(localAnswers);
  const normalizedQuery = normalize(query);
  const matchedAnswer =
    normalizedQuery.length >= minPrefix
      ? (localAnswers.find((a) => normalize(a).startsWith(normalizedQuery)) ?? null)
      : null;
  const matchLabel = matchedAnswer
    ? matchedAnswer.charAt(0).toUpperCase() + matchedAnswer.slice(1).toLowerCase()
    : null;

  // Reprend le timer uniquement si c'est le focus de la barre qui l'avait mis en pause
  const resumeIfPausedByFocus = () => {
    if (isPaused && pausedByFocus.current) {
      pausedByFocus.current = false;
      onTogglePause();
    }
  };

  const handleDismissSearch = () => {
    inputRef.current?.blur();
    setSearchFocused(false);
    setQuery('');
    Keyboard.dismiss();
    resumeIfPausedByFocus();
  };

  const handleValidate = () => {
    resumeIfPausedByFocus();
    onValidate(matchedAnswer ?? '');
    setQuery('');
  };

  return (
    <View style={styles.wrapper}>
      {/* Timer row */}
      <View style={styles.timerRow}>
        <View style={[styles.track, isPaused && styles.trackPaused]}>
          <View style={[styles.fill, { width: `${elapsedFraction * 100}%`, backgroundColor: fillColor }]} />
        </View>
        <Text style={[styles.seconds, isWarning && styles.secondsWarning]}>{seconds}</Text>
        <Pressable
          onPress={onTogglePause}
          accessibilityRole="button"
          accessibilityLabel={isPaused ? 'Reprendre' : 'Pause'}
          style={styles.pauseBtn}
        >
          <View pointerEvents="none">
            {isPaused ? (
              <Svg width={24} height={20} viewBox="0 0 24 20">
                <Path d={PLAY_PATH} fill={colors.cream} />
              </Svg>
            ) : (
              <Svg width={21} height={24} viewBox="0 0 21 24">
                <Path d={PAUSE_PATH} fill={colors.cream} />
              </Svg>
            )}
          </View>
        </Pressable>
      </View>

      {/* Badge équipe + question — tap pour fermer le clavier */}
      <Pressable onPress={handleDismissSearch} accessible={false} style={{ gap: 20 }}>
        <View style={styles.badgeRow}>
          <View style={[styles.teamBadge, { backgroundColor: currentTeam.color }]}>
            <Text style={[styles.teamBadgeText, { color: badgeTextColor }]} numberOfLines={1}>
              {currentTeam.name}
            </Text>
          </View>
        </View>
        <Text style={styles.questionText}>{subject}</Text>
      </Pressable>

      {/* Barre de saisie — préfixe silencieux */}
      <View style={styles.searchRow}>
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Vérifier une réponse…"
          placeholderTextColor="rgba(254,246,215,0.4)"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="done"
          onFocus={() => {
            setSearchFocused(true);
            if (!isPaused) {
              pausedByFocus.current = true;
              onTogglePause();
            }
          }}
          onBlur={() => {
            setSearchFocused(false);
            resumeIfPausedByFocus();
          }}
          style={styles.searchInput}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityRole="button" accessibilityLabel={t.survie.clear}>
            <Text style={styles.clearBtn}>✕</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => onWebSearch(question.subject)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t.play.searchOnline}
          >
            <View style={{ width: 24, height: 24 }}>
              <Animated.View
                style={{
                  position: 'absolute',
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.cream,
                  transform: [{ scale: pingScale }],
                  opacity: pingOpacity,
                }}
              />
              <SearchOnlineIcon />
            </View>
          </Pressable>
        )}
      </View>

      {/* Badge réponse — n'apparaît que quand le seuil de préfixe est atteint */}
      {matchLabel ? (
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>✓ {matchLabel}</Text>
        </View>
      ) : null}

      {/* Pactole — masqué pendant la saisie, centré dans l'espace restant sinon */}
      {!searchFocused && query.length === 0 ? (
        <View style={styles.jackpotMiddle}>
          <View style={styles.jackpotSection}>
            <Text style={styles.jackpotLabel}>{t.result.pointsAtStake}</Text>
            <View style={styles.jackpotCard}>
              <Text style={styles.jackpotValue}>{state.jackpot}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Boutons */}
      <View style={[styles.buttons, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
        <Pressable
          onPress={handleValidate}
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
            <Text style={styles.passerText}>{t.auction.pass}</Text>
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
  trackPaused: {
    opacity: 0.45,
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
  pauseBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.purpleDeep,
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
    fontSize: 24,
    lineHeight: 31,
    color: colors.cream,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(254,246,215,0.2)',
    borderWidth: 1,
    borderColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.cream,
    padding: 0,
  },
  clearBtn: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: 'rgba(254,246,215,0.6)',
    paddingHorizontal: 4,
  },

  matchBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  matchText: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: '#fff',
  },

  jackpotMiddle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jackpotSection: {
    alignItems: 'center',
    gap: 10,
  },
  jackpotLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.cream,
  },
  jackpotCard: {
    backgroundColor: colors.purpleDeep,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  jackpotValue: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 58,
    color: colors.cream,
  },

  buttons: {
    gap: 12,
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
