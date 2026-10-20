import { useEffect, useState } from 'react';

import { WELCOME_GAMES, WELCOME_PACK } from '@/config/shop';
import { loadGamesCompleted } from '@/lib/engagement';
import { usePurchases } from './purchases';

/** Pack de bienvenue : offert après WELCOME_GAMES parties terminées, enregistré sur l'appareil. */
export function useWelcomePack() {
  const { hasPurchased } = usePurchases();
  // null tant que le compteur n'est pas lu : la progression ne s'affiche pas avant
  const [gamesCompleted, setGamesCompleted] = useState<number | null>(null);
  useEffect(() => {
    loadGamesCompleted().then(setGamesCompleted);
  }, []);
  const gamesPlayed = gamesCompleted === null ? null : Math.min(gamesCompleted, WELCOME_GAMES);
  return {
    unlocked: hasPurchased(WELCOME_PACK),
    gamesPlayed,
    gamesLeft: gamesPlayed === null ? null : WELCOME_GAMES - gamesPlayed,
  };
}
