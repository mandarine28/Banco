/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { withoutTrialPack, withTrialPack } from './trialPacks.ts';

test('retirer un essai absent rend la même liste : pas de nouvel état, pas de boucle au lancement de la partie', () => {
  const list = ['football'];
  assert.equal(withoutTrialPack(list, 'anime'), list);
});

test('retirer un essai présent rend une nouvelle liste sans lui', () => {
  assert.deepEqual(withoutTrialPack(['football', 'anime'], 'football'), ['anime']);
});

test('ajouter un essai déjà présent rend la même liste', () => {
  const list = ['football'];
  assert.equal(withTrialPack(list, 'football'), list);
  assert.deepEqual(withTrialPack(list, 'anime'), ['football', 'anime']);
});
