import type { ImageSourcePropType } from 'react-native';

/** Illustration plein écran d'un pack : l'image glisse depuis `from` et se pose sur `to` (0 à 1, de gauche à droite). */
export type PackIntro = { image: ImageSourcePropType; from: number; to: number };

/** Exports des SVG de chaque pack (assets/packs/full) ; `to` centre la tête de la mascotte. */
export const PACK_INTROS: Record<string, PackIntro> = {
  football: { image: require('../../assets/packs/full/football.webp'), from: 0.72, to: 0.46 },
  'harry-potter': { image: require('../../assets/packs/full/harry-potter.webp'), from: 0.2, to: 0.49 },
  'rap-francais': { image: require('../../assets/packs/full/rap-francais.webp'), from: 0.2, to: 0.49 },
  dresseur: { image: require('../../assets/packs/full/dresseur.webp'), from: 0.8, to: 0.5 },
  'art-litterature': { image: require('../../assets/packs/full/art-litterature.webp'), from: 0.18, to: 0.45 },
  'retro-gaming': { image: require('../../assets/packs/full/retro-gaming.webp'), from: 0.5, to: 0.5 },
  anime: { image: require('../../assets/packs/full/anime.webp'), from: 0.8, to: 0.48 },
};
