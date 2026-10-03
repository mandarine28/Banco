import { useEffect, useRef, useState } from 'react';

/**
 * Compte à rebours basé sur l'horloge (reste juste même si l'app ralentit).
 * Appelle `onEnd` une seule fois à zéro. Repart de `seconds` à chaque activation.
 */
export function useCountdown(active: boolean, seconds: number, onEnd: () => void) {
  const [remaining, setRemaining] = useState(seconds * 1000);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!active) {
      setRemaining(seconds * 1000);
      return;
    }
    const deadline = Date.now() + seconds * 1000;
    let ended = false;
    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      setRemaining(left);
      if (left === 0 && !ended) {
        ended = true;
        clearInterval(id);
        onEndRef.current();
      }
    };
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [active, seconds]);

  return remaining;
}
