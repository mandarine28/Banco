import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { getSubject, localizedQuestion, normalize, searchAnswers, suggestions } from '@/game/answers';
import { contract, currentQuestion, type GameState, TURN_SECONDS } from '@/game/engine';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': colors.cream };
const WARNING_SECONDS = 10;
const THUMB_MIN_H = 28;

// Hauteur max de la zone chips : 5 lignes visibles sans scroll
const CHIP_ROW_H = 36;
const CHIP_GAP = 12;
const MAX_CHIPS_H = 5 * CHIP_ROW_H + 4 * CHIP_GAP; // 228

const PAUSE_PATH =
  'M5.14286 0C5.59751 0 6.03355 0.180612 6.35504 0.502103C6.67653 0.823594 6.85714 1.25963 6.85714 1.71429V22.2857C6.85714 22.7404 6.67653 23.1764 6.35504 23.4979C6.03355 23.8194 5.59751 24 5.14286 24H1.71429C1.25963 24 0.823594 23.8194 0.502103 23.4979C0.180612 23.1764 0 22.7404 0 22.2857V1.71429C0 1.25963 0.180612 0.823594 0.502103 0.502103C0.823594 0.180612 1.25963 0 1.71429 0H5.14286ZM18.8571 0C19.3118 0 19.7478 0.180612 20.0693 0.502103C20.3908 0.823594 20.5714 1.25963 20.5714 1.71429V22.2857C20.5714 22.7404 20.3908 23.1764 20.0693 23.4979C19.7478 23.8194 19.3118 24 18.8571 24H15.4286C14.9739 24 14.5379 23.8194 14.2164 23.4979C13.8949 23.1764 13.7143 22.7404 13.7143 22.2857V1.71429C13.7143 1.25963 13.8949 0.823594 14.2164 0.502103C14.5379 0.180612 14.9739 0 15.4286 0H18.8571Z';

const PLAY_PATH =
  'M23.9911 1.28571C23.9911 0.944722 23.8557 0.617695 23.6145 0.376577C23.3734 0.135459 23.0464 0 22.7054 0C22.3644 0 22.0374 0.135459 21.7963 0.376577C21.5551 0.617695 21.4197 0.944722 21.4197 1.28571V18.4286C21.4197 18.7696 21.5551 19.0966 21.7963 19.3377C22.0374 19.5788 22.3644 19.7143 22.7054 19.7143C23.0464 19.7143 23.3734 19.5788 23.6145 19.3377C23.8557 19.0966 23.9911 18.7696 23.9911 18.4286V1.28571ZM16.6265 8.04857C17.8094 8.964 17.8094 10.7503 16.6265 11.6657C12.9614 14.5019 8.86859 16.7372 4.5014 18.288L3.70254 18.5726C2.21112 19.1006 0.633973 18.0926 0.433402 16.5531C-0.144467 12.1078 -0.144467 7.60644 0.433402 3.16114C0.635688 1.62171 2.21112 0.613714 3.70254 1.14343L4.5014 1.42629C8.86859 2.97704 12.9614 5.21238 16.6265 8.04857Z';

function SkipIcon() {
  return (
    <Svg width={30} height={16} viewBox="0 0 38 20">
      <Path
        d="M11.8725 7.03509L11.6304 9V12.276C11.6304 12.8502 12.1128 13.3064 12.686 13.2745L23.8792 12.6513C24.4524 12.6194 24.9348 13.0756 24.9348 13.6497V18.2299C24.9348 19.008 25.7844 19.488 26.4509 19.0864L36.5023 13.0296C37.027 12.7134 37.1467 12.004 36.7547 11.5332L28.3812 1.47615C27.8635 0.854393 26.8602 1.07275 26.6478 1.85342L25.1721 7.27627C25.0373 7.77146 24.5496 8.08426 24.0433 8.00018L13.0288 6.17087C12.4677 6.07768 11.942 6.4706 11.8725 7.03509Z"
        fill={colors.cream}
      />
      <Path
        d="M0 9.59591V10.592C0 10.8529 0.101952 11.1035 0.2841 11.2903L0.84948 11.87C1.03412 12.0593 1.28622 12.1678 1.55064 12.1717L10.0799 12.2974C10.6264 12.3054 11.0652 12.7507 11.0652 13.2973V17.2447C11.0652 18.001 11.8723 18.4836 12.5385 18.1256L22.4868 12.78C23.0647 12.4695 23.1921 11.6962 22.7444 11.2167L14.4644 2.34881C13.9391 1.78619 13.0017 2.00316 12.7771 2.73938L11.2758 7.65876C11.15 8.07081 10.7745 8.35601 10.3438 8.36657L0.975494 8.59621C0.43292 8.60951 0 9.05317 0 9.59591Z"
        fill={colors.cream}
      />
    </Svg>
  );
}

