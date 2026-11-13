/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildShareMessage } from './shareResult.ts';

const texts = { shareWin: (team: string) => `Victoire de ${team}`, shareTie: 'Égalité', shareInvite: 'Viens :' };
const team = (name: string) => ({ name });

test('un vainqueur seul : son nom en titre, le classement puis le lien de l’app', () => {
  const message = buildShareMessage(
    [{ team: team('Loups'), score: 12, rank: 1 }, { team: team('Ours'), score: 8, rank: 2 }],
    texts,
  );
  assert.equal(message, 'Victoire de Loups\n\n1. Loups — 12\n2. Ours — 8\n\nViens : https://apps.apple.com/app/id6821200817');
});

test('plusieurs premiers : titre d’égalité', () => {
  const message = buildShareMessage(
    [{ team: team('Loups'), score: 5, rank: 1 }, { team: team('Ours'), score: 5, rank: 1 }],
    texts,
  );
  assert.ok(message.startsWith('Égalité\n'));
});
