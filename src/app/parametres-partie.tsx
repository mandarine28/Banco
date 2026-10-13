import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

const LOCK_PATH =
  'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import { questions } from '@/data/questions';
import { themes } from '@/data/themes';
import { useLang } from '@/lib/LangContext';
import { type Lang, getT } from '@/lib/i18n';
import { ROUND_LIMITS, TEAM_LIMITS, useGameSettings } from '@/state/gameSettings';
import { usePurchases } from '@/state/purchases';
import { colors, fonts } from '@/theme';

const MAX_WIDTH = 500;

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

const SETTING_PATH =
  'M12.1523 0C12.9816 0 13.7558 0.414588 14.2158 1.10449L15.1445 2.49707C15.7968 3.47551 16.9758 3.96402 18.1289 3.7334L18.4355 3.67188C19.195 3.51999 19.9807 3.75708 20.5283 4.30469L20.624 4.40137C21.2715 5.04885 21.432 6.03842 21.0225 6.85742L20.9902 6.92188C20.6001 7.70222 20.7532 8.64481 21.3701 9.26172C21.5925 9.48412 21.8638 9.65145 22.1621 9.75098L22.2158 9.76953C23.1412 10.078 23.7655 10.9436 23.7656 11.9189V12.7949C23.7655 13.721 23.0961 14.5116 22.1826 14.6641C20.925 14.8737 20.2286 16.2405 20.7988 17.3809L20.9941 17.7705C21.4209 18.6241 21.2529 19.6553 20.5781 20.3301L20.0547 20.8545C19.4148 21.4943 18.4215 21.6159 17.6455 21.1504C16.5637 20.5013 15.1589 21.0211 14.7598 22.2178L14.668 22.4932C14.3678 23.393 13.5257 23.9999 12.5771 24H11.4482C10.5921 23.9999 9.80964 23.5158 9.42676 22.75C8.98292 21.8626 8.01192 21.3682 7.0332 21.5312L6 21.7041C5.09973 21.854 4.18247 21.5594 3.53711 20.9141C2.89174 20.2686 2.59806 19.3515 2.74805 18.4512L2.88672 17.6143C3.066 16.5384 2.4726 15.4824 1.45996 15.0771C0.465873 14.6795 -0.127978 13.6537 0.0234375 12.5938L0.167969 11.582C0.33926 10.3836 1.21916 9.40802 2.39355 9.11426L2.90332 8.9873C3.09371 8.93967 3.26746 8.8409 3.40625 8.70215C3.69636 8.41204 3.79757 7.983 3.66797 7.59375L3.00391 5.59961C2.7116 4.72269 3.04242 3.75883 3.81152 3.24609C4.29202 2.92581 4.88509 2.82283 5.44531 2.96289L7.30859 3.42871C8.38861 3.78864 9.53436 3.09846 9.72168 1.97559L9.76367 1.72754C9.92987 0.730694 10.7921 3.81912e-05 11.8027 0H12.1523ZM11.7656 8C9.5565 8.00001 7.76562 9.79087 7.76562 12C7.76562 14.2091 9.5565 16 11.7656 16C13.9748 16 15.7656 14.2091 15.7656 12C15.7656 9.79086 13.9748 8 11.7656 8Z';

const themeIdsWithQuestions = new Set(questions.map((q) => q.theme));

type Category = { id: string; label: string; labelByLang?: Partial<Record<Lang, string>>; available: boolean; locked?: boolean };

const BASE_CATEGORIES: Category[] = themes.map((theme) => ({
  id: theme.id,
  label: theme.label,
  labelByLang: theme.labelByLang,
  available: themeIdsWithQuestions.has(theme.id),
  locked: false,
}));

const DEFAULT_SELECTED = new Set(BASE_CATEGORIES.filter((c) => c.available).map((c) => c.id));

const CHIP_ROW_H = 36;
const CHIP_GAP = 12;
const CATEGORY_CHIPS_H = 5 * CHIP_ROW_H + 4 * CHIP_GAP; // 228 — 5 rows visible

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

type StepperRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
};