type Props = {
  state: GameState;
  remainingMs: number;
  onToggle: (label: string) => void;
  onWebSearch: (query: string) => void;
  onSkip: () => void;
  onTogglePause: () => void;
  isPaused?: boolean;
};

export function PlayPhase({ state, remainingMs, onToggle, onWebSearch, onSkip, onTogglePause, isPaused = false }: Props) {
  const { lang } = useLang();
  const t = getT(lang);
  const question = currentQuestion(state);
  const locQuestion = localizedQuestion(question, lang);
  const { team: teamIdx } = contract(state);
  const team = state.teams[teamIdx];
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(8)).current;
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = () => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTranslateY.setValue(8);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
    toastTimeout.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(toastTranslateY, { toValue: 8, duration: 250, useNativeDriver: true }),
      ]).start();
    }, 2000);
  };

  useEffect(() => () => { if (toastTimeout.current) clearTimeout(toastTimeout.current); }, []);

  // Dès que la partie se met en pause (recherche web), on blur le TextInput.
  // Cela empêche iOS de le re-focus après la fermeture du SFSafariViewController.
  useEffect(() => {
    if (!isPaused) return;
    inputRef.current?.blur();
    setQuery('');
    setSearchFocused(false);
    Keyboard.dismiss();
  }, [isPaused]);

  // Scrollbar dynamique
  const [chipsScrollY, setChipsScrollY] = useState(0);
  const [chipsContentH, setChipsContentH] = useState(0);
  const [chipsContainerH, setChipsContainerH] = useState(0);

  const seconds = Math.ceil(remainingMs / 1000);
  const elapsedFraction = Math.max(0, Math.min(1, 1 - remainingMs / (TURN_SECONDS * 1000)));
  const isWarning = seconds <= WARNING_SECONDS;
  const fillColor = isWarning ? colors.pink : '#fb940e';

  const teamBadgeTextColor = BADGE_TEXT_COLOR[team.color] ?? colors.purpleDeep;
  const rawSubject = getSubject(question, lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();

  const searching = normalize(query).length > 0;
  // Mode compact : badge + question masqués quand clavier ouvert → libère de l'espace pour les chips
  const compact = searchFocused || searching;
  const list = searching ? searchAnswers(locQuestion, query) : suggestions(locQuestion, state.found);

  const handleToggle = (label: string) => {
    onToggle(label);
    if (searching) setQuery('');
  };
  const handleWebSearch = () => onWebSearch(`${query.trim()} ${question.subject}`);

  // Calcul de la scrollbar dynamique
  const isScrollable = chipsContentH > chipsContainerH + 4;
  const thumbH = isScrollable
    ? Math.max(THUMB_MIN_H, chipsContainerH * (chipsContainerH / chipsContentH))
    : chipsContainerH;
  const thumbMaxTop = chipsContainerH - thumbH;
  const scrollProgress = isScrollable ? chipsScrollY / (chipsContentH - chipsContainerH) : 0;
  const thumbTop = scrollProgress * thumbMaxTop;

  return (
    <View style={styles.wrapper}>
      {/* ─── ZONE STICKY : chrono, badge, question, recherche ─── */}
      <Pressable style={styles.stickyTop} onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.timerRow}>
          <View style={[styles.track, isPaused && styles.trackPaused]}>
            <View style={[styles.fill, { width: `${elapsedFraction * 100}%`, backgroundColor: fillColor }]} />
          </View>
          <Text style={[styles.seconds, isWarning && styles.secondsWarning]}>{seconds}</Text>
          <Pressable
            onPress={onTogglePause}
            accessibilityRole="button"
            accessibilityLabel={isPaused ? t.play.resume : t.play.pause}
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
          <Pressable
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel={t.play.endTurn}
            style={styles.skipBtn}
          >
            <SkipIcon />
          </Pressable>
        </View>

        {!compact ? (
          <View style={styles.badgeRow}>
            <View style={[styles.teamBadge, { backgroundColor: team.color }]}>
              <Text style={[styles.teamBadgeText, { color: teamBadgeTextColor }]} numberOfLines={1}>
                {team.name}
              </Text>
            </View>
          </View>
        ) : null}

        {!compact ? (
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{subject}</Text>
          </View>
        ) : null}

        <View style={styles.searchRow}>
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            editable={!isPaused}
            placeholder={t.play.searchPlaceholder}
            placeholderTextColor="rgba(254,246,215,0.5)"
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onSubmitEditing={searching ? handleWebSearch : undefined}
            accessibilityLabel={t.play.searchPlaceholder}
            style={styles.searchInput}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Effacer">
              <Text style={styles.clearBtn}>✕</Text>
            </Pressable>
          ) : null}
        </View>

        {searching && list.length === 0 ? (
          <View style={styles.noResult}>
            <Text style={styles.noResultText}>{t.play.notInDatabase(query.trim().toUpperCase())}</Text>
            <View style={styles.noResultActions}>
              <Pressable onPress={() => { handleToggle(query.trim().toUpperCase()); inputRef.current?.blur(); Keyboard.dismiss(); showToast(); }} style={styles.actionBtn} accessibilityRole="button">
                <Text style={styles.actionBtnText}>{t.play.validateAnyway}</Text>
              </Pressable>
              <Pressable onPress={handleWebSearch} style={[styles.actionBtn, styles.actionBtnAlt]} accessibilityRole="button">
                <Text style={[styles.actionBtnText, styles.actionBtnTextAlt]}>{t.play.searchOnline}</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </Pressable>

      <Animated.View
        style={[styles.toast, { opacity: toastOpacity, transform: [{ translateY: toastTranslateY }] }]}
        pointerEvents="none"
      >
        <Text style={styles.toastText}>{t.play.answerAdded}</Text>
      </Animated.View>

      {/* ─── ZONE SCROLLABLE : chips + scrollbar dynamique ─── */}
      {list.length > 0 && !searching ? (
        <Text style={styles.someAnswersLabel}>{t.play.someAnswers}</Text>
      ) : null}
      {list.length > 0 ? (
        <View style={styles.chipsArea}>
          {/* Scrollbar track + thumb dynamique */}
          <View
            style={styles.scrollTrack}
            onLayout={(e) => setChipsContainerH(e.nativeEvent.layout.height)}
          >
            {isScrollable ? (
              <View
                style={[
                  styles.scrollThumb,
                  { height: thumbH, top: thumbTop },
                ]}
              />
            ) : (
              <View style={[styles.scrollThumb, { height: chipsContainerH, top: 0 }]} />
            )}
          </View>

          <ScrollView
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsGrid}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            onScroll={(e) => setChipsScrollY(e.nativeEvent.contentOffset.y)}
            onContentSizeChange={(_, h) => setChipsContentH(h)}
          >
            {list.map((label) => {
              const found = state.found.includes(label);
              const displayLabel = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
              return (
                <Pressable
                  key={label}
                  onPress={() => handleToggle(label)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: found }}
                  accessibilityLabel={label}
                  style={({ pressed }) => [
                    styles.chip,
                    found ? styles.chipFound : styles.chipNotFound,
                    pressed && styles.chipPressed,
                  ]}
                >
                  <Text style={[styles.chipLabel, found ? styles.chipLabelFound : styles.chipLabelNotFound]}>
                    {displayLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 4,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  // ── Sticky top ──
  stickyTop: {
    gap: 20,
    paddingBottom: 16,
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
  pauseBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.purpleDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.purpleDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackPaused: {
    opacity: 0.45,
  },
  badgeRow: {
    alignItems: 'center',
  },
  teamBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '80%',
  },
  teamBadgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  questionCard: {
    backgroundColor: '#fef1cc',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  questionText: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.purpleDeep,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(254,246,215,0.2)',
    borderWidth: 1,
    borderColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 24,
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
  noResult: {
    gap: 12,
  },
  noResultText: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.cream,
    textAlign: 'center',
  },
  noResultActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  actionBtn: {
    backgroundColor: colors.cream,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionBtnAlt: {
    backgroundColor: colors.purpleDeep,
  },
  actionBtnText: {
    fontFamily: fonts.displayMedium,
    fontSize: 13,
    color: colors.purpleDeep,
  },
  actionBtnTextAlt: {
    color: colors.cream,
  },
  toast: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    backgroundColor: colors.purpleDeep,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
  },
  toastText: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.cream,
  },
  someAnswersLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
    marginBottom: 10,
  },
  // ── Zone chips ──
  chipsArea: {
    flex: 1,
    maxHeight: MAX_CHIPS_H,
    flexDirection: 'row',
    gap: 12,
  },
  // Scrollbar track (conteneur de la piste)
  scrollTrack: {
    width: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  // Thumb dynamique (glisse dans la piste)
  scrollThumb: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  chipsScroll: {
    flex: 1,
    maxHeight: MAX_CHIPS_H,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipFound: {
    backgroundColor: '#fef1cc',
  },
  chipNotFound: {
    backgroundColor: '#4883e5',
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
  chipLabelFound: {
    color: colors.purpleDeep,
  },
  chipLabelNotFound: {
    color: colors.cream,
  },
});
