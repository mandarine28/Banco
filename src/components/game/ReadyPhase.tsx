import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { getSubject } from '@/game/answers';
import { contract, currentQuestion, type GameState, opponent } from '@/game/engine';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { colors, fonts } from '@/theme';

const BADGE_TEXT_COLOR: Record<string, string> = {
  '#FB0ED4': colors.cream,
};

function PhoneIcon({ color = colors.purpleDeep }: { color?: string }) {
  return (
    <Svg width={15} height={20} viewBox="0 0 21 29">
      <Path
        d="M4.35571 0.367188C8.27709 0.0440868 12.2234 0.0440867 16.1448 0.367188C16.8068 0.421634 17.4472 0.609479 18.0178 0.916992C18.0985 0.958499 18.1784 1.00282 18.2561 1.04883C18.7671 1.34502 19.1991 1.74091 19.5178 2.20801C19.7967 2.6167 19.9832 3.0708 20.0667 3.54395L20.0959 3.74805V3.74902L20.1067 3.84766H20.1057C20.1208 3.95947 20.13 4.07204 20.1321 4.18555L20.3752 12.2656V12.2734L20.3665 12.5947L20.3752 12.9287V12.9355L20.3665 13.2578L20.3752 13.5918V13.5977L20.3665 13.9229L20.3752 14.2539V14.2607L20.135 23.6729C20.1063 24.7869 19.6258 25.8512 18.7874 26.668C17.9493 27.4842 16.8107 27.9988 15.5842 28.1182C12.0389 28.4612 8.4616 28.4612 4.91626 28.1182C3.68975 27.9988 2.55115 27.4842 1.71313 26.668C0.874721 25.8512 0.394196 24.7869 0.365479 23.6729L0.125244 14.2607V14.2539L0.134033 13.9199L0.125244 13.5977V13.5918L0.134033 13.2588L0.125244 12.9355V12.9287L0.134033 12.5967L0.125244 12.2734V12.2656L0.368408 4.18555L0.377197 4.01074C0.381821 3.95283 0.388034 3.89496 0.395752 3.83789L0.399658 3.79688V3.79395L0.404541 3.75586C0.468728 3.16555 0.69198 2.59863 1.05396 2.10449C1.41549 1.61105 1.90445 1.20455 2.47778 0.918945C2.55541 0.878367 2.63448 0.839708 2.71411 0.802734C3.22463 0.562922 3.78254 0.415018 4.35571 0.367188ZM10.2502 23.2607C9.6898 23.2607 9.15447 23.4595 8.76196 23.8105C8.36995 24.1612 8.15261 24.6339 8.15259 25.123C8.15259 25.6122 8.36997 26.0849 8.76196 26.4355C9.15447 26.7866 9.6898 26.9854 10.2502 26.9854C10.8107 26.9854 11.346 26.7866 11.7385 26.4355C12.1305 26.0849 12.3479 25.6122 12.3479 25.123C12.3479 24.6339 12.1305 24.1612 11.7385 23.8105C11.346 23.4595 10.8107 23.2607 10.2502 23.2607ZM16.219 2.70996C12.2507 2.32645 8.24829 2.32548 4.28149 2.70898C4.08426 2.72929 3.89319 2.78205 3.71704 2.8623C3.25915 3.12353 2.94243 3.55001 2.85962 4.04004C2.85838 4.05285 2.85864 4.06712 2.85864 4.08203V4.08496L2.62524 13.1846L2.81372 19.4453C2.83306 20.0911 3.11638 20.7109 3.6145 21.1865C4.11324 21.6626 4.79316 21.9613 5.52466 22.0215C8.66843 22.2794 11.8321 22.2794 14.9758 22.0215C15.7073 21.9613 16.3872 21.6626 16.886 21.1865C17.3841 20.7109 17.6674 20.0911 17.6868 19.4453L17.8752 13.1846L17.6418 4.08398L17.6409 4.03613C17.5571 3.5498 17.2395 3.12341 16.7844 2.86133C16.6126 2.7814 16.4245 2.73062 16.219 2.70996Z"
        fill={color}
        stroke={color}
        strokeWidth={0.25}
      />
    </Svg>
  );
}

