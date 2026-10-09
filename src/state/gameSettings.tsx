import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

export type GameMode = 'classique' | 'streak';

export type Team = {
  name: string;
  color: string;
};

export const TEAM_LIMITS = { min: 2, max: 4 } as const;
export const ROUND_LIMITS = { min: 1, max: 10 } as const;

export type GameSettings = {
  mode: GameMode;
  teamCount: number;
  roundCount: number;
  teams: Team[];
  selectedThemes: string[];
};

type GameSettingsContextValue = GameSettings & {
  setMode: (mode: GameMode) => void;
  setTeamCount: (count: number) => void;
  setRoundCount: (count: number) => void;
  setTeams: (teams: Team[]) => void;
  setSelectedThemes: (themes: string[]) => void;
};

const defaults: GameSettings = {
  mode: 'classique',
  teamCount: 2,
  roundCount: 5,
  teams: [],
  selectedThemes: [],
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
