/// <reference types="node" />

import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { searchWikipedia } from './wikipedia.ts';

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

const mockFetch = (body: unknown, ok = true) => {
  globalThis.fetch = (async (url: string) => {
    mockFetch.lastUrl = url;
    return { ok, status: ok ? 200 : 503, json: async () => body };
  }) as unknown as typeof fetch;
};
mockFetch.lastUrl = '';

test('renvoie le premier article, extrait nettoyé du HTML', async () => {
  mockFetch({
    query: { search: [{ title: 'Hulk', snippet: 'Le <span class="searchmatch">Hulk</span> est un &quot;super-héros&quot; de Marvel' }] },
  });
  const result = await searchWikipedia('Hulk', 'SUPER-HÉROS');
  assert.deepEqual(result, { title: 'Hulk', extract: 'Le Hulk est un "super-héros" de Marvel' });
  assert.match(decodeURIComponent(mockFetch.lastUrl.replace(/\+/g, ' ')), /srsearch=Hulk SUPER-HÉROS/);
  assert.match(mockFetch.lastUrl, /origin=\*|origin=%2A/);
});

test('renvoie null sans résultat, lève une erreur si le service répond mal', async () => {
  mockFetch({ query: { search: [] } });
  assert.equal(await searchWikipedia('zzz', ''), null);
  mockFetch({}, false);
  await assert.rejects(searchWikipedia('zzz', ''));
});
