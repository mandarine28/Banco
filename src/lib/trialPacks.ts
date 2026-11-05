/**
 * Listes des packs en essai. Sans changement réel, on rend la même liste (même référence) :
 * l'état React ne bouge pas, et l'écran de partie qui retire l'essai au lancement ne tourne pas en boucle.
 */
export const withTrialPack = (list: string[], themeId: string): string[] => (list.includes(themeId) ? list : [...list, themeId]);

export const withoutTrialPack = (list: string[], themeId: string): string[] =>
  list.includes(themeId) ? list.filter((id) => id !== themeId) : list;