function ChatIcon({ color = colors.purpleDeep }: { color?: string }) {
  return (
    <Svg width={20} height={18} viewBox="0 0 23 21">
      <Path
        d="M13.25 17.25C17.021 17.25 18.907 17.25 20.078 16.078C21.249 14.906 21.25 13.021 21.25 9.25C21.25 5.479 21.25 3.593 20.078 2.422C18.906 1.251 17.021 1.25 13.25 1.25H9.25C5.479 1.25 3.593 1.25 2.422 2.422C1.251 3.594 1.25 5.479 1.25 9.25C1.25 13.021 1.25 14.907 2.422 16.078C3.075 16.732 3.95 17.021 5.25 17.148"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M11.25 9.25V9.26M7.25 9.25V9.26M15.25 9.25V9.26M13.25 17.25C12.014 17.25 10.652 17.75 9.409 18.395C7.411 19.432 6.412 19.951 5.92 19.62C5.428 19.289 5.521 18.265 5.708 16.216L5.75 15.75"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

type Props = {
  state: GameState;
  onStart: () => void;
};

export function ReadyPhase({ state, onStart }: Props) {
  const insets = useSafeAreaInsets();
  const { lang } = useLang();
  const t = getT(lang);
  const { team, amount } = contract(state);
  const answering = state.teams[team];
  const holder = state.teams[opponent(state)];
  const rawSubject = getSubject(currentQuestion(state), lang);
  const subject = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase();

  const answeringTextColor = BADGE_TEXT_COLOR[answering.color] ?? colors.purpleDeep;
  const holderTextColor = BADGE_TEXT_COLOR[holder.color] ?? colors.purpleDeep;

  // Animation compteur : 0 → amount, chiffre par chiffre
  // stepDelay s'adapte : ~160ms/chiffre pour les petits (3→4), ~75ms pour les grands (19→20)
  const [displayedAmount, setDisplayedAmount] = useState(0);
  useEffect(() => {
    setDisplayedAmount(0);
    if (amount === 0) return;
    const stepDelay = Math.max(20, Math.min(60, 500 / amount));
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      setDisplayedAmount(step);
      if (step >= amount) clearInterval(id);
    }, stepDelay);
    return () => clearInterval(id);
  }, [amount]);

  return (
    <View style={styles.wrapper}>
      {/* Zone bleue — round + badge équipe + question + objectif */}
      <View style={styles.topContent}>
        <View style={styles.roundPill}>
          <Text style={styles.roundLabel}>{t.ready.round} {state.round + 1}/{state.roundCount}</Text>
        </View>

        <View style={[styles.teamBadge, { backgroundColor: answering.color }]}>
          <Text style={[styles.teamBadgeText, { color: answeringTextColor }]} numberOfLines={1}>
            {answering.name}
          </Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{subject}</Text>
        </View>

        <View style={styles.objectifSection}>
          <Text style={styles.objectifLabel}>{t.ready.target}</Text>
          <View style={styles.amountBadge}>
            <Text style={styles.amountText}>{displayedAmount}</Text>
          </View>
        </View>
      </View>

      {/* Bouton JOUER */}
      <Pressable
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel="Jouer"
        style={styles.btnWrap}
      >
        <LinearGradient
          colors={['#fb940e', '#f2c512']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btnInner}
        >
          <Text style={styles.btnText}>{t.ready.play}</Text>
        </LinearGradient>
      </Pressable>

      {/* Carte info — qui tient l'appareil, qui répond */}
      <View style={[styles.infoCard, { marginBottom: Math.max(insets.bottom + 8, 16) }]}>
        <View style={styles.infoRow}>
          <PhoneIcon />
          <View style={[styles.infoTeamBadge, { backgroundColor: holder.color }]}>
            <Text style={[styles.infoTeamText, { color: holderTextColor }]} numberOfLines={1}>
              {holder.name}
            </Text>
          </View>
          <Text style={styles.infoText}>{t.ready.holdsPhone}</Text>
        </View>
        <View style={styles.infoRow}>
          <ChatIcon />
          <View style={[styles.infoTeamBadge, { backgroundColor: answering.color }]}>
            <Text style={[styles.infoTeamText, { color: answeringTextColor }]} numberOfLines={1}>
              {answering.name}
            </Text>
          </View>
          <Text style={styles.infoText}>{t.ready.answers}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 32,
  },
  topContent: {
    flex: 1,
    gap: 32,
    alignItems: 'center',
  },
  roundPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roundLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
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
    backgroundColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 13,
    width: '100%',
  },
  questionText: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.purpleDeep,
  },
  objectifSection: {
    gap: 24,
    alignItems: 'center',
  },
  objectifLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  amountBadge: {
    backgroundColor: colors.purpleDeep,
    borderRadius: 12,
    height: 85,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    fontFamily: fonts.displayMedium,
    fontSize: 48,
    color: colors.cream,
  },
  btnWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#a15c03',
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnInner: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 51,
  },
  btnText: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
  },
  infoCard: {
    backgroundColor: '#fef1cb',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 24,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoTeamBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '45%',
  },
  infoTeamText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
  },
  infoText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.purpleDeep,
    flexShrink: 1,
  },
});
