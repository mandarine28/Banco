import { questions } from '@/data/questions';
import { themes } from '@/data/themes';
import type { Question } from '@/data/types';
import { dailyIndex } from '@/lib/solo';

/** Catégories classiques seulement : le défi du jour doit être jouable par tout le monde, packs gagnés ou non. */
export const CLASSIC_THEMES = themes.map((theme) => theme.id);

/** Listes les plus fournies seulement : une bonne réponse refusée gâche un défi qu'on ne joue qu'une fois. */
export const DAILY_MIN_ANSWERS = 60;

/** Questions du défi : classiques, jouables dans toutes les langues, avec une longue liste de réponses. */
export function dailyPool(pool: readonly Question[] = questions): Question[] {
  return pool
    .filter((q) => CLASSIC_THEMES.includes(q.theme) && !q.onlyLangs && q.answers.length >= DAILY_MIN_ANSWERS)
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** Question du défi de ce jour : la même pour tous les joueurs de Bango, quelle que soit leur langue, sans serveur. */
export function dailyQuestion(day: string): Question {
  const pool = dailyPool();
  return pool[dailyIndex(day, pool.length)];
}
