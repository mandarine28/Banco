import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

const LOCK_PATH =
  'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import { ConfirmModal } from '@/components/InfoModal';
import { TimerInfoIllustration } from '@/components/TimerInfoIllustration';
import { Toast, useToast } from '@/components/Toast';
import { GIFT_PACKS, PACK_THEME_IDS, type ProductId, WELCOME_GAMES } from '@/config/shop';
import { gamesUntil } from '@/lib/giftChain';
import { questions } from '@/data/questions';
import { themes } from '@/data/themes';
import { isRewardGranted, showRewardedAd } from '@/lib/ads';
import { playHaptic } from '@/lib/haptics';
import { useLang } from '@/lib/LangContext';
import { loadUsedTrials } from '@/lib/trials';
import { type Lang, getT } from '@/lib/i18n';
import { ROUND_LIMITS, SURVIE_TIMER_OPTIONS, type SurvieTimer, TEAM_LIMITS, useGameSettings } from '@/state/gameSettings';
import { usePurchases } from '@/state/purchases';
import { useGiftChain } from '@/state/useGifts';
import { useTutorialTarget } from '@/state/tutorial';
import { colors, fonts, teamColors } from '@/theme';
import { Pressable } from '@/components/Pressable';

const MAX_WIDTH = 500;

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

const SETTING_PATH =
  'M12.1523 0C12.9816 0 13.7558 0.414588 14.2158 1.10449L15.1445 2.49707C15.7968 3.47551 16.9758 3.96402 18.1289 3.7334L18.4355 3.67188C19.195 3.51999 19.9807 3.75708 20.5283 4.30469L20.624 4.40137C21.2715 5.04885 21.432 6.03842 21.0225 6.85742L20.9902 6.92188C20.6001 7.70222 20.7532 8.64481 21.3701 9.26172C21.5925 9.48412 21.8638 9.65145 22.1621 9.75098L22.2158 9.76953C23.1412 10.078 23.7655 10.9436 23.7656 11.9189V12.7949C23.7655 13.721 23.0961 14.5116 22.1826 14.6641C20.925 14.8737 20.2286 16.2405 20.7988 17.3809L20.9941 17.7705C21.4209 18.6241 21.2529 19.6553 20.5781 20.3301L20.0547 20.8545C19.4148 21.4943 18.4215 21.6159 17.6455 21.1504C16.5637 20.5013 15.1589 21.0211 14.7598 22.2178L14.668 22.4932C14.3678 23.393 13.5257 23.9999 12.5771 24H11.4482C10.5921 23.9999 9.80964 23.5158 9.42676 22.75C8.98292 21.8626 8.01192 21.3682 7.0332 21.5312L6 21.7041C5.09973 21.854 4.18247 21.5594 3.53711 20.9141C2.89174 20.2686 2.59806 19.3515 2.74805 18.4512L2.88672 17.6143C3.066 16.5384 2.4726 15.4824 1.45996 15.0771C0.465873 14.6795 -0.127978 13.6537 0.0234375 12.5938L0.167969 11.582C0.33926 10.3836 1.21916 9.40802 2.39355 9.11426L2.90332 8.9873C3.09371 8.93967 3.26746 8.8409 3.40625 8.70215C3.69636 8.41204 3.79757 7.983 3.66797 7.59375L3.00391 5.59961C2.7116 4.72269 3.04242 3.75883 3.81152 3.24609C4.29202 2.92581 4.88509 2.82283 5.44531 2.96289L7.30859 3.42871C8.38861 3.78864 9.53436 3.09846 9.72168 1.97559L9.76367 1.72754C9.92987 0.730694 10.7921 3.81912e-05 11.8027 0H12.1523ZM11.7656 8C9.5565 8.00001 7.76562 9.79087 7.76562 12C7.76562 14.2091 9.5565 16 11.7656 16C13.9748 16 15.7656 14.2091 15.7656 12C15.7656 9.79086 13.9748 8 11.7656 8Z';

const themeIdsWithQuestions = new Set(questions.map((q) => q.theme));

type Category = { id: string; label: string; labelByLang?: Partial<Record<Lang, string>>; available: boolean; locked?: boolean };

// Ordre d'affichage : noms courts et longs alternés pour remplir les lignes sans gros blocs
const DISPLAY_ORDER = ['sport', 'musique', 'divertissement', 'cinema', 'culture-generale', 'geographie', 'marques'];
const displayRank = (id: string) => {
  const rank = DISPLAY_ORDER.indexOf(id);
  return rank === -1 ? DISPLAY_ORDER.length : rank;
};

