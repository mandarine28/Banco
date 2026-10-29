import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Fragment } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { Pressable } from '@/components/Pressable';
import type { ProductId } from '@/config/shop';
import { colors, fonts } from '@/theme';

export type PassPack = { productId: ProductId; title: string; image: ImageSourcePropType };
export type PassState = 'won' | 'current' | 'locked';

type Props = {
  /** Packs offerts, dans l'ordre où on les gagne. */
  packs: PassPack[];
  owned: (productId: ProductId) => boolean;
  /** Prochain pack à gagner (null : tous gagnés, undefined : pas encore lu). */
  next: ProductId | null | undefined;
  /** Progression affichée sous le pack en cours, ex. « 1/3 ». */
  progress: string;
  /** Phrase lue par le lecteur d'écran pour une pastille. */
  describe: (pack: PassPack, state: PassState) => string;
  /** Toucher une pastille verrouillée : explique quel pack gagner d'abord. */
  onLockedPress?: (pack: PassPack) => void;
};

const SIZE = 38;
const ORANGE = '#fb940e';

/** Passe des packs offerts : pastilles reliées comme une piste, du pack gagné au prochain à gagner. */
export function GiftPass({ packs, owned, next, progress, describe, onLockedPress }: Props) {
  const stateOf = (p: PassPack): PassState => (owned(p.productId) ? 'won' : p.productId === next ? 'current' : 'locked');
  const states = packs.map(stateOf);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.track}>
      {packs.map((pack, i) => {
        const state = states[i];
        return (
          <Fragment key={pack.productId}>
            {/* Trait parcouru (orange) jusqu'au pack en cours, blanc au-delà */}
            {i > 0 ? <View style={[styles.link, state !== 'locked' && styles.linkDone]} /> : null}
            <Pressable
              style={styles.node}
              disabled={state !== 'locked' || !onLockedPress}
              onPress={() => onLockedPress?.(pack)}
              accessibilityRole={state === 'locked' ? 'button' : undefined}
              accessibilityLabel={describe(pack, state)}
            >
              <View style={[styles.circle, state === 'current' && styles.circleCurrent]}>
                <Image source={pack.image} style={[styles.image, state === 'locked' && styles.imageLocked]} />
                {state === 'locked' ? (
                  <View style={styles.lock}>
                    <MaterialCommunityIcons name="lock" size={16} color={colors.cream} />
                  </View>
                ) : null}
              </View>
              {state === 'won' ? (
                <View style={styles.check}>
                  <MaterialCommunityIcons name="check-bold" size={11} color={colors.purpleDeep} />
                </View>
              ) : null}
              <Text style={styles.progress}>{state === 'current' ? progress : ' '}</Text>
            </Pressable>
          </Fragment>
        );
      })}
      {/* Piste ouverte : d'autres packs offerts arriveront */}
      <View style={styles.link} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  track: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  node: {
    alignItems: 'center',
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
    backgroundColor: colors.purpleDeep,
  },
  circleCurrent: {
    borderWidth: 3,
    borderColor: ORANGE,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLocked: {
    opacity: 0.35,
  },
  lock: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    position: 'absolute',
    top: SIZE - 14,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal,
    borderWidth: 2,
    borderColor: colors.purple,
  },
  progress: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.cream,
  },
  // Trait entre deux pastilles (maquette : 28 × 4, blanc) ; s'étire pour remplir la largeur
  link: {
    flex: 1,
    minWidth: 28,
    height: 4,
    marginTop: (SIZE - 4) / 2,
    marginHorizontal: -1,
    borderRadius: 33,
    backgroundColor: colors.white,
  },
  linkDone: {
    backgroundColor: ORANGE,
  },
});
