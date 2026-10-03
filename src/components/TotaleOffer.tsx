import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { TotaleIcon } from '@/components/Illustrations';
import { PriceButton } from '@/components/PillButton';
import { offers } from '@/config/shop';
import { colors, fonts } from '@/theme';

/** Encart de l'offre groupée « La Totale », avec son étiquette « Meilleure option! ». */
export function TotaleOffer({ onBuy }: { onBuy: () => void }) {
  return (
    <View style={styles.wrapper}>
      <Card style={styles.card}>
        <TotaleIcon size={54} />
        <View style={styles.texts}>
          <Text style={styles.title}>La Totale</Text>
          <Text style={styles.subtitle} numberOfLines={1} adjustsFontSizeToFit>Streak + Jokers + Packs</Text>
        </View>
        <PriceButton price={offers.laTotale.price} onPress={onBuy} width={84} />
      </Card>
      <View style={styles.tag}>
        <Text style={styles.tagLabel}>Meilleure option!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingLeft: 10,
    paddingRight: 16,
  },
  texts: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.black,
    fontFamily: fonts.display,
    fontSize: 24,
  },
  subtitle: {
    color: colors.black,
    fontFamily: fonts.displayMedium,
    fontSize: 14,
  },
  tag: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.pink,
  },
  tagLabel: {
    color: colors.white,
    fontFamily: fonts.displayMedium,
    fontSize: 14,
  },
});
