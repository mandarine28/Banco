/**
 * Arrondi des coins de l'écran, estimé : aucune API ne le donne. Sur iPhone, la hauteur de l'encoche
 * (marge du haut) trahit le modèle ; sur Android, une valeur moyenne.
 */
export function screenCornerRadius(os: string, topInset: number): number {
  if (os !== 'ios') return 36;
  if (topInset >= 62) return 62; // 16 Pro, 16 Pro Max
  if (topInset >= 59) return 55; // 14 Pro à 16 Plus
  if (topInset >= 50) return 44; // 12 mini, 13 mini
  if (topInset >= 47) return 47; // 11, XR, 12 à 14
  if (topInset >= 44) return 39; // X, XS, 11 Pro
  return 0; // iPhone à bouton d'accueil : coins carrés
}
