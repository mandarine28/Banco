/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { REVIEW_INTERVAL_MS, shouldRequestReview } from './reviewRule.ts';

const NOW = Date.UTC(2026, 9, 18);

test('pas de demande d’avis avant la 3e partie', () => {
  assert.equal(shouldRequestReview(2, null, NOW), false);
});

test('demande d’avis dès la 3e partie si jamais demandé', () => {
  assert.equal(shouldRequestReview(3, null, NOW), true);
});

test('pas de nouvelle demande avant 30 jours', () => {
  assert.equal(shouldRequestReview(10, NOW - REVIEW_INTERVAL_MS + 1, NOW), false);
  assert.equal(shouldRequestReview(10, NOW - REVIEW_INTERVAL_MS, NOW), true);
});
