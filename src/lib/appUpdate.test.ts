/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isNewerVersion } from './appUpdate.ts';

test('version plus récente : comparaison nombre par nombre, pas alphabétique', () => {
  assert.equal(isNewerVersion('1.3.0', '1.2.0'), true);
  assert.equal(isNewerVersion('1.10.0', '1.9.2'), true);
  assert.equal(isNewerVersion('2.0', '1.9.9'), true);
});

test('même version ou plus ancienne : pas de mise à jour proposée', () => {
  assert.equal(isNewerVersion('1.2.0', '1.2.0'), false);
  assert.equal(isNewerVersion('1.2', '1.2.0'), false);
  assert.equal(isNewerVersion('1.1.9', '1.2.0'), false);
});
