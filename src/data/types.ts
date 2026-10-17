export type Question = {
  id: string;
  theme: string;
  /** Objet de la question en FR (affiché après « CITEZ <mise> »). */
  subject: string;
  /** Traductions du sujet par langue. Fallback sur `subject` (FR) si absent. */
  subjectByLang?: Partial<Record<import('../lib/i18n').Lang, string>>;
  /**
   * Réponses FR, de la plus citée à la moins citée. Liste de référence pour toutes les langues :
   * les autres langues la traduisent via le glossaire du thème (src/data/glossaries).
   */
  answers: string[];
  /**
   * Liste complète propre à une langue, uniquement quand le contenu change vraiment
   * (ex. comédiens français ≠ comédiens espagnols). Prioritaire sur `answers` + glossaire.
   */
  answersByLang?: Partial<Record<import('../lib/i18n').Lang, string[]>>;
};

/**
 * Traductions des réponses d'un thème : réponse FR → libellé dans la langue.
 * Seules les réponses qui changent sont listées (les noms propres identiques n'ont pas d'entrée).
 * Une langue sans entrée retombe sur l'anglais, puis sur le français.
 */
export type Glossary = Partial<Record<Exclude<import('../lib/i18n').Lang, 'fr'>, Record<string, string>>>;

export type Theme = {
  id: string;
  label: string;
  /** Traductions du label par langue. Fallback sur `label` (FR) si absent. */
  labelByLang?: Partial<Record<import('../lib/i18n').Lang, string>>;
  /** Nom d'icône MaterialCommunityIcons. */
  icon: string;
};
