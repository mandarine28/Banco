/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { shouldShowInterstitial } from './adRule.ts';

test('pas de pub de fin de partie sur la première partie', () => {
  assert.equal(shouldShowInterstitial(1), false);
});

test('ensuite, une pub à chaque partie terminée', () => {
  assert.deepEqual([2, 3, 4, 5, 6].map(shouldShowInterstitial), [true, true, true, true, true]);
});
