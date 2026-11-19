/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { luminance, navyReadable } from './contrast.ts';

const NAVY = luminance([12, 45, 100]);
const contrast = (rgb: string) => (luminance(rgb.match(/\d+/g)!.map(Number)) + 0.05) / (NAVY + 0.05);

test('fond de couleur : le bleu nuit atteint le contraste visé, rose compris', () => {
  for (const hex of ['#EF1ACC', '#EFCC1A', '#1AEF84']) assert.ok(contrast(navyReadable(hex)) >= 7, hex);
});

test('fond déjà assez clair : couleur gardée telle quelle', () => {
  assert.equal(navyReadable('#EFCC1A'), 'rgb(239,204,26)');
});
