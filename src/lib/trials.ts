import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'banco.usedTrials';

function warn(message: string, error: unknown) {
  if (__DEV__) console.warn(`[trials] ${message}`, error);
}

/** Thèmes de packs déjà essayés grâce à une pub (un seul essai par pack). */
export async function loadUsedTrials(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []);
  } catch (e) {
    warn('lecture impossible', e);
    return new Set();
  }
}

export async function markTrialUsed(themeId: string): Promise<void> {
  try {
    const used = await loadUsedTrials();
    if (used.has(themeId)) return;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...used, themeId]));
  } catch (e) {
    warn('sauvegarde impossible', e);
  }
}
