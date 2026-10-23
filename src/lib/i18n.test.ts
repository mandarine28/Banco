/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { pickLang } from './i18n.ts';

test('pickLang choisit la première langue supportée de l’appareil', () => {
  assert.equal(pickLang(['de']), 'de');
  assert.equal(pickLang(['ru', 'ES']), 'es');
  assert.equal(pickLang([null, 'fr']), 'fr');
  assert.equal(pickLang(['IT']), 'it');
  assert.equal(pickLang(['pt']), 'pt');
});

test('pickLang retombe sur l’anglais si aucune langue n’est supportée', () => {
  assert.equal(pickLang(['ja', 'ru']), 'en');
  assert.equal(pickLang([]), 'en');
});
