// Offres payantes affichées dans l'app. Les achats intégrés ne sont pas encore branchés.
export const offers = {
  streak: { price: '0,99 €' },
  jokers: { price: '0,99 €' },
  packFootball: { price: '0,99 €' },
  packJeuxVideo: { price: '0,99 €' },
  laTotale: { price: '1,99 €' },
} as const;

export const purchaseUnavailable = {
  title: 'Bientôt disponible',
  message: 'Les achats intégrés ne sont pas encore activés dans cette version.',
};
