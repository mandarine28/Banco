import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { HomeBackground } from '@/components/HomeBackground';
import { AllPacksModal } from '@/components/AllPacksModal';
import { ConfirmModal } from '@/components/InfoModal';
import { CheckBadge, type PackTileLabels, type SpecialPack } from '@/components/PackTile';
import { SelectAllToggle } from '@/components/SelectAllToggle';
import { SpecialPacksPass } from '@/components/SpecialPacksPass';
import { TimerInfoIllustration } from '@/components/TimerInfoIllustration';
import { Toast, useToast } from '@/components/Toast';
import { PACK_INTROS, PACK_THUMBS } from '@/config/packIntros';
import { GIFT_PACKS, PACK_THEME_IDS, WELCOME_GAMES } from '@/config/shop';
import { questions } from '@/data/questions';
import { themes } from '@/data/themes';
import { playHaptic } from '@/lib/haptics';
import { useLang } from '@/lib/LangContext';
import { gamesUntil } from '@/lib/giftChain';
import { loadPackLastPlayed } from '@/lib/packHistory';
import { type PackLastPlayed, sortByLastPlayed } from '@/lib/packOrder';
import { type Lang, getT } from '@/lib/i18n';
import { ROUND_LIMITS, SURVIE_TIMER_OPTIONS, type SurvieTimer, useGameSettings } from '@/state/gameSettings';
import { usePurchases } from '@/state/purchases';
import { LockedGiftModal } from '@/components/LockedGiftModal';
import { useGiftChain } from '@/state/useGifts';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';

const MAX_WIDTH = 500;
// Hauteur du fondu entre le titre fixe et le contenu qui défile
const STICKY_FADE = 44;
// Fondu en courbe douce (ease-out) : un dégradé linéaire court laissait une bande visible
const STICKY_FADE_COLORS = ['rgba(38,109,228,1)', 'rgba(38,109,228,0.82)', 'rgba(38,109,228,0.55)', 'rgba(38,109,228,0.3)', 'rgba(38,109,228,0.12)', 'rgba(38,109,228,0)'] as const;
const STICKY_FADE_STOPS = [0, 0.15, 0.35, 0.6, 0.82, 1] as const;

const ARROW_PATH =
  'M25.3411 5.19038L31.4496 10.4604C32.1513 11.0658 31.7232 12.2175 30.7964 12.2175H25.3559L13.1071 11.5356C12.5339 11.5036 12.0515 11.9599 12.0515 12.534V17.1142C12.0515 17.8923 11.2019 18.3723 10.5354 17.9707L0.484021 11.9139C-0.0406948 11.5977 -0.16034 10.8883 0.231643 10.4175L8.60512 0.36043C9.12279 -0.26133 10.1261 -0.0429697 10.3385 0.737696L11.8143 6.16055C11.949 6.65574 12.4367 6.96854 12.943 6.88446L24.5241 4.96105C24.817 4.91241 25.1163 4.99643 25.3411 5.19038Z';

