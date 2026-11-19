import AsyncStorage from '@react-native-async-storage/async-storage';

import { dayKey } from '@/lib/solo';

const INSTALL_KEY = 'banco.installDate';

/** Premier jour où l'app a été ouverte (AAAA-MM-JJ) ; enregistré à la première lecture. */
export async function loadInstallDate(): Promise<string> {
  const today = dayKey(new Date());
  try {
    const saved = await AsyncStorage.getItem(INSTALL_KEY);
    if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) return saved;
    await AsyncStorage.setItem(INSTALL_KEY, today);
  } catch (e) {
    // Stockage indisponible : aujourd'hui, au pire les jours passés paraissent tous antérieurs à l'installation
    if (__DEV__) console.warn('[installDate] lecture impossible', e);
  }
  return today;
}
