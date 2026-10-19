import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/** Appelle `onBackground` dès que l'app quitte le premier plan (changement d'app, verrouillage), tant que `active`. */
export function usePauseOnBackground(active: boolean, onBackground: () => void) {
  const onBackgroundRef = useRef(onBackground);

  useEffect(() => {
    onBackgroundRef.current = onBackground;
  });

  useEffect(() => {
    if (!active) return;
    const sub = AppState.addEventListener('change', (status) => {
      if (status !== 'active') onBackgroundRef.current();
    });
    return () => sub.remove();
  }, [active]);
}
