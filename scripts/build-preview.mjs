// Construit un aperçu web autonome (un seul fichier HTML) à partir de `dist/`
// (`npx expo export --platform web`). Usage : node scripts/build-preview.mjs <sortie.html>
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = process.argv[2] ?? 'preview.html';
const jsDir = 'dist/_expo/static/js/web';
const bundleFile = readdirSync(jsDir).find((f) => f.startsWith('entry-') && f.endsWith('.js'));
let bundle = readFileSync(join(jsDir, bundleFile), 'utf8');

// Seules les polices réellement affichées sont embarquées.
const usedFonts = /(Quicksand_(600SemiBold|700Bold)|Roboto_(500Medium|700Bold)|FontAwesome6_(Solid|Brands|Regular)|MaterialCommunityIcons)\.[0-9a-f]+\.ttf$/;
bundle = bundle.replace(/"(\/assets\/[^"]+\.ttf)"/g, (match, path) => {
  if (!usedFonts.test(path)) return match;
  const data = readFileSync(join('dist', path)).toString('base64');
  return `"data:font/ttf;base64,${data}"`;
});

const title = process.env.EXPO_PUBLIC_APP_NAME ?? 'Devineuf';
// Le manifeste embarqué reprend le nom de app.json : on l'aligne sur le nom de l'aperçu.
bundle = bundle.replaceAll('Devineuf', title);
const html = `<title>${title}</title>
<style>
  html, body { height: 100%; background: #7A14B8; overflow: hidden; }
  #root { display: flex; height: 100%; flex: 1; }
</style>
<div id="root"></div>
<script>
  // Expo Router lit l'URL courante : on démarre l'aperçu sur l'écran d'accueil.
  try { history.replaceState(null, '', '/'); } catch (e) {}
</script>
<script>${bundle.replace(/<\/script/gi, '<\\/script')}</script>
`;
writeFileSync(out, html);
console.log(`${out}: ${(html.length / 1e6).toFixed(1)} MB`);
