/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { daysInclusive, monthGrid, recentWeeks, shiftDay, shiftMonth } from './calendar.ts';

test('grille du mois : commence un lundi, semaines complètes', () => {
  // Novembre 2026 commence un dimanche : 6 cases vides avant le 1er
  const grid = monthGrid(2026, 10);
  assert.deepEqual(grid[0], [null, null, null, null, null, null, '2026-11-01']);
  assert.equal(grid.at(-1)?.filter(Boolean).at(-1), '2026-11-30');
  assert.ok(grid.every((week) => week.length === 7));
});

test('grille du mois : février bissextile', () => {
  const days = monthGrid(2028, 1).flat().filter(Boolean);
  assert.equal(days.length, 29);
  assert.equal(days[0], '2028-02-01');
});

test('mois voisin : passage d’année dans les deux sens', () => {
  assert.deepEqual(shiftMonth(2026, 11, 1), { year: 2027, month: 0 });
  assert.deepEqual(shiftMonth(2026, 0, -1), { year: 2025, month: 11 });
});

test('deux dernières semaines : du lundi de la semaine passée au dimanche de celle-ci', () => {
  // Jeudi 19 novembre 2026
  assert.deepEqual(recentWeeks('2026-11-19', 2).map((week) => [week[0], week[6]]), [
    ['2026-11-09', '2026-11-15'],
    ['2026-11-16', '2026-11-22'],
  ]);
});

test('deux dernières semaines : un lundi de début de mois remonte au mois précédent', () => {
  assert.deepEqual(recentWeeks('2027-03-01', 2)[0][0], '2027-02-22');
  // Un dimanche reste dans sa semaine
  assert.equal(recentWeeks('2026-11-22', 1)[0][0], '2026-11-16');
});

test('jour décalé : passage de mois et d’année', () => {
  assert.equal(shiftDay('2026-11-19', -14), '2026-11-05');
  assert.equal(shiftDay('2026-12-25', 14), '2027-01-08');
  assert.equal(shiftDay('2028-03-01', -1), '2028-02-29');
});

test('jours inclus : même jour, passage à l’heure d’été, ordre inversé', () => {
  assert.equal(daysInclusive('2026-11-19', '2026-11-19'), 1);
  assert.equal(daysInclusive('2026-03-20', '2026-04-02'), 14);
  assert.equal(daysInclusive('2026-11-20', '2026-11-19'), 0);
});
