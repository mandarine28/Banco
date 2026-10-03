export type Question = {
  id: string;
  theme: string;
  prompt: string;
  /**
   * Réponses acceptées, de la plus citée à la moins citée.
   * Les premières s'affichent en boutons ; la recherche parcourt toute la liste.
   */
  answers: string[];
};

export type Theme = {
  id: string;
  label: string;
  /** Nom d'icône MaterialCommunityIcons. */
  icon: string;
};
