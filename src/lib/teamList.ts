import { isDefaultTeamName } from './i18n.ts';

export type SavedTeam = { name: string; color: string };
/** Liste « Équipes » ou « Chacun pour soi » de l'écran « Qui joue ? ». */
export type RosterKind = 'teams' | 'players';

/**
 * Équipes relues sur l'appareil : couleurs connues et distinctes, au plus `max` ; liste vide si illisible.
 * Un nom par défaut (« Équipe 2 », « Player 1 »…) redevient vide pour suivre la langue en cours.
 */
export function parseSavedTeams(raw: unknown, colors: readonly string[], max: number): SavedTeam[] {
  if (!Array.isArray(raw)) return [];
  const teams: SavedTeam[] = [];
  for (const item of raw) {
    if (typeof item !== 'object' || item === null) continue;
    const { name, color } = item as Record<string, unknown>;
    if (typeof name !== 'string' || typeof color !== 'string' || !colors.includes(color)) continue;
    if (teams.some((team) => team.color === color)) continue;
    const trimmed = name.trim();
    teams.push({ name: isDefaultTeamName(trimmed) ? '' : trimmed, color });
  }
  return teams.slice(0, max);
}
