/** Mélange une couleur #RRGGBB avec du blanc (0 = inchangée, 1 = blanc), en composantes 0-255. */
export function lighten(hex: string, amount: number): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return [mix((n >> 16) & 255), mix((n >> 8) & 255), mix(n & 255)];
}

/** Luminance relative (WCAG) d'une couleur 0-255. */
export function luminance(rgb: readonly number[]): number {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contraste visé entre le texte bleu nuit et un fond de couleur d'équipe (le rose en manquait). */
export const NAVY_MIN_CONTRAST = 7;
const NAVY_LUMINANCE = luminance([12, 45, 100]);

/** Couleur d'équipe éclaircie juste assez pour qu'un texte bleu nuit posé dessus reste bien lisible. */
export function navyReadable(hex: string, minContrast = NAVY_MIN_CONTRAST, minLighten = 0): string {
  for (let amount = minLighten; amount < 1; amount += 0.05) {
    const rgb = lighten(hex, amount);
    if ((luminance(rgb) + 0.05) / (NAVY_LUMINANCE + 0.05) >= minContrast) return `rgb(${rgb.join(',')})`;
  }
  return 'rgb(255,255,255)';
}
