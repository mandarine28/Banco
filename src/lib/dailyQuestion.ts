import { questionsFor } from '@/data/questions';
import { themes } from '@/data/themes';
import type { Question } from '@/data/types';
import type { Lang } from '@/lib/i18n';
import { dailyIndex } from '@/lib/solo';

/** Catégories classiques seulement : le défi du jour doit être jouable par tout le monde, packs gagnés ou non. */
export const CLASSIC_THEMES = themes.map((theme) => theme.id);

/** Question du défi de ce jour : la même pour tous les joueurs d'une langue, sans serveur. */
export function dailyQuestion(lang: Lang, day: string): Question {
  const pool = questionsFor(lang, CLASSIC_THEMES).sort((a, b) => a.id.localeCompare(b.id));
  return pool[dailyIndex(day, pool.length)];
}
