/// <reference types="node" />

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { glossaries } from '../data/glossaries.ts';
import { questions } from '../data/questions.ts';
import { LANGUAGES } from '../lib/i18n.ts';
import { getAnswers, hiddenAnswers, indexLetter, normalize, searchAnswers, sortAlphabetically, suggestions, translateAnswer } from './answers.ts';
import {
  canPass,
  contract,
  createGame,
  currentPrompt,
  currentQuestion,
  MAX_BID,
  gameReducer,
  minimumBid,
  opponent,
  passConcludesAuction,
  planQuestions,
  ranking,
  remaining,
} from './engine.ts';
import type { GameAction, GameState } from './engine.ts';

const LANGS = LANGUAGES.map((l) => l.code);
// Au-delà, la liste de puces du tour (toutes rendues d'un coup) devient lente sur Android d'entrée de gamme
const MAX_SUGGESTIONS = 150;

// Générateur pseudo-aléatoire déterministe pour des tests reproductibles.
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32;
    return seed / 2 ** 32;
  };
}

const two = [
  { name: 'ÉQUIPE 1', color: '#FBB040' },
  { name: 'ÉQUIPE 2', color: '#16D3C3' },
];
const three = [...two, { name: 'ÉQUIPE 3', color: '#F21F66' }];

const play = (state: GameState, ...actions: GameAction[]) => actions.reduce(gameReducer, state);
const find = (count: number): GameAction[] =>
  Array.from({ length: count }, (_, i) => ({ type: 'TOGGLE_ANSWER', label: `RÉPONSE ${i}` }));

test('chaque question a, dans chaque langue, assez de réponses (mise max), sans doublon ni excès', () => {
  const problems: string[] = [];
  for (const q of questions) {
    assert.ok(q.theme && q.subject && !/^CITEZ/i.test(q.subject), q.id);
    for (const lang of LANGS) {
      const list = getAnswers(q, lang);
      if (list.length < MAX_BID) problems.push(`${q.id} [${lang}] : ${list.length} réponses (< ${MAX_BID})`);
      if (list.length > MAX_SUGGESTIONS) problems.push(`${q.id} [${lang}] : ${list.length} réponses (> ${MAX_SUGGESTIONS})`);
      const keys = list.map(normalize);
      const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
      if (dupes.length) problems.push(`${q.id} [${lang}] : doublons ${dupes.join(', ')}`);
    }
  }
  assert.deepEqual(problems, []);
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length, 'identifiants uniques');
});

test('glossaires : chaque entrée traduit une réponse FR existante du thème', () => {
  const stale: string[] = [];
  for (const [theme, glossary] of Object.entries(glossaries)) {
    const frAnswers = new Set(questions.filter((q) => q.theme === theme).flatMap((q) => q.answers));
    for (const [lang, entries] of Object.entries(glossary)) {
      for (const fr of Object.keys(entries ?? {})) if (!frAnswers.has(fr)) stale.push(`${theme} [${lang}] ${fr}`);
    }
  }
  assert.deepEqual(stale, []);
});

test('réponses locales : jamais en double avec la liste commune de leur langue', () => {
  const redundant: string[] = [];
  for (const q of questions) {
    for (const [lang, list] of Object.entries(q.local ?? {})) {
      const common = new Set(getAnswers({ ...q, local: undefined }, lang as (typeof LANGS)[number]).map(normalize));
      for (const a of list ?? []) if (common.has(normalize(a))) redundant.push(`${q.id} [${lang}] ${a}`);
    }
  }
  assert.deepEqual(redundant, []);
});

test('réponses locales : affichées dans leur langue seulement, trouvables ailleurs par la recherche', () => {
  const q = {
    id: 't', theme: 'inconnu', subject: 'SUPERMARCHÉS', answers: ['LIDL', 'ALDI'],
    local: { fr: ['CARREFOUR', 'LECLERC'], de: ['EDEKA'] },
  };
  assert.deepEqual(getAnswers(q, 'fr'), ['LIDL', 'CARREFOUR', 'ALDI', 'LECLERC']);
  assert.deepEqual(getAnswers(q, 'de'), ['LIDL', 'EDEKA', 'ALDI']);
  assert.deepEqual(getAnswers(q, 'es'), ['LIDL', 'ALDI']);
  assert.deepEqual(hiddenAnswers(q, 'de'), ['CARREFOUR', 'LECLERC']);
  const de = { ...q, answers: getAnswers(q, 'de') };
  assert.deepEqual(searchAnswers(de, 'le', 30, hiddenAnswers(q, 'de')), ['LECLERC']);
  assert.deepEqual(searchAnswers(de, 'l', 30, hiddenAnswers(q, 'de')), ['LIDL', 'LECLERC', 'ALDI']);
});