function StepperRow({ label, value, min, max, onChange }: StepperRowProps) {
  const atMin = value <= min;
  const atMax = value >= max;
  return (
    <View style={styles.settingRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={atMin}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={`Diminuer ${label}`}
          accessibilityState={{ disabled: atMin }}
        >
          <Text style={[styles.stepperBtn, atMin && styles.stepperBtnDisabled]}>-</Text>
        </Pressable>
        <View style={styles.stepperBadge}>
          <Text style={styles.stepperValue}>{value}</Text>
        </View>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          disabled={atMax}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={`Augmenter ${label}`}
          accessibilityState={{ disabled: atMax }}
        >
          <Text style={[styles.stepperBtn, atMax && styles.stepperBtnDisabled]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function MatchSettingsScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const { mode, setMode, teamCount, setTeamCount, roundCount, setRoundCount, setSelectedThemes } = useGameSettings();
  const { hasPurchased } = usePurchases();
  const [selected, setSelected] = useState<Set<string>>(DEFAULT_SELECTED);

  const hasHarryPotter = hasPurchased('packHarryPotter');
  const CATEGORIES: Category[] = [
    ...BASE_CATEGORIES,
    {
      id: 'harry-potter',
      label: 'Harry Potter',
      available: hasHarryPotter,
      locked: !hasHarryPotter,
    },
  ];
  const [chipsScrollY, setChipsScrollY] = useState(0);
  const [chipsContentH, setChipsContentH] = useState(0);
  const [chipsContainerH, setChipsContainerH] = useState(0);
  const { lang } = useLang();
  const t = getT(lang);

  const isChipsScrollable = chipsContentH > chipsContainerH;
  const thumbH = isChipsScrollable
    ? Math.max(20, (chipsContainerH / chipsContentH) * chipsContainerH)
    : chipsContainerH;
  const thumbTop = isChipsScrollable
    ? (chipsScrollY / (chipsContentH - chipsContainerH)) * (chipsContainerH - thumbH)
    : 0;

  const [lockedToast, setLockedToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const panelTop = insets.top + 68;
  const toastBottom = Math.max(24, insets.bottom + 16) + 51 + 16 + 8;

  const handleLockedPress = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setLockedToast(true);
    toastTimer.current = setTimeout(() => setLockedToast(false), 1800);
  };

  const toggleCategory = (id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    if (!cat?.available) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        {/* Fond crème + blobs */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>

        {/* Panneau bleu */}
        <View style={[styles.bluePanel, { top: panelTop }]}>
          <CreamPatternSvg width={width} height={height - panelTop} opacity={0.04} fill="#ffffff" />
          <ScrollView
            style={styles.panelScroll}
            contentContainerStyle={[styles.panelContent, { paddingBottom: 24 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Sélection du mode */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mode de jeu</Text>
              <View style={styles.modeRow}>
                <Pressable
                  style={[styles.modeChip, mode !== 'survie' && styles.modeChipActive]}
                  onPress={() => setMode('classique')}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: mode !== 'survie' }}
                  accessibilityLabel="Mode Classique"
                >
                  <Text style={[styles.modeChipText, mode !== 'survie' && styles.modeChipTextActive]}>
                    Classique
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.modeChip, mode === 'survie' && styles.modeChipActive]}
                  onPress={() => setMode('survie')}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: mode === 'survie' }}
                  accessibilityLabel="Mode Survie"
                >
                  <Text style={[styles.modeChipText, mode === 'survie' && styles.modeChipTextActive]}>
                    Survie
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Paramètre de jeux */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.matchSettings.settingsTitle}</Text>
              <View style={styles.rowList}>
                <StepperRow
                  label={t.matchSettings.teamCount}
                  value={teamCount}
                  min={TEAM_LIMITS.min}
                  max={TEAM_LIMITS.max}
                  onChange={setTeamCount}
                />
                <StepperRow
                  label={t.matchSettings.roundCount}
                  value={roundCount}
                  min={ROUND_LIMITS.min}
                  max={ROUND_LIMITS.max}
                  onChange={setRoundCount}
                />
              </View>
            </View>

            {/* Catégories de questions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t.matchSettings.categoriesTitle}</Text>
                {(() => {
                  const available = CATEGORIES.filter((c) => !c.locked).map((c) => c.id);
                  const allSelected = available.every((id) => selected.has(id));
                  return (
                    <Pressable
                      onPress={() => setSelected(allSelected ? new Set() : new Set(available))}
                      hitSlop={8}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: allSelected }}
                      accessibilityLabel={allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                      style={styles.selectAllRow}
                    >
                      <Text style={styles.selectAllLabel}>
                        {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                      </Text>
                      <Svg width={28} height={28} viewBox="0 0 24 24">
                        {allSelected ? (
                          <>
                            <Rect x="2" y="2" width="20" height="20" rx="6" fill={colors.cream} />
                            <Path d="M9 12l2 2 4-4" stroke={colors.purple} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </>
                        ) : (
                          <Rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="rgba(254,246,215,0.5)" strokeWidth="2" />
                        )}
                      </Svg>
                    </Pressable>
                  );
                })()}
              </View>
              <View style={styles.chipsArea}>
                <View
                  style={styles.scrollTrack}
                  onLayout={(e) => setChipsContainerH(e.nativeEvent.layout.height)}
                >
                  {isChipsScrollable ? (
                    <View style={[styles.scrollThumb, { height: thumbH, top: thumbTop }]} />
                  ) : (
                    <View style={[styles.scrollThumb, { height: chipsContainerH, top: 0 }]} />
                  )}
                </View>
                <ScrollView
                  style={styles.chipsScroll}
                  contentContainerStyle={styles.chips}
                  showsVerticalScrollIndicator={false}
                  scrollEventThrottle={16}
                  nestedScrollEnabled={true}
                  onScroll={(e) => setChipsScrollY(e.nativeEvent.contentOffset.y)}
                  onContentSizeChange={(_, h) => setChipsContentH(h)}
                >
                  {CATEGORIES.map((cat) => {
                    const isActive = selected.has(cat.id);
                    const isLocked = cat.locked;
                    const displayLabel = cat.labelByLang?.[lang] ?? cat.label;
                    return (
                      <Pressable
                        key={cat.id}
                        style={[
                          styles.chip,
                          isLocked ? styles.chipPurchaseLocked : isActive ? styles.chipActive : styles.chipInactive,
                        ]}
                        onPress={isLocked ? handleLockedPress : () => toggleCategory(cat.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isActive, disabled: isLocked }}
                        accessibilityLabel={isLocked ? `${displayLabel} — verrouillé` : displayLabel}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isLocked
                              ? styles.chipTextLocked
                              : { color: isActive ? colors.purpleDeep : colors.cream },
                          ]}
                        >
                          {displayLabel}
                        </Text>
                        {isLocked && (
                          <Svg width={24} height={24} viewBox="0 0 24 24" style={styles.chipLockIcon}>
                            <Path d={LOCK_PATH} fill={colors.cream} />
                          </Svg>
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </ScrollView>

          {/* Toast chip verrouillé */}
          {lockedToast && (
            <View style={[styles.lockedToast, { bottom: toastBottom }]}>
              <Text style={styles.lockedToastText}>Disponible dans la boutique</Text>
              <Pressable
                style={styles.lockedToastCta}
                onPress={() => { setLockedToast(false); router.push('/boutique'); }}
                accessibilityRole="button"
                accessibilityLabel="Aller à la boutique"
              >
                <Text style={styles.lockedToastCtaText}>Boutique</Text>
              </Pressable>
            </View>
          )}

          {/* Continuer — toujours visible */}
          <View style={[styles.continuerWrapper, { paddingBottom: Math.max(24, insets.bottom + 16) }]}>
            <Pressable
              style={styles.btnContinuer}
              onPress={() => { setSelectedThemes([...selected]); router.push('/equipes'); }}
              accessibilityRole="button"
              accessibilityLabel={t.matchSettings.continueBtn}
            >
              <Text style={styles.btnContinuerText}>{t.matchSettings.continueBtn}</Text>
            </Pressable>
          </View>
        </View>

        {/* En-tête */}
        <View
          style={[
            styles.header,
            { top: insets.top + 14, left: width * 0.06, right: width * 0.06 },
          ]}
        >
          <Pressable
            onPress={() => router.back()}
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
  panelScroll: {
    flex: 1,
  },
  panelContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    gap: 48,
  },
  chipsArea: {
    maxHeight: CATEGORY_CHIPS_H,
    flexDirection: 'row',
    gap: 8,
  },
  chipsScroll: {
    flex: 1,
  },
  scrollTrack: {
    width: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollThumb: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  continuerWrapper: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    gap: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectAllLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 13,
    color: 'rgba(254,246,215,0.6)',
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fef1cc',
  },
  rowList: {
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.cream,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
    minHeight: 51,
  },
  rowLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.purpleDeep,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 94,
    justifyContent: 'flex-end',
  },
  stepperBtn: {
    fontFamily: fonts.displayMedium,
    fontSize: 32,
    color: colors.purpleDeep,
    width: 24,
    textAlign: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.25,
  },
  stepperBadge: {
    backgroundColor: colors.purpleDeep,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 38,
  },
  stepperValue: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chipActive: {
    backgroundColor: colors.cream,
  },
  chipInactive: {
    backgroundColor: '#4883E5',
  },
  chipPurchaseLocked: {
    backgroundColor: '#8592A8',
    borderColor: colors.cream,
  },
  chipText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
  },
  chipTextLocked: {
    color: colors.cream,
  },
  chipLockIcon: {
    marginTop: 1,
  },
  btnContinuer: {
    height: 51,
    borderRadius: 16,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContinuerText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modeChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(254,246,215,0.4)',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#4883E5',
  },
  modeChipActive: {
    backgroundColor: colors.cream,
    borderColor: colors.cream,
  },
  modeChipText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.cream,
  },
  modeChipTextActive: {
    color: colors.purpleDeep,
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lockedToast: {
    position: 'absolute',
    left: 24,
    right: 24,
    backgroundColor: colors.purpleDeep,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  lockedToastText: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.cream,
    flex: 1,
  },
  lockedToastCta: {
    backgroundColor: colors.pink,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
  },
  lockedToastCtaText: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.cream,
  },
});
