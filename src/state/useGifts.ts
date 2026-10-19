import { PACK_THEME_IDS, type ProductId } from '@/config/shop';
import { usePurchases } from './purchases';

/** Pack offert contre un partage du jeu : une fois par appareil, sans compte ni serveur. */
export function useGifts() {
  const { hasPurchased, giftedPack, claimGiftedPack } = usePurchases();
  const giftablePacks = (Object.keys(PACK_THEME_IDS) as ProductId[]).filter((product) => !hasPurchased(product));
  // undefined = lecture du trousseau en cours : rien n'est proposé avant de savoir
  const canOfferGift = giftedPack === null && giftablePacks.length > 0;
  return { giftablePacks, canOfferGift, claimGift: claimGiftedPack };
}
