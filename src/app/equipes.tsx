import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/Card';
import { LabelButton } from '@/components/PillButton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { type Team, useGameSettings } from '@/state/gameSettings';
import { colors, fonts, teamColors } from '@/theme';

const NAME_MAX_LENGTH = 16;

const defaultName = (index: number) => `ÉQUIPE ${index + 1}`;

export default function TeamSetupScreen() {
  const { teamCount, teams: savedTeams, setTeams } = useGameSettings();
  const [index, setIndex] = useState(0);
  // Brouillon des équipes déjà saisies : on garde les choix quand on revient en arrière.
  const [drafts, setDrafts] = useState<Team[]>(() => savedTeams.slice(0, teamCount));

  // Couleurs déjà prises par les équipes précédentes.
  const takenColors = drafts.slice(0, index).map((team) => team.color);
  const current = drafts[index];

  const saveAndContinue = (team: Team) => {
    const next = [...drafts.slice(0, index), team, ...drafts.slice(index + 1)];
    // Une couleur choisie ici ne doit pas rester sur une équipe suivante.
    const cleaned = next.map((t, i) =>
      i > index && next.slice(0, i).some((prev) => prev.color === t.color) ? { ...t, color: '' } : t,
    );
    setDrafts(cleaned);

    if (index + 1 < teamCount) {
      setIndex(index + 1);
    } else {
      setTeams(cleaned.slice(0, teamCount));
      router.push('/partie');
    }
  };

  const goBack = () => (index > 0 ? setIndex(index - 1) : router.back());

  return (
    <ScreenLayout title="CONFIGURATION DES ÉQUIPES" onBack={goBack}>
      <TeamForm
        key={index}
        index={index}
        total={teamCount}
        initial={current}
        takenColors={takenColors}
        onSubmit={saveAndContinue}
      />
    </ScreenLayout>
  );
}

type TeamFormProps = {
  index: number;
  total: number;
  initial?: Team;
  takenColors: string[];
  onSubmit: (team: Team) => void;
};

function TeamForm({ index, total, initial, takenColors, onSubmit }: TeamFormProps) {
  const firstFree = teamColors.find((c) => !takenColors.includes(c)) ?? teamColors[0];
  const [color, setColor] = useState<string>(
    initial?.color && !takenColors.includes(initial.color) ? initial.color : firstFree,
  );
  const [name, setName] = useState(initial?.name ?? '');

  const submit = () => onSubmit({ color, name: name.trim() || defaultName(index) });

  return (
    <View style={styles.wrapper}>
      <Card style={styles.card}>
        <Text style={styles.step} accessibilityLabel={`Équipe ${index + 1} sur ${total}`}>
          {index + 1}/{total}
        </Text>

        <Text style={styles.label}>CHOISISSEZ LA COULEUR DE L’ÉQUIPE</Text>
        <View style={styles.colors}>
          {teamColors.map((c, i) => {
            const taken = takenColors.includes(c);
            const selected = c === color;
            return (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                disabled={taken}
                accessibilityRole="radio"
                accessibilityState={{ selected, disabled: taken }}
                accessibilityLabel={`Couleur ${i + 1}${taken ? ', déjà prise' : ''}`}
                hitSlop={4}
                style={[styles.swatchRing, selected && styles.swatchRingSelected]}
              >
                <View style={[styles.swatch, { backgroundColor: c }, taken && styles.swatchTaken]} />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>INSÉRER LE NOM DE L’ÉQUIPE</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={defaultName(index)}
          placeholderTextColor={colors.inputPlaceholder}
          maxLength={NAME_MAX_LENGTH}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={submit}
          accessibilityLabel="Nom de l’équipe"
          style={styles.input}
        />

        <View style={styles.actions}>
          <LabelButton label="SUIVANT" onPress={submit} />
        </View>
      </Card>
    </View>
  );
}

const SWATCH = 52;
const RING = 4;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 24,
  },
  card: {
    alignItems: 'center',
    gap: 22,
    paddingTop: 16,
    paddingBottom: 26,
    paddingHorizontal: 22,
  },
  step: {
    alignSelf: 'flex-end',
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 28,
  },
  label: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 16,
    textAlign: 'center',
  },
  colors: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  swatchRing: {
    padding: RING,
    borderRadius: SWATCH,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  swatchRingSelected: {
    borderColor: colors.purple,
  },
  swatch: {
    width: SWATCH,
    height: SWATCH,
    borderRadius: SWATCH / 2,
  },
  swatchTaken: {
    opacity: 0.2,
  },
  input: {
    alignSelf: 'stretch',
    height: 64,
    paddingHorizontal: 28,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: colors.purple,
    backgroundColor: colors.lavender,
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 26,
  },
  actions: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    paddingTop: 8,
  },
});
