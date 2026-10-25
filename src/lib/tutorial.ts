import AsyncStorage from '@react-native-async-storage/async-storage';

export const TUTORIAL_KEY = 'banco.tutorialSeen';

/** Le didacticiel du premier lancement a-t-il déjà été vu (ou passé) ? En cas d'erreur de lecture : oui, pour ne pas le répéter. */
export async function loadTutorialSeen(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(TUTORIAL_KEY)) === '1';
  } catch (e) {
    if (__DEV__) console.warn('[tutorial] lecture impossible', e);
    return true;
  }
}

export async function markTutorialSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(TUTORIAL_KEY, '1');
  } catch (e) {
    if (__DEV__) console.warn('[tutorial] sauvegarde impossible', e);
  }
}
