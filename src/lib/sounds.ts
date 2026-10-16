import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { useSyncExternalStore } from 'react';

const SOURCES = {
  tap: require('../../assets/sound/tap.mp3'),
  upDown: require('../../assets/sound/up-down.mp3'),
  bid: require('../../assets/sound/bid.mp3'),
  correct: require('../../assets/sound/correct.mp3'),
  roundWon: require('../../assets/sound/round-won.mp3'),
  gameWon: require('../../assets/sound/game-won.mp3'),
} as const;

export type SoundName = keyof typeof SOURCES;

const STORAGE_KEY = 'soundEnabled';

// Sons déclenchés en rafale (+ / − maintenus, taps rapides) : plusieurs joueurs par son
// pour qu'un nouveau déclenchement n'attende pas le rembobinage du précédent et puisse se superposer.
const POOL_SIZE: Partial<Record<SoundName, number>> = { tap: 4, upDown: 6, correct: 4, bid: 2 };

type Pool = { players: AudioPlayer[]; next: number };
const pools: Partial<Record<SoundName, Pool>> = {};

function warn(message: string, error?: unknown) {
  if (__DEV__) console.warn(`[sounds] ${message}`, error ?? '');
}

// Jeu de soirée : les sons restent audibles en mode silencieux, sans couper la musique en cours
setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch((e) =>
  warn('setAudioModeAsync a échoué', e),
);

// --- Préférence « Effets sonores » (persistée, activée par défaut) ---
let enabled = true;
const listeners = new Set<() => void>();

AsyncStorage.getItem(STORAGE_KEY)
  .then((value) => {
    if (value === '0') setSoundEnabled(false, false);
  })
  .catch((e) => warn('lecture de la préférence impossible', e));

export function setSoundEnabled(value: boolean, persist = true): void {
  enabled = value;
  listeners.forEach((listener) => listener());
  if (!value) (Object.keys(pools) as SoundName[]).forEach(stopSound);
  if (persist) AsyncStorage.setItem(STORAGE_KEY, value ? '1' : '0').catch((e) => warn('sauvegarde impossible', e));
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => enabled,
  );
}

function createPlayer(name: SoundName): AudioPlayer {
  // downloadFirst : en dev (Expo Go), le son est servi par Metro en HTTP, que le lecteur iOS
  // lit mal en streaming ; on le copie d'abord en local. En production le fichier est déjà local.
  const player = createAudioPlayer(SOURCES[name], { downloadFirst: true });
  // Rembobine dès la fin : le prochain déclenchement part sans attendre de seek
  player.addListener('playbackStatusUpdate', (status) => {
    if (status.didJustFinish) player.seekTo(0).catch(() => {});
  });
  return player;
}

function getPool(name: SoundName): Pool | null {
  try {
    pools[name] ??= {
      players: Array.from({ length: POOL_SIZE[name] ?? 1 }, () => createPlayer(name)),
      next: 0,
    };
    return pools[name];
  } catch (e) {
    warn(`impossible de créer le joueur « ${name} »`, e);
    return null;
  }
}

/** Charge tous les sons à l'avance pour éviter la latence du premier déclenchement. */
export function preloadSounds(): void {
  for (const name of Object.keys(SOURCES) as SoundName[]) getPool(name);
}

/** Joue un son depuis `fromSeconds` (début par défaut). Ne lève jamais d'erreur. */
export function playSound(name: SoundName, fromSeconds = 0): void {
  if (!enabled) return;
  const pool = getPool(name);
  if (!pool) return;
  // Joueur libre et rembobiné en priorité, sinon le suivant dans la rotation
  const ready = pool.players.find((p) => !p.playing && p.currentTime === fromSeconds);
  const player = ready ?? pool.players[pool.next];
  pool.next = (pool.next + 1) % pool.players.length;
  try {
    if (ready || (fromSeconds === 0 && !player.isLoaded)) {
      player.play();
      return;
    }
    player
      .seekTo(fromSeconds)
      .then(() => player.play())
      .catch((e) => warn(`lecture de « ${name} » impossible`, e));
  } catch (e) {
    warn(`lecture de « ${name} » impossible`, e);
  }
}

export function stopSound(name: SoundName): void {
  try {
    pools[name]?.players.forEach((p) => p.pause());
  } catch (e) {
    warn(`arrêt de « ${name} » impossible`, e);
  }
}
