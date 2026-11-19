import AsyncStorage from '@react-native-async-storage/async-storage';

import { teamColors } from '@/theme';

import { parseSavedTeams, type RosterKind, type SavedTeam } from './teamList';

/** Dernières équipes et derniers joueurs, chacun sa liste, repris à la partie suivante. */
const ROSTER_KEYS: Record<RosterKind, string> = { teams: 'banco.lastTeams', players: 'banco.lastPlayers' };
/** « Chacun pour soi » choisi dans « Qui joue ? ». */
const INDIVIDUAL_KEY = 'banco.individual';

function warn(message: string, error: unknown) {
  if (__DEV__) console.warn(`[savedTeams] ${message}`, error);
}

export async function loadRoster(kind: RosterKind, max: number): Promise<SavedTeam[]> {
  try {
    const raw = await AsyncStorage.getItem(ROSTER_KEYS[kind]);
    return parseSavedTeams(raw ? JSON.parse(raw) : [], teamColors, max);
  } catch (e) {
    warn(`lecture impossible (${kind})`, e);
    return [];
  }
}

export async function saveRoster(kind: RosterKind, teams: readonly SavedTeam[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ROSTER_KEYS[kind], JSON.stringify(teams));
  } catch (e) {
    warn(`sauvegarde impossible (${kind})`, e);
  }
}

export async function loadIndividual(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(INDIVIDUAL_KEY)) === '1';
  } catch (e) {
    warn('lecture du mode impossible', e);
    return false;
  }
}

export async function saveIndividual(individual: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(INDIVIDUAL_KEY, individual ? '1' : '0');
  } catch (e) {
    warn('sauvegarde du mode impossible', e);
  }
}
