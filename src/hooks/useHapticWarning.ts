import { useEffect, useRef } from 'react';

import { playHaptic } from '@/lib/haptics';

/**
 * Vibration unique quand le chrono franchit `thresholdSeconds` en descendant.
 * Un tour qui démarre déjà sous le seuil ne vibre pas (il n'y a pas de franchissement).
 */
export function useHapticWarning(remainingMs: number, thresholdSeconds: number) {
  const previousMs = useRef(remainingMs);

  useEffect(() => {
    const thresholdMs = thresholdSeconds * 1000;
    if (previousMs.current > thresholdMs && remainingMs <= thresholdMs && remainingMs > 0) playHaptic('heavy');
    previousMs.current = remainingMs;
  }, [remainingMs, thresholdSeconds]);
}
