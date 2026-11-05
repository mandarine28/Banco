import AsyncStorage from '@react-native-async-storage/async-storage';

const WHATS_NEW_KEY = 'banco.whatsNewSeen';
/** Annonce en cours : à changer (avec les textes et NEW_PACKS de WhatsNewModal) pour en afficher une nouvelle. */
export const WHATS_NEW_ID = '1.5.0';

/** L'annonce en cours a-t-elle déjà été vue ? En cas d'erreur de lecture : oui, pour ne pas déranger. */
export async function loadWhatsNewSeen(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(WHATS_NEW_KEY)) === WHATS_NEW_ID;
  } catch (e) {
    if (__DEV__) console.warn('[whatsNew] lecture impossible', e);
    return true;
  }
}

export async function markWhatsNewSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(WHATS_NEW_KEY, WHATS_NEW_ID);
  } catch (e) {
    if (__DEV__) console.warn('[whatsNew] sauvegarde impossible', e);
  }
}
