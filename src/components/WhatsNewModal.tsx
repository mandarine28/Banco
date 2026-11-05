import { router } from 'expo-router';
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { ConfirmModal } from '@/components/InfoModal';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { colors, fonts } from '@/theme';

const NEW_PACKS: { id: string; image: ImageSourcePropType }[] = [
  { id: 'football', image: require('../../assets/packs/football.png') },
];

/** « Nouveautés ! » au lancement : les nouveaux packs, avec un accès direct à la boutique. */
export function WhatsNewModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const t = getT(useLang().lang);
  return (
    <ConfirmModal
      visible={visible}
      title={t.common.whatsNewTitle}
      titleLines={2}
      message={t.common.whatsNewMsg}
      confirmLabel={t.common.whatsNewBtn}
      onConfirm={() => {
        onClose();
        router.push('/boutique');
      }}
      onDismiss={onClose}
      onClose={onClose}
    >
      <View style={styles.packs}>
        {NEW_PACKS.map((pack) => (
          <View key={pack.id} style={styles.pack}>
            <Image source={pack.image} style={styles.image} accessibilityIgnoresInvertColors />
            <Text style={styles.name} numberOfLines={2}>{t.shop.packTitles[pack.id] ?? pack.id}</Text>
          </View>
        ))}
      </View>
    </ConfirmModal>
  );
}

const styles = StyleSheet.create({
  packs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  pack: {
    flex: 1,
    maxWidth: 120,
    alignItems: 'center',
    gap: 6,
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 12,
  },
  name: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.purpleDeep,
    textAlign: 'center',
  },
});
