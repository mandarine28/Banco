// Génère des versions allégées des polices embarquées (assets/fonts/), sans les milliers de
// caractères japonais de M PLUS Rounded ni les icônes FontAwesome inutilisées.
// À relancer si on ajoute une graisse ou une icône FontAwesome :  node scripts/subset-fonts.mjs
// Contrôle : src/data/fonts.test.ts (chaque caractère des textes et questions est présent, mêmes largeurs).
import fs from 'node:fs';
import path from 'node:path';
import subsetFont from 'subset-font';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'assets', 'fonts');
fs.mkdirSync(out, { recursive: true });

// Tous les caractères latins et la ponctuation européenne, même ceux qu'on n'utilise pas encore
const RANGES = [
  [0x0020, 0x007e], // ASCII
  [0x00a0, 0x024f], // Latin-1, Latin étendu A et B (accents, ß, œ, ñ, ç…)
  [0x0300, 0x036f], // accents combinants
  [0x1e00, 0x1eff], // Latin étendu additionnel
  [0x2000, 0x206f], // ponctuation générale (– — ‘ ’ “ ” „ … •)
  [0x20a0, 0x20cf], // symboles monétaires (€)
  [0x2100, 0x214f], // symboles lettres (™ №)
  [0x2190, 0x21ff], // flèches
  [0x2200, 0x22ff], // symboles mathématiques (≥ ≤ ×)
  [0x25a0, 0x25ff], // formes géométriques
  [0x2600, 0x27bf], // symboles divers (♀ ♂ ★ ✓)
];

/** Caractères présents dans le code et les données (textes, questions) : aucun ne doit manquer. */
function usedChars() {
  const chars = new Set();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(entry.name)) for (const ch of fs.readFileSync(p, 'utf8')) chars.add(ch);
    }
  };
  walk(path.join(root, 'src'));
  return chars;
}

const text = [...usedChars()].join('') + RANGES.map(([a, b]) => String.fromCodePoint(...Array.from({ length: b - a + 1 }, (_, i) => a + i))).join('');

const MPLUS = path.join(root, 'node_modules', '@expo-google-fonts', 'm-plus-rounded-1c');
for (const weight of ['400Regular', '500Medium', '700Bold', '800ExtraBold']) {
  const file = `MPLUSRounded1c_${weight}.ttf`;
  const src = fs.readFileSync(path.join(MPLUS, weight, file));
  const subset = await subsetFont(src, text, { targetFormat: 'truetype' });
  fs.writeFileSync(path.join(out, file), subset);
  console.log(`${file} : ${(src.length / 1024).toFixed(0)} Ko → ${(subset.length / 1024).toFixed(0)} Ko`);
}

// FontAwesome 6 Solid réduit aux seules icônes utilisées (le paquet complet embarque 3 polices)
const FA_ICONS = ['forward'];
const faDir = path.join(root, 'node_modules', '@expo', 'vector-icons', 'build', 'vendor', 'react-native-vector-icons');
const faMap = JSON.parse(fs.readFileSync(path.join(faDir, 'glyphmaps', 'FontAwesome6Free.json'), 'utf8'));
const faText = FA_ICONS.map((name) => String.fromCodePoint(faMap[name])).join('');
const faSrc = fs.readFileSync(path.join(faDir, 'Fonts', 'FontAwesome6_Solid.ttf'));
const faSubset = await subsetFont(faSrc, faText, { targetFormat: 'truetype' });
fs.writeFileSync(path.join(out, 'FontAwesome6_Solid.ttf'), faSubset);
fs.writeFileSync(path.join(out, 'fontAwesome6Glyphs.json'), JSON.stringify(Object.fromEntries(FA_ICONS.map((n) => [n, faMap[n]]))) + '\n');
console.log(`FontAwesome6_Solid.ttf : ${(faSrc.length / 1024).toFixed(0)} Ko → ${(faSubset.length / 1024).toFixed(0)} Ko`);
