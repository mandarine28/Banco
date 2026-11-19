export type ThemeStat = { theme: string; count: number; average: number };

/** Thèmes des défis joués, du mieux réussi (meilleure moyenne) au moins bien ; à égalité, le plus joué d'abord. */
export function themeRanking<T>(entries: readonly T[], themeOf: (entry: T) => string | undefined, scoreOf: (entry: T) => number): ThemeStat[] {
  const totals = new Map<string, { count: number; sum: number }>();
  for (const entry of entries) {
    const theme = themeOf(entry);
    if (!theme) continue;
    const t = totals.get(theme) ?? { count: 0, sum: 0 };
    totals.set(theme, { count: t.count + 1, sum: t.sum + scoreOf(entry) });
  }
  return [...totals.entries()]
    .map(([theme, { count, sum }]) => ({ theme, count, average: Math.round((sum / count) * 10) / 10 }))
    .sort((a, b) => b.average - a.average || b.count - a.count);
}
