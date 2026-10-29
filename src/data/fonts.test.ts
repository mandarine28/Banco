/// <reference types="node" />

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

// Polices allégées (scripts/subset-fonts.mjs) : elles doivent rendre exactement comme les originales
// pour tout ce que l'app affiche, et garder les mêmes métriques (mises en page inchangées).
const ROOT = join(import.meta.dirname, '..', '..');
const WEIGHTS = ['400Regular', '500Medium', '700Bold', '800ExtraBold'];
const original = (w: string) => join(ROOT, 'node_modules', '@expo-google-fonts', 'm-plus-rounded-1c', w, `MPLUSRounded1c_${w}.ttf`);
const subset = (file: string) => join(ROOT, 'assets', 'fonts', file);

type Font = { glyph: (cp: number) => number; advance: (cp: number) => number; metrics: number[] };

/** Lecture minimale d'un TTF : table cmap (format 4), largeurs (hmtx) et métriques verticales. */
function readFont(path: string): Font {
  const buf = readFileSync(path);
  const tables: Record<string, number> = {};
  for (let i = 0; i < buf.readUInt16BE(4); i++) {
    const o = 12 + i * 16;
    tables[buf.toString('ascii', o, o + 4)] = buf.readUInt32BE(o + 8);
  }
  let sub = -1;
  for (let i = 0; i < buf.readUInt16BE(tables.cmap + 2); i++) {
    const off = tables.cmap + buf.readUInt32BE(tables.cmap + 8 + i * 8);
    if (buf.readUInt16BE(off) === 4) sub = off;
  }
  assert.ok(sub >= 0, `${path} : table cmap format 4 introuvable`);
  const segX2 = buf.readUInt16BE(sub + 6);
  const ends = sub + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ranges = deltas + segX2;
  const glyph = (c: number) => {
    if (c > 0xffff) return 0;
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
  const numHMetrics = buf.readUInt16BE(tables.hhea + 34);
  const advance = (c: number) => buf.readUInt16BE(tables.hmtx + 4 * Math.min(glyph(c), numHMetrics - 1));
  const os2 = tables['OS/2'];
  const metrics = [
    buf.readUInt16BE(tables.head + 18), // unitsPerEm
    buf.readInt16BE(tables.hhea + 4), buf.readInt16BE(tables.hhea + 6), buf.readInt16BE(tables.hhea + 8), // ascender, descender, lineGap
    buf.readInt16BE(os2 + 68), buf.readInt16BE(os2 + 70), buf.readInt16BE(os2 + 72), // typo ascender, descender, lineGap
    buf.readUInt16BE(os2 + 74), buf.readUInt16BE(os2 + 76), // win ascent, descent
  ];
  return { glyph, advance, metrics };
}

/** Tous les caractères écrits dans le code et les données : textes des 6 langues, questions, réponses. */
function usedCodePoints(): number[] {
  const cps = new Set<number>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(entry.name)) for (const ch of readFileSync(p, 'utf8')) cps.add(ch.codePointAt(0)!);
    }
  };
  walk(join(ROOT, 'src'));
  return [...cps];
}

// Latin complet + ponctuation européenne : couvert même si pas encore utilisé (futurs packs, noms d'équipes)
const LATIN = Array.from({ length: 0x024f - 0x0020 + 1 }, (_, i) => 0x0020 + i).concat(
  Array.from({ length: 0x206f - 0x2000 + 1 }, (_, i) => 0x2000 + i),
);

for (const w of WEIGHTS) {
  test(`police allégée ${w} : mêmes caractères, mêmes largeurs, mêmes métriques que l'originale`, () => {
    const before = readFont(original(w));
    const after = readFont(subset(`MPLUSRounded1c_${w}.ttf`));
    assert.deepEqual(after.metrics, before.metrics, 'métriques verticales');
    const problems: string[] = [];
    for (const cp of new Set([...usedCodePoints(), ...LATIN])) {
      if (!before.glyph(cp)) continue; // déjà absent de l'originale (emoji…) : rendu par le système, inchangé
      const ch = `${String.fromCodePoint(cp)} (U+${cp.toString(16).toUpperCase().padStart(4, '0')})`;
      if (!after.glyph(cp)) problems.push(`${ch} manquant`);
      else if (after.advance(cp) !== before.advance(cp)) problems.push(`${ch} largeur ${after.advance(cp)} ≠ ${before.advance(cp)}`);
    }
    assert.deepEqual(problems, []);
  });
}

test('aucun import global de polices : il embarquerait toutes les graisses et tous les jeux d’icônes (~24 Mo)', () => {
  const offenders: string[] = [];
  const walk = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.test.ts')) {
        const src = readFileSync(p, 'utf8');
        if (/from '@expo\/vector-icons'|from '@expo-google-fonts\//.test(src)) offenders.push(p);
      }
    }
  };
  walk(join(ROOT, 'src'));
  // Importer chaque jeu par son chemin : '@expo/vector-icons/MaterialCommunityIcons', polices via assets/fonts
  assert.deepEqual(offenders, []);
});

test('icônes FontAwesome allégées : chaque icône utilisée est présente, même largeur', () => {
  const dir = join(ROOT, 'node_modules', '@expo', 'vector-icons', 'build', 'vendor', 'react-native-vector-icons');
  const before = readFont(join(dir, 'Fonts', 'FontAwesome6_Solid.ttf'));
  const after = readFont(subset('FontAwesome6_Solid.ttf'));
  const glyphs: Record<string, number> = JSON.parse(readFileSync(subset('fontAwesome6Glyphs.json'), 'utf8'));
  // Chaque icône FontAwesome6 du code doit figurer dans la police allégée
  const used = new Set<string>();
  const walk = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.tsx$/.test(entry.name)) {
        for (const m of readFileSync(p, 'utf8').matchAll(/<FontAwesome6\s+name="([^"]+)"/g)) used.add(m[1]);
      }
    }
  };
  walk(join(ROOT, 'src'));
  assert.ok(used.size > 0);
  for (const name of used) {
    assert.ok(glyphs[name], `icône « ${name} » absente : l'ajouter à FA_ICONS dans scripts/subset-fonts.mjs`);
    assert.ok(after.glyph(glyphs[name]), name);
    assert.equal(after.advance(glyphs[name]), before.advance(glyphs[name]), name);
  }
});
