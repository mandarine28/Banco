import { useEffect, useState } from 'react';

import { ConfirmModal } from '@/components/InfoModal';
import { GIFT_PACKS, PACK_THEME_IDS, WELCOME_GAMES } from '@/config/shop';
import { isRewardGranted, showRewardedAd } from '@/lib/ads';
import { gamesUntil } from '@/lib/giftChain';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { loadUsedTrials } from '@/lib/trials';
import { useGiftChain } from '@/state/useGifts';

type Props = {
  /** Thème du pack offert touché (null = fenêtre fermée). */
  themeId: string | null;
  onClose: () => void;
  /** Pub regardée jusqu'au bout : le pack peut être joué une partie. */
  onTrialGranted: (themeId: string) => void;
};

/** Pack offert pas encore gagné : parties restantes, et une partie d'essai contre une pub tant qu'elle n'a pas servi. */
export function LockedGiftModal({ themeId, onClose, onTrialGranted }: Props) {
  const t = getT(useLang().lang);
  const { chain } = useGiftChain();
  const [usedTrials, setUsedTrials] = useState<Set<string>>(new Set());
  // Relu à chaque ouverture : un essai peut avoir été consommé depuis un autre écran
  useEffect(() => {
    if (themeId) loadUsedTrials().then(setUsedTrials);
  }, [themeId]);

  const product = themeId ? GIFT_PACKS.find((id) => PACK_THEME_IDS[id] === themeId) : undefined;
  const trialUsed = themeId !== null && usedTrials.has(themeId);
  const left = chain && product ? gamesUntil(chain, product) : WELCOME_GAMES;

  const watchAd = async () => {
    const id = themeId;
    const result = await showRewardedAd();
    onClose();
    if (id && isRewardGranted(result)) onTrialGranted(id);
  };

  return (
    <ConfirmModal
      visible={product !== undefined}
      title={themeId ? (t.shop.packTitles[themeId] ?? themeId) : ''}
      // Essai déjà utilisé : on le dit, sinon le joueur ne comprend pas pourquoi le bouton pub a disparu
      message={(trialUsed ? t.gift.lockedTrialUsedMsg : t.gift.lockedTrialMsg)(left)}
      cancelLabel={trialUsed ? undefined : t.gift.gotIt}
      cancelIcon="check-bold"
      onCancel={trialUsed ? undefined : onClose}
      confirmLabel={trialUsed ? t.gift.gotIt : t.shop.watchAd}
      confirmIcon={trialUsed ? 'check-bold' : 'play-circle'}
      onConfirm={trialUsed ? onClose : watchAd}
      onDismiss={onClose}
    />
  );
}
