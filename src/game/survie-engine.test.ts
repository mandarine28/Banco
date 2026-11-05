/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { questions } from '../data/questions.ts';
import { createSurvieGame, survieReducer, survieTurboSeconds, type SurvieAction, type SurvieState } from './survie-engine.ts';

const teams = ['A', 'B', 'C'].map((name) => ({ name, color: '#000' }));
const play = (state: SurvieState, ...actions: SurvieAction['type'][]) =>
  actions.reduce((s, type) => survieReducer(s, { type } as SurvieAction), state);

test('turbo : 2 s de moins par tour de table, plancher à 5 s', () => {
  let state = play(createSurvieGame(teams, 3, questions), 'START');
  assert.equal(survieTurboSeconds(state), 15);
  state = play(state, 'VALIDATE', 'VALIDATE');
  assert.equal(survieTurboSeconds(state), 15, 'le tour n’est pas fini tant que C n’a pas répondu');
  state = play(state, 'VALIDATE');
  assert.equal(survieTurboSeconds(state), 13);
  for (let i = 0; i < 3 * 20; i++) state = play(state, 'VALIDATE');
  assert.equal(survieTurboSeconds(state), 5);
});

test('turbo : un tour compte aussi quand l’équipe d’ouverture est éliminée', () => {
  // A sèche, puis B et C répondent : le jeu repasse au niveau de A → tour bouclé
  let state = play(createSurvieGame(teams, 3, questions), 'START', 'PASS', 'START', 'VALIDATE');
  assert.equal(survieTurboSeconds(state), 15);
  state = play(state, 'VALIDATE');
  assert.equal(survieTurboSeconds(state), 13);
});

test('turbo : le chrono repart à 15 s à chaque manche', () => {
  let state = play(createSurvieGame(teams, 3, questions), 'START', 'VALIDATE', 'VALIDATE', 'VALIDATE');
  state = play(state, 'PASS', 'START', 'PASS', 'NEXT');
  assert.equal(state.round, 1);
  assert.equal(survieTurboSeconds(state), 15);
});

test('terminer la manche à la main : aucun vainqueur, aucun point, et la manche suivante repart', () => {
  const started = survieReducer(createSurvieGame(teams, 2, questions, () => 0), { type: 'START' });
  const ended = survieReducer(survieReducer(started, { type: 'VALIDATE' }), { type: 'END_ROUND' });
  assert.equal(ended.phase, 'result');
  assert.equal(ended.roundWinner, null);
  assert.deepEqual(ended.scores, [0, 0, 0]);
  assert.equal(survieReducer(ended, { type: 'NEXT' }).round, 1);
});

test('terminer la manche : sans effet hors de la phase de jeu', () => {
  const ready = createSurvieGame(teams, 2, questions, () => 0);
  assert.equal(survieReducer(ready, { type: 'END_ROUND' }), ready);
});
