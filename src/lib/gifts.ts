import * as SecureStore from 'expo-secure-store';

import { PRODUCT_IDS, type ProductId } from '@/config/shop';

// Trousseau sécurisé plutôt qu'AsyncStorage : sur iOS il survit à la désinstallation, ce qui limite les cadeaux à répétition
const GIFT_KEY = 'banco.giftedPack';

/** Accepte uniquement un identifiant de pack connu (une valeur corrompue ne débloque rien). */
export function parseGiftedPack(value: string | null): ProductId | null {
  return value !== null && value in PRODUCT_IDS ? (value as ProductId) : null;
}

/** Pack reçu en cadeau (partage du jeu) sur cet appareil, ou null s'il n'a pas encore été offert. */
export async function loadGiftedPack(): Promise<ProductId | null> {
  try {
    return parseGiftedPack(await SecureStore.getItemAsync(GIFT_KEY));
  } catch (e) {
    if (__DEV__) console.warn('[gifts] lecture du cadeau impossible', e);
    return null;
  }
}

/** Enregistre le pack offert ; lève une erreur si l'appareil refuse l'écriture (la fenêtre l'affiche). */
export async function saveGiftedPack(productId: ProductId): Promise<void> {
  await SecureStore.setItemAsync(GIFT_KEY, productId);
}