test('traduction : glossaire de la langue, puis anglais, puis français', () => {
  const theme = Object.keys(glossaries).find((t) => Object.keys(glossaries[t].en ?? {}).length)!;
  const [fr, en] = Object.entries(glossaries[theme].en!)[0];
  assert.equal(translateAnswer(theme, 'fr', fr), fr);
  assert.equal(translateAnswer(theme, 'en', fr), en);
  assert.equal(translateAnswer(theme, 'de', fr), glossaries[theme].de?.[fr] ?? en);
  assert.equal(translateAnswer(theme, 'en', 'RÉPONSE INCONNUE'), 'RÉPONSE INCONNUE');
});

test('la recherche ignore accents, casse et ponctuation, préfixes en premier', () => {
  const autos = questions.find((q) => q.id === 'marques-autos')!;
  assert.deepEqual(searchAnswers(autos, 'citroen'), ['CITROËN']);
  assert.equal(searchAnswers(autos, 'au')[0], 'AUDI');
  assert.deepEqual(searchAnswers(autos, '   '), []);
  const alcool = questions.find((q) => q.id === 'marques-alcool')!;
  assert.ok(searchAnswers(alcool, 'ja').includes('JAMESON'));
  assert.equal(searchAnswers(alcool, 'hei')[0], 'HEINEKEN');
});

test('les boutons affichent toutes les réponses + les saisies libres validées', () => {
  const q = questions[0];
  const last = q.answers[q.answers.length - 1];
  const list = suggestions(q, [last, 'SAISIE LIBRE']);
  assert.equal(list.length, q.answers.length + 1); // SAISIE LIBRE ajoutée ; last déjà dans la liste
  assert.ok(list.includes(last) && list.includes('SAISIE LIBRE'));
  assert.equal(suggestions(q, [q.answers[0]]).length, q.answers.length); // pas de doublon
});

test('tri alphabétique et lettre d\'index ignorent accents et ponctuation', () => {
  assert.deepEqual(sortAlphabetically(['ÉCLAIR', 'ZORRO', "L'ABEILLE", 'ASTERIX']), ['ASTERIX', 'ÉCLAIR', "L'ABEILLE", 'ZORRO']);
  assert.equal(indexLetter('ÉCLAIR'), 'E');
  assert.equal(indexLetter('1/2'), '#');
});

test('compteur manuel : décompte depuis la mise, sans dépasser la mise', () => {
  let s = play(createGame(two, 1, questions, seeded(11)), { type: 'BID', amount: 3 }, { type: 'PASS' }, { type: 'START_TURN' });
  assert.equal(remaining(s), 3);
  s = play(s, { type: 'ADJUST', delta: -1 });
  assert.equal(remaining(s), 3, 'le + ne dépasse pas la mise');
  s = play(s, { type: 'ADJUST', delta: 1 }, { type: 'TOGGLE_ANSWER', label: 'X' });
  assert.equal(remaining(s), 1);
  s = play(s, { type: 'TOGGLE_ANSWER', label: 'X' });
  assert.equal(remaining(s), 2, 'annuler un bouton rend la réponse');
  s = play(s, { type: 'ADJUST', delta: 1 }, { type: 'ADJUST', delta: 1 });
  assert.equal(s.phase, 'result');
  assert.equal(s.endReason, 'reached');
});

test('une question par round, sans répétition tant que la base suffit', () => {
  const plan = planQuestions(questions, 5, seeded(1));
  assert.equal(plan.length, 5);
  assert.equal(new Set(plan.map((q) => q.id)).size, 5);
  assert.equal(planQuestions(questions.slice(0, 2), 5, seeded(2)).length, 5);
});

test('l’ouvreur doit miser, puis chacun surenchérit ou passe', () => {
  let s = createGame(two, 3, questions, seeded(3));
  assert.equal(s.phase, 'auction');
  assert.equal(s.auction.current, 0);
  assert.equal(canPass(s), false);
  assert.equal(gameReducer(s, { type: 'PASS' }), s, 'passer à l’ouverture est refusé');

  s = play(s, { type: 'BID', amount: 3 });
  assert.equal(s.auction.current, 1);
  assert.equal(minimumBid(s), 4);
  s = play(s, { type: 'BID', amount: 2 }); // trop bas : ramené au minimum
  assert.deepEqual(s.auction.highest, { team: 1, amount: 4 });
  s = play(s, { type: 'PASS' });
  assert.equal(s.phase, 'ready');
  assert.deepEqual(contract(s), { team: 1, amount: 4 });
  assert.equal(opponent(s), 0);
});

