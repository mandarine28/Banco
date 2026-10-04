import type { Question } from '../data/types';

/** Nombre de réponses proposées en boutons sans recherche (3 colonnes x 9 lignes). */
export const SUGGESTION_COUNT = 27;

/** Forme comparable d'un texte : minuscules, sans accents, sans espaces ni ponctuation. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** Boutons affichés sans recherche : les réponses les plus citées, plus celles déjà validées ailleurs. */
export function suggestions(question: Question, found: readonly string[], count = SUGGESTION_COUNT): string[] {
  const top = question.answers.slice(0, count);
  const extra = found.filter((label) => !top.includes(label));
  return [...top, ...extra];
}

/** Réponses de la base contenant la saisie (accents, casse et ponctuation ignorés). */
export function searchAnswers(question: Question, query: string, limit = 30): string[] {
  const q = normalize(query);
  if (!q) return [];
  const starts = question.answers.filter((a) => normalize(a).startsWith(q));
  const contains = question.answers.filter((a) => !starts.includes(a) && normalize(a).includes(q));
  return [...starts, ...contains].slice(0, limit);
}
