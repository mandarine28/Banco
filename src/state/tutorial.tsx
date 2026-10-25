import { type Href, router } from 'expo-router';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ViewInstance } from 'react-native';

import { markTutorialSeen } from '@/lib/tutorial';

/** Éléments mis en lumière par le didacticiel ; chaque écran enregistre les siens avec useTutorialTarget. */
export type TutorialTarget = 'home-shop' | 'home-play' | 'shop-gift-0' | 'shop-gift-1' | 'mode-auction' | 'mode-survie' | 'match-teams';

export type TutorialStep = { route: Href; target?: TutorialTarget };

/** Parcours du premier lancement : accueil → boutique (packs offerts) → accueil → modes de jeu → réglages de partie. */
export const TUTORIAL_STEPS: TutorialStep[] = [
  { route: '/' },
  { route: '/', target: 'home-shop' },
  { route: '/boutique', target: 'shop-gift-0' },
  { route: '/boutique', target: 'shop-gift-1' },
  { route: '/', target: 'home-play' },
  { route: '/parametres', target: 'mode-auction' },
  { route: '/parametres', target: 'mode-survie' },
  { route: '/parametres-partie', target: 'match-teams' },
];

type TutorialContextValue = {
  /** Étape affichée, null hors didacticiel. */
  step: number | null;
  /** onEnd(true) s'il a été suivi jusqu'au bout, onEnd(false) s'il a été passé. */
  start: (onEnd: (completed: boolean) => void) => void;
  next: () => void;
  skip: () => void;
  registerTarget: (id: TutorialTarget, node: ViewInstance | null) => void;
  getTarget: (id: TutorialTarget) => ViewInstance | null;
};

const TutorialContext = createContext<TutorialContextValue | null>(null);

// L'accueil est la racine de la pile : on y revient en refermant les écrans ouverts
function goTo(route: Href) {
  if (route === '/') {
    if (router.canDismiss()) router.dismissAll();
  } else {
    router.push(route);
  }
}

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<number | null>(null);
  // Copie synchrone de l'étape : la navigation se fait hors de la mise à jour d'état
  const stepRef = useRef<number | null>(null);
  const show = useCallback((next: number | null) => {
    stepRef.current = next;
    setStep(next);
  }, []);
  const targets = useRef<Partial<Record<TutorialTarget, ViewInstance | null>>>({});
  const onEndRef = useRef<((completed: boolean) => void) | null>(null);

  const end = useCallback((completed: boolean) => {
    show(null);
    markTutorialSeen();
    onEndRef.current?.(completed);
    onEndRef.current = null;
  }, [show]);

  const start = useCallback((onEnd: (completed: boolean) => void) => {
    onEndRef.current = onEnd;
    show(0);
  }, [show]);

  const next = useCallback(() => {
    const current = stepRef.current;
    if (current === null) return;
    const following = current + 1;
    // Fin : retour à l'écran des modes, le joueur n'en a pas encore choisi
    if (following >= TUTORIAL_STEPS.length) {
      if (router.canGoBack()) router.back();
      end(true);
      return;
    }
    if (TUTORIAL_STEPS[following].route !== TUTORIAL_STEPS[current].route) goTo(TUTORIAL_STEPS[following].route);
    show(following);
  }, [end, show]);

  const registerTarget = useCallback((id: TutorialTarget, node: ViewInstance | null) => {
    targets.current[id] = node;
  }, []);
  const getTarget = useCallback((id: TutorialTarget) => targets.current[id] ?? null, []);

  const skip = useCallback(() => {
    goTo('/');
    end(false);
  }, [end]);

  const value = useMemo(
    () => ({ step, start, next, skip, registerTarget, getTarget }),
    [step, start, next, skip, registerTarget, getTarget],
  );
  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>;
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) throw new Error('useTutorial doit être utilisé dans TutorialProvider');
  return context;
}

/** Ref à poser sur la View de l'élément à mettre en lumière (avec collapsable={false}). */
export function useTutorialTarget(id: TutorialTarget) {
  const { registerTarget } = useTutorial();
  return useCallback((node: ViewInstance | null) => registerTarget(id, node), [registerTarget, id]);
}
