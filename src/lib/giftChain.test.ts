/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { gamesUntil, giftAfter, giftChain, parseGiftedPacks } from './giftChain.ts';

const owns = (...ids: string[]) => (id: string) => ids.includes(id);

test('chaîne de cadeaux : 3 parties pour Poudlard, puis le compteur repart de 0 pour le Rap', () => {
  assert.deepEqual(giftChain(owns(), 2), { next: 'packHarryPotter', played: 2, floor: 0 });
  assert.deepEqual(giftChain(owns('packHarryPotter'), 3), { next: 'packRapFrancais', played: 0, floor: 3 });
  assert.deepEqual(giftChain(owns('packHarryPotter'), 5), { next: 'packRapFrancais', played: 2, floor: 3 });
  assert.equal(giftChain(owns('packHarryPotter', 'packRapFrancais'), 9).next, null);
});

test('chaîne de cadeaux : après réinstallation, le compteur à 0 ne fait pas reculer la progression', () => {
  assert.equal(giftChain(owns('packHarryPotter'), 0).played, 0);
});

test('parties restantes : le pack suivant attend la fin du précédent', () => {
  const chain = giftChain(owns(), 1);
  assert.equal(gamesUntil(chain, 'packHarryPotter'), 2);
  assert.equal(gamesUntil(chain, 'packRapFrancais'), 5);
  assert.equal(giftAfter('packHarryPotter'), 'packRapFrancais');
});

test('packs offerts : l’ancien format (un seul pack) reste lu, les valeurs inconnues sont ignorées', () => {
  assert.deepEqual(parseGiftedPacks('packHarryPotter'), ['packHarryPotter']);
  assert.deepEqual(parseGiftedPacks('packHarryPotter,packRapFrancais'), ['packHarryPotter', 'packRapFrancais']);
  assert.deepEqual(parseGiftedPacks('pirate,packRapFrancais'), ['packRapFrancais']);
  assert.deepEqual(parseGiftedPacks(null), []);
});
