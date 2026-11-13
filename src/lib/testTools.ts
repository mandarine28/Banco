import AsyncStorage from '@react-native-async-storage/async-storage';

import { TUTORIAL_KEY } from '@/lib/tutorial';

// Progression du joueur, sans les préférences (langue, son, vibration)
const PLAYER_PROGRESS_KEYS = ['banco.gamesCompleted', 'banco.lastReviewPromptAt', 'banco.welcomeIntroSeen', 'banco.usedTrials', 'banco.soloRecord', 'banco.dailyChallenge', 'banco.dailyHistory', TUTORIAL_KEY];

/** Build de test : compteur de parties aligné sur les packs gagnés, le prochain pack repart d'une partie complète. */
export async function setGamesCompleted(count: number): Promise<void> {
  await AsyncStorage.setItem('banco.gamesCompleted', String(count));
}

/** Build de test : efface la progression locale pour revoir l'app comme un joueur neuf. */
export async function resetPlayerProgress(): Promise<void> {
  await AsyncStorage.multiRemove(PLAYER_PROGRESS_KEYS);
}
