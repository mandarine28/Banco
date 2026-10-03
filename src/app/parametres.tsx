import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, CardDivider } from '@/components/Card';
import { Bulb, SoccerBall } from '@/components/Illustrations';
import { InfoBadge, type InfoContent, InfoModal } from '@/components/InfoModal';
import { NextButton, PriceButton } from '@/components/PillButton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TotaleOffer } from '@/components/TotaleOffer';
import { offers, purchaseUnavailable } from '@/config/shop';
import { useGameSettings } from '@/state/gameSettings';
import { colors, fonts } from '@/theme';

const infos = {
  modes: {
    title: 'Modes de jeu',
    message:
      "Classique : les équipes misent sur le nombre de réponses qu'elles pourront citer sur un thème. La plus haute mise répond en 60 secondes, l'adversaire tient le téléphone et valide.\n\nStreak : mode supplémentaire à débloquer.",
  },
  packs: {
    title: 'Packs de questions',
    message: 'Des questions supplémentaires sur un thème précis, à ajouter aux questions de base.',
  },
} satisfies Record<string, InfoContent>;

export default function GameModesScreen() {
  const { mode, setMode } = useGameSettings();
  const [info, setInfo] = useState<InfoContent | null>(null);
  const buy = () => setInfo(purchaseUnavailable);

  return (
    <ScreenLayout
      title="PARAMÈTRES DE JEU"
      footer={<NextButton onPress={() => router.push('/parametres-partie')} />}
    >
      <SectionTitle title="MODES DE JEU" onInfo={() => setInfo(infos.modes)} />

      <View style={styles.modes}>
        <ModeCard
          selected={mode === 'classique'}
          onPress={() => setMode('classique')}
          label="CLASSIQUE"
          illustration={<Bulb height={78} />}
        />
        <ModeCard
          locked
          onPress={buy}
          label="STREAK"
          illustration={<MaterialCommunityIcons name="fire" size={56} color={colors.pink} />}
          footer={<PriceButton price={offers.streak.price} onPress={buy} />}
        />
      </View>

      <SectionTitle title="PACK DE QUESTIONS" onInfo={() => setInfo(infos.packs)} />

      <Card>
        <PackRow icon={<SoccerBall size={40} />} label="FOOTBALL" price={offers.packFootball.price} onBuy={buy} />
        <CardDivider />
        <PackRow
          icon={<MaterialCommunityIcons name="space-invaders" size={42} color={colors.lavender} />}
          label="JEUX VIDÉO"
          price={offers.packJeuxVideo.price}
          onBuy={buy}
        />
      </Card>

      <TotaleOffer onBuy={buy} />

      <InfoModal content={info} onClose={() => setInfo(null)} />
    </ScreenLayout>
  );
}

function SectionTitle({ title, onInfo }: { title: string; onInfo: () => void }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <InfoBadge label={title} onPress={onInfo} />
    </View>
  );
}

type ModeCardProps = {
  label: string;
  illustration: ReactNode;
  onPress: () => void;
  selected?: boolean;
  locked?: boolean;
  footer?: ReactNode;
};

function ModeCard({ label, illustration, onPress, selected = false, locked = false, footer }: ModeCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: locked }}
      accessibilityLabel={locked ? `Mode ${label}, verrouillé` : `Mode ${label}`}
      style={[styles.modeWrapper, locked && styles.modeLocked]}
    >
      <Card style={styles.modeCard}>
        {illustration}
        <Text style={styles.modeLabel}>{label}</Text>
        {footer}
      </Card>
      {selected ? (
        <View style={[styles.badge, styles.badgeSelected]}>
          <MaterialCommunityIcons name="check-bold" size={22} color={colors.white} />
        </View>
      ) : null}
      {locked ? (
        <View style={[styles.badge, styles.badgeLocked]}>
          <MaterialCommunityIcons name="lock" size={18} color={colors.white} />
        </View>
      ) : null}
    </Pressable>
  );
}

type PackRowProps = {
  icon: ReactNode;
  label: string;
  price: string;
  onBuy: () => void;
};

function PackRow({ icon, label, price, onBuy }: PackRowProps) {
  return (
    <View style={styles.packRow}>
      <View style={styles.packIcon}>{icon}</View>
      <Text style={styles.packLabel}>{label}</Text>
      <PriceButton price={price} onPress={onBuy} />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sectionLabel: {
    color: colors.labelOnPurple,
    fontFamily: fonts.body,
    fontSize: 18,
  },
  modes: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 10,
  },
  modeWrapper: {
    flex: 1,
  },
  modeLocked: {
    marginTop: 26,
  },
  modeCard: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  modeLabel: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSelected: {
    top: -12,
    right: -6,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.teal,
  },
  badgeLocked: {
    top: -6,
    right: -8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.lavender,
  },
  packRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  packIcon: {
    width: 46,
    alignItems: 'center',
  },
  packLabel: {
    flex: 1,
    textAlign: 'center',
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 18,
  },
});
