/** Date (ms) de la dernière partie jouée avec chaque pack, par thème. */
export type PackLastPlayed = Record<string, number>;

/** Lit la valeur enregistrée ; toute entrée invalide est ignorée (stockage corrompu = aucun historique). */
export function parsePackLastPlayed(raw: string | null): PackLastPlayed {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1])),
    );
  } catch {
    return {};
  }
}

/** Ajoute la partie qui commence : ces thèmes deviennent les plus récents. */
export function withPlayed(history: PackLastPlayed, themeIds: readonly string[], now: number): PackLastPlayed {
  return { ...history, ...Object.fromEntries(themeIds.map((id) => [id, now])) };
}

/**
 * Packs débloqués d'abord, du plus récemment joué au plus ancien (jamais joués : ordre de déblocage) ;
 * packs encore bloqués ensuite, dans l'ordre de déblocage, même si une partie d'essai y a été jouée.
 */
export function sortByLastPlayed<T extends { id: string; playable: boolean }>(items: readonly T[], history: PackLastPlayed): T[] {
  return items
    .map((item, index) => ({ item, index, at: item.playable ? (history[item.id] ?? -1) : -2 }))
    .sort((a, b) => b.at - a.at || a.index - b.index)
    .map(({ item }) => item);
}
