/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { questions } from '../data/questions.ts';
import { normalize, searchAnswers, suggestions, SUGGESTION_COUNT } from './answers.ts';
import {
  canPass,
  contract,
  createGame,
  gameReducer,
  minimumBid,
  opponent,
  planQuestions,
  ranking,
  remaining,
} from './engine.ts';
import type { GameAction, GameState } from './engine.ts';

// Générateur pseudo-aléatoire déterministe pour des tests reproductibles.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32;
    return seed / 2 ** 32;
  };
}

const two = [
  { name: 'ÉQUIPE 1', color: '#FBB040' },
  { name: 'ÉQUIPE 2', color: '#16D3C3' },
];
const three = [...two, { name: 'ÉQUIPE 3', color: '#F21F66' }];

const play = (state: GameState, ...actions: GameAction[]) => actions.reduce(gameReducer, state);
const find = (count: number): GameAction[] =>
  Array.from({ length: count }, (_, i) => ({ type: 'TOGGLE_ANSWER', label: `RÉPONSE ${i}` }));

test('chaque question a au moins 27 réponses, sans doublon', () => {
  for (const q of questions) {
    assert.ok(q.theme, q.id);
    assert.ok(q.answers.length >= SUGGESTION_COUNT, `${q.id} : ${q.answers.length} réponses`);
    const keys = q.answers.map(normalize);
    const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
    assert.deepEqual(dupes, [], `${q.id} : doublons`);
  }
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length, 'identifiants uniques');
});

test('la recherche ignore accents, casse et ponctuation, préfixes en premier', () => {
  const heroes = questions.find((q) => q.id === 'super-heros')!;
  assert.deepEqual(searchAnswers(heroes, 'spiderman'), ['SPIDER-MAN']);
  assert.ok(searchAnswers(heroes, 'man').includes('BATMAN'));
  assert.deepEqual(searchAnswers(heroes, '   '), []);
  const cheese = questions.find((q) => q.id === 'fromages')!;
  assert.deepEqual(searchAnswers(cheese, 'epoisses'), ['ÉPOISSES']);
  assert.equal(searchAnswers(cheese, 'co')[0], 'COMTÉ');
});

test('les boutons gardent visibles les réponses validées hors du top', () => {
  const q = questions[0];
  const deep = q.answers[q.answers.length - 1];
  const list = suggestions(q, [deep, 'SAISIE LIBRE']);
  assert.equal(list.length, SUGGESTION_COUNT + 2);
  assert.ok(list.includes(deep) && list.includes('SAISIE LIBRE'));
  assert.equal(suggestions(q, [q.answers[0]]).length, SUGGESTION_COUNT);
});

test('compteur manuel : décompte depuis la mise, sans dépasser la mise', () => {
  let s = play(createGame(two, 1, questions, seeded(11)), { type: 'BID', amount: 3 }, { type: 'PASS' }, { type: 'START_TURN' });
  assert.equal(remaining(s), 3);
  s = play(s, { type: 'ADJUST', delta: -1 });
  assert.equal(remaining(s), 3, 'le + ne dépasse pas la mise');
  s = play(s, { type: 'ADJUST', delta: 1 }, { type: 'TOGGLE_ANSWER', label: 'X' });
  assert.equal(remaining(s), 1);
  s = play(s, { type: 'TOGGLE_ANSWER', label: 'X' });
  assert.equal(remaining(s), 2, 'annuler un bouton rend la réponse');
  s = play(s, { type: 'ADJUST', delta: 1 }, { type: 'ADJUST', delta: 1 });
  assert.equal(s.phase, 'result');
  assert.equal(s.endReason, 'reached');
});

test('une question par round, sans répétition tant que la base suffit', () => {
  const plan = planQuestions(questions, 5, seeded(1));
  assert.equal(plan.length, 5);
  assert.equal(new Set(plan.map((q) => q.id)).size, 5);
  assert.equal(planQuestions(questions.slice(0, 2), 5, seeded(2)).length, 5);
});