const SETTING_PATH =
  'M12.1523 0C12.9816 0 13.7558 0.414588 14.2158 1.10449L15.1445 2.49707C15.7968 3.47551 16.9758 3.96402 18.1289 3.7334L18.4355 3.67188C19.195 3.51999 19.9807 3.75708 20.5283 4.30469L20.624 4.40137C21.2715 5.04885 21.432 6.03842 21.0225 6.85742L20.9902 6.92188C20.6001 7.70222 20.7532 8.64481 21.3701 9.26172C21.5925 9.48412 21.8638 9.65145 22.1621 9.75098L22.2158 9.76953C23.1412 10.078 23.7655 10.9436 23.7656 11.9189V12.7949C23.7655 13.721 23.0961 14.5116 22.1826 14.6641C20.925 14.8737 20.2286 16.2405 20.7988 17.3809L20.9941 17.7705C21.4209 18.6241 21.2529 19.6553 20.5781 20.3301L20.0547 20.8545C19.4148 21.4943 18.4215 21.6159 17.6455 21.1504C16.5637 20.5013 15.1589 21.0211 14.7598 22.2178L14.668 22.4932C14.3678 23.393 13.5257 23.9999 12.5771 24H11.4482C10.5921 23.9999 9.80964 23.5158 9.42676 22.75C8.98292 21.8626 8.01192 21.3682 7.0332 21.5312L6 21.7041C5.09973 21.854 4.18247 21.5594 3.53711 20.9141C2.89174 20.2686 2.59806 19.3515 2.74805 18.4512L2.88672 17.6143C3.066 16.5384 2.4726 15.4824 1.45996 15.0771C0.465873 14.6795 -0.127978 13.6537 0.0234375 12.5938L0.167969 11.582C0.33926 10.3836 1.21916 9.40802 2.39355 9.11426L2.90332 8.9873C3.09371 8.93967 3.26746 8.8409 3.40625 8.70215C3.69636 8.41204 3.79757 7.983 3.66797 7.59375L3.00391 5.59961C2.7116 4.72269 3.04242 3.75883 3.81152 3.24609C4.29202 2.92581 4.88509 2.82283 5.44531 2.96289L7.30859 3.42871C8.38861 3.78864 9.53436 3.09846 9.72168 1.97559L9.76367 1.72754C9.92987 0.730694 10.7921 3.81912e-05 11.8027 0H12.1523ZM11.7656 8C9.5565 8.00001 7.76562 9.79087 7.76562 12C7.76562 14.2091 9.5565 16 11.7656 16C13.9748 16 15.7656 14.2091 15.7656 12C15.7656 9.79086 13.9748 8 11.7656 8Z';

const themeIdsWithQuestions = new Set(questions.map((q) => q.theme));

type Category = { id: string; label: string; labelByLang?: Partial<Record<Lang, string>>; available: boolean };

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
  }))
  .sort((a, b) => displayRank(a.id) - displayRank(b.id));

function BackArrow({ size }: { size: number }) {
  const h = (size * 19) / 32;
  return (
    <View pointerEvents="none">
      <Svg width={size} height={h} viewBox="0 0 32 19">
        <Path d={ARROW_PATH} fill={colors.cream} />
      </Svg>
    </View>
  );
}

function SettingIcon({ size }: { size: number }) {
  return (
    <View pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d={SETTING_PATH} fill={colors.cream} />
      </Svg>
    </View>
  );
}

/** Signe − ou + du compteur (traits arrondis de la maquette). */
function StepSign({ plus }: { plus?: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 15 15">
      <Path
        d={plus ? 'M7.5 1v13M1 7.5h13' : 'M1 7.5h13'}
        stroke={colors.purpleDeep}
        strokeWidth={2.1}
        strokeLinecap="round"
      />
    </Svg>
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
      <Text style={styles.stepperLabel} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
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
          <View style={atMin && styles.stepperBtnDisabled}><StepSign /></View>
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
          <View style={atMax && styles.stepperBtnDisabled}><StepSign plus /></View>
        </Pressable>
      </View>
    </View>
  );
}

type TimerSliderProps = {
  label: string;
  value: SurvieTimer;
  onChange: (value: SurvieTimer) => void;
};

