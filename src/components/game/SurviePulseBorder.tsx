import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

type Props = {
  color: string;
};

export function SurviePulseBorder({ color }: Props) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.border, { borderColor: color, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 7,
    zIndex: 100,
  },
});
