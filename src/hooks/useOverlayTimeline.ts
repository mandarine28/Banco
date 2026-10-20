import { useEffect, useEffectEvent, useRef } from 'react';
import { AccessibilityInfo, Animated, type EasingFunction } from 'react-native';

type Options = {
  /** Opacité de l'overlay entier — animée à 0 pour la sortie. */
  opacity: Animated.Value;
  /** Animation d'entrée + maintien. reduceMotion=true → poser les valeurs finales et renvoyer un simple délai. */
  intro: (reduceMotion: boolean) => Animated.CompositeAnimation;
  /** Séquence jouée après l'intro (ou après un tap), impossible à passer — ex. compte à rebours. */
  outro?: () => Animated.CompositeAnimation;
  exitMs: number;
  exitEasing: EasingFunction;
  /** Le fondu de sortie commence : l'écran suivant peut se monter dessous. */
  onReveal: () => void;
  /** Fondu terminé : l'overlay peut être retiré. */
  onDone: () => void;
};

/** Joue une transition plein écran puis son fondu de sortie. Renvoie `skip` (tap pour passer). */
export function useOverlayTimeline({ opacity, intro, outro, exitMs, exitEasing, onReveal, onDone }: Options) {
  // Props recréées à chaque render — effect events pour ne pas relancer l'animation.
  const buildIntro = useEffectEvent(intro);
  const buildOutro = useEffectEvent(() => outro?.() ?? null);
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
      running = Animated.timing(opacity, { toValue: 0, ...exitConfig(), useNativeDriver: true });
      // finished=false → démonté en plein fondu (ex. remplacé par une nouvelle transition) : ne pas notifier
      running.start(({ finished }) => {
        if (finished) done();
      });
    };
    let inOutro = false;
    const finishIntro = () => {
      if (exited || inOutro) return;
      const sequel = buildOutro();
      if (!sequel) return exit();
      inOutro = true;
      running?.stop();
      opacity.setValue(1);
      running = sequel;
      running.start(({ finished }) => {
        if (finished) exit();
      });
    };
    skipRef.current = finishIntro;

    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduceMotion) => {
        if (exited || inOutro) return;
        running = buildIntro(reduceMotion);
        running.start(({ finished }) => {
          if (finished) finishIntro();
        });
      });

    return () => {
      exited = true;
      running?.stop();
    };
  }, [opacity]);

  return () => skipRef.current();
}
