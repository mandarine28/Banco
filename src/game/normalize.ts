/** Forme comparable d'un texte : minuscules, sans accents, sans espaces ni ponctuation. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    // Ligatures non décomposées par NFD : « CŒUR » doit se trouver en tapant « coeur »
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
}
