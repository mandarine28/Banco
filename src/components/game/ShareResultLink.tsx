import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Share, StyleSheet, Text } from 'react-native';

import { Pressable } from '@/components/Pressable';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { buildShareMessage } from '@/lib/shareResult';
import { colors, fonts } from '@/theme';

type Props = {
  rows: Parameters<typeof buildShareMessage>[0];
};

/** Lien discret sous le classement : ne fait pas concurrence à « Revanche ». */
export function ShareResultLink({ rows }: Props) {
  const { lang } = useLang();
  const t = getT(lang);
  // Feuille de partage annulée ou indisponible : rien à signaler au joueur
  const share = () => Share.share({ message: buildShareMessage(rows, t.final) }).catch(() => {});
  return (
    <Pressable style={styles.link} onPress={share} hitSlop={10} accessibilityRole="button" accessibilityLabel={t.final.share}>
      <MaterialCommunityIcons name="share-variant" size={20} color={colors.cream} />
      <Text style={styles.text}>{t.final.share}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
  },
  text: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
    color: colors.cream,
    textDecorationLine: 'underline',
  },
});
