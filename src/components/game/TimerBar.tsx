import { StyleSheet, View } from 'react-native';

import { NextButton } from '@/components/PillButton';
import { SevenSegment } from '@/components/SevenSegment';
import { TURN_SECONDS } from '@/game/engine';
import { colors } from '@/theme';

const WARNING_SECONDS = 10;

type Props = {
  remainingMs: number;
  onSkip: () => void;
};

/** Barre fixée en bas pendant le jeu : chrono et bouton pour terminer le tour. */
export function TimerBar({ remainingMs, onSkip }: Props) {
  const seconds = Math.ceil(remainingMs / 1000);
  const color = seconds <= WARNING_SECONDS ? colors.pink : colors.orange;
  const progress = remainingMs / (TURN_SECONDS * 1000);

  return (
    <View style={styles.row}>
      <View style={styles.timer} accessibilityLabel={`${seconds} secondes restantes`}>
        <SevenSegment value={String(seconds).padStart(2, '0')} height={28} color={color} />
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: color }]}>
            <View style={styles.shine} />
          </View>
        </View>
      </View>
      <NextButton accessibilityLabel="Terminer le tour" onPress={onSkip} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
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
});
