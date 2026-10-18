import { useCallback, useEffect, useState } from 'react';

import { PACK_THEME_IDS, type ProductId } from '@/config/shop';
import { claimGift, fetchClaimedGifts, GiftClaimError, type GiftKind } from '@/lib/gifts';
import { useAuth } from './auth';
import { usePurchases } from './purchases';

const NONE: ReadonlySet<GiftKind> = new Set();

/** Cadeaux (bienvenue, partage) : packs offerts une fois par compte, accordés côté serveur. */
export function useGifts() {
  const { user } = useAuth();
  const { hasPurchased, refresh } = usePurchases();
  // Rattaché à l'utilisateur : un changement de compte ne réutilise pas l'état du précédent
  const [claimed, setClaimed] = useState<{ userId: string; kinds: ReadonlySet<GiftKind> } | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchClaimedGifts()
      .then((kinds) => {
        if (!cancelled) setClaimed({ userId: user.id, kinds });
      })
      .catch((e) => {
        if (__DEV__) console.warn('[gifts] lecture impossible', e);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Non connecté : on ne sait pas encore, le serveur tranchera après connexion. Connecté : on attend la lecture.
  const claimedKinds = !user ? NONE : claimed?.userId === user.id ? claimed.kinds : null;
  const giftablePacks = (Object.keys(PACK_THEME_IDS) as ProductId[]).filter((product) => !hasPurchased(product));

  const canOffer = (kind: GiftKind) => claimedKinds !== null && !claimedKinds.has(kind) && giftablePacks.length > 0;

  const claim = useCallback(
    async (kind: GiftKind, productId: ProductId) => {
      const markClaimed = () => {
        if (user) setClaimed((prev) => ({ userId: user.id, kinds: new Set([...(prev?.kinds ?? []), kind]) }));
      };
      try {
        await claimGift(kind, productId);
      } catch (e) {
        // Déjà récupéré (autre appareil) : on cesse de le proposer
        if (e instanceof GiftClaimError && e.reason === 'already_claimed') markClaimed();
        throw e;
      }
      markClaimed();
      await refresh();
    },
    [user, refresh],
  );

  return { isSignedIn: !!user, giftablePacks, canOffer, claim };
}
