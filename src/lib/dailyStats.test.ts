/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { themeRanking } from './dailyStats.ts';

test('thèmes classés par moyenne, puis par nombre de défis ; thème inconnu ignoré', () => {
  const entries = [
    { theme: 'cinema', score: 10 },
    { theme: 'cinema', score: 15 },
    { theme: 'sport', score: 20 },
    { theme: 'musique', score: 12.5 },
    { theme: undefined, score: 99 },
  ];
  const ranking = themeRanking(entries, (e) => e.theme, (e) => e.score);
  assert.deepEqual(ranking.map((r) => r.theme), ['sport', 'cinema', 'musique']);
  assert.deepEqual(ranking[1], { theme: 'cinema', count: 2, average: 12.5 });
});
