/** Taille des libellés de bouton des fenêtres (police display). */
export const BUTTON_FONT_SIZE = 24;
const MIN_FONT_SIZE = 14;
/** Largeur moyenne d'une capitale de la police display, en fraction de la taille de police. */
export const CAPITAL_WIDTH_RATIO = 0.66;

/**
 * Taille commune aux boutons d'une même fenêtre : celle qui fait tenir le libellé le plus long.
 * Sans elle, chaque bouton rétrécit seul et les deux textes n'ont plus la même taille.
 */
export function sharedLabelSize(labels: readonly string[], textWidth: number): number {
  const longest = Math.max(1, ...labels.map((label) => label.length));
  const fitting = textWidth / (longest * CAPITAL_WIDTH_RATIO);
  return Math.max(MIN_FONT_SIZE, Math.min(BUTTON_FONT_SIZE, Math.floor(fitting)));
}
