import type { Question } from '../data/types';

export const TURN_SECONDS = 60;
export const MIN_BID = 1;
/** Mise maximale : l'atteindre clôt l'enchère. Chaque question a au moins 27 réponses en base. */
export const MAX_BID = 20;

export type GameTeam = { name: string; color: string };

/**
 * Déroulé d'un round :
 * - `auction` : seul le thème est affiché, les équipes surenchérissent ou passent ;
 * - `ready`   : l'enchère est remportée, l'équipe s'apprête à répondre ;
 * - `play`    : question révélée, chrono lancé ;
 * - `result`  : mise gagnée ou cédée à l'adversaire.
 */
export type Phase = 'auction' | 'ready' | 'play' | 'result' | 'final';

/** Raison de fin d'un tour : chrono à zéro, mise atteinte, ou tour abandonné. */
export type EndReason = 'time' | 'reached' | 'skip';

export type Auction = {
  /** Équipe qui doit surenchérir ou passer. */
  current: number;
  /** Plus haute mise : nombre de réponses que l'équipe s'engage à trouver. */
  highest: { team: number; amount: number } | null;
  /** Dernière équipe dépassée par la plus haute mise : c'est l'adversaire du tour. */
  outbid: number | null;
  passed: boolean[];
  /** Dernière mise posée par chaque équipe (null = a passé sans enchérir). */
  bids: (number | null)[];
};

export type GameState = {
  teams: GameTeam[];
  roundCount: number;
  /** Une question par round ; son thème est annoncé pendant l'enchère. */
  plan: Question[];
  round: number;
  phase: Phase;
  auction: Auction;
  /** Réponses validées en touchant leur bouton (libellés de la base ou saisis à la main). */
  found: string[];
  /** Réponses comptées pendant le tour (boutons et compteur manuel), de 0 à la mise. */
  progress: number;
  scores: number[];
  endReason: EndReason | null;
};

export type GameAction =
  | { type: 'BID'; amount: number }
  | { type: 'PASS' }
  | { type: 'START_TURN' }
  | { type: 'TOGGLE_ANSWER'; label: string }
  | { type: 'ADJUST'; delta: 1 | -1 }
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

/** Une question par round, sans répétition tant que la base le permet. */
export function planQuestions(questions: readonly Question[], roundCount: number, random: Random = Math.random) {
  if (questions.length === 0) throw new Error('Aucune question disponible');
  const plan: Question[] = [];
  let pool: Question[] = [];
  for (let round = 0; round < roundCount; round++) {
    if (pool.length === 0) pool = shuffle(questions, random);
    plan.push(pool.pop() as Question);
  }
  return plan;
}

/** L'enchère d'un round est ouverte par chaque équipe à tour de rôle. */
function openAuction(teamCount: number, round: number): Auction {
  return { current: round % teamCount, highest: null, outbid: null, passed: Array(teamCount).fill(false), bids: Array(teamCount).fill(null) };
}

export function createGame(
  teams: GameTeam[],
  roundCount: number,
  questions: readonly Question[],
  random: Random = Math.random,
): GameState {
  return {
    teams,
    roundCount,
    plan: planQuestions(questions, roundCount, random),
    round: 0,
    phase: 'auction',
    auction: openAuction(teams.length, 0),
    found: [],
    progress: 0,
    scores: teams.map(() => 0),
    endReason: null,
  };
}

export const currentQuestion = (state: GameState) => state.plan[state.round];

/** Intitulé affiché une fois l'enchère remportée : « CITEZ 14 SUPER-HÉROS ». */
export const currentPrompt = (state: GameState) => `CITEZ ${contract(state).amount} ${currentQuestion(state).subject}`;

/** Mise minimale pour l'équipe dont c'est le tour d'enchérir. */
export const minimumBid = (state: GameState) => (state.auction.highest?.amount ?? MIN_BID - 1) + 1;

/** Le premier à parler doit ouvrir l'enchère : il ne peut pas passer. */
export const canPass = (state: GameState) => state.auction.highest !== null;

/** Équipe qui répond (plus haute mise) et la mise à atteindre. */
export function contract(state: GameState) {
  const { highest } = state.auction;
  if (!highest) throw new Error('Enchère non terminée');
  return highest;
}

