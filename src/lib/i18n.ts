export type Lang = 'fr' | 'en' | 'de' | 'es';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
];

type Translations = {
  auction: {
    instruction: string;
    opens: string;
    raises: string;
    bid: string;
    pass: string;
    max: (n: number) => string;
  };
  ready: {
    round: string;
    target: string;
    play: string;
    holdsPhone: string;
    answers: string;
  };
  play: {
    searchPlaceholder: string;
    notInDatabase: (word: string) => string;
    validateAnyway: string;
    searchOnline: string;
    answerAdded: string;
    pause: string;
    resume: string;
    endTurn: string;
    someAnswers: string;
  };
  home: {
    play: string;
    shop: string;
    rules: string;
    subtitle: string;
  };
  gameMode: {
    modesTitle: string;
    classic: string;
    charades: string;
    packsTitle: string;
    continueBtn: string;
  };
  matchSettings: {
    settingsTitle: string;
    teamCount: string;
    roundCount: string;
    categoriesTitle: string;
    continueBtn: string;
  };
  teams: {
    setupTitle: string;
    chooseColor: string;
    chooseName: string;
    namePlaceholder: (n: number) => string;
    inProgress: string;
    nextBtn: string;
    defaultName: (i: number) => string;
  };
  comingSoon: {
    subtitle: string;
    back: string;
  };
  pages: {
    shop: string;
    rules: string;
    themes: string;
    settings: string;
    info: string;
  };
  result: {
    nextRound: string;
    finalResults: string;
  };
};

