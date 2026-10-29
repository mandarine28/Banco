/** Build de test (profil EAS « test ») ou dev (expo start) : outils de déblocage dans les Réglages. Jamais en production. */
export const TEST_TOOLS = __DEV__ || process.env.EXPO_PUBLIC_TEST_TOOLS === '1';
