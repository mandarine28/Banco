import { useEffect, useRef, useState } from 'react';

/**
 * Compte à rebours qui décompte le temps réellement écoulé, avec pause possible.
 * Repart de `seconds` à chaque activation et appelle `onEnd` à zéro.
 */
export function useCountdown(active: boolean, paused: boolean, seconds: number, onEnd: () => void) {
  const [remaining, setRemaining] = useState(seconds * 1000);
  const [wasActive, setWasActive] = useState(active);
  const onEndRef = useRef(onEnd);

  // Réinitialisation pendant le rendu quand le chrono démarre ou s'arrête.
  if (active !== wasActive) {
    setWasActive(active);
    setRemaining(seconds * 1000);
  }

  useEffect(() => {
    onEndRef.current = onEnd;
  });

  const running = active && !paused;
  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = now - last;
      last = now;
      setRemaining((r) => Math.max(0, r - elapsed));
    }, 100);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (active && remaining === 0) onEndRef.current();
  }, [active, remaining]);

  return remaining;
}
