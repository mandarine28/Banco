/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { reminderDates } from './reminderDates.ts';
import { dailyIndex, dayKey, editDistance, matchAnswer, nextStreak } from './solo.ts';

const answers = ['Kylian Mbappé', 'Zinédine Zidane', 'Thierry Henry', 'Henry Kissinger', 'Pelé'];

test('saisie exacte, sans accents ni majuscules', () => {
  assert.equal(matchAnswer('zinedine zidane', answers, []), 'Zinédine Zidane');
  assert.equal(matchAnswer('PELE', answers, []), 'Pelé');
});

test('un seul mot suffit quand il ne désigne qu’une réponse', () => {
  assert.equal(matchAnswer('mbappe', answers, []), 'Kylian Mbappé');
});

test('un mot partagé par deux réponses est refusé, sauf si l’une est déjà trouvée', () => {
  assert.equal(matchAnswer('henry', answers, []), null);
  assert.equal(matchAnswer('henry', answers, ['Thierry Henry']), 'Henry Kissinger');
});

test('une réponse déjà trouvée ou absente ne compte pas', () => {
  assert.equal(matchAnswer('pele', answers, ['Pelé']), null);
  assert.equal(matchAnswer('platini', answers, []), null);
  assert.equal(matchAnswer('   ', answers, []), null);
});

test('fautes de frappe tolérées quand la saisie ne ressemble qu’à une réponse', () => {
  assert.equal(matchAnswer('zinedin zidanne', answers, []), 'Zinédine Zidane');
  assert.equal(matchAnswer('mbape', answers, []), 'Kylian Mbappé');
  assert.equal(matchAnswer('thiery henri', answers, []), 'Thierry Henry');
  // Lettres inversées en tapant vite
  assert.equal(matchAnswer('zidnae', answers, []), 'Zinédine Zidane');
});

test('écrit à l’oreille : même prononciation, orthographe différente', () => {
  assert.equal(matchAnswer('jokair', ['Joker', 'Batman', 'Pingouin'], []), 'Joker');
  assert.equal(matchAnswer('filip', ['Philippe', 'Louis'], []), 'Philippe');
  assert.equal(matchAnswer('mikael jakson', ['Michael Jackson', 'Madonna'], []), 'Michael Jackson');
});

test('trop de fautes, ou une saisie qui colle à deux réponses : refusée', () => {
  assert.equal(matchAnswer('zxcvbn', answers, []), null);
  assert.equal(matchAnswer('henri', answers, []), null);
  // Mot de 3 lettres : aucune faute permise, sinon « Rix » validerait « Rio »
  assert.equal(matchAnswer('rix', ['Rio'], []), null);
  assert.equal(matchAnswer('rmoe', ['Rome'], []), 'Rome');
});

test('écart de saisie : une lettre ajoutée, retirée, remplacée ou deux inversées comptent pour une faute', () => {
  assert.equal(editDistance('zidane', 'zidane'), 0);
  assert.equal(editDistance('zidan', 'zidane'), 1);
  assert.equal(editDistance('zidnae', 'zidane'), 1);
  assert.equal(editDistance('zodane', 'zidane'), 1);
});

test('correction plus stricte : première lettre juste, un seul mot presque exact', () => {
  assert.equal(matchAnswer('gateau', ['Bateau', 'Avion'], []), null, 'première lettre différente');
  assert.equal(matchAnswer('zadabe', ['Zinédine Zidane'], []), null, 'deux fautes sur un seul mot');
  assert.equal(matchAnswer('moutn', ['Mouton'], []), 'Mouton', 'une faute sur un mot court reste tolérée');
  assert.equal(matchAnswer('chevak', ['Cheval', 'Chèvre'], []), 'Cheval');
  assert.equal(matchAnswer('chocolat', ['Chevalier', 'Château'], []), null);
});

test('pluriel et réponse entière : « fourmis » trouve Fourmi même avec Fourmi rouge dans la liste', () => {
  const insects = ['FOURMI', 'ABEILLE', 'FOURMI ROUGE'];
  assert.equal(matchAnswer('fourmis', insects, []), 'FOURMI');
  assert.equal(matchAnswer('fourmi', insects, []), 'FOURMI');
  assert.equal(matchAnswer('fourmie', insects, []), 'FOURMI', 'une faute : la réponse entière passe devant le mot');
  assert.equal(matchAnswer('fourmi', insects, ['FOURMI']), 'FOURMI ROUGE');
  assert.equal(matchAnswer('abeilles', insects, []), 'ABEILLE');
});

test('un mot trop court ne suffit pas', () => {
  assert.equal(matchAnswer('ky', ['Ky Lo'], []), null);
});

test('le défi du jour est le même pour une date donnée et reste dans la liste', () => {
  assert.equal(dailyIndex('2026-11-13', 50), dailyIndex('2026-11-13', 50));
  assert.notEqual(dailyIndex('2026-11-13', 1000), dailyIndex('2026-11-14', 1000));
  assert.ok(dailyIndex('2026-11-13', 7) < 7);
  assert.equal(dayKey(new Date(2026, 0, 5)), '2026-01-05');
});

test('série : continue le lendemain, repart à 1 après un jour manqué', () => {
  assert.equal(nextStreak(null, '2026-11-13'), 1);
  assert.equal(nextStreak({ day: '2026-11-12', score: 4, streak: 3 }, '2026-11-13'), 4);
  assert.equal(nextStreak({ day: '2026-11-11', score: 4, streak: 3 }, '2026-11-13'), 1);
  assert.equal(nextStreak({ day: '2026-02-28', score: 4, streak: 2 }, '2026-03-01'), 3);
});

test('rappels du défi : les 3 jours suivants à 18 h, même en fin de mois', () => {
  const dates = reminderDates(new Date(2026, 10, 30, 21, 15));
  assert.deepEqual(dates.map((d) => [d.getMonth(), d.getDate(), d.getHours()]), [[11, 1, 18], [11, 2, 18], [11, 3, 18]]);
});
