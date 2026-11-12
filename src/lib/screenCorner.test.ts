import assert from 'node:assert/strict';
import test from 'node:test';
import { screenCornerRadius } from './screenCorner.ts';

test('arrondi de l’écran : déduit de l’encoche sur iPhone, valeur moyenne sur Android', () => {
  assert.equal(screenCornerRadius('ios', 20), 0);
  assert.equal(screenCornerRadius('ios', 44), 39);
  assert.equal(screenCornerRadius('ios', 47), 47);
  assert.equal(screenCornerRadius('ios', 59), 55);
  assert.equal(screenCornerRadius('ios', 62), 62);
  assert.equal(screenCornerRadius('android', 24), 36);
});
