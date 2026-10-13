import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

type Actions = { showBorder: (color: string) => void; hideBorder: () => void };
type State = { visible: boolean; color: string };

const ActionsCtx = createContext<Actions>({ showBorder: () => {}, hideBorder: () => {} });
const StateCtx = createContext<State>({ visible: false, color: '' });

export function SurvieOverlayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ visible: false, color: '' });
  const showBorder = useCallback((color: string) => setState({ visible: true, color }), []);
  const hideBorder = useCallback(() => setState(s => ({ ...s, visible: false })), []);

  return (
    <ActionsCtx.Provider value={{ showBorder, hideBorder }}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </ActionsCtx.Provider>
  );
}

export function useSurvieOverlay(): Actions {
  return useContext(ActionsCtx);
}

export function SurviePulseBorderRoot() {
  const { visible, color } = useContext(StateCtx);
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (!visible) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [visible, opacity]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.border, { borderColor: color, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 7,
    borderRadius: 44,
  },
});
