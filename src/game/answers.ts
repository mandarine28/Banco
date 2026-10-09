import type { Lang } from '../lib/i18n';
import type { Question } from '../data/types';

/** Retourne la banque de réponses adaptée à la langue (fallback FR). */
export function getAnswers(question: Question, lang: Lang): string[] {
  return question.answersByLang?.[lang] ?? question.answers;
}

/** Retourne le sujet traduit dans la langue cible (fallback FR). */
export function getSubject(question: Question, lang: Lang): string {
  return question.subjectByLang?.[lang] ?? question.subject;
}

/** Retourne une copie de la question avec les réponses de la langue cible comme banque principale. */
export function localizedQuestion(question: Question, lang: Lang): Question {
  return { ...question, answers: getAnswers(question, lang) };
}

/** Forme comparable d'un texte : minuscules, sans accents, sans espaces ni ponctuation. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/** Boutons affichés sans recherche : toutes les réponses, plus celles déjà validées ailleurs. */
export function suggestions(question: Question, found: readonly string[]): string[] {
  const extra = found.filter((label) => !question.answers.includes(label));
  return [...question.answers, ...extra];
}

/** Réponses de la base contenant la saisie (accents, casse et ponctuation ignorés). */
export function searchAnswers(question: Question, query: string, limit = 30): string[] {
  const q = normalize(query);
  if (!q) return [];
  const starts = question.answers.filter((a) => normalize(a).startsWith(q));
  const contains = question.answers.filter((a) => !starts.includes(a) && normalize(a).includes(q));
  return [...starts, ...contains].slice(0, limit);
}
