import { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

const STRIP_W = 34;
const MIN_ROW_H = 11;
const BUBBLE_SIZE = 56;

type Props = {
  letters: readonly string[];
  activeLetter: string | null;
  onSelect: (letter: string) => void;
  accessibilityLabel: string;
};

/** Index A-Z vertical façon Apple Music : toucher/glisser saute à la lettre, bulle façon Material. */
export function AlphabetIndex({ letters, activeLetter, onSelect, accessibilityLabel }: Props) {
  const [height, setHeight] = useState(0);
  const [drag, setDrag] = useState<{ y: number; letter: string } | null>(null);
  // Le PanResponder est créé une fois : il lit les valeurs courantes via ce ref
  const live = useRef({ letters, onSelect, height: 0, startY: 0, last: '' });
  useEffect(() => {
    live.current.letters = letters;
    live.current.onSelect = onSelect;
  }, [letters, onSelect]);

  const [responder] = useState(() => {
    const pick = (y: number) => {
      const { letters: ls, height: h } = live.current;
      if (!ls.length || !h) return;
      const clamped = Math.max(0, Math.min(h - 1, y));
      const letter = ls[Math.floor((clamped / h) * ls.length)];
      setDrag({ y: clamped, letter });
      if (letter !== live.current.last) {
        live.current.last = letter;
        live.current.onSelect(letter);
      }
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        live.current.startY = e.nativeEvent.locationY;
        live.current.last = '';
        pick(e.nativeEvent.locationY);
      },
      onPanResponderMove: (_, g) => pick(live.current.startY + g.dy),
      onPanResponderRelease: () => setDrag(null),
      onPanResponderTerminate: () => setDrag(null),
    });
  });

  // Trop de lettres pour la hauteur : on n'en affiche qu'une sur `step`, le glisser reste précis
  const maxSlots = Math.max(1, Math.floor(height / MIN_ROW_H));
  const step = Math.ceil(letters.length / maxSlots);
  const shown = letters.filter((_, i) => i % step === 0);
  const fontSize = Math.min(13, Math.max(9, (height / Math.max(1, shown.length)) * 0.8));
  const current = drag?.letter ?? activeLetter;
  const currentIdx = current ? letters.indexOf(current) : -1;
  const moveBy = (delta: number) => {
    const next = letters[Math.max(0, Math.min(letters.length - 1, currentIdx + delta))];
    if (next) onSelect(next);
  };

  return (
    <View
      style={styles.strip}
      onLayout={(e) => {
        live.current.height = e.nativeEvent.layout.height;
        setHeight(e.nativeEvent.layout.height);
      }}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={current ? { text: current } : undefined}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => moveBy(e.nativeEvent.actionName === 'increment' ? 1 : -1)}
      {...responder.panHandlers}
    >
      <View style={styles.letters} pointerEvents="none">
        {shown.map((letter) => {
          const isActive = current !== null && letters.indexOf(letter) <= currentIdx && currentIdx < letters.indexOf(letter) + step;
          return (
            <Text key={letter} style={[styles.letter, { fontSize }, isActive && styles.letterActive]}>
              {letter}
            </Text>
          );
        })}
      </View>
      {drag ? (
        <View
          pointerEvents="none"
          style={[styles.bubble, { top: Math.max(0, Math.min(height - BUBBLE_SIZE, drag.y - BUBBLE_SIZE / 2)) }]}
        >
          <Text style={styles.bubbleText}>{drag.letter}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    width: STRIP_W,
    // Élargit la zone tactile vers la gauche sans prendre de place dans la mise en page
    paddingLeft: 12,
    marginLeft: -12,
    zIndex: 2,
  },
  letters: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  letter: {
    fontFamily: fonts.displayMedium,
    color: 'rgba(254,246,215,0.75)',
    textAlign: 'center',
  },
  letterActive: {
    color: colors.pink,
  },
  bubble: {
    position: 'absolute',
    right: STRIP_W + 8,
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderTopLeftRadius: BUBBLE_SIZE / 2,
    borderBottomLeftRadius: BUBBLE_SIZE / 2,
    borderTopRightRadius: BUBBLE_SIZE / 2,
    borderBottomRightRadius: 6,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleText: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.purpleDeep,
  },
});
