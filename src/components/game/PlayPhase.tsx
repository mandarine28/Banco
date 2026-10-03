import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Card, CardDivider } from '@/components/Card';
import { SevenSegment } from '@/components/SevenSegment';
import { contract, currentQuestion, type GameState, TURN_SECONDS } from '@/game/engine';
import { colors, fonts } from '@/theme';

type Props = {
  state: GameState;
  remainingMs: number;
  onToggle: (index: number) => void;
};

const WARNING_SECONDS = 10;

export function PlayPhase({ state, remainingMs, onToggle }: Props) {
  const { height } = useWindowDimensions();
  const question = currentQuestion(state);
  const { amount } = contract(state);
  const seconds = Math.ceil(remainingMs / 1000);
  const timerColor = seconds <= WARNING_SECONDS ? colors.pink : colors.orange;
  const progress = remainingMs / (TURN_SECONDS * 1000);
  // Les 9 lignes doivent tenir à l'écran sur un téléphone courant.
  const rowHeight = Math.max(44, Math.min(56, (height - 360) / 9));

  // Ordre alphabétique à l'affichage, index d'origine conservé pour la validation.
  const rows = question.answers
    .map((answer, index) => ({ answer, index }))
    .sort((a, b) => a.answer.label.localeCompare(b.answer.label, 'fr'));

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.prompt}>{question.prompt}</Text>
        <Text style={styles.goal} accessibilityLabel={`${state.found.length} réponses trouvées sur ${amount} misées`}>
          {state.found.length}/{amount} RÉPONSE{amount > 1 ? 'S' : ''}
        </Text>
      </View>

      <View style={styles.timer} accessibilityLabel={`${seconds} secondes restantes`}>
        <SevenSegment value={String(seconds).padStart(2, '0')} height={30} color={timerColor} />
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: timerColor }]}>
            <View style={styles.shine} />
          </View>
        </View>
      </View>

      {rows.map(({ answer, index }) => {
        const found = state.found.includes(index);
        return (
          <View key={index}>
            <CardDivider />
            <Pressable
              onPress={() => onToggle(index)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: found }}
              accessibilityLabel={answer.label}
              style={[styles.row, { height: rowHeight }, found && styles.rowFound]}
            >
              <Text style={[styles.answer, found && styles.textFound]} numberOfLines={1}>
                {answer.label}
              </Text>
              {found ? <MaterialCommunityIcons name="check-bold" size={22} color={colors.white} /> : null}
            </Pressable>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  prompt: {
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 19,
    textAlign: 'center',
  },
  goal: {
    marginTop: 8,
    color: colors.purple,
    fontFamily: fonts.display,
    fontSize: 22,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  track: {
    flex: 1,
    height: 18,
    borderRadius: 9,
    padding: 3,
    backgroundColor: '#E6E6E6',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  shine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
  },
  rowFound: {
    backgroundColor: colors.teal,
  },
  answer: {
    flex: 1,
    color: colors.black,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  textFound: {
    color: colors.white,
  },
});
