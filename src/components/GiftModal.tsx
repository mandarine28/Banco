import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ConfirmModal } from '@/components/InfoModal';
import { Pressable } from '@/components/Pressable';
import { PACK_THEME_IDS, type ProductId } from '@/config/shop';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';

type Step = 'choose' | 'claiming' | 'done' | 'failed';

type Props = {
  /** Packs pouvant être offerts (non possédés). */
  packs: ProductId[];
  onClaim: (productId: ProductId) => Promise<void>;
  /** Ferme la fenêtre ; à monter à chaque ouverture pour repartir d'un état neuf. */
  onClose: () => void;
};

/** Fenêtre « pack de bienvenue » : choix du pack, enregistré sur l'appareil. */
export function GiftModal({ packs, onClaim, onClose }: Props) {
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
    } catch {
      setStep('failed');
    }
  };

  if (step === 'done') {
    return (
      <ConfirmModal
        visible
        title={t.gift.doneTitle}
        message={t.gift.doneMsg}
        confirmLabel={t.gift.ok}
        confirmIcon="party-popper"
        onConfirm={onClose}
        onDismiss={onClose}
      />
    );
  }

  return (
    <ConfirmModal
      visible
      title={t.gift.welcomeTitle}
      message={step === 'failed' ? t.gift.failedMsg : t.gift.chooseMsg}
      confirmLabel={t.gift.claim}
      confirmIcon="gift"
      cancelLabel={t.gift.later}
      onConfirm={claim}
      onCancel={onClose}
      onClose={onClose}
      closeLabel={t.shop.close}
    >
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
