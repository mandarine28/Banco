/** Demande d'avis à partir de la 3e partie terminée. */
export const REVIEW_AFTER_GAMES = 3;
/** Au plus une demande par mois de notre côté ; Apple plafonne en plus à 3 affichages par an. */
export const REVIEW_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;

export function shouldRequestReview(gamesCompleted: number, lastPromptAt: number | null, now: number): boolean {
  if (gamesCompleted < REVIEW_AFTER_GAMES) return false;
  return lastPromptAt === null || now - lastPromptAt >= REVIEW_INTERVAL_MS;
}
