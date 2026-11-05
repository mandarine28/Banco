import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'banco.usedTrials';
/** Packs débloqués par une vidéo dont la partie d'essai n'a pas encore été lancée. */
const PENDING_KEY = 'banco.pendingTrials';

function warn(message: string, error: unknown) {
  if (__DEV__) console.warn(`[trials] ${message}`, error);
}

/** Liste de thèmes enregistrée sur l'appareil ; vide si absente ou illisible. */
async function readThemeList(key: string): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch (e) {
    warn(`lecture impossible (${key})`, e);
    return [];
  }
}

/** Thèmes de packs déjà essayés grâce à une pub (un seul essai par pack). */
export async function loadUsedTrials(): Promise<Set<string>> {
  return new Set(await readThemeList(STORAGE_KEY));
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

/** Essais accordés mais pas encore joués : survivent à la fermeture de l'app. */
export const loadPendingTrials = () => readThemeList(PENDING_KEY);

export async function savePendingTrials(themeIds: readonly string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(themeIds));
  } catch (e) {
    warn('sauvegarde des essais en attente impossible', e);
  }
}
