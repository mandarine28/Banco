import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

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
};

type GameSettingsContextValue = GameSettings & {
  setMode: (mode: GameMode) => void;
  setTeamCount: (count: number) => void;
  setRoundCount: (count: number) => void;
  setTeams: (teams: Team[]) => void;
  setSelectedThemes: (themes: string[]) => void;
  setSurvieTimer: (seconds: SurvieTimer | null) => void;
};

const defaults: GameSettings = {
  mode: 'classique',
  teamCount: 2,
  roundCount: 5,
  teams: [],
  selectedThemes: [],
  survieTimer: SURVIE_TIMER_OPTIONS[0],
};

const clamp = (value: number, { min, max }: { min: number; max: number }) => Math.min(max, Math.max(min, value));

const GameSettingsContext = createContext<GameSettingsContextValue | null>(null);

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaults);

  const value = useMemo<GameSettingsContextValue>(
    () => ({
      ...settings,
      setMode: (mode) => setSettings((s) => ({ ...s, mode })),
      setTeamCount: (count) => setSettings((s) => ({ ...s, teamCount: clamp(count, TEAM_LIMITS) })),
      setRoundCount: (count) => setSettings((s) => ({ ...s, roundCount: clamp(count, ROUND_LIMITS) })),
      setTeams: (teams) => setSettings((s) => ({ ...s, teams })),
      setSelectedThemes: (selectedThemes) => setSettings((s) => ({ ...s, selectedThemes })),
      setSurvieTimer: (survieTimer) => setSettings((s) => ({ ...s, survieTimer })),
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
