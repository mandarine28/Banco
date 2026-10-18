import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

import { shouldRequestReview } from './reviewRule';

const GAMES_KEY = 'banco.gamesCompleted';
const REVIEW_KEY = 'banco.lastReviewPromptAt';

/** Cadeau de bienvenue proposé à partir de cette partie terminée. */
export const WELCOME_GIFT_AFTER_GAMES = 3;

function warn(message: string, error: unknown) {
  if (__DEV__) console.warn(`[engagement] ${message}`, error);
}

export async function loadGamesCompleted(): Promise<number> {
  try {
    return Number(await AsyncStorage.getItem(GAMES_KEY)) || 0;
  } catch (e) {
    warn('lecture du compteur impossible', e);
    return 0;
  }
}

/** Compte une partie menée jusqu'à l'écran final ; renvoie le nouveau total. */
export async function recordGameCompleted(): Promise<number> {
  const count = (await loadGamesCompleted()) + 1;
  try {
    await AsyncStorage.setItem(GAMES_KEY, String(count));
  } catch (e) {
    warn('sauvegarde du compteur impossible', e);
  }
  return count;
}

/** Fenêtre d'avis native (Apple / Google), si la règle Banco et la plateforme le permettent. */
export async function maybeRequestReview(gamesCompleted: number): Promise<void> {
  try {
    const last = Number(await AsyncStorage.getItem(REVIEW_KEY)) || null;
    const now = Date.now();
    if (!shouldRequestReview(gamesCompleted, last, now)) return;
    if (!(await StoreReview.isAvailableAsync())) return;
    await StoreReview.requestReview();
    await AsyncStorage.setItem(REVIEW_KEY, String(now));
  } catch (e) {
    warn('demande d’avis impossible', e);
  }
}
