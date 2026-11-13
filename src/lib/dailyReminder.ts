import { Platform } from 'react-native';

import { reminderDates } from './reminderDates';

const ID_PREFIX = 'daily-challenge-';
const CHANNEL_ID = 'daily-challenge';

type NotificationsModule = typeof import('expo-notifications');

function warn(message: string, error: unknown) {
  if (__DEV__) console.warn(`[rappel] ${message}`, error);
}

/** Autorisation déjà donnée, ou demandée maintenant si l'OS le permet encore. */
async function ensurePermission(Notifications: NotificationsModule): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
  return asked.granted;
}

/**
 * Après un défi joué : rappels les jours suivants, ceux d'avant annulés.
 * Jouer chaque jour repousse donc les rappels ; un joueur qui décroche en reçoit encore quelques-uns, puis plus rien.
 */
export async function scheduleDailyReminders(streak: number): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    // Chargé à la demande : un build sans le module natif ne plante pas, il n'a simplement pas de rappel
    const Notifications = await import('expo-notifications');
    if (!(await ensurePermission(Notifications))) return;
    // Android 8+ : une notification sans canal tombe dans « Divers », que l'utilisateur ne sait pas régler
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, { name: 'Défi du jour', importance: Notifications.AndroidImportance.DEFAULT });
    }
    const dates = reminderDates(new Date());
    await Promise.all(dates.map((_, i) => Notifications.cancelScheduledNotificationAsync(`${ID_PREFIX}${i}`).catch(() => {})));
    const body = streak > 1 ? `Ta série de ${streak} jours t’attend, ne la laisse pas filer !` : 'Un nouveau défi t’attend : combien de réponses en 60 secondes ?';
    for (const [i, date] of dates.entries()) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${ID_PREFIX}${i}`,
        content: { title: 'Défi du jour 🔥', body },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID },
      });
    }
  } catch (e) {
    warn('programmation impossible', e);
  }
}
