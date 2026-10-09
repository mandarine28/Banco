import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { type Team, useGameSettings } from '@/state/gameSettings';
import { colors, fonts, teamColors } from '@/theme';

const MAX_WIDTH = 500;
const NAME_MAX_LENGTH = 16;

const TAKEN_COLORS: Record<string, string> = {
  '#33FF5C': '#45A157',
  '#FB0ED4': '#A14592',
  '#FBD40E': '#A19245',
  '#27FBED': '#45A19B',
};

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

const SETTING_PATH =
  'M12.1523 0C12.9816 0 13.7558 0.414588 14.2158 1.10449L15.1445 2.49707C15.7968 3.47551 16.9758 3.96402 18.1289 3.7334L18.4355 3.67188C19.195 3.51999 19.9807 3.75708 20.5283 4.30469L20.624 4.40137C21.2715 5.04885 21.432 6.03842 21.0225 6.85742L20.9902 6.92188C20.6001 7.70222 20.7532 8.64481 21.3701 9.26172C21.5925 9.48412 21.8638 9.65145 22.1621 9.75098L22.2158 9.76953C23.1412 10.078 23.7655 10.9436 23.7656 11.9189V12.7949C23.7655 13.721 23.0961 14.5116 22.1826 14.6641C20.925 14.8737 20.2286 16.2405 20.7988 17.3809L20.9941 17.7705C21.4209 18.6241 21.2529 19.6553 20.5781 20.3301L20.0547 20.8545C19.4148 21.4943 18.4215 21.6159 17.6455 21.1504C16.5637 20.5013 15.1589 21.0211 14.7598 22.2178L14.668 22.4932C14.3678 23.393 13.5257 23.9999 12.5771 24H11.4482C10.5921 23.9999 9.80964 23.5158 9.42676 22.75C8.98292 21.8626 8.01192 21.3682 7.0332 21.5312L6 21.7041C5.09973 21.854 4.18247 21.5594 3.53711 20.9141C2.89174 20.2686 2.59806 19.3515 2.74805 18.4512L2.88672 17.6143C3.066 16.5384 2.4726 15.4824 1.45996 15.0771C0.465873 14.6795 -0.127978 13.6537 0.0234375 12.5938L0.167969 11.582C0.33926 10.3836 1.21916 9.40802 2.39355 9.11426L2.90332 8.9873C3.09371 8.93967 3.26746 8.8409 3.40625 8.70215C3.69636 8.41204 3.79757 7.983 3.66797 7.59375L3.00391 5.59961C2.7116 4.72269 3.04242 3.75883 3.81152 3.24609C4.29202 2.92581 4.88509 2.82283 5.44531 2.96289L7.30859 3.42871C8.38861 3.78864 9.53436 3.09846 9.72168 1.97559L9.76367 1.72754C9.92987 0.730694 10.7921 3.81912e-05 11.8027 0H12.1523ZM11.7656 8C9.5565 8.00001 7.76562 9.79087 7.76562 12C7.76562 14.2091 9.5565 16 11.7656 16C13.9748 16 15.7656 14.2091 15.7656 12C15.7656 9.79086 13.9748 8 11.7656 8Z';

function BackArrow({ size }: { size: number }) {
  const h = (size * 19) / 32;
  return (
    <View pointerEvents="none">
      <Svg width={size} height={h} viewBox="0 0 32 19">
        <Path d={ARROW_PATH} fill={colors.purple} />
      </Svg>
    </View>
  );
}

function SettingIcon({ size }: { size: number }) {
  return (
    <View pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={SETTING_PATH} fill={colors.purple} />
      </Svg>
    </View>
  );
}

function availableAvatars(drafts: Team[], currentIndex: number): readonly string[] {
  const taken = new Set(drafts.slice(0, currentIndex).map((t) => t.color).filter(Boolean));
  return teamColors.filter((c) => !taken.has(c));
}

function initialAvatar(drafts: Team[], teamIndex: number): string {
  const avail = availableAvatars(drafts, teamIndex);
  const saved = drafts[teamIndex]?.color;
  return saved && avail.includes(saved) ? saved : (avail[0] ?? teamColors[0]);
}