const translations: Record<Lang, Translations> = {
  fr: {
    auction: {
      instruction: 'Combien de réponses pouvez-vous citer en 60 secondes ?',
      opens: 'ouvre les enchères',
      raises: 'surenchérit ou passe',
      bid: 'MISER',
      pass: 'PASSER',
      max: (n) => `Maximum : ${n}`,
    },
    ready: {
      round: 'Round',
      target: 'Objectif de réponses :',
      play: 'JOUER',
      holdsPhone: "tient l'appareil",
      answers: 'répond',
    },
    play: {
      searchPlaceholder: 'Vérifier une réponse',
      notInDatabase: (w) => `« ${w} » n'est pas dans la base.`,
      validateAnyway: 'VALIDER QUAND MÊME',
      searchOnline: 'CHERCHER EN LIGNE',
      answerAdded: '✓ Réponse ajoutée',
      pause: 'Pause',
      resume: 'Reprendre',
      endTurn: 'Terminer le tour',
      someAnswers: 'Quelques réponses possible...',
    },
    home: {
      play: 'Jouer',
      shop: 'Boutique',
      rules: 'Règle',
      subtitle: "C'est partie pour Banco !",
    },
    gameMode: {
      modesTitle: 'Modes de jeux',
      classic: 'Classique',
      charades: 'Mimes',
      packsTitle: 'Pack de questions',
      continueBtn: 'Continuer',
    },
    matchSettings: {
      settingsTitle: 'Paramètre de jeux',
      teamCount: "Nombre d'équipes",
      roundCount: 'Nombre de rounds',
      categoriesTitle: 'Catégories de questions',
      continueBtn: 'Continuer',
    },
    teams: {
      setupTitle: 'Création des squads',
      chooseColor: "Choisissez la couleur de l'équipe",
      chooseName: "Choisissez le nom de l'équipe",
      namePlaceholder: (n) => `Nom de l'équipe ${n}`,
      inProgress: 'En cours...',
      nextBtn: 'Suivant',
      defaultName: (i) => `Équipe ${i + 1}`,
    },
    comingSoon: {
      subtitle: 'Bientôt disponible',
      back: 'Retour',
    },
    pages: {
      shop: 'Boutique',
      rules: 'Règles',
      themes: 'Thèmes de questions',
      settings: 'Réglages',
      info: 'Infos',
    },
    result: {
      nextRound: 'MANCHE SUIVANTE',
      finalResults: 'RÉSULTATS',
    },
  },
  en: {
    auction: {
      instruction: 'How many answers can you name in 60 seconds?',
      opens: 'opens the bidding',
      raises: 'raises or passes',
      bid: 'BID',
      pass: 'PASS',
      max: (n) => `Maximum: ${n}`,
    },
    ready: {
      round: 'Round',
      target: 'Target:',
      play: 'PLAY',
      holdsPhone: 'holds the phone',
      answers: 'answers',
    },
    play: {
      searchPlaceholder: 'Check an answer',
      notInDatabase: (w) => `"${w}" is not in the database.`,
      validateAnyway: 'VALIDATE ANYWAY',
      searchOnline: 'SEARCH ONLINE',
      answerAdded: '✓ Answer added',
      pause: 'Pause',
      resume: 'Resume',
      endTurn: 'End turn',
      someAnswers: 'A few possible answers...',
    },
    home: {
      play: 'Play',
      shop: 'Shop',
      rules: 'Rules',
      subtitle: 'Ready to play Banco!',
    },
    gameMode: {
      modesTitle: 'Game modes',
      classic: 'Classic',
      charades: 'Charades',
      packsTitle: 'Question packs',
      continueBtn: 'Continue',
    },
    matchSettings: {
      settingsTitle: 'Game settings',
      teamCount: 'Number of teams',
      roundCount: 'Number of rounds',
      categoriesTitle: 'Question categories',
      continueBtn: 'Continue',
    },
    teams: {
      setupTitle: 'Team setup',
      chooseColor: 'Choose your team colour',
      chooseName: 'Choose your team name',
      namePlaceholder: (n) => `Team ${n} name`,
      inProgress: 'In progress...',
      nextBtn: 'Next',
      defaultName: (i) => `Team ${i + 1}`,
    },
    comingSoon: {
      subtitle: 'Coming soon',
      back: 'Back',
    },
    pages: {
      shop: 'Shop',
      rules: 'Rules',
      themes: 'Question themes',
      settings: 'Settings',
      info: 'Info',
    },
    result: {
      nextRound: 'NEXT ROUND',
      finalResults: 'RESULTS',
    },
  },
  de: {
    auction: {
      instruction: 'Wie viele Antworten können Sie in 60 Sekunden nennen?',
      opens: 'eröffnet das Gebot',
      raises: 'erhöht oder passt',
      bid: 'BIETEN',
      pass: 'PASSEN',
      max: (n) => `Maximum: ${n}`,
    },
    ready: {
      round: 'Runde',
      target: 'Ziel:',
      play: 'SPIELEN',
      holdsPhone: 'hält das Gerät',
      answers: 'antwortet',
    },
    play: {
      searchPlaceholder: 'Antwort prüfen',
      notInDatabase: (w) => `„${w}" ist nicht in der Datenbank.`,
      validateAnyway: 'TROTZDEM BESTÄTIGEN',
      searchOnline: 'ONLINE SUCHEN',
      answerAdded: '✓ Antwort hinzugefügt',
      pause: 'Pause',
      resume: 'Weiter',
      endTurn: 'Runde beenden',
      someAnswers: 'Einige mögliche Antworten...',
    },
    home: {
      play: 'Spielen',
      shop: 'Shop',
      rules: 'Regeln',
      subtitle: 'Bereit für Banco!',
    },
    gameMode: {
      modesTitle: 'Spielmodi',
      classic: 'Klassisch',
      charades: 'Pantomime',
      packsTitle: 'Fragenpakete',
      continueBtn: 'Weiter',
    },
    matchSettings: {
      settingsTitle: 'Spieleinstellungen',
      teamCount: 'Anzahl Teams',
      roundCount: 'Anzahl Runden',
      categoriesTitle: 'Fragenkategorien',
      continueBtn: 'Weiter',
    },
    teams: {
      setupTitle: 'Teams erstellen',
      chooseColor: 'Teamfarbe wählen',
      chooseName: 'Teamname wählen',
      namePlaceholder: (n) => `Team ${n} Name`,
      inProgress: 'Läuft...',
      nextBtn: 'Weiter',
      defaultName: (i) => `Team ${i + 1}`,
    },
    comingSoon: {
      subtitle: 'Demnächst verfügbar',
      back: 'Zurück',
    },
    pages: {
      shop: 'Shop',
      rules: 'Regeln',
      themes: 'Fragenkategorien',
      settings: 'Einstellungen',
      info: 'Info',
    },
    result: {
      nextRound: 'NÄCHSTE RUNDE',
      finalResults: 'ERGEBNISSE',
    },
  },
  es: {
    auction: {
      instruction: '¿Cuántas respuestas puedes decir en 60 segundos?',
      opens: 'abre la puja',
      raises: 'sube o pasa',
      bid: 'PUJAR',
      pass: 'PASAR',
      max: (n) => `Máximo: ${n}`,
    },
    ready: {
      round: 'Ronda',
      target: 'Objetivo:',
      play: 'JUGAR',
      holdsPhone: 'tiene el dispositivo',
      answers: 'responde',
    },
    play: {
      searchPlaceholder: 'Verificar respuesta',
      notInDatabase: (w) => `"${w}" no está en la base.`,
      validateAnyway: 'VALIDAR DE TODOS MODOS',
      searchOnline: 'BUSCAR EN LÍNEA',
      answerAdded: '✓ Respuesta añadida',
      pause: 'Pausa',
      resume: 'Reanudar',
      endTurn: 'Terminar turno',
      someAnswers: 'Algunas respuestas posibles...',
    },
    home: {
      play: 'Jugar',
      shop: 'Tienda',
      rules: 'Reglas',
      subtitle: '¡A jugar al Banco!',
    },
    gameMode: {
      modesTitle: 'Modos de juego',
      classic: 'Clásico',
      charades: 'Mímica',
      packsTitle: 'Packs de preguntas',
      continueBtn: 'Continuar',
    },
    matchSettings: {
      settingsTitle: 'Ajustes de juego',
      teamCount: 'Número de equipos',
      roundCount: 'Número de rondas',
      categoriesTitle: 'Categorías de preguntas',
      continueBtn: 'Continuar',
    },
    teams: {
      setupTitle: 'Crear equipos',
      chooseColor: 'Elige el color del equipo',
      chooseName: 'Elige el nombre del equipo',
      namePlaceholder: (n) => `Nombre equipo ${n}`,
      inProgress: 'En curso...',
      nextBtn: 'Siguiente',
      defaultName: (i) => `Equipo ${i + 1}`,
    },
    comingSoon: {
      subtitle: 'Próximamente',
      back: 'Volver',
    },
    pages: {
      shop: 'Tienda',
      rules: 'Reglas',
      themes: 'Temas de preguntas',
      settings: 'Ajustes',
      info: 'Info',
    },
    result: {
      nextRound: 'RONDA SIGUIENTE',
      finalResults: 'RESULTADOS',
    },
  },
};

export function getT(lang: Lang): Translations {
  return translations[lang];
}
