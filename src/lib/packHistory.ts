import AsyncStorage from '@react-native-async-storage/async-storage';

import { type PackLastPlayed, parsePackLastPlayed, withPlayed } from '@/lib/packOrder';

const STORAGE_KEY = 'banco.packLastPlayed';

/** Dernière partie de chaque pack sur cet appareil ; vide si absente ou illisible. */
export async function loadPackLastPlayed(): Promise<PackLastPlayed> {
  try {
    return parsePackLastPlayed(await AsyncStorage.getItem(STORAGE_KEY));
  } catch (e) {
    if (__DEV__) console.warn('[packHistory] lecture impossible', e);
    return {};
  }
}

/** Enregistre les packs de la partie qui commence (tri « joués récemment » des paramètres). */
export async function markPacksPlayed(themeIds: readonly string[]): Promise<void> {
  if (themeIds.length === 0) return;
  try {
    const history = await loadPackLastPlayed();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(withPlayed(history, themeIds, Date.now())));
  } catch (e) {
    if (__DEV__) console.warn('[packHistory] sauvegarde impossible', e);
  }
}
