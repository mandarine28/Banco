import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ConfirmModal } from '@/components/InfoModal';
import { Pressable } from '@/components/Pressable';
import { PACK_THEME_IDS, type ProductId } from '@/config/shop';
import { GiftClaimError, type GiftKind } from '@/lib/gifts';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';

type Step = 'choose' | 'claiming' | 'done' | 'failed' | 'alreadyClaimed';

type Props = {
  kind: GiftKind;
  /** Packs pouvant être offerts (non possédés). */
  packs: ProductId[];
  isSignedIn: boolean;
  onClaim: (productId: ProductId) => Promise<void>;
  /** Ferme la fenêtre ; à monter à chaque ouverture pour repartir d'un état neuf. */
  onClose: () => void;
  /** Avant d'ouvrir l'écran de connexion : masquer la fenêtre sans abandonner le cadeau. */
  onSignIn: () => void;
};

/** Fenêtre « pack offert » : choix du pack, puis accord côté serveur (compte requis). */
export function GiftModal({ kind, packs, isSignedIn, onClaim, onClose, onSignIn }: Props) {
  const { lang } = useLang();
  const t = getT(lang);
  const [step, setStep] = useState<Step>('choose');
  const [selected, setSelected] = useState<ProductId | undefined>(packs[0]);

  const packTitle = (product: ProductId) => t.shop.packTitles[PACK_THEME_IDS[product] ?? ''] ?? product;

  const claim = async () => {
    if (!selected || step === 'claiming') return;
    setStep('claiming');
    try {
      await onClaim(selected);
      setStep('done');
    } catch (e) {
      setStep(e instanceof GiftClaimError && e.reason === 'already_claimed' ? 'alreadyClaimed' : 'failed');
    }
  };

  const goToAccount = () => {
    onSignIn();
    router.push('/auth');
  };

  if (step === 'done' || step === 'alreadyClaimed') {
    return (
      <ConfirmModal
        visible
        title={step === 'done' ? t.gift.doneTitle : (kind === 'welcome' ? t.gift.welcomeTitle : t.gift.shareTitle)}
        message={step === 'done' ? t.gift.doneMsg : t.gift.alreadyClaimedMsg}
        confirmLabel={t.gift.ok}
        confirmIcon={step === 'done' ? 'party-popper' : undefined}
        onConfirm={onClose}
        onDismiss={onClose}
      />
    );
  }

  const message = !isSignedIn ? t.gift.signInMsg : step === 'failed' ? t.gift.failedMsg : t.gift.chooseMsg;

  return (
    <ConfirmModal
      visible
      title={kind === 'welcome' ? t.gift.welcomeTitle : t.gift.shareTitle}
      message={message}
      confirmLabel={isSignedIn ? t.gift.claim : t.gift.createAccount}
      confirmIcon={isSignedIn ? 'gift' : 'account-plus'}
      cancelLabel={t.gift.later}
      onConfirm={isSignedIn ? claim : goToAccount}
      onCancel={onClose}
      onClose={onClose}
      closeLabel={t.shop.close}
    >
      {isSignedIn ? (
        <View style={styles.packs} accessibilityRole="radiogroup">
          {packs.map((product) => {
            const isSelected = product === selected;
            return (
              <Pressable
                key={product}
                onPress={() => setSelected(product)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                style={[styles.pack, isSelected && styles.packSelected]}
              >
                <Text style={[styles.packText, isSelected && styles.packTextSelected]} numberOfLines={1}>
                  {packTitle(product)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </ConfirmModal>
  );
}

const styles = StyleSheet.create({
  packs: {
    width: '100%',
    gap: 8,
  },
  pack: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.purpleDeep,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  packSelected: {
    backgroundColor: colors.purpleDeep,
  },
  packText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.purpleDeep,
  },
  packTextSelected: {
    color: colors.cream,
  },
});
