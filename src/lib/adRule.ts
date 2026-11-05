/** Aucune pub de fin de partie sur la toute première partie : on laisse découvrir le jeu. */
export const INTERSTITIAL_AFTER_GAMES = 1;

/** Pub de fin de partie à chaque partie terminée, à partir de la 2e. */
export function shouldShowInterstitial(gamesCompleted: number): boolean {
  return gamesCompleted > INTERSTITIAL_AFTER_GAMES;
}
