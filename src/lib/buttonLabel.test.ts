/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { BUTTON_FONT_SIZE, sharedLabelSize } from './buttonLabel.ts';

test('libellés courts : taille normale pour les deux boutons', () => {
  assert.equal(sharedLabelSize(['OK', 'ANNULER'], 200), BUTTON_FONT_SIZE);
});

test('un libellé long fixe la taille commune, plus petite', () => {
  const size = sharedLabelSize(['REGARDER UNE PUB', 'COMPRIS'], 200);
  assert.ok(size < BUTTON_FONT_SIZE);
  assert.equal(size, sharedLabelSize(['REGARDER UNE PUB'], 200));
});

test('jamais sous la taille minimale, même très à l’étroit', () => {
  assert.equal(sharedLabelSize(['UN LIBELLÉ BEAUCOUP TROP LONG POUR UN BOUTON'], 50), 14);
});
