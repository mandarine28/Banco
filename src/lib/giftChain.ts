import { GIFT_PACKS, PRODUCT_IDS, WELCOME_GAMES, type ProductId } from '../config/shop';

export type GiftChain = {
  /** Prochain pack à gagner, null quand tous sont gagnés. */
  next: ProductId | null;
  /** Parties jouées vers le prochain pack (0 à WELCOME_GAMES) : repart de 0 à chaque pack gagné. */
  played: number;
  /** Parties terminées déjà acquises : WELCOME_GAMES par pack gagné. */
  floor: number;
};

/** Où en est le joueur dans la chaîne des packs offerts. */
export function giftChain(owned: (productId: ProductId) => boolean, gamesCompleted: number): GiftChain {
  const floor = WELCOME_GAMES * GIFT_PACKS.filter(owned).length;
  return {
    next: GIFT_PACKS.find((productId) => !owned(productId)) ?? null,
    played: Math.min(Math.max(gamesCompleted - floor, 0), WELCOME_GAMES),
    floor,
  };
}

/** Parties restantes avant de gagner ce pack (0 s'il est déjà gagné). */
export function gamesUntil(chain: GiftChain, productId: ProductId): number {
  if (chain.next === null) return 0;
  const steps = GIFT_PACKS.indexOf(productId) - GIFT_PACKS.indexOf(chain.next);
  return steps < 0 ? 0 : WELCOME_GAMES - chain.played + WELCOME_GAMES * steps;
}

/** Pack offert qui suit celui-ci dans la chaîne, s'il y en a un. */
export const giftAfter = (productId: ProductId): ProductId | undefined => GIFT_PACKS[GIFT_PACKS.indexOf(productId) + 1];

/** Pack offert qui précède celui-ci dans la chaîne, s'il y en a un. */
export const giftBefore = (productId: ProductId): ProductId | undefined => {
  const index = GIFT_PACKS.indexOf(productId);
  return index > 0 ? GIFT_PACKS[index - 1] : undefined;
};

/**
 * Packs offerts, séparés par des virgules (une valeur seule, format d'avant la chaîne de cadeaux, reste lue).
 * Seuls les identifiants connus sont gardés : une valeur corrompue ne débloque rien.
 */
export function parseGiftedPacks(value: string | null): ProductId[] {
  if (value === null) return [];
  return value.split(',').filter((id): id is ProductId => id in PRODUCT_IDS);
}
