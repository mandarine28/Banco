export type ProductId = 'streak' | 'jokers' | 'packFootball' | 'packJeuxVideo' | 'laTotale' | 'packHarryPotter';

export const offers: Record<ProductId, { label: string; price: string }> = {
  streak: { label: 'Mode Streak', price: '0,99 €' },
  jokers: { label: 'Jokers', price: '0,99 €' },
  packFootball: { label: 'Pack Football', price: '0,99 €' },
  packJeuxVideo: { label: 'Pack Jeux Vidéo', price: '0,99 €' },
  laTotale: { label: 'La Totale', price: '1,99 €' },
  packHarryPotter: { label: "Pack L'école du sorcier à lunettes", price: '0,99 €' },
};

// Identifiants produits tels que définis dans App Store Connect / Google Play
export const PRODUCT_IDS: Record<ProductId, string> = {
  streak: 'com.banco.mode_streak',
  jokers: 'com.banco.jokers',
  packFootball: 'com.banco.pack_football',
  packJeuxVideo: 'com.banco.pack_jeux_video',
  laTotale: 'com.banco.la_totale',
  packHarryPotter: 'com.banco.pack_harry_potter',
};

/** Fiche App Store (lien partagé par « Partager Banco »). */
export const APP_STORE_URL = 'https://apps.apple.com/app/id6821200817';

/** Thème de jeu correspondant à chaque pack de questions. */
export const PACK_THEME_IDS: Partial<Record<ProductId, string>> = {
  packHarryPotter: 'harry-potter',
};
