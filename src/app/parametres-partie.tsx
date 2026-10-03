import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, CardDivider } from '@/components/Card';
import { JesterHat } from '@/components/Illustrations';
import { InfoBadge, type InfoContent, InfoModal } from '@/components/InfoModal';
import { NextButton, PriceButton } from '@/components/PillButton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { Stepper } from '@/components/Stepper';
import { Toggle } from '@/components/Toggle';
import { TotaleOffer } from '@/components/TotaleOffer';
import { offers, purchaseUnavailable } from '@/config/shop';
import { ROUND_LIMITS, TEAM_LIMITS, useGameSettings } from '@/state/gameSettings';
import { colors, fonts } from '@/theme';

const infos = {
  sameTheme: {
    title: 'Même thème / round',
    message: "Activé : dans un même round, toutes les équipes reçoivent une question du même thème.",
  },
  jokers: {
    title: 'Jokers',
    message: 'Des aides à utiliser pendant la partie, à débloquer.',
  },
} satisfies Record<string, InfoContent>;

export default function MatchSettingsScreen() {
  const settings = useGameSettings();
  const [info, setInfo] = useState<InfoContent | null>(null);
  const buy = () => setInfo(purchaseUnavailable);

  return (
    <ScreenLayout title="PARAMÈTRES DE JEU" footer={<NextButton onPress={() => router.push('/equipes')} />}>
      <Card>
        <Row label="NOMBRE D’ÉQUIPES">
          <Stepper
            label="nombre d’équipes"
            value={settings.teamCount}
            {...TEAM_LIMITS}
            onChange={settings.setTeamCount}
            color={colors.orange}
            shadowColor={colors.orangeShadow}
          />
        </Row>
        <CardDivider />
        <Row label="NOMBRE DE ROUNDS">
          <Stepper
            label="nombre de rounds"
            value={settings.roundCount}
            {...ROUND_LIMITS}
            onChange={settings.setRoundCount}
            color={colors.pink}
            shadowColor={colors.pinkSoft}
          />
        </Row>
        <CardDivider />
        <Row label="THÈMES DE QUESTIONS">
          <Pressable
            onPress={() => router.push('/themes')}
            accessibilityRole="button"
            accessibilityLabel="Choisir les thèmes de questions"
            style={styles.themesButtonBase}
          >
            <View style={styles.themesButton}>
              <MaterialCommunityIcons name="tune-variant" size={30} color={colors.white} />
            </View>
          </Pressable>
        </Row>
        <CardDivider />
        <Row label="MÊME THÈME / ROUND" onInfo={() => setInfo(infos.sameTheme)}>
          <Toggle
            accessibilityLabel="Même thème par round"
            value={settings.sameThemePerRound}
            onChange={settings.setSameThemePerRound}
          />
        </Row>
        <CardDivider />
        <Row label="JOKERS" icon={<JesterHat width={46} />} onInfo={() => setInfo(infos.jokers)}>
          <PriceButton price={offers.jokers.price} onPress={buy} width={96} />
        </Row>
      </Card>

      <View style={styles.spacer} />
      <TotaleOffer onBuy={buy} />

      <InfoModal content={info} onClose={() => setInfo(null)} />
    </ScreenLayout>
  );
}

type RowProps = {
  label: string;
  children: ReactNode;
  icon?: ReactNode;
  onInfo?: () => void;
};

function Row({ label, children, icon, onInfo }: RowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.labelGroup}>
        {icon}
        <Text style={styles.label}>{label}</Text>
        {onInfo ? (
          <View style={styles.infoBadge}>
            <InfoBadge label={label} onPress={onInfo} />
          </View>
        ) : null}
      </View>
      <View style={styles.control}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 76,
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 14,
  },
  labelGroup: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    flexShrink: 1,
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 17,
  },
  infoBadge: {
    alignSelf: 'flex-start',
    marginTop: -6,
  },
  control: {
    alignItems: 'center',
  },
  themesButtonBase: {
    borderRadius: 12,
    paddingBottom: 3,
    backgroundColor: colors.tealShadow,
  },
  themesButton: {
    width: 56,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal,
  },
  spacer: {
    flex: 1,
    minHeight: 12,
  },
});
