import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DailyRecord } from './solo';

const RECORD_KEY = 'banco.soloRecord';
const DAILY_KEY = 'banco.dailyChallenge';

function warn(message: string, error: unknown) {
  if (__DEV__) console.warn(`[solo] ${message}`, error);
}

/** Plus gros objectif atteint en solo (0 sans partie réussie). */
export async function loadSoloRecord(): Promise<number> {
  try {
    return Number(await AsyncStorage.getItem(RECORD_KEY)) || 0;
  } catch (e) {
    warn('lecture du record impossible', e);
    return 0;
  }
}

export async function saveSoloRecord(record: number): Promise<void> {
  try {
    await AsyncStorage.setItem(RECORD_KEY, String(record));
  } catch (e) {
    warn('sauvegarde du record impossible', e);
  }
}

/** Dernier défi du jour joué ; null si jamais joué ou illisible. */
export async function loadDailyRecord(): Promise<DailyRecord | null> {
  try {
    const parsed: unknown = JSON.parse((await AsyncStorage.getItem(DAILY_KEY)) ?? 'null');
    if (!parsed || typeof parsed !== 'object') return null;
    const { day, score, streak } = parsed as Record<string, unknown>;
    return typeof day === 'string' && typeof score === 'number' && typeof streak === 'number' ? { day, score, streak } : null;
  } catch (e) {
    warn('lecture du défi impossible', e);
    return null;
  }
}

export async function saveDailyRecord(record: DailyRecord): Promise<void> {
  try {
    await AsyncStorage.setItem(DAILY_KEY, JSON.stringify(record));
  } catch (e) {
    warn('sauvegarde du défi impossible', e);
  }
}

const HISTORY_KEY = 'banco.dailyHistory';
/** Au-delà, les plus anciens défis sont oubliés : la liste reste légère à lire au lancement. */
const HISTORY_MAX_DAYS = 90;

/** Un défi du jour joué : la question, les réponses trouvées et la taille de la liste. */
export type DailyHistoryEntry = {
  day: string;
  questionId: string;
  found: string[];
  total: number;
  /** Défi joué avant l'historique : seul le score est connu, pas les réponses. */
  score?: number;
};

function isHistoryEntry(value: unknown): value is DailyHistoryEntry {
  if (!value || typeof value !== 'object') return false;
  const { day, questionId, found, total } = value as Record<string, unknown>;
  return typeof day === 'string' && typeof questionId === 'string' && typeof total === 'number'
    && Array.isArray(found) && found.every((answer) => typeof answer === 'string');
}

/** Défis joués, du plus récent au plus ancien ; entrées illisibles ignorées. */
export async function loadDailyHistory(): Promise<DailyHistoryEntry[]> {
  try {
    const parsed: unknown = JSON.parse((await AsyncStorage.getItem(HISTORY_KEY)) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isHistoryEntry) : [];
  } catch (e) {
    warn('lecture de l’historique impossible', e);
    return [];
  }
}

export async function addDailyHistory(entry: DailyHistoryEntry): Promise<void> {
  try {
    const history = await loadDailyHistory();
    const next = [entry, ...history.filter((item) => item.day !== entry.day)].slice(0, HISTORY_MAX_DAYS);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch (e) {
    warn('sauvegarde de l’historique impossible', e);
  }
}
