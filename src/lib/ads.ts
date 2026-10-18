/** Issue d'une demande de vidéo récompensée. */
export type RewardedResult = 'rewarded' | 'dismissed' | 'unavailable';

/**
 * Affiche une vidéo récompensée.
 * SDK AdMob pas encore intégré : renvoie 'unavailable' (l'appelant offre alors la récompense quand même).
 */
export async function showRewardedAd(): Promise<RewardedResult> {
  return 'unavailable';
}

/** Règle Banco : pas de pub disponible → on ne frustre pas le joueur, la récompense est offerte. */
export const isRewardGranted = (result: RewardedResult) => result !== 'dismissed';
