export type Answer = {
  label: string;
  /** Points rapportés : 1 pour une réponse évidente, jusqu'à 5 pour une réponse rare. */
  points: number;
};

export type Question = {
  id: string;
  theme: string;
  prompt: string;
  /** Exactement 9 réponses. */
  answers: Answer[];
};

export type Theme = {
  id: string;
  label: string;
  /** Nom d'icône MaterialCommunityIcons. */
  icon: string;
};
