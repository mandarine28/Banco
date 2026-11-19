import AsyncStorage from '@react-native-async-storage/async-storage';

import { dailyPool } from '@/lib/dailyQuestion';
import { dayKey } from '@/lib/solo';
import { addDailyHistory } from '@/lib/soloStorage';
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

/** Build de test : faux défis sur les 6 dernières semaines, avec des jours manqués, pour voir l'écran « Mes défis » rempli. */
export async function fillDailyHistory(): Promise<void> {
  const pool = dailyPool();
  // Repart d'un historique vide : un remplissage précédent boucherait les trous
  await AsyncStorage.removeItem('banco.dailyHistory');
  for (let back = 42; back >= 1; back--) {
    // Environ un jour sur trois sans défi : les trous doivent se voir dans le calendrier
    if (back % 3 === 0 || back % 7 === 5) continue;
    const date = new Date();
    date.setDate(date.getDate() - back);
    const question = pool[(back * 7) % pool.length];
    const found = question.answers.filter((_, i) => i % 3 === back % 3).slice(0, (back % 18) + 2);
    await addDailyHistory({ day: dayKey(date), questionId: question.id, found, total: question.answers.length });
  }
}
