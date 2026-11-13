/** Heure du rappel : fin de journée, quand on a le temps de jouer une minute. */
export const REMINDER_HOUR = 18;
/** Rappels programmés d'avance : au-delà, un joueur qui a décroché n'est plus relancé. */
export const REMINDER_DAYS = 3;

/** Dates des prochains rappels : les jours suivants à REMINDER_HOUR, heure locale. */
export function reminderDates(now: Date, days = REMINDER_DAYS, hour = REMINDER_HOUR): Date[] {
  return Array.from({ length: days }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i + 1, hour));
}
