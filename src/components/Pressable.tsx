import type { ComponentProps } from 'react';
import { Pressable as RNPressable, type GestureResponderEvent } from 'react-native';

import { playSound, type SoundName } from '@/lib/sounds';

type Props = ComponentProps<typeof RNPressable> & {
  /** Son de l'action (« tap » par défaut) ; false pour aucun son. */
  sound?: SoundName | false;
  /**
   * Joue le son au relâchement plutôt qu'au contact. Pour les éléments dans une liste qui défile :
   * sinon le simple fait de commencer un défilement déclencherait le son.
   */
  soundOnRelease?: boolean;
};

/** Pressable de React Native + son joué dès le contact du doigt (onPressIn) pour éviter toute latence. */
export function Pressable({ sound = 'tap', soundOnRelease = false, onPress, onPressIn, ...rest }: Props) {
  const play = () => {
    if (sound && rest.accessible !== false) playSound(sound);
  };
  return (
    <RNPressable
      {...rest}
      onPressIn={(event: GestureResponderEvent) => {
        // Seulement pour une vraie action (onPress) : les zones à appui maintenu gèrent leur son
        if (onPress && !soundOnRelease) play();
        onPressIn?.(event);
      }}
      onPress={
        onPress
          ? (event: GestureResponderEvent) => {
              if (soundOnRelease) play();
              onPress(event);
            }
          : undefined
      }
    />
  );
}