export default function TeamSetupScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const { teamCount, teams: savedTeams, setTeams } = useGameSettings();
  const { lang } = useLang();
  const t = getT(lang);
  const defaultName = t.teams.defaultName;

  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<Team[]>(() =>
    Array.from({ length: teamCount }, (_, i) => ({ name: '', color: savedTeams[i]?.color ?? teamColors[i % teamColors.length] })),
  );
  const [name, setName] = useState(() => drafts[0]?.name ?? '');
  const [selectedColor, setSelectedColor] = useState<string>(() => initialAvatar(drafts, 0));

  const panelTop = insets.top + 68;
  const takenColors = new Set(drafts.slice(0, index).map((t) => t.color).filter(Boolean));

  const saveAndContinue = () => {
    const updated = [...drafts];
    updated[index] = { name: name.trim(), color: selectedColor };
    setDrafts(updated);

    if (index + 1 < teamCount) {
      const nextAvail = availableAvatars(updated, index + 1);
      const nextSaved = updated[index + 1]?.color;
      setSelectedColor(nextSaved && nextAvail.includes(nextSaved) ? nextSaved : (nextAvail[0] ?? teamColors[0]));
      setName(updated[index + 1]?.name ?? '');
      setIndex(index + 1);
    } else {
      setTeams(updated.slice(0, teamCount).map((team, i) => ({ ...team, name: team.name || defaultName(i) })));
      router.push('/partie');
    }
  };

  const goBack = () => {
    if (index > 0) {
      const updated = [...drafts];
      updated[index] = { name: name.trim(), color: selectedColor };
      setDrafts(updated);
      setSelectedColor(initialAvatar(updated, index - 1));
      setName(updated[index - 1]?.name ?? '');
      setIndex(index - 1);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        {/* Fond crème */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>

        {/* Panneau bleu */}
        <View style={[styles.bluePanel, { top: panelTop }]}>
          <CreamPatternSvg width={width} height={height - panelTop} opacity={0.04} fill="#ffffff" />
          <View style={[styles.panelInner, { paddingBottom: Math.max(64, insets.bottom + 30) }]}>
            <View style={styles.content}>
              <View style={styles.topSection}>
                {/* Titre + compteur */}
                <View style={styles.titleRow}>
                  <Text style={styles.sectionTitle}>{t.teams.setupTitle}</Text>
                  <Text style={styles.counter}>{index + 1}/{teamCount}</Text>
                </View>

                <View style={styles.sections}>
                  {/* Sélecteur de couleur */}
                  <View style={styles.subsection}>
                    <Text style={styles.label}>{t.teams.chooseColor}</Text>
                    <View style={styles.colorRow}>
                      {teamColors.map((color) => {
                        const isSelected = color === selectedColor;
                        const isTaken = takenColors.has(color);
                        const displayColor = isTaken ? (TAKEN_COLORS[color] ?? color) : color;
                        return (
                          <Pressable
                            key={color}
                            onPress={() => !isTaken && setSelectedColor(color)}
                            accessibilityRole="radio"
                            accessibilityLabel={`Couleur ${color}`}
                            accessibilityState={{ selected: isSelected, disabled: isTaken }}
                            hitSlop={8}
                          >
                            {isSelected ? (
                              <View style={styles.circleOuter}>
                                <View style={styles.circleGap}>
                                  <View style={[styles.circleInner, { backgroundColor: displayColor }]} />
                                </View>
                              </View>
                            ) : (
                              <View style={[styles.colorCircle, { backgroundColor: displayColor }]} />
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  {/* Nom de l'équipe */}
                  <View style={styles.subsection}>
                    <Text style={styles.label}>{t.teams.chooseName}</Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder={t.teams.namePlaceholder(index + 1)}
                      placeholderTextColor="rgba(254,246,215,0.5)"
                      maxLength={NAME_MAX_LENGTH}
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={saveAndContinue}
                      accessibilityLabel={t.teams.namePlaceholder(index + 1)}
                      style={styles.teamInput}
                    />
                  </View>
                </View>
              </View>

              {/* Indicateurs de progression */}
              <View style={styles.progressRow}>
                {Array.from({ length: teamCount }, (_, i) => {
                  const isPast = i < index;
                  const isFuture = i > index;
                  const dotColor = isPast ? (drafts[i]?.color ?? teamColors[i]) : selectedColor;
                  const label = isPast ? (drafts[i]?.name || defaultName(i)) : t.teams.inProgress;
                  return (
                    <View key={i} style={[styles.progressItem, isFuture && styles.hidden]}>
                      <View style={[styles.progressDot, { backgroundColor: dotColor }]} />
                      <Text style={styles.progressText}>{label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Bouton Suivant */}
            <Pressable
              onPress={saveAndContinue}
              accessibilityRole="button"
              accessibilityLabel={t.teams.nextBtn}
            >
              <View style={styles.btnSuivant}>
                <Text style={styles.btnSuivantText}>{t.teams.nextBtn}</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* En-tête */}
        <View
          style={[styles.header, { top: insets.top + 14, left: width * 0.06, right: width * 0.06 }]}
        >
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={10}
          >
            <BackArrow size={Math.min(width * 0.09, 36)} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/reglages')}
            accessibilityRole="button"
            accessibilityLabel="Paramètres"
            hitSlop={10}
          >
            <SettingIcon size={Math.min(width * 0.08, 32)} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  screen: {
    overflow: 'hidden',
  },
  bluePanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.purple,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    overflow: 'hidden',
  },
  panelInner: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 24,
    gap: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    gap: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fef1cc',
  },
  counter: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  sections: {
    gap: 17,
  },
  subsection: {
    gap: 11,
  },
  label: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  circleOuter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  teamInput: {
    backgroundColor: 'rgba(254,246,215,0.2)',
    borderWidth: 1,
    borderColor: colors.cream,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
    minHeight: 51,
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  progressRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hidden: {
    opacity: 0,
  },
  progressDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  progressText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  btnSuivant: {
    height: 51,
    borderRadius: 16,
    backgroundColor: '#fffbf5',
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.purpleDeep,
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  btnSuivantText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.purpleDeep,
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
