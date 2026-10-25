import { useEffect, useState } from 'react';

import { WELCOME_PACK } from '@/config/shop';
import { loadGamesCompleted } from '@/lib/engagement';
import { giftChain, type GiftChain } from '@/lib/giftChain';
import { usePurchases } from './purchases';

/** Packs offerts gagnés l'un après l'autre (WELCOME_GAMES parties chacun), enregistrés sur l'appareil. */
export function useGiftChain(): { welcomeUnlocked: boolean; chain: GiftChain | null } {
  const { hasPurchased } = usePurchases();
  // null tant que le compteur n'est pas lu : la progression ne s'affiche pas avant
  const [gamesCompleted, setGamesCompleted] = useState<number | null>(null);
  useEffect(() => {
    loadGamesCompleted().then(setGamesCompleted);
  }, []);
  return {
    welcomeUnlocked: hasPurchased(WELCOME_PACK),
    chain: gamesCompleted === null ? null : giftChain(hasPurchased, gamesCompleted),
  };
}
