/** Jour au format AAAA-MM-JJ (mois de 0 à 11, comme Date). */
export const dayString = (year: number, month: number, day: number): string =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

/**
 * Grille d'un mois, semaines du lundi au dimanche : chaque case est un jour AAAA-MM-JJ, ou null hors du mois.
 * Toujours des semaines complètes de 7 cases.
 */
export function monthGrid(year: number, month: number): (string | null)[][] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay : 0 = dimanche ; on veut 0 = lundi
  const offset = (first.getDay() + 6) % 7;
  const cells: (string | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => dayString(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

/** Mois voisin, en passant d'une année à l'autre. */
export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const date = new Date(year, month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

/** Dernières semaines (lundi → dimanche) jusqu'à celle de `today` incluse, une ligne de 7 jours AAAA-MM-JJ par semaine. */
export function recentWeeks(today: string, count: number): string[][] {
  const [y, m, d] = today.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  // Lundi de la première semaine montrée
  const start = new Date(y, m - 1, d - ((date.getDay() + 6) % 7) - 7 * (count - 1));
  return Array.from({ length: count }, (_, w) =>
    Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + i);
      return dayString(day.getFullYear(), day.getMonth(), day.getDate());
    }),
  );
}

/** Jour décalé de `delta` jours (AAAA-MM-JJ), en passant les mois et les années. */
export function shiftDay(day: string, delta: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(y, m - 1, d + delta);
  return dayString(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Nombre de jours de `from` à `to` inclus (0 si `to` précède `from`). */
export function daysInclusive(from: string, to: string): number {
  const [fy, fm, fd] = from.split('-').map(Number);
  const [ty, tm, td] = to.split('-').map(Number);
  // UTC : pas de jour de 23 h ou 25 h aux changements d'heure
  const days = Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000) + 1;
  return Math.max(0, days);
}
