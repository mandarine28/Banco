/// <reference types="node" />

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { questions } from './questions.ts';

// Carte question (écran des mises) : police display 34px, iPhone 375pt − marges écran 24×2 − carte 16×2
const FONT_SIZE = 34;
const TEXT_WIDTH = 375 - 48 - 32;
const MAX_LINES = 3;

/** Largeurs d'avance des glyphes lues directement dans le TTF (tables cmap format 4 + hmtx). */
function loadAdvanceWidths(path: string): (text: string) => number {
  const buf = readFileSync(path);
  const tables: Record<string, number> = {};
  for (let i = 0; i < buf.readUInt16BE(4); i++) {
    const o = 12 + i * 16;
    tables[buf.toString('ascii', o, o + 4)] = buf.readUInt32BE(o + 8);
  }
  const unitsPerEm = buf.readUInt16BE(tables.head + 18);
  const numHMetrics = buf.readUInt16BE(tables.hhea + 34);
  let sub = -1;
  for (let i = 0; i < buf.readUInt16BE(tables.cmap + 2); i++) {
    const off = tables.cmap + buf.readUInt32BE(tables.cmap + 8 + i * 8);
    if (buf.readUInt16BE(off) === 4) sub = off;
  }
  assert.ok(sub >= 0, 'table cmap format 4 introuvable');
  const segX2 = buf.readUInt16BE(sub + 6);
  const ends = sub + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2;
  const glyph = (c: number) => {
    for (let i = 0; i < segX2 / 2; i++) {
      if (c > buf.readUInt16BE(ends + 2 * i)) continue;
      const s = buf.readUInt16BE(starts + 2 * i);
      if (c < s) return 0;
      const d = buf.readInt16BE(deltas + 2 * i), r = buf.readUInt16BE(ranges + 2 * i);
      if (r === 0) return (c + d) & 0xffff;
      const g = buf.readUInt16BE(ranges + 2 * i + r + 2 * (c - s));
      return g && (g + d) & 0xffff;
    }
    return 0;
  };
  const advance = (g: number) => buf.readUInt16BE(tables.hmtx + 4 * Math.min(g, numHMetrics - 1));
  return (text) => [...text].reduce((w, ch) => w + advance(glyph(ch.codePointAt(0)!)), 0) * FONT_SIZE / unitsPerEm;
}

/** Retour à la ligne glouton par mots, comme React Native ; un mot trop long est coupé. */
function countLines(text: string, width: (s: string) => number, maxW: number): number {
  let lines = 1;
  let cur = '';
  for (const word of text.split(' ')) {
    const candidate = cur ? `${cur} ${word}` : word;
    if (width(candidate) <= maxW) { cur = candidate; continue; }
    if (cur) lines++;
    cur = word;
    while (width(cur) > maxW) { lines++; cur = cur.slice(Math.floor(cur.length * maxW / width(cur))); }
  }
  return lines;
}

test(`chaque intitulé de question tient en ${MAX_LINES} lignes sur la carte des mises`, () => {
  const width = loadAdvanceWidths('node_modules/@expo-google-fonts/m-plus-rounded-1c/800ExtraBold/MPLUSRounded1c_800ExtraBold.ttf');
  const display = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const tooLong = questions.flatMap((q) =>
    Object.entries({ fr: q.subject, ...q.subjectByLang })
      .filter(([, s]) => s && countLines(display(s), width, TEXT_WIDTH) > MAX_LINES)
      .map(([lang, s]) => `${q.id} [${lang}] ${s}`),
  );
  assert.deepEqual(tooLong, []);
});
