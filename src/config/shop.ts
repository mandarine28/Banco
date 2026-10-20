export type ProductId = 'streak' | 'jokers' | 'packFootball' | 'packJeuxVideo' | 'laTotale' | 'packHarryPotter';

export const offers: Record<ProductId, { label: string; price: string }> = {
  streak: { label: 'Mode Streak', price: '0,99 €' },
  jokers: { label: 'Jokers', price: '0,99 €' },
  packFootball: { label: 'Pack Football', price: '0,99 €' },
  packJeuxVideo: { label: 'Pack Jeux Vidéo', price: '0,99 €' },
  laTotale: { label: 'La Totale', price: '1,99 €' },
  packHarryPotter: { label: 'Pack Poudlard Express', price: '0,99 €' },
};

// Identifiants produits tels que définis dans App Store Connect / Google Play
// Ne jamais retirer packHarryPotter : le pack de bienvenue est enregistré sous cet identifiant, l'enlever le ferait perdre aux joueurs
export const PRODUCT_IDS: Record<ProductId, string> = {
  streak: 'com.banco.mode_streak',
  jokers: 'com.banco.jokers',
  packFootball: 'com.banco.pack_football',
  packJeuxVideo: 'com.banco.pack_jeux_video',
  laTotale: 'com.banco.la_totale',
  packHarryPotter: 'com.banco.pack_harry_potter',
};


/** Pack offert (jamais vendu) après WELCOME_GAMES parties terminées. */
export const WELCOME_PACK: ProductId = 'packHarryPotter';
export const WELCOME_GAMES = 3;

/** Thème de jeu correspondant à chaque pack de questions. */
export const PACK_THEME_IDS: Partial<Record<ProductId, string>> = {
  packHarryPotter: 'harry-potter',
};
