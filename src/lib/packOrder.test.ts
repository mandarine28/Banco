/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parsePackLastPlayed, sortByLastPlayed, withPlayed } from './packOrder.ts';

const packs = ['harry-potter', 'rap-francais', 'dresseur', 'football'].map((id) => ({ id, playable: true }));

test('le dernier pack joué passe en tête, les jamais joués gardent l’ordre de la chaîne', () => {
  const order = sortByLastPlayed(packs, { football: 200, 'rap-francais': 300 }).map((p) => p.id);
  assert.deepEqual(order, ['rap-francais', 'football', 'harry-potter', 'dresseur']);
});

test('un pack bloqué reste après les débloqués, à sa place dans la chaîne, même joué en essai', () => {
  const mixed = [...packs, { id: 'retro-gaming', playable: false }, { id: 'jeux-video', playable: false }];
  const order = sortByLastPlayed(mixed, { 'jeux-video': 900, 'harry-potter': 100, dresseur: 400 }).map((p) => p.id);
  assert.deepEqual(order, ['dresseur', 'harry-potter', 'rap-francais', 'football', 'retro-gaming', 'jeux-video']);
});

test('sans historique, l’ordre de la chaîne est conservé', () => {
  assert.deepEqual(sortByLastPlayed(packs, {}).map((p) => p.id), packs.map((p) => p.id));
});

test('une nouvelle partie rend ses packs les plus récents sans effacer les autres', () => {
  assert.deepEqual(withPlayed({ football: 100 }, ['rap-francais'], 500), { football: 100, 'rap-francais': 500 });
});

test('un stockage illisible ou corrompu ne casse rien', () => {
  assert.deepEqual(parsePackLastPlayed(null), {});
  assert.deepEqual(parsePackLastPlayed('pas du json'), {});
  assert.deepEqual(parsePackLastPlayed('[1,2]'), {});
  assert.deepEqual(parsePackLastPlayed('{"football":12,"rap":"x"}'), { football: 12 });
});
