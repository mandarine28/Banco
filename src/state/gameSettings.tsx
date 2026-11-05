import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { withoutTrialPack, withTrialPack } from '@/lib/trialPacks';
import { loadPendingTrials, savePendingTrials } from '@/lib/trials';

export type GameMode = 'classique' | 'streak' | 'survie';

export type Team = {
  name: string;
  color: string;
};

export const TEAM_LIMITS = { min: 2, max: 4 } as const;
export const ROUND_LIMITS = { min: 3, max: 10 } as const;
/** Chrono de survie : 'turbo' (temps qui baisse à chaque tour de table) ou durée fixe en secondes. */
export const SURVIE_TIMER_OPTIONS = ['turbo', 10, 20, 30] as const;
export type SurvieTimer = (typeof SURVIE_TIMER_OPTIONS)[number];

export type GameSettings = {
  mode: GameMode;
  teamCount: number;
  roundCount: number;
  teams: Team[];
  selectedThemes: string[];
  /** Chrono de survie : 'turbo', secondes par tour, ou null = sans chrono. */
  survieTimer: SurvieTimer | null;
  /** Packs débloqués pour une partie par une vidéo, tant que cette partie n'a pas été lancée. */
  trialPacks: string[];
};

type GameSettingsContextValue = GameSettings & {
  setMode: (mode: GameMode) => void;
  setTeamCount: (count: number) => void;
  setRoundCount: (count: number) => void;
  setTeams: (teams: Team[]) => void;
  setSelectedThemes: (themes: string[]) => void;
  setSurvieTimer: (seconds: SurvieTimer | null) => void;
  addTrialPack: (themeId: string) => void;
  /** Partie d'essai lancée : le pack redevient verrouillé pour la suite. */
  removeTrialPack: (themeId: string) => void;
};

const defaults: GameSettings = {
  mode: 'classique',
  teamCount: 2,
  roundCount: 5,
  teams: [],
  selectedThemes: [],
  survieTimer: SURVIE_TIMER_OPTIONS[0],
  trialPacks: [],
};

const clamp = (value: number, { min, max }: { min: number; max: number }) => Math.min(max, Math.max(min, value));

const GameSettingsContext = createContext<GameSettingsContextValue | null>(null);

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaults);

  // Essais en attente relus au lancement : une vidéo regardée n'est pas perdue si l'app est fermée avant de jouer
  const [trialsLoaded, setTrialsLoaded] = useState(false);
  useEffect(() => {
    loadPendingTrials().then((stored) => {
      setSettings((s) => ({ ...s, trialPacks: [...new Set([...stored, ...s.trialPacks])] }));
      setTrialsLoaded(true);
    });
  }, []);
  // Après la lecture seulement : sinon la liste vide du départ écraserait celle enregistrée
  useEffect(() => {
    if (trialsLoaded) savePendingTrials(settings.trialPacks);
  }, [trialsLoaded, settings.trialPacks]);

  const value = useMemo<GameSettingsContextValue>(
    () => ({
      ...settings,
      setMode: (mode) => setSettings((s) => ({ ...s, mode })),
      setTeamCount: (count) => setSettings((s) => ({ ...s, teamCount: clamp(count, TEAM_LIMITS) })),
      setRoundCount: (count) => setSettings((s) => ({ ...s, roundCount: clamp(count, ROUND_LIMITS) })),
      setTeams: (teams) => setSettings((s) => ({ ...s, teams })),
      setSelectedThemes: (selectedThemes) => setSettings((s) => ({ ...s, selectedThemes })),
      setSurvieTimer: (survieTimer) => setSettings((s) => ({ ...s, survieTimer })),
      addTrialPack: (themeId) => setSettings((s) => ({ ...s, trialPacks: withTrialPack(s.trialPacks, themeId) })),
      // Sans changement, on rend le même état : sinon l'écran de partie qui retire l'essai tourne en boucle (écran figé)
      removeTrialPack: (themeId) =>
        setSettings((s) => {
          const trialPacks = withoutTrialPack(s.trialPacks, themeId);
          return trialPacks === s.trialPacks ? s : { ...s, trialPacks };
        }),
    }),
    [settings],
  );

  return <GameSettingsContext.Provider value={value}>{children}</GameSettingsContext.Provider>;
}

export function useGameSettings() {
  const context = useContext(GameSettingsContext);
  if (!context) throw new Error('useGameSettings doit être utilisé dans GameSettingsProvider');
  return context;
}
