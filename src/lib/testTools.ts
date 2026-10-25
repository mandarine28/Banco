import AsyncStorage from '@react-native-async-storage/async-storage';

// Progression du joueur, sans les préférences (langue, son, vibration)
const PLAYER_PROGRESS_KEYS = ['banco.gamesCompleted', 'banco.lastReviewPromptAt', 'banco.welcomeIntroSeen', 'banco.usedTrials'];

/** Build de test : efface la progression locale pour revoir l'app comme un joueur neuf. */
export async function resetPlayerProgress(): Promise<void> {
  await AsyncStorage.multiRemove(PLAYER_PROGRESS_KEYS);
}
