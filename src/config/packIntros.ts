import type { ImageSourcePropType } from 'react-native';

/** Illustration plein écran d'un pack : l'image glisse depuis `from` et se pose sur `to` (0 à 1, de gauche à droite). */
export type PackIntro = { image: ImageSourcePropType; aspect: number; from: number; to: number };

// Largeur / hauteur des exports (3120 × 2532 px) : lue ici, pas à l'exécution
const WIDE = 3120 / 2532;

/** Exports des SVG de chaque pack (assets/packs/full) ; `to` centre la tête de la mascotte. */
export const PACK_INTROS: Record<string, PackIntro> = {
  football: { image: require('../../assets/packs/full/football.webp'), aspect: WIDE, from: 0.72, to: 0.46 },
  'harry-potter': { image: require('../../assets/packs/full/harry-potter.webp'), aspect: WIDE, from: 0.2, to: 0.49 },
  'rap-francais': { image: require('../../assets/packs/full/rap-francais.webp'), aspect: WIDE, from: 0.2, to: 0.49 },
  dresseur: { image: require('../../assets/packs/full/dresseur.webp'), aspect: WIDE, from: 0.8, to: 0.5 },
  'art-litterature': { image: require('../../assets/packs/full/art-litterature.webp'), aspect: WIDE, from: 0.18, to: 0.45 },
  'retro-gaming': { image: require('../../assets/packs/full/retro-gaming.webp'), aspect: 2110 / 2532, from: 0.15, to: 0.5 },
  anime: { image: require('../../assets/packs/full/anime.webp'), aspect: WIDE, from: 0.8, to: 0.48 },
};
