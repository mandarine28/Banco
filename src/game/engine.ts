import type { Question } from '../data/types';

export const TURN_SECONDS = 60;
export const ANSWERS_PER_QUESTION = 9;

export type GameTeam = { name: string; color: string };

export type Phase = 'intro' | 'play' | 'result' | 'final';

/** Raison de fin d'un tour : chrono à zéro, 9 réponses trouvées, ou tour passé. */
export type EndReason = 'time' | 'complete' | 'skip';

export type GameState = {
  teams: GameTeam[];
  roundCount: number;
  /** Questions prévues pour chaque tour : plan[round][équipe]. */
  plan: Question[][];
  round: number;
  /** Index de l'équipe qui répond pendant ce tour. */
  turn: number;
  phase: Phase;
  /** Index (dans question.answers) des réponses validées pendant le tour. */
  found: number[];
  scores: number[];
  endReason: EndReason | null;
};

export type GameAction =
  | { type: 'START_TURN' }
  | { type: 'TOGGLE_ANSWER'; index: number }
  | { type: 'END_TURN'; reason: EndReason }
  | { type: 'NEXT' };

type Random = () => number;

function shuffle<T>(items: readonly T[], random: Random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Attribue une question à chaque tour, sans répétition tant que la base le permet.
 * Avec `sameTheme`, toutes les équipes d'un même round reçoivent une question du même thème.
 */
export function planQuestions(
  questions: readonly Question[],
  teamCount: number,
  roundCount: number,
  sameTheme: boolean,
  random: Random = Math.random,
): Question[][] {
  if (questions.length === 0) throw new Error('Aucune question disponible');

  let pool = shuffle(questions, random);
  const take = (accept: (q: Question) => boolean): Question => {
    // Base épuisée : on recommence avec toutes les questions.
    if (!pool.some(accept)) pool = shuffle(questions, random);
    const index = pool.findIndex(accept);
    const picked = index === -1 ? pool[0] : pool[index];
    pool = pool.filter((q) => q !== picked);
    return picked;
  };

  const plan: Question[][] = [];
  for (let round = 0; round < roundCount; round++) {
    if (sameTheme) {
      const counts = new Map<string, number>();
      for (const q of pool) counts.set(q.theme, (counts.get(q.theme) ?? 0) + 1);
      const candidates = [...counts].filter(([, n]) => n >= teamCount).map(([theme]) => theme);
      const theme = candidates.length > 0 ? candidates[Math.floor(random() * candidates.length)] : null;
      plan.push(Array.from({ length: teamCount }, () => take((q) => theme === null || q.theme === theme)));
    } else {
      plan.push(Array.from({ length: teamCount }, () => take(() => true)));
    }
  }
  return plan;
}

export function createGame(
  teams: GameTeam[],
  roundCount: number,
  sameTheme: boolean,
  questions: readonly Question[],
  random: Random = Math.random,
): GameState {
  return {
    teams,
    roundCount,
    plan: planQuestions(questions, teams.length, roundCount, sameTheme, random),
    round: 0,
    turn: 0,
    phase: 'intro',
    found: [],
    scores: teams.map(() => 0),
    endReason: null,
  };
}

export const currentQuestion = (state: GameState) => state.plan[state.round][state.turn];

/** L'équipe suivante tient le téléphone et valide les réponses. */
export const holderIndex = (state: GameState) => (state.turn + 1) % state.teams.length;

export function turnPoints(state: GameState): number {
  const { answers } = currentQuestion(state);
  return state.found.reduce((sum, i) => sum + answers[i].points, 0);
}

export const isLastTurn = (state: GameState) =>
  state.round === state.roundCount - 1 && state.turn === state.teams.length - 1;

/** Classement : équipes triées par score décroissant, avec le rang (ex aequo partagés). */
export function ranking(state: GameState) {
  const sorted = state.teams
    .map((team, index) => ({ team, index, score: state.scores[index] }))
    .sort((a, b) => b.score - a.score);
  return sorted.map((entry) => ({ ...entry, rank: sorted.findIndex((e) => e.score === entry.score) + 1 }));
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_TURN':
      if (state.phase !== 'intro') return state;
      return { ...state, phase: 'play', found: [], endReason: null };

    case 'TOGGLE_ANSWER': {
      if (state.phase !== 'play') return state;
      const found = state.found.includes(action.index)
        ? state.found.filter((i) => i !== action.index)
        : [...state.found, action.index];
      const next = { ...state, found };
      return found.length === currentQuestion(state).answers.length ? endTurn(next, 'complete') : next;
    }

    case 'END_TURN':
      if (state.phase !== 'play') return state;
      return endTurn(state, action.reason);

    case 'NEXT': {
      if (state.phase !== 'result') return state;
      if (isLastTurn(state)) return { ...state, phase: 'final' };
      const lastTeam = state.turn === state.teams.length - 1;
      return {
        ...state,
        phase: 'intro',
        round: lastTeam ? state.round + 1 : state.round,
        turn: lastTeam ? 0 : state.turn + 1,
        found: [],
        endReason: null,
      };
    }
  }
}

function endTurn(state: GameState, reason: EndReason): GameState {
  const scores = [...state.scores];
  scores[state.turn] += turnPoints(state);
  return { ...state, phase: 'result', scores, endReason: reason };
}
