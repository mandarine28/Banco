/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { questions } from '../data/questions.ts';
import { createGame, currentQuestion, gameReducer, holderIndex, planQuestions, ranking } from './engine.ts';
import type { GameState } from './engine.ts';

// Générateur pseudo-aléatoire déterministe pour des tests reproductibles.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32;
    return seed / 2 ** 32;
  };
}

const teams = [
  { name: 'ÉQUIPE 1', color: '#FBB040' },
  { name: 'ÉQUIPE 2', color: '#16D3C3' },
];

test('chaque question d’exemple a 9 réponses et des points entre 1 et 5', () => {
  for (const q of questions) {
    assert.equal(q.answers.length, 9, q.id);
    for (const a of q.answers) assert.ok(a.points >= 1 && a.points <= 5, `${q.id} / ${a.label}`);
  }
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length, 'identifiants uniques');
});

test('le plan ne répète pas de question tant que la base suffit', () => {
  const plan = planQuestions(questions, 2, 5, false, seeded(1));
  const ids = plan.flat().map((q) => q.id);
  assert.equal(ids.length, 10);
  assert.equal(new Set(ids).size, 10);
});

test('le plan réutilise des questions quand la base est épuisée', () => {
  const plan = planQuestions(questions.slice(0, 3), 4, 3, false, seeded(2));
  assert.equal(plan.flat().length, 12);
});

test('avec « même thème », un round partage un seul thème', () => {
  const plan = planQuestions(questions, 2, 4, true, seeded(3));
  for (const round of plan) assert.equal(new Set(round.map((q) => q.theme)).size, 1);
});

test('un tour : validation, annulation, points et fin au chrono', () => {
  let s: GameState = createGame(teams, 2, false, questions, seeded(4));
  assert.equal(holderIndex(s), 1);
  s = gameReducer(s, { type: 'START_TURN' });
  s = gameReducer(s, { type: 'TOGGLE_ANSWER', index: 0 });
  s = gameReducer(s, { type: 'TOGGLE_ANSWER', index: 1 });
  s = gameReducer(s, { type: 'TOGGLE_ANSWER', index: 1 });
  assert.deepEqual(s.found, [0]);
  s = gameReducer(s, { type: 'END_TURN', reason: 'time' });
  assert.equal(s.phase, 'result');
  assert.equal(s.scores[0], currentQuestion(s).answers[0].points);
  assert.equal(s.endReason, 'time');
});

test('trouver les 9 réponses termine le tour', () => {
  let s = gameReducer(createGame(teams, 1, false, questions, seeded(5)), { type: 'START_TURN' });
  for (let i = 0; i < 9; i++) s = gameReducer(s, { type: 'TOGGLE_ANSWER', index: i });
  assert.equal(s.phase, 'result');
  assert.equal(s.endReason, 'complete');
  assert.equal(s.scores[0], currentQuestion(s).answers.reduce((n, a) => n + a.points, 0));
});

test('enchaînement des tours puis fin de partie', () => {
  let s = createGame(teams, 2, false, questions, seeded(6));
  const visited: string[] = [];
  while (s.phase !== 'final') {
    visited.push(`${s.round}-${s.turn}`);
    s = gameReducer(s, { type: 'START_TURN' });
    s = gameReducer(s, { type: 'END_TURN', reason: 'skip' });
    s = gameReducer(s, { type: 'NEXT' });
  }
  assert.deepEqual(visited, ['0-0', '0-1', '1-0', '1-1']);
});

test('classement avec ex aequo', () => {
  const s = { ...createGame([...teams, { name: 'ÉQUIPE 3', color: '#F21F66' }], 1, false, questions), scores: [5, 9, 5] };
  assert.deepEqual(
    ranking(s).map((r) => [r.index, r.rank]),
    [
      [1, 1],
      [0, 2],
      [2, 2],
    ],
  );
});
