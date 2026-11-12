/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { gamesUntil, giftAfter, giftChain, parseGiftedPacks } from './giftChain.ts';

const owns = (...ids: string[]) => (id: string) => ids.includes(id);

test('chaîne de cadeaux : un pack offert à chaque partie terminée, dans l’ordre', () => {
  assert.deepEqual(giftChain(owns(), 0), { next: 'packHarryPotter', played: 0, floor: 0 });
  assert.deepEqual(giftChain(owns(), 1), { next: 'packHarryPotter', played: 1, floor: 0 });
  assert.deepEqual(giftChain(owns('packHarryPotter'), 1), { next: 'packRap', played: 0, floor: 1 });
  assert.deepEqual(giftChain(owns('packHarryPotter', 'packRap'), 2), { next: 'packDresseur', played: 0, floor: 2 });
  assert.deepEqual(giftChain(owns('packHarryPotter', 'packRap', 'packDresseur', 'packArt', 'packRetro', 'packAnime', 'packFootball'), 8), { next: 'packDessinsAnimes', played: 1, floor: 7 });
  assert.deepEqual(giftChain(owns('packHarryPotter', 'packRap', 'packDresseur', 'packArt', 'packRetro', 'packAnime', 'packFootball', 'packDessinsAnimes'), 8), { next: 'packJeuxVideo', played: 0, floor: 8 });
  assert.equal(giftChain(owns('packHarryPotter', 'packRap', 'packDresseur', 'packArt', 'packRetro', 'packAnime', 'packFootball', 'packDessinsAnimes', 'packJeuxVideo'), 9).next, null);
});

test('chaîne de cadeaux : un joueur de l’ancienne règle (3 parties par pack) ne gagne qu’un pack par partie', () => {
  // 10 parties jouées, 3 packs gagnés : le compteur plafonne à 1, le Rap… l’Art arrive à la fin de la prochaine partie
  assert.deepEqual(giftChain(owns('packHarryPotter', 'packRap', 'packDresseur'), 10), { next: 'packArt', played: 1, floor: 3 });
});

test('chaîne de cadeaux : après réinstallation, le compteur à 0 ne fait pas reculer la progression', () => {
  assert.equal(giftChain(owns('packHarryPotter'), 0).played, 0);
});

test('parties restantes : le pack suivant attend la fin du précédent', () => {
  const chain = giftChain(owns(), 0);
  const order = ['packHarryPotter', 'packRap', 'packDresseur', 'packArt', 'packRetro', 'packAnime', 'packFootball', 'packDessinsAnimes', 'packJeuxVideo'] as const;
  order.forEach((pack, i) => {
    assert.equal(gamesUntil(chain, pack), i + 1, pack);
    if (i > 0) assert.equal(giftAfter(order[i - 1]), pack);
  });
});

test('packs offerts : l’ancien format (un seul pack) reste lu, les valeurs inconnues sont ignorées', () => {
  assert.deepEqual(parseGiftedPacks('packHarryPotter'), ['packHarryPotter']);
  assert.deepEqual(parseGiftedPacks('packHarryPotter,packRap'), ['packHarryPotter', 'packRap']);
  assert.deepEqual(parseGiftedPacks('pirate,packRap'), ['packRap']);
  assert.deepEqual(parseGiftedPacks(null), []);
});
