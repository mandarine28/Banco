/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseSavedTeams } from './teamList.ts';

const COLORS = ['#A', '#B', '#C'];

test('équipes relues : garde les équipes valides, dans l\'ordre', () => {
  assert.deepEqual(parseSavedTeams([{ name: ' Les As ', color: '#A' }, { name: 'Zoo', color: '#B' }], COLORS, 4), [
    { name: 'Les As', color: '#A' },
    { name: 'Zoo', color: '#B' },
  ]);
});

test('équipes relues : écarte couleur inconnue ou déjà prise, et coupe au maximum', () => {
  const raw = [
    { name: 'X', color: '#Z' },
    { name: 'Un', color: '#A' },
    { name: 'Deux', color: '#A' },
    { name: 'Trois', color: '#B' },
    { name: 'Quatre', color: '#C' },
    null,
  ];
  assert.deepEqual(parseSavedTeams(raw, COLORS, 2).map((team) => team.name), ['Un', 'Trois']);
});

test('équipes relues : un nom par défaut, quelle que soit sa langue, redevient vide', () => {
  const raw = [
    { name: 'Équipe 1', color: '#A' },
    { name: 'PLAYER 2', color: '#B' },
    { name: 'Équipe des As', color: '#C' },
  ];
  assert.deepEqual(parseSavedTeams(raw, COLORS, 4).map((team) => team.name), ['', '', 'Équipe des As']);
});

test('équipes relues : donnée illisible = aucune équipe', () => {
  assert.deepEqual(parseSavedTeams('oups', COLORS, 4), []);
  assert.deepEqual(parseSavedTeams(null, COLORS, 4), []);
});
