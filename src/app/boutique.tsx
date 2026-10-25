import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { CreamPatternSvg } from '@/components/CreamPatternSvg';
import { offers, PACK_THEME_IDS, type ProductId, WELCOME_GAMES, WELCOME_PACK } from '@/config/shop';
import { giftBefore } from '@/lib/giftChain';
import { GIFT_PACKS } from '@/config/shop';
import { questions } from '@/data/questions';
import { useLang } from '@/lib/LangContext';
import { getT } from '@/lib/i18n';
import { usePurchases } from '@/state/purchases';
import { useGiftChain } from '@/state/useGifts';
import { useTutorialTarget } from '@/state/tutorial';
import { colors, fonts } from '@/theme';
import { Pressable } from '@/components/Pressable';
import { Toast, useToast } from '@/components/Toast';

const BACK_PATH = 'M20 12H4M10 6L4 12L10 18';

const SETTING_PATH =
  'M12.1523 0C12.9816 0 13.7558 0.414588 14.2158 1.10449L15.1445 2.49707C15.7968 3.47551 16.9758 3.96402 18.1289 3.7334L18.4355 3.67188C19.195 3.51999 19.9807 3.75708 20.5283 4.30469L20.624 4.40137C21.2715 5.04885 21.432 6.03842 21.0225 6.85742L20.9902 6.92188C20.6001 7.70222 20.7532 8.64481 21.3701 9.26172C21.5925 9.48412 21.8638 9.65145 22.1621 9.75098L22.2158 9.76953C23.1412 10.078 23.7655 10.9436 23.7656 11.9189V12.7949C23.7655 13.721 23.0961 14.5116 22.1826 14.6641C20.925 14.8737 20.2286 16.2405 20.7988 17.3809L20.9941 17.7705C21.4209 18.6241 21.2529 19.6553 20.5781 20.3301L20.0547 20.8545C19.4148 21.4943 18.4215 21.6159 17.6455 21.1504C16.5637 20.5013 15.1589 21.0211 14.7598 22.2178L14.668 22.4932C14.3678 23.393 13.5257 23.9999 12.5771 24H11.4482C10.5921 23.9999 9.80964 23.5158 9.42676 22.75C8.98292 21.8626 8.01192 21.3682 7.0332 21.5312L6 21.7041C5.09973 21.854 4.18247 21.5594 3.53711 20.9141C2.89174 20.2686 2.59806 19.3515 2.74805 18.4512L2.88672 17.6143C3.066 16.5384 2.4726 15.4824 1.45996 15.0771C0.465873 14.6795 -0.127978 13.6537 0.0234375 12.5938L0.167969 11.582C0.33926 10.3836 1.21916 9.40802 2.39355 9.11426L2.90332 8.9873C3.09371 8.93967 3.26746 8.8409 3.40625 8.70215C3.69636 8.41204 3.79757 7.983 3.66797 7.59375L3.00391 5.59961C2.7116 4.72269 3.04242 3.75883 3.81152 3.24609C4.29202 2.92581 4.88509 2.82283 5.44531 2.96289L7.30859 3.42871C8.38861 3.78864 9.53436 3.09846 9.72168 1.97559L9.76367 1.72754C9.92987 0.730694 10.7921 3.81912e-05 11.8027 0H12.1523ZM11.7656 8C9.5565 8.00001 7.76562 9.79087 7.76562 12C7.76562 14.2091 9.5565 16 11.7656 16C13.9748 16 15.7656 14.2091 15.7656 12C15.7656 9.79086 13.9748 8 11.7656 8Z';

type Pack = {
  id: string;
  productId?: ProductId;
  image: ImageSourcePropType;
  comingSoon?: boolean;
  /** Pack de bienvenue : jamais vendu, gagné en jouant. */
  gift?: boolean;
};

const PACKS: Pack[] = [
  { id: 'harry-potter', productId: WELCOME_PACK, gift: true, image: require('../../assets/packs/harry-potter.png') },
  { id: 'rap-francais', productId: 'packRap', gift: true, image: require('../../assets/packs/rap-francais.png') },
  { id: 'nintendo', comingSoon: true, image: require('../../assets/packs/retro-gaming.png') },
  { id: 'anime', comingSoon: true, image: require('../../assets/packs/anime.png') },
];

/** Nombre de questions par pack, compté dans les données (0 pour un pack à venir). */
const questionCount = (packId: string) => questions.filter((q) => q.theme === packId).length;

type PackCardProps = {
  pack: Pack;
  /** Prix localisé de l'App Store ; pastille masquée tant qu'il n'est pas connu. */
  price?: string;
  purchased: boolean;
  purchasing: boolean;
  onPurchase: () => void;
  /** Pack offert : progression « 1 partie sur 3 » (vide tant que le compteur n'est pas lu). */
  giftProgress?: string;
  /** Pack offert à gagner avant celui-ci : légende « Après X », bouton cadenassé, toast explicatif au toucher. */
  giftAfter?: string;
};

