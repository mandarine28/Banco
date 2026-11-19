import type { ComponentProps } from 'react';
import { Pressable as RNPressable, type GestureResponderEvent } from 'react-native';

import { playHaptic, type HapticKind } from '@/lib/haptics';
import { playSound, type SoundName } from '@/lib/sounds';

type Props = ComponentProps<typeof RNPressable> & {
  /** Son de l'action (« tap » par défaut) ; false pour aucun son. */
  sound?: SoundName | false;
  /** Vibration jouée en même temps que le son (aucune par défaut). */
  haptic?: HapticKind;
};

/**
 * Pressable de React Native + son joué quand l'appui aboutit (onPress), jamais au simple contact :
 * un doigt qui fait défiler une liste ou se pose à côté d'un bouton ne doit pas faire de bruit.
 */
export function Pressable({ sound = 'tap', haptic, onPress, ...rest }: Props) {
  const play = () => {
    if (rest.accessible === false) return;
    if (sound) playSound(sound);
    if (haptic) playHaptic(haptic);
  };
  return (
    <RNPressable
      {...rest}
      onPress={
        onPress
          ? (event: GestureResponderEvent) => {
              play();
              onPress(event);
            }
          : undefined
      }
    />
  );
}