const BASE_CATEGORIES: Category[] = themes
  .map((theme) => ({
    id: theme.id,
    label: theme.label,
    labelByLang: theme.labelByLang,
    available: themeIdsWithQuestions.has(theme.id),
    locked: false,
  }))
  .sort((a, b) => displayRank(a.id) - displayRank(b.id));

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

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

/** Libellé de réglage précédé de son pictogramme. */
function RowLabel({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.rowLabelWrap}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.cream} />
      <Text style={styles.rowLabel} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
    </View>
  );
}

type StepperRowProps = {
  icon: IconName;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
};

function StepperRow({ icon, label, value, min, max, onChange }: StepperRowProps) {
  const atMin = value <= min;
  const atMax = value >= max;
  return (
    <View style={styles.settingRow}>
      <RowLabel icon={icon} label={label} />
      <View style={styles.stepper}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          sound="upDown"
          haptic="selection"
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
          sound="upDown"
          haptic="selection"
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

type TimerRowProps = {
  label: string;
  info: { fixed: string; turbo: string };
  gotItLabel: string;
  value: SurvieTimer | null;
  onChange: (value: SurvieTimer | null) => void;
};

/** Chrono de survie : interrupteur, puis choix de la durée quand il est activé. */
function TimerRow({ label, info, gotItLabel, value, onChange }: TimerRowProps) {
  const enabled = value !== null;
  const [showInfo, setShowInfo] = useState(false);
  return (
    <View style={[styles.settingRow, styles.timerCard]}>
      <ConfirmModal
        visible={showInfo}
        title={label}
        confirmLabel={gotItLabel}
        confirmIcon="timer-outline"
        onConfirm={() => setShowInfo(false)}
        onDismiss={() => setShowInfo(false)}
      >
        <TimerInfoIllustration fixedCaption={info.fixed} turboCaption={info.turbo} />
      </ConfirmModal>
      <View style={styles.timerHeader}>
        <View style={styles.timerTitle}>
          <RowLabel icon="timer-outline" label={label} />
          <Pressable
            onPress={() => setShowInfo(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`${label} : info`}
          >
            {/* Pastille pleine : se distingue de l'icône chrono en contour juste avant */}
            <View style={styles.infoBadge}>
              <MaterialCommunityIcons name="information-variant" size={16} color={colors.purpleDeep} />
            </View>
          </Pressable>
        </View>
        <Switch
          value={enabled}
          onValueChange={(on) => {
            playHaptic('selection');
            onChange(on ? SURVIE_TIMER_OPTIONS[0] : null);
          }}
          // Vert d'équipe : l'orange est réservé aux actions et aux prix
          trackColor={{ false: 'rgba(254,246,215,0.25)', true: teamColors[1] }}
          thumbColor={colors.cream}
          ios_backgroundColor="rgba(254,246,215,0.25)"
          accessibilityLabel={label}
        />
      </View>
      {enabled ? (
        <View style={styles.timerOptions} accessibilityRole="radiogroup">
          {SURVIE_TIMER_OPTIONS.map((option) => {
            const selected = option === value;
            // « Turbo » : même mot dans toutes les langues
            const optionLabel = option === 'turbo' ? 'Turbo' : `${option} s`;
            return (
              <Pressable
                key={option}
                onPress={() => onChange(option)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`${label} ${optionLabel}`}
                style={[styles.timerOption, selected && styles.timerOptionSelected]}
              >
                <Text style={[styles.timerOptionText, selected && styles.timerOptionTextSelected]}>{optionLabel}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export default function MatchSettingsScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const { mode, teamCount, setTeamCount, roundCount, setRoundCount, setSelectedThemes, survieTimer, setSurvieTimer } = useGameSettings();
  const { hasPurchased } = usePurchases();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const toast = useToast();
  const noCategory = selected.size === 0;

  // Packs débloqués pour une partie après une vidéo récompensée
  const [trialIds, setTrialIds] = useState<Set<string>>(new Set());
  const [lockedPack, setLockedPack] = useState<Category | null>(null);
  // Un seul essai par pack : ensuite, achat obligatoire pour y rejouer
  const [usedTrials, setUsedTrials] = useState<Set<string>>(new Set());
  useEffect(() => {
    loadUsedTrials().then(setUsedTrials);
  }, []);
  const trialUsed = lockedPack !== null && usedTrials.has(lockedPack.id);
  const goToShop = () => {
    setLockedPack(null);
    router.push('/boutique');
  };
  // Packs offerts : gagnés en jouant, jamais essayés contre une pub
  const { chain } = useGiftChain();
  const lockedGift: ProductId | undefined = lockedPack ? GIFT_PACKS.find((product) => PACK_THEME_IDS[product] === lockedPack.id) : undefined;
  // Packs offerts en tête de liste, dans l'ordre où on les gagne, avant les catégories de base
  const CATEGORIES: Category[] = [
    ...GIFT_PACKS.map((product) => ({
      id: PACK_THEME_IDS[product] ?? product,
      label: PACK_THEME_IDS[product] ?? product,
      available: hasPurchased(product),
      locked: !hasPurchased(product),
    })),
    ...BASE_CATEGORIES,
  ];
  const { lang } = useLang();
  const t = getT(lang);
  const settingsTitle = mode === 'survie' ? t.common.survieSettings : t.common.auctionSettings;
  const teamsTarget = useTutorialTarget('match-teams');

  const panelTop = insets.top + 68;

  const watchAdForTrial = async (pack: Category) => {
    const result = await showRewardedAd();
    setLockedPack(null);
    if (!isRewardGranted(result)) return;
    setTrialIds((prev) => new Set(prev).add(pack.id));
    // Par défaut, la partie d'essai ne pioche que dans ce pack ; le joueur peut en recocher d'autres
    setSelected(new Set([pack.id]));
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
            {/* Paramètre de jeux */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{settingsTitle}</Text>
              <View style={styles.rowList}>
                <View ref={teamsTarget} collapsable={false}>
                  <StepperRow
                    icon="account-group"
                    label={t.matchSettings.teamCount}
                    value={teamCount}
                    min={TEAM_LIMITS.min}
                    max={TEAM_LIMITS.max}
                    onChange={setTeamCount}
                  />
                </View>
                <StepperRow
                  icon="flag-checkered"
                  label={t.matchSettings.roundCount}
                  value={roundCount}
                  min={ROUND_LIMITS.min}
                  max={ROUND_LIMITS.max}
                  onChange={setRoundCount}
                />
                {mode === 'survie' ? (
                  <TimerRow label={t.matchSettings.timer} info={{ fixed: t.matchSettings.timerInfoFixed, turbo: t.matchSettings.timerInfoTurbo }}
                    gotItLabel={t.gift.gotIt} value={survieTimer} onChange={setSurvieTimer} />
                ) : null}
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
                      accessibilityLabel={allSelected ? t.common.deselectAll : t.common.selectAll}
                      style={styles.selectAllRow}
                    >
                      <Text style={styles.selectAllLabel}>
                        {allSelected ? t.common.deselectAll : t.common.selectAll}
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
              {/* Pas de défilement imbriqué : il se battait avec celui de la page, toute la liste défile avec la page */}
              <View style={styles.chips}>
                  {CATEGORIES.map((cat) => {
                    const isActive = selected.has(cat.id);
                    const isLocked = cat.locked;
                    // Pack débloqué (hors catégories de base) : contour et étoile jaunes de la charte pour le distinguer
                    const isPack = !isLocked && !BASE_CATEGORIES.some((base) => base.id === cat.id);
                    const label = t.shop.packTitles[cat.id] ?? cat.labelByLang?.[lang] ?? cat.label;
                    const displayLabel = trialIds.has(cat.id) ? `${label} · ${t.shop.trialBadge}` : label;
                    return (
                      <Pressable
                        key={cat.id}
                        style={[
                          styles.chip,
                          isLocked ? styles.chipPurchaseLocked : isActive ? styles.chipActive : styles.chipInactive,
                          isPack && styles.chipPack,
                        ]}
                        onPress={isLocked ? () => setLockedPack(cat) : () => toggleCategory(cat.id)}
                        // Cocher → son « bonne réponse », décocher ou catégorie verrouillée → clic principal
                        sound={isLocked || isActive ? 'tap' : 'correct'}
                        soundOnRelease
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isActive, disabled: isLocked }}
                        accessibilityLabel={isLocked ? `${displayLabel} — ${t.common.locked}` : displayLabel}
                      >
                        {isPack ? (
                          <MaterialCommunityIcons
                            name="star-four-points"
                            size={16}
                            color={isActive ? colors.purpleDeep : colors.yellow}
                          />
                        ) : null}
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
              </View>
            </View>
          </ScrollView>

          {/* Pack offert verrouillé : nombre de parties restantes */}
          <ConfirmModal
            visible={lockedGift !== undefined}
            title={lockedPack ? (t.shop.packTitles[lockedPack.id] ?? lockedPack.label) : ''}
            message={t.gift.lockedMsg(chain && lockedGift ? gamesUntil(chain, lockedGift) : WELCOME_GAMES)}
            confirmLabel={t.gift.gotIt}
            confirmIcon="gift"
            onConfirm={() => setLockedPack(null)}
            onDismiss={() => setLockedPack(null)}
          />

          {/* Pack verrouillé : essai d'une partie contre une pub, ou boutique */}
          <ConfirmModal
            visible={lockedPack !== null && lockedGift === undefined}
            title={lockedPack ? (t.shop.packTitles[lockedPack.id] ?? lockedPack.labelByLang?.[lang] ?? lockedPack.label) : ''}
            message={trialUsed ? t.shop.trialUsedMsg : t.shop.trialMsg}
            cancelLabel={t.shop.goToShop}
            cancelIcon="cart"
            confirmLabel={trialUsed ? t.shop.goToShop : t.shop.watchAd}
            confirmIcon={trialUsed ? 'cart' : 'play-circle'}
            onCancel={trialUsed ? undefined : goToShop}
            onConfirm={() => {
              if (trialUsed) goToShop();
              else if (lockedPack) watchAdForTrial(lockedPack);
            }}
            onDismiss={() => setLockedPack(null)}
            onClose={() => setLockedPack(null)}
            closeLabel={t.shop.close}
          />

          {/* Continuer — toujours visible */}
          <View style={[styles.continuerWrapper, { paddingBottom: Math.max(24, insets.bottom + 16) }]}>
            <Toast toast={toast} message={t.matchSettings.pickCategoryFirst} />
            {/* Reste pressable même inactif : un appui explique pourquoi on ne peut pas continuer */}
            <Pressable
              style={noCategory && styles.btnContinuerDisabled}
              accessibilityState={{ disabled: noCategory }}
              accessibilityHint={noCategory ? t.matchSettings.pickCategoryFirst : undefined}
              onPress={noCategory ? toast.show : () => { setSelectedThemes([...selected]); router.push('/equipes'); }}
              accessibilityRole="button"
              accessibilityLabel={t.matchSettings.continueBtn}
            >
              <LinearGradient
                colors={['#fb940e', '#f2c512']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnContinuer}
              >
                <Text style={styles.btnContinuerText}>{t.matchSettings.continueBtn}</Text>
              </LinearGradient>
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
            accessibilityLabel={t.comingSoon.back}
            hitSlop={10}
          >
            <BackArrow size={Math.min(width * 0.09, 36)} />
          </Pressable>
          <Pressable
            onPress={() => router.push('/reglages')}
            accessibilityRole="button"
            accessibilityLabel={t.pages.settings}
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
  // Réglage, pas une option à cocher : fond bleu nuit pour ne pas ressembler aux catégories sélectionnées (crème)
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.purpleDeep,
    borderWidth: 1,
    borderColor: colors.lavender,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minHeight: 51,
    gap: 12,
  },
  timerCard: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
    paddingVertical: 12,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  infoBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  timerOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  // Pastilles comme la valeur des compteurs : crème = durée choisie
  timerOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.lavender,
  },
  timerOptionSelected: {
    backgroundColor: colors.cream,
    borderColor: colors.cream,
  },
  timerOptionText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.cream,
  },
  timerOptionTextSelected: {
    color: colors.purpleDeep,
  },
  rowLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  rowLabel: {
    flexShrink: 1,
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  // Largeur au contenu (− valeur +) : l'ancienne largeur fixe de 94 débordait sur le libellé
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  stepperBtn: {
    fontFamily: fonts.displayMedium,
    fontSize: 32,
    color: colors.cream,
    width: 24,
    textAlign: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.25,
  },
  stepperBadge: {
    backgroundColor: colors.cream,
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
    color: colors.purpleDeep,
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
  // Contour 2 px : padding réduit d'1 px pour garder la taille des autres catégories
  chipPack: {
    borderWidth: 2,
    borderColor: colors.yellow,
    paddingHorizontal: 11,
    paddingVertical: 5,
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
  btnContinuerDisabled: {
    opacity: 0.4,
  },
  // Même bouton que « Continuer » (choix du mode) et « Jouer » (accueil)
  btnContinuer: {
    height: 51,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#a15c03',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a15c03',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  btnContinuerText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  header: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
