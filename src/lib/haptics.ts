import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'hapticsEnabled';

function warn(message: string, error?: unknown) {
  if (__DEV__) console.warn(`[haptics] ${message}`, error ?? '');
}

// --- Préférence « Retour haptique » (persistée, activée par défaut) ---
let enabled = true;
const listeners = new Set<() => void>();

AsyncStorage.getItem(STORAGE_KEY)
  .then((value) => {
    if (value === '0') setHapticsEnabled(false, false);
  })
  .catch((e) => warn('lecture de la préférence impossible', e));

export function setHapticsEnabled(value: boolean, persist = true): void {
  enabled = value;
  listeners.forEach((listener) => listener());
  if (persist) AsyncStorage.setItem(STORAGE_KEY, value ? '1' : '0').catch((e) => warn('sauvegarde impossible', e));
}

export function useHapticsEnabled(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => enabled,
  );
}

export type HapticKind = 'selection' | 'light' | 'heavy' | 'success' | 'error';

const PLAYERS: Record<HapticKind, () => Promise<void>> = {
  selection: () => Haptics.selectionAsync(),
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

/** Vibration ignorée si le joueur a coupé le retour haptique. Ne lève jamais d'erreur. */
export function playHaptic(kind: HapticKind): void {
  if (!enabled) return;
  PLAYERS[kind]().catch((e) => warn(`vibration « ${kind} » impossible`, e));
}
