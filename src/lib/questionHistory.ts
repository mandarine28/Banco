import AsyncStorage from '@react-native-async-storage/async-storage';

import type { QuestionHistory } from '@/game/engine';

const STORAGE_KEY = 'banco.questionHistory';

// Chargé au démarrage : les parties se créent de façon synchrone et lisent ce cache
let cache: QuestionHistory = {};

function parse(raw: string | null): QuestionHistory {
  if (!raw) return {};
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  return Object.fromEntries(Object.entries(data).filter(([, at]) => typeof at === 'number'));
}

/** Dernière apparition de chaque question sur cet appareil. */
export const getQuestionHistory = (): QuestionHistory => cache;

export async function loadQuestionHistory(): Promise<void> {
  try {
    cache = { ...parse(await AsyncStorage.getItem(STORAGE_KEY)), ...cache };
  } catch (e) {
    if (__DEV__) console.warn('[questionHistory] lecture impossible', e);
  }
}

/** Date la question affichée : elle repassera après toutes les autres de son thème. */
export async function markQuestionSeen(id: string): Promise<void> {
  cache = { ...cache, [id]: Date.now() };
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    if (__DEV__) console.warn('[questionHistory] sauvegarde impossible', e);
  }
}