test('l’ouvreur doit miser, puis chacun surenchérit ou passe', () => {
  let s = createGame(two, 3, questions, seeded(3));
  assert.equal(s.phase, 'auction');
  assert.equal(s.auction.current, 0);
  assert.equal(canPass(s), false);
  assert.equal(gameReducer(s, { type: 'PASS' }), s, 'passer à l’ouverture est refusé');

  s = play(s, { type: 'BID', amount: 3 });
  assert.equal(s.auction.current, 1);
  assert.equal(minimumBid(s), 4);
  s = play(s, { type: 'BID', amount: 2 }); // trop bas : ramené au minimum
  assert.deepEqual(s.auction.highest, { team: 1, amount: 4 });
  s = play(s, { type: 'PASS' });
  assert.equal(s.phase, 'ready');
  assert.deepEqual(contract(s), { team: 1, amount: 4 });
  assert.equal(opponent(s), 0);
});

test('miser 9 termine l’enchère immédiatement', () => {
  const s = play(createGame(two, 1, questions, seeded(4)), { type: 'BID', amount: 9 });
  assert.equal(s.phase, 'ready');
  assert.deepEqual(contract(s), { team: 0, amount: 9 });
});

test('réussite : l’équipe empoche sa mise dès qu’elle l’atteint', () => {
  let s = play(createGame(two, 1, questions, seeded(5)), { type: 'BID', amount: 3 }, { type: 'PASS' });
  s = play(s, { type: 'START_TURN' }, ...find(3));
  assert.equal(s.phase, 'result');
  assert.equal(s.endReason, 'reached');
  assert.deepEqual(s.scores, [3, 0]);
});

test('échec : la mise va à l’adversaire', () => {
  let s = play(createGame(two, 1, questions, seeded(6)), { type: 'BID', amount: 5 }, { type: 'PASS' });
  s = play(s, { type: 'START_TURN' }, ...find(4), { type: 'END_TURN', reason: 'time' });
  assert.deepEqual(s.scores, [0, 5]);
});

test('une réponse annulée ne compte plus', () => {
  let s = play(createGame(two, 1, questions, seeded(7)), { type: 'BID', amount: 2 }, { type: 'PASS' });
  s = play(s, { type: 'START_TURN' }, { type: 'TOGGLE_ANSWER', label: 'A' }, { type: 'TOGGLE_ANSWER', label: 'A' });
  assert.deepEqual(s.found, []);
  assert.equal(s.phase, 'play');
});

test('à 3 équipes, l’adversaire est la dernière équipe dépassée', () => {
  // L'équipe 1 ouvre à 2, l'équipe 2 monte à 3, l'équipe 3 passe, l'équipe 1 monte à 5, l'équipe 2 passe.
  let s = play(
    createGame(three, 1, questions, seeded(8)),
    { type: 'BID', amount: 2 },
    { type: 'BID', amount: 3 },
    { type: 'PASS' },
    { type: 'BID', amount: 5 },
    { type: 'PASS' },
  );
  assert.equal(s.phase, 'ready');
  assert.deepEqual(contract(s), { team: 0, amount: 5 });
  assert.equal(opponent(s), 1);
  s = play(s, { type: 'START_TURN' }, { type: 'END_TURN', reason: 'skip' });
  assert.deepEqual(s.scores, [0, 5, 0]);
});

test('si personne ne surenchérit, l’adversaire est l’équipe suivante', () => {
  const s = play(createGame(three, 1, questions, seeded(9)), { type: 'BID', amount: 1 }, { type: 'PASS' }, { type: 'PASS' });
  assert.equal(s.phase, 'ready');
  assert.equal(opponent(s), 1);
});

test('l’ouverture tourne à chaque round, puis fin de partie', () => {
  let s = createGame(two, 3, questions, seeded(10));
  const openers: number[] = [];
  while (s.phase !== 'final') {
    openers.push(s.auction.current);
    s = play(s, { type: 'BID', amount: 1 }, { type: 'PASS' }, { type: 'START_TURN' }, { type: 'END_TURN', reason: 'skip' }, { type: 'NEXT' });
  }
  assert.deepEqual(openers, [0, 1, 0]);
});

test('classement avec ex aequo', () => {
  const s = { ...createGame(three, 1, questions), scores: [5, 9, 5] };
  assert.deepEqual(
    ranking(s).map((r) => [r.index, r.rank]),
    [
      [1, 1],
      [0, 2],
      [2, 2],
    ],
  );
});
