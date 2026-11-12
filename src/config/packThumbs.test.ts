/// <reference types="node" />

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const full = readdirSync('assets/packs/full');

test('chaque illustration de pack a sa vignette (assets/packs/thumbs)', () => {
  assert.deepEqual(readdirSync('assets/packs/thumbs').sort(), [...full].sort());
});

test('chaque vignette est déclarée dans PACK_THUMBS', () => {
  const config = readFileSync('src/config/packIntros.ts', 'utf8');
  for (const file of full) assert.ok(config.includes(`assets/packs/thumbs/${file}`), file);
});
