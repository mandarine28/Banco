import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import type { ProductId } from '@/config/shop';
import { parseGiftedPacks } from '@/lib/giftChain';

// Trousseau sécurisé plutôt qu'AsyncStorage : sur iOS il survit à la désinstallation, ce qui limite les cadeaux à répétition
const GIFT_KEY = 'banco.giftedPack';
const WELCOME_INTRO_KEY = 'banco.welcomeIntroSeen';

/** La fenêtre « Cadeau de bienvenue » a-t-elle déjà été montrée ? En cas d'erreur de lecture : oui, pour ne pas la répéter. */
export async function loadWelcomeIntroSeen(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(WELCOME_INTRO_KEY)) === '1';
  } catch (e) {
    if (__DEV__) console.warn('[gifts] lecture de la fenêtre de bienvenue impossible', e);
    return true;
  }
}

export async function markWelcomeIntroSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(WELCOME_INTRO_KEY, '1');
  } catch (e) {
    if (__DEV__) console.warn('[gifts] sauvegarde de la fenêtre de bienvenue impossible', e);
  }
}

/** Packs reçus en cadeau sur cet appareil (vide si aucun). */
export async function loadGiftedPacks(): Promise<ProductId[]> {
  try {
    return parseGiftedPacks(await SecureStore.getItemAsync(GIFT_KEY));
  } catch (e) {
    if (__DEV__) console.warn('[gifts] lecture des cadeaux impossible', e);
    return [];
  }
}

/** Enregistre les packs offerts ; lève une erreur si l'appareil refuse l'écriture (la fenêtre l'affiche). */
export async function saveGiftedPacks(productIds: ProductId[]): Promise<void> {
  await SecureStore.setItemAsync(GIFT_KEY, productIds.join(','));
}
