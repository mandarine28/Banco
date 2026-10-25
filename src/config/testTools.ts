/** Build de test (profil EAS « test ») : outils de déblocage dans les Réglages. Jamais en production. */
export const TEST_TOOLS = process.env.EXPO_PUBLIC_TEST_TOOLS === '1';
