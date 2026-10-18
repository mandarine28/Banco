import type { Lang } from '../lib/i18n';
import type { Question } from '../data/types';
import { glossaries } from '../data/glossaries';

/** Libellé d'une réponse FR dans la langue cible : glossaire de la langue, puis anglais, puis FR. */
export function translateAnswer(theme: string, lang: Lang, answer: string): string {
  if (lang === 'fr') return answer;
  const glossary = glossaries[theme];
  return glossary?.[lang]?.[answer] ?? glossary?.en?.[answer] ?? answer;
}

/** Retourne la banque de réponses adaptée à la langue (liste dédiée, sinon FR traduit + réponses locales). */
export function getAnswers(question: Question, lang: Lang): string[] {
  const own = question.answersByLang?.[lang];
  if (own) return own;
  const common = question.answers.map((a) => translateAnswer(question.theme, lang, a));
  const local = question.local?.[lang] ?? [];
  // Entrelacées pour garder l'ordre de popularité des deux listes
  const merged = Array.from({ length: Math.max(common.length, local.length) }, (_, i) => [common[i], local[i]]).flat();
  // Deux réponses peuvent avoir le même libellé une fois traduites : on garde la première
  const seen = new Set<string>();
  return merged.filter((a): a is string => a !== undefined && !seen.has(normalize(a)) && !!seen.add(normalize(a)));
}

/** Réponses locales des autres cultures : masquées dans la liste, mais trouvables par la recherche. */
export function hiddenAnswers(question: Question, lang: Lang): string[] {
  const shown = new Set(getAnswers(question, lang).map(normalize));
  const others = [
    ...Object.entries(question.local ?? {}),
    ...Object.entries(question.answersByLang ?? {}),
  ].flatMap(([l, list]) => (l === lang ? [] : (list ?? [])));
  return others.filter((a) => !shown.has(normalize(a)) && !!shown.add(normalize(a)));
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

/** Copie triée de A à Z (accents, casse et ponctuation ignorés). */
export function sortAlphabetically(labels: readonly string[]): string[] {
  return [...labels].sort((a, b) => normalize(a).localeCompare(normalize(b)));
}

/** Lettre d'index d'une réponse (« # » pour les chiffres et symboles). */
export function indexLetter(label: string): string {
  const first = normalize(label).charAt(0);
  return /[a-z]/.test(first) ? first.toUpperCase() : '#';
}

/** Réponses contenant la saisie (accents, casse et ponctuation ignorés) : préfixes d'abord, liste affichée avant les masquées. */
export function searchAnswers(question: Question, query: string, limit = 30, hidden: readonly string[] = []): string[] {
  const q = normalize(query);
  if (!q) return [];
  const pool = [...question.answers, ...hidden];
  const starts = pool.filter((a) => normalize(a).startsWith(q));
  const contains = pool.filter((a) => !starts.includes(a) && normalize(a).includes(q));
  return [...starts, ...contains].slice(0, limit);
}
