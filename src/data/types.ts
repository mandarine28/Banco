export type Question = {
  id: string;
  theme: string;
  /** Objet de la question, affiché après « CITEZ <mise> » (ex. « SUPER-HÉROS »). */
  subject: string;
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
