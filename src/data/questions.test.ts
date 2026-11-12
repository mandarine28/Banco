/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { questionsFor } from './questions.ts';
import type { Question } from './types.ts';

const q = (id: string, theme: string, onlyLangs?: Question['onlyLangs']): Question => ({ id, theme, subject: id, answers: [], onlyLangs });

test('questionsFor : une question réservée au français n’est jamais posée dans une autre langue', () => {
  const pool = [q('tous', 'dessins-animes'), q('club-dorothee', 'dessins-animes', ['fr']), q('foot', 'football')];

  assert.deepEqual(questionsFor('fr', ['dessins-animes'], pool).map((x) => x.id), ['tous', 'club-dorothee']);
  assert.deepEqual(questionsFor('de', ['dessins-animes'], pool).map((x) => x.id), ['tous']);
  assert.deepEqual(questionsFor('en', [], pool).map((x) => x.id), ['tous', 'foot']);
});
