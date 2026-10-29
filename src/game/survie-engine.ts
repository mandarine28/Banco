import type { Question } from '../data/types';
import { planQuestions, type GameTeam } from './engine.ts';

export const SURVIE_TURN_SECONDS = 10;
/** La cagnotte démarre à 1 : même si la 1re équipe sèche d'entrée, la manche rapporte un point. */
export const SURVIE_START_JACKPOT = 1;
/** Chrono Turbo : 15 s au 1er tour de table, 2 s de moins à chaque tour, jamais sous 5 s. */
export const SURVIE_TURBO = { start: 15, step: 2, min: 5 } as const;

export type SurviePhase = 'ready' | 'play' | 'result' | 'final';

export type SurvieState = {
  teams: GameTeam[];
  roundCount: number;
  plan: Question[];
  round: number;
  phase: SurviePhase;
  /** Teams still active in the current round. */
  aliveTeams: boolean[];
  currentTeam: number;
  /** Points en jeu : SURVIE_START_JACKPOT + bonnes réponses de la manche. */
  jackpot: number;
  /** Winner of the last round (null during play). */
  roundWinner: number | null;
  scores: number[];
  /** Canonical answers validated this round (for result screen chips). */
  found: string[];
  /** Tours de table bouclés dans la manche (chrono Turbo). */
  lap: number;
};

export type SurvieAction =
  | { type: 'START' }
  | { type: 'VALIDATE'; answer?: string }
  | { type: 'PASS' }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT' };

type Random = () => number;

export function createSurvieGame(
  teams: GameTeam[],
  roundCount: number,
  questions: readonly Question[],
  random: Random = Math.random,
): SurvieState {
  return {
    teams,
    roundCount,
    plan: planQuestions(questions, roundCount, random),
    round: 0,
    phase: 'ready',
    aliveTeams: teams.map(() => true),
    currentTeam: 0,
    jackpot: SURVIE_START_JACKPOT,
    roundWinner: null,
    scores: teams.map(() => 0),
    found: [],
    lap: 0,
  };
}

export const survieCurrentQuestion = (state: SurvieState) => state.plan[state.round];
export const survieTurboSeconds = (state: SurvieState) =>
  Math.max(SURVIE_TURBO.min, SURVIE_TURBO.start - state.lap * SURVIE_TURBO.step);

export const isLastSurvieRound = (state: SurvieState) => state.round === state.roundCount - 1;

export function survieRanking(state: SurvieState) {
  const sorted = state.teams
    .map((team, index) => ({ team, index, score: state.scores[index] }))
    .sort((a, b) => b.score - a.score);
  return sorted.map((entry) => ({
    ...entry,
    rank: sorted.findIndex((e) => e.score === entry.score) + 1,
  }));
}

function nextAliveTeam(aliveTeams: boolean[], from: number): number {
  const n = aliveTeams.length;
  for (let step = 1; step <= n; step++) {
    const candidate = (from + step) % n;
    if (aliveTeams[candidate]) return candidate;
  }
  return from;
}

/** Tour de table bouclé quand le jeu repasse par l'équipe qui a ouvert la manche (même éliminée). */
function nextLap(state: SurvieState, next: number): number {
  const n = state.teams.length;
  const starter = state.round % n;
  const toNext = (next - state.currentTeam + n) % n || n;
  const toStarter = (starter - state.currentTeam + n) % n || n;
  return toStarter <= toNext ? state.lap + 1 : state.lap;
}

function eliminateAndAdvance(state: SurvieState): SurvieState {
  const aliveTeams = [...state.aliveTeams];
  aliveTeams[state.currentTeam] = false;
  const remaining = aliveTeams.filter(Boolean).length;

  if (remaining <= 1) {
    const winner = aliveTeams.findIndex(Boolean);
    const scores = [...state.scores];
    if (winner >= 0) scores[winner] += state.jackpot;
    return {
      ...state,
      aliveTeams,
      phase: 'result',
      roundWinner: winner >= 0 ? winner : null,
      scores,
    };
  }

  const next = nextAliveTeam(aliveTeams, state.currentTeam);
  return { ...state, aliveTeams, currentTeam: next, phase: 'ready', lap: nextLap(state, next) };
}

export function survieReducer(state: SurvieState, action: SurvieAction): SurvieState {
  switch (action.type) {
    case 'START': {
      if (state.phase !== 'ready') return state;
      return { ...state, phase: 'play' };
    }

    case 'VALIDATE': {
      if (state.phase !== 'play') return state;
      const jackpot = state.jackpot + 1;
      const next = nextAliveTeam(state.aliveTeams, state.currentTeam);
      const found = action.answer ? [...state.found, action.answer] : state.found;
      return { ...state, jackpot, currentTeam: next, found, lap: nextLap(state, next) };
    }

    case 'PASS':
    case 'TIMEOUT': {
      if (state.phase !== 'play') return state;
      return eliminateAndAdvance(state);
    }

    case 'NEXT': {
      if (state.phase !== 'result') return state;
      if (isLastSurvieRound(state)) return { ...state, phase: 'final' };
      const round = state.round + 1;
      return {
        ...state,
        round,
        phase: 'ready',
        aliveTeams: state.teams.map(() => true),
        currentTeam: round % state.teams.length,
        jackpot: SURVIE_START_JACKPOT,
        roundWinner: null,
        found: [],
        lap: 0,
      };
    }
  }
}
