/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { shouldShowInterstitial } from './adRule.ts';

test('pas de pub de fin de partie pendant les 3 premières parties', () => {
  assert.deepEqual([1, 2, 3].map(shouldShowInterstitial), [false, false, false]);
});

test('ensuite, une partie sur deux', () => {
  assert.deepEqual([4, 5, 6, 7, 8].map(shouldShowInterstitial), [true, false, true, false, true]);
});
