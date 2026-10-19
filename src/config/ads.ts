// Identifiants des emplacements AdMob (console AdMob → Applications → Emplacements publicitaires).
// Vides tant que le compte n'est pas configuré : les builds de développement utilisent les pubs de test Google,
// une version publiée sans identifiant n'affiche simplement aucune pub.
export const AD_UNIT_IDS = {
  /** Vidéo récompensée « Essayer un pack ». */
  rewardedTrial: { ios: '', android: '' },
  /** Interstitiel de fin de partie (image et texte seulement). */
  endGameInterstitial: { ios: '', android: '' },
} as const;

export type AdPlacement = keyof typeof AD_UNIT_IDS;
