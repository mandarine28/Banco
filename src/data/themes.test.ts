/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { themeLabel } from './themes.ts';

test('themeLabel traduit thèmes et packs, sans laisser passer le français', () => {
  assert.equal(themeLabel('sport', 'pt'), 'Esporte');
  assert.equal(themeLabel('harry-potter', 'pt'), 'Expresso de Hogwarts');
  assert.equal(themeLabel('harry-potter', 'fr'), 'Poudlard Express');
  assert.equal(themeLabel('geographie', 'fr'), 'Géographie');
});
