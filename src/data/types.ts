export type Question = {
  id: string;
  theme: string;
  /** Objet de la question en FR (affiché après « CITEZ <mise> »). */
  subject: string;
  /** Traductions du sujet par langue. Fallback sur `subject` (FR) si absent. */
  subjectByLang?: Partial<Record<import('../lib/i18n').Lang, string>>;
  /**
   * Réponses FR (défaut), de la plus citée à la moins citée.
   * Les 27 premières s'affichent en boutons ; la recherche parcourt toute la liste.
   */
  answers: string[];
  /**
   * Surcharges par langue : ordre différent (questions internationales) ou
   * contenu différent (questions culturellement variables).
   * Fallback sur `answers` si la langue n'est pas définie.
   */
  answersByLang?: Partial<Record<import('../lib/i18n').Lang, string[]>>;
};

export type Theme = {
  id: string;
  label: string;
  /** Traductions du label par langue. Fallback sur `label` (FR) si absent. */
  labelByLang?: Partial<Record<import('../lib/i18n').Lang, string>>;
  /** Nom d'icône MaterialCommunityIcons. */
  icon: string;
};
