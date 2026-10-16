import { useEffect, useEffectEvent } from 'react';
import { BackHandler } from 'react-native';

/**
 * Android : le geste/bouton retour système ne quitte pas la partie, il ouvre la même
 * confirmation que la croix. (Le swipe iOS est désactivé pour « partie » via gestureEnabled dans _layout.)
 */
export function useBackToQuitConfirm(onBack: () => void) {
  const handleBack = useEffectEvent(onBack);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBack();
      return true;
    });
    return () => sub.remove();
  }, []);
}
