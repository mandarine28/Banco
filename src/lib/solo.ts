import { normalize } from '../game/normalize.ts';

/** Longueur minimale pour accepter un seul mot d'une réponse (« Mbappé » pour « Kylian Mbappé »). */
const MIN_WORD_MATCH = 4;

/** Fautes de frappe tolérées selon la longueur du mot visé : aucune sur un mot très court, sinon il en accepte trop. */
export function allowedTypos(length: number): number {
  if (length <= 3) return 0;
  if (length <= 6) return 1;
  if (length <= 10) return 2;
  return 3;
}

/** Un seul mot d'une réponse (« Mbappé ») : il doit être assez long et presque juste, sinon tout finit par coller. */
const WORD_MAX_TYPOS = 1;

/** Nombre de lettres à ajouter, retirer, remplacer ou intervertir pour passer de a à b. */
export function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      // Deux lettres inversées (« zidnae ») : une seule faute, fréquente quand on tape vite
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/**
 * Forme « à l'oreille » d'un texte déjà normalisé : écrit autrement mais prononcé pareil
 * (« jokair » → « joker », « filip » → « filipe » pour Philippe).
 */
export function soundKey(normalized: string): string {
  return normalized
    .replace(/ph/g, 'f')
    .replace(/eau|au/g, 'o')
    .replace(/ai|ei|ay|ey/g, 'e')
    .replace(/qu|ck|q/g, 'k')
    .replace(/c(?=[aou])/g, 'k')
    .replace(/y/g, 'i')
    .replace(/h/g, '')
    .replace(/(.)\1+/g, '$1');
}

/**
 * Écart (orthographe ou son) entre la saisie et la réponse entière ou l'un de ses mots ; Infinity hors tolérance.
 * Compté en demi-points : à fautes égales, la réponse entière (« Fourmi ») passe devant un seul mot
 * d'une autre (« Fourmi rouge »), sinon les deux se neutralisaient et la saisie était refusée.
 */
function closeness(q: string, answer: string): number {
  const full = normalize(answer);
  const targets = [{ text: full, budget: allowedTypos(full.length), word: false }];
  if (q.length >= MIN_WORD_MATCH) {
    for (const word of answer.split(/[\s'’-]+/).map(normalize)) {
      if (word.length >= MIN_WORD_MATCH && word !== full) {
        targets.push({ text: word, budget: Math.min(WORD_MAX_TYPOS, allowedTypos(word.length)), word: true });
      }
    }
  }
  const qSound = soundKey(q);
  let best = Infinity;
  for (const { text, budget, word } of targets) {
    const sound = soundKey(text);
    // La première lettre est rarement ratée : sans elle, « gâteau » passait pour « bateau »
    const typed = q[0] === text[0] ? editDistance(q, text) : Infinity;
    const heard = qSound[0] === sound[0] ? editDistance(qSound, sound) : Infinity;
    const distance = Math.min(typed, heard);
    if (distance <= budget) best = Math.min(best, distance * 2 + (word ? 1 : 0));
  }
  return best;
}

/**
 * Réponse de la liste correspondant à la saisie, ou null.
 * Tolère accents, casse, ponctuation et quelques fautes de frappe ; accepte aussi un seul mot
 * de la réponse (« Mbappé »). Refusée si plusieurs réponses pas encore trouvées collent aussi bien.
 */
export function matchAnswer(input: string, answers: readonly string[], found: readonly string[]): string | null {
  const q = normalize(input);
  if (!q) return null;
  // Pluriel tapé (« fourmis ») : le singulier compte comme une saisie exacte
  const variants = q.length > MIN_WORD_MATCH && /[sx]$/.test(q) ? [q, q.slice(0, -1)] : [q];
  const remaining = answers.filter((answer) => !found.includes(answer));
  for (const variant of variants) {
    const exact = remaining.find((answer) => normalize(answer) === variant);
    if (exact) return exact;
  }
  let best = Infinity;
  let matches: string[] = [];
  for (const answer of remaining) {
    const distance = Math.min(...variants.map((variant) => closeness(variant, answer)));
    if (distance < best) {
      best = distance;
      matches = [answer];
    } else if (distance === best && distance !== Infinity) {
      matches.push(answer);
    }
  }
  return matches.length === 1 ? matches[0] : null;
}

/** Jour local au format AAAA-MM-JJ : le défi change à minuit chez le joueur. */
export function dayKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Même jour → même index pour tous les joueurs, sans serveur. */
export function dailyIndex(day: string, count: number): number {
  let hash = 0;
  for (const char of day) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % count;
}

export type DailyRecord = { day: string; score: number; streak: number };

/** Série de jours d'affilée : continue si le dernier défi date d'hier, repart à 1 sinon. */
export function nextStreak(previous: DailyRecord | null, today: string): number {
  if (!previous) return 1;
  if (previous.day === today) return previous.streak;
  const yesterday = new Date(`${today}T12:00:00`);
  yesterday.setDate(yesterday.getDate() - 1);
  return previous.day === dayKey(yesterday) ? previous.streak + 1 : 1;
}
