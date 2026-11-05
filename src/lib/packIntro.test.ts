/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { coverFrame, focusOffset } from './packIntro.ts';

test('image large sur écran portrait : la hauteur couvre l’écran, la largeur déborde', () => {
  assert.deepEqual(coverFrame(2, 400, 800), { width: 1600, height: 800 });
});

test('image étroite sur écran large : la largeur couvre l’écran', () => {
  assert.deepEqual(coverFrame(0.5, 800, 800), { width: 800, height: 1600 });
});

test('le point choisi est centré à l’écran', () => {
  assert.equal(focusOffset(1600, 400, 0.5), -600);
});

test('le décalage s’arrête aux bords de l’image : jamais de vide à l’écran', () => {
  assert.equal(focusOffset(1600, 400, 0), 0);
  assert.equal(focusOffset(1600, 400, 1), -1200);
});
