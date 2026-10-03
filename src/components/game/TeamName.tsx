import { Text } from 'react-native';

import type { GameTeam } from '@/game/engine';

/** Nom d'équipe écrit dans sa couleur, à insérer dans un <Text>. */
export function TeamName({ team }: { team: GameTeam }) {
  return <Text style={{ color: team.color }}>{team.name}</Text>;
}
