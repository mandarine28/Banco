import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { colors } from '@/theme';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  accessibilityLabel: string;
};

const TRACK_W = 66;
const KNOB = 28;
const PAD = 3;

export function Toggle({ value, onChange, accessibilityLabel }: Props) {
  const position = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(position, { toValue: value ? 1 : 0, duration: 160, useNativeDriver: false }).start();
  }, [position, value]);

  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: position.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.lavender, colors.teal],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [
                { translateX: position.interpolate({ inputRange: [0, 1], outputRange: [0, TRACK_W - KNOB - PAD * 2] }) },
              ],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: KNOB + PAD * 2,
    borderRadius: (KNOB + PAD * 2) / 2,
    padding: PAD,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
});