test('passer conclut l’enchère seulement quand il ne reste que deux équipes', () => {
  assert.equal(passConcludesAuction(createGame(two, 1, questions, seeded(5))), true);
  let s = play(createGame(three, 1, questions, seeded(5)), { type: 'BID', amount: 3 });
  assert.equal(passConcludesAuction(s), false, 'trois équipes en lice : on passe son tour');
  s = play(s, { type: 'PASS' });
  assert.equal(s.phase, 'auction');
  assert.equal(passConcludesAuction(s), true, 'deux équipes restantes : passer conclut');
  s = play(s, { type: 'PASS' });
  assert.equal(s.phase, 'ready');
});

test('la mise peut dépasser 9 ; la mise maximale termine l’enchère', () => {
  let s = play(createGame(two, 1, questions, seeded(4)), { type: 'BID', amount: 12 });
  assert.equal(s.phase, 'auction');
  assert.equal(minimumBid(s), 13);
  s = play(s, { type: 'BID', amount: MAX_BID + 5 });
  assert.equal(s.phase, 'ready');
  assert.deepEqual(contract(s), { team: 1, amount: MAX_BID });
  assert.equal(currentPrompt(s), `CITEZ ${MAX_BID} ${currentQuestion(s).subject}`);
});

test('réussite : l’équipe empoche sa mise dès qu’elle l’atteint', () => {
  let s = play(createGame(two, 1, questions, seeded(5)), { type: 'BID', amount: 3 }, { type: 'PASS' });
  s = play(s, { type: 'START_TURN' }, ...find(3));
  assert.equal(s.phase, 'result');
  assert.equal(s.endReason, 'reached');
  assert.deepEqual(s.scores, [3, 0]);
});

test('échec : la mise va à l’adversaire', () => {
  let s = play(createGame(two, 1, questions, seeded(6)), { type: 'BID', amount: 5 }, { type: 'PASS' });
  s = play(s, { type: 'START_TURN' }, ...find(4), { type: 'END_TURN', reason: 'time' });
  assert.deepEqual(s.scores, [0, 5]);
});

test('une réponse annulée ne compte plus', () => {
  let s = play(createGame(two, 1, questions, seeded(7)), { type: 'BID', amount: 2 }, { type: 'PASS' });
  s = play(s, { type: 'START_TURN' }, { type: 'TOGGLE_ANSWER', label: 'A' }, { type: 'TOGGLE_ANSWER', label: 'A' });
  assert.deepEqual(s.found, []);
  assert.equal(s.phase, 'play');
});

test('à 3 équipes, l’adversaire est la dernière équipe dépassée', () => {
  // L'équipe 1 ouvre à 2, l'équipe 2 monte à 3, l'équipe 3 passe, l'équipe 1 monte à 5, l'équipe 2 passe.
  let s = play(
    createGame(three, 1, questions, seeded(8)),
    { type: 'BID', amount: 2 },
    { type: 'BID', amount: 3 },
    { type: 'PASS' },
    { type: 'BID', amount: 5 },
    { type: 'PASS' },
  );
  assert.equal(s.phase, 'ready');
  assert.deepEqual(contract(s), { team: 0, amount: 5 });
  assert.equal(opponent(s), 1);
  s = play(s, { type: 'START_TURN' }, { type: 'END_TURN', reason: 'skip' });
  assert.deepEqual(s.scores, [0, 5, 0]);
});

test('si personne ne surenchérit, l’adversaire est l’équipe suivante', () => {
  const s = play(createGame(three, 1, questions, seeded(9)), { type: 'BID', amount: 1 }, { type: 'PASS' }, { type: 'PASS' });
  assert.equal(s.phase, 'ready');
  assert.equal(opponent(s), 1);
});

test('l’ouverture tourne à chaque round, puis fin de partie', () => {
  let s = createGame(two, 3, questions, seeded(10));
  const openers: number[] = [];
  while (s.phase !== 'final') {
    openers.push(s.auction.current);
    s = play(s, { type: 'BID', amount: 1 }, { type: 'PASS' }, { type: 'START_TURN' }, { type: 'END_TURN', reason: 'skip' }, { type: 'NEXT' });
  }
  assert.deepEqual(openers, [0, 1, 0]);
});

test('classement avec ex aequo', () => {
  const s = { ...createGame(three, 1, questions), scores: [5, 9, 5] };
  assert.deepEqual(
    ranking(s).map((r) => [r.index, r.rank]),
    [
      [1, 1],
      [0, 2],
      [2, 2],
    ],
  );
});