function PackCard({ pack, price, purchased, purchasing, onPurchase, giftProgress, giftAfter }: PackCardProps) {
  const toast = useToast();
  // Didacticiel : les cartes des packs offerts sont éclairées dans l'ordre où on les gagne
  const giftIndex = pack.gift && pack.productId ? GIFT_PACKS.indexOf(pack.productId) : -1;
  const tutorialTarget = useTutorialTarget(giftIndex === 1 ? 'shop-gift-1' : 'shop-gift-0');
  const { lang } = useLang();
  const t = getT(lang);
  const title = t.shop.packTitles[pack.id] ?? pack.id;
  const count = questionCount(pack.id);

  return (
    <View>
      <View
        ref={giftIndex === 0 || giftIndex === 1 ? tutorialTarget : undefined}
        collapsable={false}
        style={[styles.card, pack.comingSoon && styles.cardDimmed]}
      >
        <View style={styles.cardLeft}>
          <View style={styles.cardTexts}>
            <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
            {count > 0 ? (
              <View style={styles.countRow}>
                <View style={styles.countDot} />
                <Text style={styles.countText}>{t.shop.questionCount(count)}</Text>
              </View>
            ) : null}
            {giftAfter ? <Text style={styles.giftAfterText} numberOfLines={2}>{t.gift.after(giftAfter)}</Text> : null}
          </View>
          {purchased ? (
            <View style={styles.unlockedButton}>
              <Text style={styles.unlockedText} numberOfLines={1} adjustsFontSizeToFit>{t.shop.unlocked}</Text>
            </View>
          ) : pack.gift ? (
            // Le pack se gagne en jouant : le bouton mène directement au choix du mode
            <View>
            {giftAfter ? <Toast toast={toast} message={t.gift.unlockFirst(giftAfter)} light style={styles.giftToast} /> : null}
            <Pressable
              style={[styles.ctaButton, styles.giftProgress, giftAfter ? styles.giftWaiting : null]}
              // En attente du pack d'avant : on explique plutôt que d'ouvrir le jeu
              onPress={giftAfter ? toast.show : () => router.push('/parametres')}
              accessibilityRole="button"
              accessibilityLabel={`${t.gift.welcomeTitle} ${giftProgress ?? ''} ${giftAfter ?? ''}`}
            >
              <MaterialCommunityIcons name={giftAfter ? 'lock' : 'gift'} size={18} color={colors.purpleDeep} />
              <Text style={[styles.ctaText, styles.giftProgressText]} numberOfLines={1} adjustsFontSizeToFit>{giftProgress ?? ''}</Text>
            </Pressable>
            </View>
          ) : (
            <Pressable
              style={styles.ctaButton}
              accessibilityRole="button"
              accessibilityLabel={price ? `${t.shop.unlockA11y(title)}, ${price}` : t.shop.unlockA11y(title)}
              disabled={pack.comingSoon || purchasing}
              onPress={onPurchase}
            >
              {purchasing ? (
                <ActivityIndicator color={colors.purpleDeep} />
              ) : (
                <Text style={styles.ctaText}>{t.shop.unlock}</Text>
              )}
            </Pressable>
          )}
        </View>
        <Image source={pack.image} style={styles.cardImage} accessibilityIgnoresInvertColors />
      </View>

      {/* Prix à cheval sur le coin haut droit de la carte (Figma 523:50) */}
      {price && !purchased && !pack.comingSoon ? (
        <View style={styles.priceBadge} pointerEvents="none">
          <Text style={styles.priceText}>{price}</Text>
        </View>
      ) : null}

      {pack.comingSoon && (
        <View style={styles.comingSoonOverlay} pointerEvents="none">
          <LinearGradient
            colors={['#33ff5c', '#27fbed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.comingSoonBadge}
          >
            <Text style={styles.comingSoonText}>{t.shop.comingSoon}</Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

export default function BoutiqueScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { hasPurchased, prices, purchase, restorePurchases, isLoading, error } = usePurchases();
  const { chain } = useGiftChain();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const { lang } = useLang();
  const t = getT(lang);
  // Pack offert : progression s'il est le prochain à gagner ; sinon 0 sur 3, en attente du pack d'avant
  const giftProgressOf = (productId: ProductId): string | undefined =>
    chain ? t.gift.progress(chain.next === productId ? chain.played : 0, WELCOME_GAMES) : undefined;
  // Titre du pack offert à gagner avant celui-ci, tant qu'il ne l'est pas
  const giftAfterOf = (productId: ProductId): string | undefined => {
    const before = giftBefore(productId);
    if (!chain || chain.next === productId || !before) return undefined;
    return t.shop.packTitles[PACK_THEME_IDS[before] ?? ''] ?? '';
  };

  async function handlePurchase(pack: Pack) {
    if (!pack.productId) return;
    setPurchasingId(pack.id);
    try {
      await purchase(pack.productId);
    } finally {
      setPurchasingId(null);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    try {
      const info = await restorePurchases();
      // Apple exige un retour explicite : succès ou rien à restaurer (l'échec s'affiche via error)
      if (info) {
        const restored = Object.keys(info.entitlements.active).length > 0;
        Alert.alert(restored ? t.shop.restoredTitle : t.shop.restore, restored ? t.shop.restoredMsg : t.shop.nothingToRestore);
      }
    } finally {
      setRestoring(false);
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <CreamPatternSvg width={width} height={height} opacity={0.04} fill="#ffffff" />
      </View>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t.shop.back}
        >
          <Svg width={34} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d={BACK_PATH}
              stroke={colors.cream}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>

        <Pressable
          onPress={() => router.push('/reglages')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t.shop.settings}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d={SETTING_PATH} fill={colors.cream} />
          </Svg>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.sectionTitle}>{t.shop.packsTitle}</Text>
          <Text style={styles.earlyText}>{t.shop.earlyAccess}</Text>
        </View>

        {error && (
          <Text style={styles.errorText}>{t.shop.errors[error]}</Text>
        )}

        {/* Pack offert déjà gagné : plus rien à proposer, la carte disparaît */}
        {PACKS.filter((pack) => !(pack.gift && pack.productId && hasPurchased(pack.productId))).map(pack => (
          <PackCard
            key={pack.id}
            pack={pack}
            // Prix localisé de l'App Store dès qu'il est chargé, sinon le prix de référence de la boutique
            price={pack.productId && !pack.gift ? (prices[pack.productId] ?? offers[pack.productId].price) : undefined}
            purchased={!!pack.productId && hasPurchased(pack.productId)}
            purchasing={purchasingId === pack.id}
            onPurchase={() => handlePurchase(pack)}
            giftProgress={pack.gift && pack.productId ? giftProgressOf(pack.productId) : undefined}
            giftAfter={pack.gift && pack.productId ? giftAfterOf(pack.productId) : undefined}
          />
        ))}

        <Pressable
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isLoading || restoring}
          accessibilityRole="button"
          accessibilityLabel={t.shop.restore}
        >
          {restoring
            ? <ActivityIndicator color={colors.cream} size="small" />
            : <Text style={styles.restoreText}>{t.shop.restore}</Text>
          }
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.purple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.cream,
    marginBottom: 4,
  },
  earlyText: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.cream,
    opacity: 0.8,
  },
  // Collé au-dessus du bouton « 0 partie sur 3 », assez large pour 2 lignes
  giftToast: {
    top: 'auto',
    bottom: '100%',
    marginBottom: 8,
    alignSelf: 'flex-start',
    width: 240,
  },
  errorText: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    backgroundColor: colors.purpleDeep,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lavender,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4,
  },
  cardDimmed: {
    opacity: 0.2,
  },
  cardLeft: {
    flex: 1,
    gap: 12,
    // Au-dessus de l'image : le toast du bouton peut déborder sur elle
    zIndex: 1,
  },
  cardTexts: {
    gap: 6,
  },
  cardTitle: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    color: colors.cream,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1AEF84',
  },
  countText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  cardImage: {
    width: 100,
    height: 120,
    borderRadius: 12,
  },
  ctaButton: {
    backgroundColor: '#fffbf5',
    borderRadius: 16,
    // Pas de bordure ni d'ombre couleur carte : invisibles, elles laissaient un liseré clair dans les arrondis
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftProgress: {
    flexDirection: 'row',
    gap: 6,
  },
  // Le texte rétrécit dans le bouton au lieu de déborder du padding
  giftProgressText: {
    flexShrink: 1,
  },
  giftWaiting: {
    opacity: 0.6,
  },
  giftAfterText: {
    fontFamily: fonts.displayMedium,
    fontSize: 14,
    color: colors.cream,
    opacity: 0.75,
  },
  ctaText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  unlockedButton: {
    backgroundColor: '#1AEF84',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#0ea85d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  priceBadge: {
    position: 'absolute',
    top: -12,
    right: -8,
    backgroundColor: colors.pink,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  priceText: {
    fontFamily: fonts.displayMedium,
    fontSize: 16,
    color: colors.cream,
  },
  comingSoonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonBadge: {
    borderRadius: 168,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  comingSoonText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  restoreText: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.cream,
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
});
