// Identifiants des emplacements AdMob (console AdMob → Applications → Emplacements publicitaires).
// Vides tant que le compte n'est pas configuré : les builds de développement utilisent les pubs de test Google,
// une version publiée sans identifiant n'affiche simplement aucune pub.
export const AD_UNIT_IDS = {
  /** Vidéo récompensée « Essayer un pack ». */
  rewardedTrial: { ios: 'ca-app-pub-7673839117797871/2385640044', android: '' },
  /** Interstitiel de fin de partie (image et texte seulement). */
  endGameInterstitial: { ios: 'ca-app-pub-7673839117797871/5963204236', android: '' },
} as const;

export type AdPlacement = keyof typeof AD_UNIT_IDS;