/**
 * Adversaire du tour : l'équipe que la plus haute mise a dépassée en dernier.
 * Elle tient l'appareil, valide les réponses et récupère la mise en cas d'échec.
 */
export function opponent(state: GameState): number {
  const { team } = contract(state);
  return state.auction.outbid ?? (team + 1) % state.teams.length;
}

export const isSuccess = (state: GameState) => state.progress >= contract(state).amount;

/** Réponses encore à trouver pour atteindre la mise. */
export const remaining = (state: GameState) => Math.max(0, contract(state).amount - state.progress);

export const isLastRound = (state: GameState) => state.round === state.roundCount - 1;

/** Classement : équipes triées par score décroissant, avec le rang (ex aequo partagés). */
export function ranking(state: GameState) {
  const sorted = state.teams
    .map((team, index) => ({ team, index, score: state.scores[index] }))
    .sort((a, b) => b.score - a.score);
  return sorted.map((entry) => ({ ...entry, rank: sorted.findIndex((e) => e.score === entry.score) + 1 }));
}

function nextBidder(auction: Auction): number {
  const n = auction.passed.length;
  for (let step = 1; step <= n; step++) {
    const candidate = (auction.current + step) % n;
    if (!auction.passed[candidate]) return candidate;
  }
  return auction.current;
}

/** L'enchère s'arrête quand une seule équipe reste en lice ou que la mise maximale est atteinte. */
function settle(state: GameState, auction: Auction): GameState {
  const remaining = auction.passed.filter((p) => !p).length;
  if (auction.highest && (remaining <= 1 || auction.highest.amount >= MAX_BID)) {
    return { ...state, auction, phase: 'ready' };
  }
  return { ...state, auction: { ...auction, current: nextBidder(auction) } };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'BID': {
      if (state.phase !== 'auction') return state;
      const amount = Math.min(MAX_BID, Math.max(minimumBid(state), Math.round(action.amount)));
      if (amount < minimumBid(state)) return state;
      const { auction } = state;
      const bids = [...auction.bids];
      bids[auction.current] = amount;
      return settle(state, {
        ...auction,
        highest: { team: auction.current, amount },
        outbid: auction.highest ? auction.highest.team : auction.outbid,
        bids,
      });
    }

    case 'PASS': {
      if (state.phase !== 'auction' || !canPass(state)) return state;
      const passed = [...state.auction.passed];
      passed[state.auction.current] = true;
      return settle(state, { ...state.auction, passed });
    }

    case 'START_TURN':
      if (state.phase !== 'ready') return state;
      return { ...state, phase: 'play', found: [], progress: 0, endReason: null };

    case 'TOGGLE_ANSWER': {
      if (state.phase !== 'play') return state;
      const already = state.found.includes(action.label);
      const next = already
        ? { ...state, found: state.found.filter((l) => l !== action.label), progress: Math.max(0, state.progress - 1) }
        : { ...state, found: [...state.found, action.label], progress: state.progress + 1 };
      return isSuccess(next) ? endTurn(next, 'reached') : next;
    }

    case 'ADJUST': {
      if (state.phase !== 'play') return state;
      const progress = Math.min(contract(state).amount, Math.max(0, state.progress + action.delta));
      const next = { ...state, progress };
      return isSuccess(next) ? endTurn(next, 'reached') : next;
    }

    case 'END_TURN':
      if (state.phase !== 'play') return state;
      return endTurn(state, action.reason);

    case 'NEXT': {
      if (state.phase !== 'result') return state;
      if (isLastRound(state)) return { ...state, phase: 'final' };
      const round = state.round + 1;
      return {
        ...state,
        round,
        phase: 'auction',
        auction: openAuction(state.teams.length, round),
        found: [],
        progress: 0,
        endReason: null,
      };
    }
  }
}

/**
 * Réussite : chaque équipe ayant enchéri empoche sa propre mise.
 * Échec : l'adversaire récupère la mise gagnante.
 */
function endTurn(state: GameState, reason: EndReason): GameState {
  const { amount } = contract(state);
  const scores = [...state.scores];
  if (isSuccess(state)) {
    for (let i = 0; i < state.teams.length; i++) {
      const bid = state.auction.bids[i];
      if (bid !== null) scores[i] += bid;
    }
  } else {
    scores[opponent(state)] += amount;
  }
  return { ...state, phase: 'result', scores, endReason: reason };
}
