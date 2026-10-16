import { useEffect, useEffectEvent, useRef } from 'react';
import { AccessibilityInfo, Animated, type EasingFunction } from 'react-native';

type Options = {
  /** Opacité de l'overlay entier — animée à 0 pour la sortie. */
  opacity: Animated.Value;
  /** Animation d'entrée + maintien. reduceMotion=true → poser les valeurs finales et renvoyer un simple délai. */
  intro: (reduceMotion: boolean) => Animated.CompositeAnimation;
  exitMs: number;
  exitEasing: EasingFunction;
  /** Le fondu de sortie commence : l'écran suivant peut se monter dessous. */
  onReveal: () => void;
  /** Fondu terminé : l'overlay peut être retiré. */
  onDone: () => void;
};

/** Joue une transition plein écran puis son fondu de sortie. Renvoie `skip` (tap pour passer). */
export function useOverlayTimeline({ opacity, intro, exitMs, exitEasing, onReveal, onDone }: Options) {
  // Props recréées à chaque render — effect events pour ne pas relancer l'animation.
  const buildIntro = useEffectEvent(intro);
  const reveal = useEffectEvent(onReveal);
  const done = useEffectEvent(onDone);
  const exitConfig = useEffectEvent(() => ({ duration: exitMs, easing: exitEasing }));
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    let exited = false;
    let running: Animated.CompositeAnimation | null = null;

    const exit = () => {
      if (exited) return;
      exited = true;
      running?.stop();
      reveal();
      Animated.timing(opacity, { toValue: 0, ...exitConfig(), useNativeDriver: true }).start(() => done());
    };
    skipRef.current = exit;

    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduceMotion) => {
        if (exited) return;
        running = buildIntro(reduceMotion);
        running.start(({ finished }) => {
          if (finished) exit();
        });
      });

    return () => {
      exited = true;
      running?.stop();
    };
  }, [opacity]);

  return () => skipRef.current();
}
