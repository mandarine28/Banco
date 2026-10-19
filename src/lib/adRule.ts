/** Aucune pub de fin de partie avant la 4e partie terminée : on laisse découvrir le jeu. */
export const INTERSTITIAL_AFTER_GAMES = 3;

/** Pub de fin de partie une partie sur deux, à partir de la 4e partie terminée (4e, 6e, 8e…). */
export function shouldShowInterstitial(gamesCompleted: number): boolean {
  return gamesCompleted > INTERSTITIAL_AFTER_GAMES && gamesCompleted % 2 === 0;
}