/** Barre des durées : toucher ou glisser le pouce, la durée sous le doigt est choisie en direct. */
function TimerSlider({ label, value, onChange }: TimerSliderProps) {
  const width = useRef(0);
  // Geste commencé sur la barre : pas de retour par balayage (plein écran avec l'animation en fondu) tant que le doigt
  // est posé. Coupé dès le contact, avant que le geste du système ne démarre (il attend quelques pixels de glissement).
  const navigation = useNavigation();
  const setBackSwipe = (enabled: boolean) => navigation.setOptions({ gestureEnabled: enabled });
  useEffect(() => () => navigation.setOptions({ gestureEnabled: true }), [navigation]);
  // Dernière durée choisie pendant le geste : évite de rejouer la vibration sur la même case
  const last = useRef(value);
  const pick = (x: number) => {
    if (!width.current) return;
    const at = Math.floor((x / width.current) * SURVIE_TIMER_OPTIONS.length);
    const option = SURVIE_TIMER_OPTIONS[Math.max(0, Math.min(SURVIE_TIMER_OPTIONS.length - 1, at))];
    if (option === last.current) return;
    last.current = option;
    playHaptic('selection');
    onChange(option);
  };
  const index = SURVIE_TIMER_OPTIONS.indexOf(value);
  const optionLabel = (option: SurvieTimer) => (option === 'turbo' ? 'Turbo' : `${option} s`);
  const step = (delta: number) => {
    const next = SURVIE_TIMER_OPTIONS[Math.max(0, Math.min(SURVIE_TIMER_OPTIONS.length - 1, index + delta))];
    if (next !== value) onChange(next);
  };
  return (
    <View
      style={styles.timerOptions}
      onLayout={(e) => { width.current = e.nativeEvent.layout.width; }}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: optionLabel(value) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => step(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
      onTouchStart={() => setBackSwipe(false)}
      onTouchEnd={() => setBackSwipe(true)}
      onTouchCancel={() => setBackSwipe(true)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      // Le défilement de la page ne vole pas le geste en cours
      onResponderTerminationRequest={() => false}
      onResponderGrant={(e) => {
        last.current = value;
        pick(e.nativeEvent.locationX);
      }}
      onResponderMove={(e) => pick(e.nativeEvent.locationX)}
    >
      {SURVIE_TIMER_OPTIONS.map((option) => {
        const selected = option === value;
        return (
          <View key={option} style={[styles.timerOption, selected && styles.timerOptionSelected]} pointerEvents="none">
            {/* « Turbo » : même mot dans toutes les langues */}
            <Text selectable={false} style={[styles.timerOptionText, selected && styles.timerOptionTextSelected]}>{optionLabel(option)}</Text>
          </View>
        );
      })}
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

/** Chrono de survie : interrupteur, puis choix de la durée (une seule barre, sans pictos) quand il est activé. */
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
          <Text style={styles.rowLabel} numberOfLines={1} adjustsFontSizeToFit>{label}</Text>
          <Pressable
            onPress={() => setShowInfo(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`${label} : info`}
          >
            <View style={styles.infoBadge}>
              <MaterialCommunityIcons name="information-variant" size={16} color={colors.cream} />
            </View>
          </Pressable>
        </View>
        <Switch
          value={enabled}
          onValueChange={(on) => {
            playHaptic('selection');
            onChange(on ? SURVIE_TIMER_OPTIONS[0] : null);
          }}
          // Bleu de l'app : l'orange est réservé aux actions et aux prix
          trackColor={{ false: 'rgba(12,45,100,0.25)', true: colors.purple }}
          thumbColor={colors.white}
          ios_backgroundColor="rgba(12,45,100,0.25)"
          accessibilityLabel={label}
        />
      </View>
      {value !== null ? <TimerSlider label={label} value={value} onChange={onChange} /> : null}
    </View>
  );
}

export default function MatchSettingsScreen() {
  const { width: windowWidth, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.min(windowWidth, MAX_WIDTH);
  const { mode, roundCount, setRoundCount, setSelectedThemes, survieTimer, setSurvieTimer } = useGameSettings();
  const { hasPurchased } = usePurchases();
  // Packs en essai (vidéo regardée, partie pas encore lancée) : cochés d'office à chaque ouverture de l'écran
  const { trialPacks, addTrialPack } = useGameSettings();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(trialPacks));
  const toast = useToast();
  const noCategory = selected.size === 0;

  // Un pack gagné entre-temps n'est plus « en essai »
  const trialIds = new Set(trialPacks.filter((id) => !GIFT_PACKS.some((product) => PACK_THEME_IDS[product] === id && hasPurchased(product))));
  // Pack offert touché alors qu'il n'est pas encore gagné
  const [lockedTheme, setLockedTheme] = useState<string | null>(null);
  const [showAllPacks, setShowAllPacks] = useState(false);
  const { chain } = useGiftChain();
  const { lang } = useLang();
  const t = getT(lang);
  // Passe des packs offerts, numérotés dans l'ordre où on les gagne
  const specialPacks: SpecialPack[] = GIFT_PACKS.flatMap((product) => {
    const id = PACK_THEME_IDS[product];
    const image = id ? PACK_THUMBS[id] : undefined;
    if (!id || !image) return [];
    // Pack en essai (pub regardée) : jouable comme un pack gagné, avec la mention « essai »
    const playable = hasPurchased(product) || trialIds.has(id);
    const gamesLeft = chain ? gamesUntil(chain, product) : undefined;
    return [{ id, rank: GIFT_PACKS.indexOf(product) + 1, title: t.shop.packTitles[id] ?? id, image, playable, trial: trialIds.has(id), selected: selected.has(id), gamesLeft }];
  });
  // Piste : packs joués récemment en tête ; la grille « tous les packs » garde l'ordre de la chaîne
  const [lastPlayed, setLastPlayed] = useState<PackLastPlayed>({});
  useEffect(() => {
    loadPackLastPlayed().then(setLastPlayed);
  }, []);
  const passPacks = sortByLastPlayed(specialPacks, lastPlayed);
  const packLabels: PackTileLabels = { trial: t.shop.trialBadge, locked: t.common.locked, freeIn: t.matchSettings.freeIn, gamesCount: t.matchSettings.gamesCount };
  const playablePackIds = specialPacks.filter((pack) => pack.playable).map((pack) => pack.id);
  // Flèches de la fenêtre d'un pack bloqué : même ordre que la grille ou la piste d'où on l'a ouverte
  const lockedThemes = (showAllPacks ? specialPacks : passPacks).filter((pack) => !pack.playable).map((pack) => pack.id);
  const allPacksSelected = playablePackIds.length > 0 && playablePackIds.every((id) => selected.has(id));
  const toggleAllPacks = () => setSelected((prev) => {
    const next = new Set(prev);
    for (const id of playablePackIds) {
      if (allPacksSelected) next.delete(id);
      else next.add(id);
    }
    return next;
  });
  const classicIds = BASE_CATEGORIES.filter((c) => c.available).map((c) => c.id);
  const allClassicSelected = classicIds.every((id) => selected.has(id));
  // Ne touche qu'aux catégories classiques : les packs cochés restent cochés
  const toggleAllClassic = () => setSelected((prev) => {
    const next = new Set(prev);
    for (const id of classicIds) {
      if (allClassicSelected) next.delete(id);
      else next.add(id);
    }
    return next;
  });
  const settingsTitle = mode === 'survie' ? t.common.survieSettings : t.common.auctionSettings;


  // Par défaut, la partie d'essai ne pioche que dans ce pack ; le joueur peut en recocher d'autres
  const startTrial = (themeId: string) => {
    addTrialPack(themeId);
    setSelected(new Set([themeId]));
  };
  const scrollRef = useRef<ScrollViewInstance>(null);
  // Fondu sous le titre fixe : seulement quand du contenu passe dessous (au repos il estomperait les premiers réglages)
  const [scrolled, setScrolled] = useState(false);
  const [fadeOpacity] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(fadeOpacity, { toValue: scrolled ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [scrolled, fadeOpacity]);
  const categoriesY = useRef(0);
  // Le joueur passe aux catégories : on les remonte sous le titre fixe pour qu'il les voie toutes, packs compris
  const anchorCategories = () => scrollRef.current?.scrollTo({ y: Math.max(0, categoriesY.current - STICKY_FADE), animated: true });

  const toggleCategory = (id: string) => {
    const playable = classicIds.includes(id) || specialPacks.some((pack) => pack.id === id && pack.playable);
    if (!playable) return;
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

  const onPackPress = (pack: SpecialPack) => (pack.playable ? toggleCategory(pack.id) : setLockedTheme(pack.id));

  return (
    <View style={styles.page}>
      <View style={[styles.screen, { width, height }]}>
        {/* Fond crème + blobs */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}>
          <HomeBackground width={width} height={height} />
        </View>

        {/* Panneau bleu */}
        <View style={styles.bluePanel}>
          <CreamPatternSvg width={width} height={height} opacity={0.04} fill="#ffffff" />
          {/* Titre fixe, sur fond bleu plein : reste lisible quand les réglages passent dessous */}
          <View style={[styles.stickyTitle, { paddingTop: insets.top + 60 }]}>
            <Text style={styles.sectionTitle}>{settingsTitle}</Text>
            {/* Fondu sous le titre : le contenu disparaît en douceur en passant dessous */}
            <Animated.View style={[styles.stickyFade, { opacity: fadeOpacity }]} pointerEvents="none">
              <LinearGradient colors={STICKY_FADE_COLORS} locations={STICKY_FADE_STOPS} style={StyleSheet.absoluteFill} />
            </Animated.View>
          </View>
          <ScrollView
            ref={scrollRef}
            scrollEventThrottle={32}
            onScroll={(e) => {
              const isScrolled = e.nativeEvent.contentOffset.y > 4;
              if (isScrolled !== scrolled) setScrolled(isScrolled);
            }}
            style={styles.panelScroll}
            contentContainerStyle={[styles.panelContent, { paddingBottom: 24 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Paramètre de jeux */}
            <View style={styles.settingsSection}>
              <View style={styles.rowList}>
                {/* Le nombre d'équipes se règle à la création des équipes (bouton « Ajouter une équipe ») */}
                <StepperRow
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
            <View style={styles.categoriesSection} onLayout={(e) => { categoriesY.current = e.nativeEvent.layout.y; }}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t.matchSettings.categoriesTitle}</Text>
                <SelectAllToggle
                  checked={allClassicSelected}
                  selectLabel={t.common.selectAll}
                  deselectLabel={t.common.deselectAll}
                  onToggle={() => {
                    toggleAllClassic();
                    anchorCategories();
                  }}
                />
              </View>
              <View style={styles.section}>
                {/* Pas de défilement imbriqué : il se battait avec celui de la page, toute la liste défile avec la page */}
                <View style={styles.chips}>
                  {BASE_CATEGORIES.map((cat) => {
                    const isActive = selected.has(cat.id);
                    const label = cat.labelByLang?.[lang] ?? cat.label;
                    return (
                      <Pressable
                        key={cat.id}
                        style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
                        onPress={() => {
                          toggleCategory(cat.id);
                          anchorCategories();
                        }}
                        // Cocher → son « bonne réponse », décocher → clic principal
                        sound={isActive ? 'tap' : 'correct'}
                        soundOnRelease
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isActive }}
                        accessibilityLabel={label}
                      >
                        <Text style={[styles.chipText, { color: colors.cream }]}>{label}</Text>
                        {isActive ? (
                          <View style={styles.chipCheck} pointerEvents="none">
                            <CheckBadge size={16} />
                          </View>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              {/* Sous les catégories classiques : visibles sans défiler, la piste dépasse en bas et invite à descendre */}
              <SpecialPacksPass
                title={t.matchSettings.specialPacks}
                seeAllLabel={t.matchSettings.seeAllPacks}
                labels={packLabels}
                packs={passPacks}
                onPackPress={onPackPress}
                onSeeAll={() => setShowAllPacks(true)}
                selectAll={playablePackIds.length > 0 ? (
                  <SelectAllToggle
                    checked={allPacksSelected}
                    selectLabel={t.common.selectAll}
                    deselectLabel={t.common.deselectAll}
                    onToggle={toggleAllPacks}
                  />
                ) : null}
              />
            </View>
          </ScrollView>

          <AllPacksModal
            visible={showAllPacks}
            title={t.matchSettings.specialPacks}
            closeLabel={t.shop.close}
            howTo={t.matchSettings.packsHowTo(WELCOME_GAMES)}
            labels={packLabels}
            packs={specialPacks}
            onPackPress={onPackPress}
            onClose={() => setShowAllPacks(false)}
            selectAll={playablePackIds.length > 0 ? (
              <SelectAllToggle
                checked={allPacksSelected}
                selectLabel={t.common.selectAll}
                deselectLabel={t.common.deselectAll}
                onToggle={toggleAllPacks}
              />
            ) : null}
          >
            {/* Rendue dans la grille ouverte : deux fenêtres sœurs ne s'empilent pas sur iOS */}
            {showAllPacks ? <LockedGiftModal themeId={lockedTheme} onClose={() => setLockedTheme(null)} onTrialGranted={startTrial} lockedThemes={lockedThemes} onChangeTheme={setLockedTheme} /> : null}
          </AllPacksModal>
          {showAllPacks ? null : <LockedGiftModal themeId={lockedTheme} onClose={() => setLockedTheme(null)} onTrialGranted={startTrial} lockedThemes={lockedThemes} onChangeTheme={setLockedTheme} />}

          {/* Continuer — toujours visible */}
          <View style={[styles.continuerWrapper, { paddingBottom: Math.max(24, insets.bottom + 16) }]}>
            <Toast toast={toast} message={t.matchSettings.pickCategoryFirst} />
            {/* Reste pressable même inactif : un appui explique pourquoi on ne peut pas continuer */}
            <Pressable
              style={noCategory && styles.btnContinuerDisabled}
              accessibilityState={{ disabled: noCategory }}
              accessibilityHint={noCategory ? t.matchSettings.pickCategoryFirst : undefined}
              onPress={noCategory ? toast.show : () => {
                setSelectedThemes([...selected]);
                // Un seul pack choisi, avec son illustration : on plonge dans son ambiance avant les équipes
                const [theme] = selected;
                if (selected.size === 1 && PACK_INTROS[theme]) router.push({ pathname: '/pack-intro', params: { theme } });
                else router.push('/equipes');
              }}
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
    top: 0,
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
  // Commence sous le fondu du titre fixe
  panelContent: {
    paddingTop: 16,
    paddingHorizontal: 24,
    gap: 24,
  },
  stickyTitle: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    backgroundColor: colors.purple,
    zIndex: 1,
  },
  stickyFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -STICKY_FADE,
    height: STICKY_FADE,
  },
  continuerWrapper: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    gap: 16,
  },
  settingsSection: {
    gap: 20,
  },
  categoriesSection: {
    gap: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fef1cc',
  },
  rowList: {
    gap: 12,
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
    gap: 12,
  },
  // Même taille que les autres textes de l'écran (catégories, packs)
  stepperLabel: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.purpleDeep,
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
    backgroundColor: colors.purpleDeep,
  },
  timerOptions: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.purpleDeep,
    overflow: 'hidden',
  },
  timerOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  // Même code que la valeur des compteurs : bleu nuit = durée choisie
  timerOptionSelected: {
    backgroundColor: colors.purpleDeep,
  },
  timerOptionText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  timerOptionTextSelected: {
    color: colors.cream,
  },
  rowLabel: {
    flexShrink: 1,
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.purpleDeep,
  },
  // Largeur au contenu (− valeur +) : l'ancienne largeur fixe de 94 débordait sur le libellé
  // Signes écartés du chiffre : le doigt sur − ou + ne cache pas la valeur qu'il change
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flexShrink: 0,
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
    minWidth: 40,
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
  // Cochée : gélule remplie de bleu nuit, la coche crème ressort dessus
  chipActive: {
    backgroundColor: colors.purpleDeep,
  },
  chipInactive: {
    backgroundColor: '#4883E5',
  },
  chipText: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
  },
  chipCheck: {
    position: 'absolute',
    top: -7,
    right: -8,
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
