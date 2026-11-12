import { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';

import Svg, { Path } from 'react-native-svg';

import { Pressable } from '@/components/Pressable';
import { PACK_THUMBS } from '@/config/packIntros';
import { GIFT_PACKS, PACK_THEME_IDS, WELCOME_GAMES } from '@/config/shop';
import { questions } from '@/data/questions';
import { isRewardGranted, showRewardedAd } from '@/lib/ads';
import { gamesUntil } from '@/lib/giftChain';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { loadUsedTrials } from '@/lib/trials';
import { useGiftChain } from '@/state/useGifts';
import { colors, fonts } from '@/theme';

type Props = {
  /** Thème du pack offert touché (null = fenêtre fermée). */
  themeId: string | null;
  onClose: () => void;
  /** Pub regardée jusqu'au bout : le pack peut être joué une partie. */
  onTrialGranted: (themeId: string) => void;
  /** Packs bloqués dans l'ordre affiché : flèches de part et d'autre pour passer de l'un à l'autre. */
  lockedThemes?: string[];
  onChangeTheme?: (themeId: string) => void;
};

// Maquette « modal au clic d'un cadenas », au bleu des cartes de la boutique
const DOT_GREEN = '#0efb84';
const ARROW_SIZE = 36;

/** Pack offert pas encore gagné : parties restantes, et une partie d'essai contre une pub tant qu'elle n'a pas servi. */
export function LockedGiftModal({ themeId, onClose, onTrialGranted, lockedThemes = [], onChangeTheme }: Props) {
  const { lang } = useLang();
  const t = getT(lang);
  const { chain } = useGiftChain();
  const [usedTrials, setUsedTrials] = useState<Set<string>>(new Set());
  // Relu à chaque ouverture : un essai peut avoir été consommé depuis un autre écran
  useEffect(() => {
    if (themeId) loadUsedTrials().then(setUsedTrials);
  }, [themeId]);

  const product = themeId ? GIFT_PACKS.find((id) => PACK_THEME_IDS[id] === themeId) : undefined;
  const trialUsed = themeId !== null && usedTrials.has(themeId);
  const left = chain && product ? gamesUntil(chain, product) : WELCOME_GAMES;
  const image = themeId ? PACK_THUMBS[themeId] : undefined;
  // Questions jouables dans la langue du joueur (certains packs n'existent qu'en français)
  const questionCount = themeId
    ? questions.filter((q) => q.theme === themeId && (!q.onlyLangs || q.onlyLangs.includes(lang))).length
    : 0;

  const position = themeId ? lockedThemes.indexOf(themeId) : -1;
  const canBrowse = onChangeTheme !== undefined && position >= 0 && lockedThemes.length > 1;
  // En boucle : du premier pack, la flèche gauche mène au dernier, et inversement
  const neighbour = (step: -1 | 1) => lockedThemes[(position + step + lockedThemes.length) % lockedThemes.length];
  const arrow = (step: -1 | 1) => {
    const target = neighbour(step);
    const name = target ? (t.shop.packTitles[target] ?? target) : '';
    return (
      <Pressable
        style={[styles.arrow, step < 0 ? styles.arrowLeft : styles.arrowRight]}
        onPress={() => target && onChangeTheme?.(target)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={name}
      >
        {/* Chevron dessiné : centré au pixel près, contrairement au glyphe d'une police d'icônes */}
        <Svg width={12} height={18} viewBox="0 0 12 18">
          <Path d={step < 0 ? 'M9.5 2L3 9l6.5 7' : 'M2.5 2L9 9l-6.5 7'} stroke={colors.purpleDeep} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </Svg>
      </Pressable>
    );
  };

  const watchAd = async () => {
    const id = themeId;
    const result = await showRewardedAd();
    onClose();
    if (id && isRewardGranted(result)) onTrialGranted(id);
  };

  return (
    <Modal visible={product !== undefined} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t.shop.close} />
        <View style={styles.card} accessibilityViewIsModal>
          {/* Parties restantes à la place d'un prix : le pack se gagne en jouant */}
          <View style={styles.pill}>
            <Text style={styles.pillText}>{t.matchSettings.freeIn(left)}</Text>
          </View>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit accessibilityRole="header">
            {themeId ? (t.shop.packTitles[themeId] ?? themeId) : ''}
          </Text>
          <View style={styles.body}>
            <View style={styles.actions}>
              <View style={styles.countRow}>
                <View style={styles.dot} />
                <Text style={styles.countText} numberOfLines={1} adjustsFontSizeToFit>{t.matchSettings.questionsCount(questionCount)}</Text>
              </View>
              {/* Essai déjà utilisé : on le dit, sinon le joueur ne comprend pas pourquoi le bouton a disparu */}
              {trialUsed ? (
                <Text style={styles.note}>{t.gift.lockedTrialUsedMsg(left)}</Text>
              ) : (
                <Pressable style={[styles.button, styles.buttonPrimary]} onPress={watchAd} accessibilityRole="button"
                  accessibilityLabel={`${t.matchSettings.tryPack} — ${t.shop.watchAd}`}>
                  <Text style={[styles.buttonText, styles.buttonTextPrimary]}>{t.matchSettings.tryPack}</Text>
                </Pressable>
              )}
              <Pressable style={[styles.button, styles.buttonOutline]} onPress={onClose} accessibilityRole="button" accessibilityLabel={t.shop.close}>
                <Text style={styles.buttonText}>{t.shop.close}</Text>
              </Pressable>
            </View>
            {/* Cadre à la hauteur des boutons : l'image s'y ajuste au lieu d'imposer sa taille */}
            <View style={styles.imageFrame}>
              {image ? <Image source={image} style={styles.image} accessibilityIgnoresInvertColors /> : null}
            </View>
          </View>
          {canBrowse ? arrow(-1) : null}
          {canBrowse ? arrow(1) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(2,8,20,0.8)',
  },
  // À cheval sur le bord de la carte : elle garde toute sa largeur
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -ARROW_SIZE / 2,
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  arrowLeft: {
    left: -ARROW_SIZE / 2,
  },
  arrowRight: {
    right: -ARROW_SIZE / 2,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    padding: 16,
    gap: 12,
    borderRadius: 16,
    // Même carte que celles de la boutique : bleu nuit et contour lavande
    borderWidth: 1,
    borderColor: colors.lavender,
    backgroundColor: colors.purpleDeep,
    // Halo blanc de la maquette
    shadowColor: colors.white,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  pill: {
    position: 'absolute',
    top: -14,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.pink,
    zIndex: 1,
  },
  pillText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  title: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  body: {
    flexDirection: 'row',
    gap: 16,
  },
  actions: {
    flex: 1,
    gap: 12,
    justifyContent: 'flex-end',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DOT_GREEN,
  },
  countText: {
    flexShrink: 1,
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  note: {
    fontFamily: fonts.bodyRegular,
    fontSize: 14,
    color: colors.cream,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
    borderRadius: 16,
    borderWidth: 2,
  },
  buttonPrimary: {
    backgroundColor: '#fffbf5',
    borderColor: colors.purpleDeep,
  },
  buttonOutline: {
    borderColor: '#fffbf5',
  },
  buttonText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.white,
  },
  buttonTextPrimary: {
    color: colors.purpleDeep,
  },
  imageFrame: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
