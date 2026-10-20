export type Lang = 'fr' | 'en' | 'de' | 'es';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
];

export const FALLBACK_LANG: Lang = 'en';

export function isLang(code: string | null | undefined): code is Lang {
  return LANGUAGES.some((l) => l.code === code);
}

/** Première langue supportée parmi les langues préférées de l'appareil (ordre de préférence), sinon l'anglais. */
export function pickLang(preferred: readonly (string | null | undefined)[]): Lang {
  return preferred.map((code) => code?.toLowerCase()).find(isLang) ?? FALLBACK_LANG;
}

type Translations = {
  auction: {
    instruction: string;
    opens: string;
    raises: string;
    bid: (n: number) => string;
    pass: string;
    passTurn: string;
    concludeAuction: string;
    max: (n: number) => string;
  };
  ready: {
    round: string;
    target: string;
    play: string;
    start: string;
    holdsPhone: string;
    answers: string;
    wonAuction: string;
    yourTurn: string;
    yourStart: string;
    yourGo: string;
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
    sortPopular: string;
    sortAlpha: string;
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
    classicDesc: string;
    survieDesc: string;
    continueBtn: string;
    pickModeFirst: string;
  };
  matchSettings: {
    settingsTitle: string;
    teamCount: string;
    roundCount: string;
    timer: string;
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
  shop: {
    packsTitle: string;
    unlock: string;
    unlockA11y: (pack: string) => string;
    questionCount: (n: number) => string;
    unlocked: string;
    comingSoon: string;
    packTitles: Record<string, string>;
    restore: string;
    restoredTitle: string;
    restoredMsg: string;
    nothingToRestore: string;
    errors: { load: string; purchase: string; restore: string };
    back: string;
    settings: string;
    lockedAvailable: string;
    goToShop: string;
    trialMsg: string;
    trialUsedMsg: string;
    watchAd: string;
    trialBadge: string;
    close: string;
    upsellMsg: string;
    later: string;
  };
  gift: {
    welcomeTitle: string;
    chooseMsg: string;
    claim: string;
    later: string;
    doneTitle: string;
    doneMsg: string;
    ok: string;
    failedMsg: string;
    welcomeCardTitle: string;
    welcomeCardMsg: (games: number) => string;
    playBtn: string;
  };
  survie: {
    validate: string;
    validateA11y: string;
    noAnswer: string;
    timeoutNo: string;
    timeoutYes: string;
    passA11y: string;
    clear: string;
    someAnswers: string;
    elimPassTitle: string;
    elimPassMsg: string;
    elimTimeoutTitle: string;
    elimTimeoutMsg: string;
    eliminate: string;
    resume: string;
    phoneTitle: string;
    phoneMsg: string;
    phoneGo: string;
  };
  final: {
    tie: string;
    victoryOf: string;
    rematch: string;
    home: string;
  };
  prefs: {
    title: string;
    soundEffects: string;
    haptics: string;
    adChoices: string;
  };
  rules: {
    close: string;
    auctionTitle: string;
    auctionSteps: string[];
    pointsTitle: string;
    auctionPoints: string[];
    survieTitle: string;
    survieSteps: string[];
    surviePoints: string[];
  };
  support: {
    title: string;
    intro: string;
    contactBtn: string;
    mailSubject: string;
    noMailApp: string;
    faqTitle: string;
    faq: { q: string; a: string }[];
    privacy: string;
    version: string;
  };
  result: {
    nextRound: string;
    finalResults: string;
    madeBid: string;
    missedBid: string;
    toFind: string;
    foundCount: string;
    eliminated: string;
    pointsAtStake: string;
  };
};

const translations: Record<Lang, Translations> = {
  fr: {
    auction: {
      instruction: 'Vous aurez 60 secondes. Combien pouvez-vous en citer ?',
      opens: 'ouvre les enchères',
      raises: 'surenchérit ou passe',
      bid: (n) => `J'EN CITE ${n}`,
      pass: 'PASSER',
      passTurn: 'PASSER MON TOUR',
      concludeAuction: 'CONCLURE L’ENCHÈRE',
      max: (n) => `Maximum : ${n}`,
    },
    ready: {
      round: 'Round',
      target: 'Objectif de réponses :',
      play: 'JOUER',
      start: 'COMMENCER',
      holdsPhone: "tient l'appareil",
      answers: 'répond',
      wonAuction: 'remporte les enchères',
      yourTurn: 'à vous de jouer !',
      yourStart: 'à vous de commencer',
      yourGo: 'à vous de répondre !',
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
      sortPopular: 'Tri par popularité',
      sortAlpha: 'Tri alphabétique',
    },
    home: {
      play: 'Jouer',
      shop: 'Boutique',
      rules: 'Règles',
      subtitle: 'Mise sur tes connaissances !',
    },
    gameMode: {
      modesTitle: 'Modes de jeux',
      classic: 'Enchères',
      charades: 'Survie',
      classicDesc: 'Misez sur votre nombre de réponses en 60 secondes !',
      survieDesc: 'Répondez en chaîne, le premier qui sèche perd',
      continueBtn: 'Continuer',
      pickModeFirst: "Choisissez d'abord un mode de jeu",
    },
    matchSettings: {
      settingsTitle: 'Paramètre de jeux',
      teamCount: 'Équipes',
      roundCount: 'Rounds',
      timer: 'Chrono',
      categoriesTitle: 'Catégories',
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
    shop: {
      packsTitle: 'Pack de questions',
      unlock: 'Débloquer',
      unlockA11y: (pack) => `Débloquer ${pack}`,
      questionCount: (n) => `${n} questions`,
      unlocked: 'Pack débloqué ✓',
      comingSoon: 'Bientôt disponible',
      packTitles: { 'harry-potter': 'Poudlard Express', nintendo: 'Rétro-gaming', anime: 'Anime & mangas' },
      restore: 'Restaurer les achats',
      restoredTitle: 'Achats restaurés',
      restoredMsg: 'Vos packs sont de nouveau débloqués.',
      nothingToRestore: 'Aucun achat à restaurer pour cet identifiant Apple.',
      errors: {
        load: 'Impossible de charger vos achats.',
        purchase: 'L\'achat a échoué. Veuillez réessayer.',
        restore: 'La restauration a échoué. Vérifiez votre connexion.',
      },
      back: 'Retour',
      settings: 'Réglages',
      lockedAvailable: 'Disponible dans la boutique',
      goToShop: 'Aller à la boutique',
      trialMsg: 'Jouez gratuitement avec ce pack en regardant une courte pub !',
      trialUsedMsg: 'Vous avez déjà essayé ce pack. Débloquez-le pour continuer à jouer avec !',
      watchAd: 'REGARDER UNE PUB',
      trialBadge: 'ESSAI',
      close: 'Fermer',
      upsellMsg: 'Vous avez aimé ? Gardez ce pack pour toutes vos parties !',
      later: 'PLUS TARD',
    },
    gift: {
      welcomeTitle: 'Cadeau de bienvenue !',
      chooseMsg: 'Choisissez le pack qui vous est offert :',
      claim: 'RÉCUPÉRER',
      later: 'PLUS TARD',
      doneTitle: "C'est à vous !",
      doneMsg: 'Votre pack est débloqué. Bonne partie !',
      ok: 'SUPER',
      failedMsg: 'Impossible de récupérer le cadeau pour le moment. Réessayez plus tard.',
      welcomeCardTitle: 'Votre pack de bienvenue',
      welcomeCardMsg: (games) => `Recevez un pack offert après ${games} parties.`,
      playBtn: 'JOUER',
    },
    survie: {
      phoneTitle: 'Posez le téléphone au centre',
      phoneMsg: 'Toutes les équipes doivent pouvoir voir l’écran.',
      phoneGo: 'C’EST PARTI !',
      validate: 'BONNE RÉPONSE',
      validateA11y: 'Bonne réponse',
      noAnswer: 'PAS DE RÉPONSE',
      timeoutNo: 'NON, ÉLIMINER',
      timeoutYes: 'OUI, VALIDER',
      passA11y: 'Pas de réponse — élimination',
      clear: 'Effacer',
      someAnswers: 'Quelques réponses qui étaient possibles',
      elimPassTitle: 'Pas de réponse ?',
      elimPassMsg: "L'équipe sera éliminée de cette manche.",
      elimTimeoutTitle: 'Temps écoulé !',
      elimTimeoutMsg: "L'équipe a-t-elle répondu à temps ?",
      eliminate: 'ÉLIMINER',
      resume: 'REPRENDRE',
    },
    final: {
      tie: 'ÉGALITÉ !',
      victoryOf: 'Victoire de',
      rematch: 'Revanche',
      home: 'Menu principal',
    },
    prefs: {
      title: 'Préférences',
      soundEffects: 'Effets sonores',
      haptics: 'Retour haptique',
      adChoices: 'Choix publicitaires',
    },
    rules: {
      close: 'Compris',
      auctionTitle: 'Mode Enchères',
      auctionSteps: [
        'Un sujet s\'affiche, par exemple « Capitales du monde ».',
        'Chaque équipe, à son tour, annonce combien de réponses elle peut citer. Elle monte la mise ou passe.',
        'L\'équipe qui mise le plus doit tenir parole. L\'équipe qu\'elle a battue tient le téléphone et compte ses bonnes réponses.',
        '60 secondes pour atteindre la mise !',
      ],
      pointsTitle: 'Les points',
      auctionPoints: [
        'Mise réussie : chaque équipe qui a misé marque sa dernière mise.',
        'Mise ratée : l\'équipe qui tenait le téléphone marque les points de la mise.',
      ],
      survieTitle: 'Mode Survie',
      survieSteps: [
        'Un sujet s\'affiche, par exemple « Capitales du monde ».',
        'Chaque équipe, à son tour, a 10 secondes (réglable) pour citer une nouvelle réponse.',
        'Réponse validée : c\'est au tour de l\'équipe suivante.',
        'Pas de réponse à temps, ou « Passer » : l\'équipe est éliminée de la manche.',
        'La manche continue jusqu\'à ce qu\'il ne reste qu\'une seule équipe.',
      ],
      surviePoints: [
        'Départ : la cagnotte vaut 1 point.',
        'Bonne réponse : la cagnotte gagne 1 point.',
        'Fin de manche : la dernière équipe en jeu remporte toute la cagnotte.',
      ],
    },
    support: {
      title: 'Assistance',
      intro: 'Un bug, une réponse manquante, une idée de sujet ? Écrivez-nous, on vous répond sous 48 h.',
      contactBtn: 'Nous écrire',
      mailSubject: 'Banco – Assistance',
      noMailApp: 'Aucune app e-mail trouvée. Écrivez-nous à :',
      faqTitle: 'Questions fréquentes',
      faq: [
        {
          q: 'Comment jouer ?',
          a: "Créez 2 à 4 équipes, choisissez vos thèmes puis un mode. Enchères : misez sur le nombre de réponses que vous pouvez citer en 60 secondes ; mise ratée, les points vont à l'adversaire. Survie : citez une réponse chacun votre tour ; l'équipe qui sèche est éliminée.",
        },
        {
          q: "Une bonne réponse n'est pas acceptée",
          a: "Notre base ne contient pas toutes les réponses possibles. Touchez « Valider quand même » pour la compter, ou « Chercher en ligne » pour vérifier. Envoyez-nous la réponse oubliée : nous l'ajouterons.",
        },
        {
          q: "J'ai changé d'iPhone, mes packs ont disparu",
          a: "Ouvrez la Boutique et touchez « Restaurer les achats », avec le même identifiant Apple que lors de l'achat. Vous ne payez jamais deux fois.",
        },
        {
          q: 'Comment me faire rembourser un achat ?',
          a: 'Les paiements sont gérés par Apple : faites votre demande sur reportaproblem.apple.com.',
        },
        {
          q: 'Comment changer la langue ?',
          a: "Avec le sélecteur de langue de l'écran d'accueil. Les sujets et les réponses s'adaptent automatiquement.",
        },
      ],
      privacy: 'Politique de confidentialité',
      version: 'Version',
    },
    result: {
      nextRound: 'MANCHE SUIVANTE',
      madeBid: 'vous avez réussi votre mise',
      missedBid: 'vous avez loupé votre mise',
      toFind: 'Réponses à trouver :',
      foundCount: 'Réponses trouvées :',
      eliminated: 'est éliminée',
      pointsAtStake: 'Points en jeu :',
      finalResults: 'RÉSULTATS',
    },
  },
  en: {
    auction: {
      instruction: "You'll have 60 seconds. How many can you name?",
      opens: 'opens the bidding',
      raises: 'raises or passes',
      bid: (n) => `I'LL NAME ${n}`,
      pass: 'PASS',
      passTurn: 'PASS MY TURN',
      concludeAuction: 'CLOSE THE AUCTION',
      max: (n) => `Maximum: ${n}`,
    },
    ready: {
      round: 'Round',
      target: 'Target:',
      play: 'PLAY',
      start: 'START',
      holdsPhone: 'holds the phone',
      answers: 'answers',
      wonAuction: 'wins the auction',
      yourTurn: 'your turn!',
      yourStart: 'you start!',
      yourGo: 'your turn to answer!',
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
      sortPopular: 'Sort by popularity',
      sortAlpha: 'Sort alphabetically',
    },
    home: {
      play: 'Play',
      shop: 'Shop',
      rules: 'Rules',
      subtitle: 'Bet on what you know!',
    },
    gameMode: {
      modesTitle: 'Game modes',
      classic: 'Auctions',
      charades: 'Survival',
      classicDesc: 'Bet on how many answers you can give in 60 seconds!',
      survieDesc: 'Answer in turn, the first to dry up loses',
      continueBtn: 'Continue',
      pickModeFirst: 'Choose a game mode first',
    },
    matchSettings: {
      settingsTitle: 'Game settings',
      teamCount: 'Teams',
      roundCount: 'Rounds',
      timer: 'Timer',
      categoriesTitle: 'Categories',
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
    shop: {
      packsTitle: 'Question packs',
      unlock: 'Unlock',
      unlockA11y: (pack) => `Unlock ${pack}`,
      questionCount: (n) => `${n} questions`,
      unlocked: 'Pack unlocked ✓',
      comingSoon: 'Coming soon',
      packTitles: { 'harry-potter': 'Hogwarts Express', nintendo: 'Retro gaming', anime: 'Anime & manga' },
      restore: 'Restore purchases',
      restoredTitle: 'Purchases restored',
      restoredMsg: 'Your packs are unlocked again.',
      nothingToRestore: 'No purchases to restore for this Apple ID.',
      errors: {
        load: 'Couldn\'t load your purchases.',
        purchase: 'Purchase failed. Please try again.',
        restore: 'Restore failed. Check your connection.',
      },
      back: 'Back',
      settings: 'Settings',
      lockedAvailable: 'Available in the shop',
      goToShop: 'Go to the shop',
      trialMsg: 'Play this pack for free by watching a short ad!',
      trialUsedMsg: "You've already tried this pack. Unlock it to keep playing with it!",
      watchAd: 'WATCH AN AD',
      trialBadge: 'TRIAL',
      close: 'Close',
      upsellMsg: 'Enjoyed it? Keep this pack for all your games!',
      later: 'LATER',
    },
    gift: {
      welcomeTitle: 'Welcome gift!',
      chooseMsg: 'Choose your free pack:',
      claim: 'CLAIM',
      later: 'LATER',
      doneTitle: "It's yours!",
      doneMsg: 'Your pack is unlocked. Have fun!',
      ok: 'GREAT',
      failedMsg: "We couldn't deliver your gift right now. Please try again later.",
      welcomeCardTitle: 'Your welcome pack',
      welcomeCardMsg: (games) => `Get a free pack after ${games} games.`,
      playBtn: 'PLAY',
    },
    survie: {
      phoneTitle: 'Put the phone in the middle',
      phoneMsg: 'Every team must be able to see the screen.',
      phoneGo: "LET'S GO!",
      validate: 'RIGHT ANSWER',
      validateA11y: 'Right answer',
      noAnswer: 'NO ANSWER',
      timeoutNo: 'NO, ELIMINATE',
      timeoutYes: 'YES, VALIDATE',
      passA11y: 'No answer — elimination',
      clear: 'Clear',
      someAnswers: 'Some possible answers',
      elimPassTitle: 'No answer?',
      elimPassMsg: 'The team will be out for this round.',
      elimTimeoutTitle: "Time's up!",
      elimTimeoutMsg: 'Did the team answer in time?',
      eliminate: 'ELIMINATE',
      resume: 'RESUME',
    },
    final: {
      tie: 'IT\'S A TIE!',
      victoryOf: 'Victory for',
      rematch: 'Rematch',
      home: 'Main menu',
    },
    prefs: {
      title: 'Preferences',
      soundEffects: 'Sound effects',
      haptics: 'Haptic feedback',
      adChoices: 'Ad choices',
    },
    rules: {
      close: 'Got it',
      auctionTitle: 'Auctions mode',
      auctionSteps: [
        'A topic appears, for example “World capitals”.',
        'Each team in turn says how many answers it can name. It raises the bid or passes.',
        'The highest bidder must deliver. The team it outbid holds the phone and counts the correct answers.',
        '60 seconds to reach the bid!',
      ],
      pointsTitle: 'Points',
      auctionPoints: [
        'Bid reached: every team that bid scores its last bid.',
        'Bid missed: the team holding the phone scores the bid.',
      ],
      survieTitle: 'Survival mode',
      survieSteps: [
        'A topic appears, for example “World capitals”.',
        'Each team, in turn, has 10 seconds (adjustable) to name a new answer.',
        'Answer validated: it’s the next team’s turn.',
        'No answer in time, or “Pass”: the team is out of the round.',
        'The round goes on until only one team is left.',
      ],
      surviePoints: [
        'Start: the jackpot is worth 1 point.',
        'Correct answer: the jackpot gains 1 point.',
        'End of round: the last team standing wins the whole jackpot.',
      ],
    },
    support: {
      title: 'Support',
      intro: 'A bug, a missing answer, an idea for a topic? Write to us, we reply within 48 hours.',
      contactBtn: 'Contact us',
      mailSubject: 'Banco – Support',
      noMailApp: 'No email app found. Write to us at:',
      faqTitle: 'FAQ',
      faq: [
        {
          q: 'How do I play?',
          a: 'Create 2 to 4 teams, pick your themes, then a mode. Auctions: bid on how many answers you can name in 60 seconds; miss your bid and the points go to the other team. Survival: name one answer each in turn; the team that runs dry is out.',
        },
        {
          q: "A correct answer isn't accepted",
          a: "Our database doesn't hold every possible answer. Tap “Validate anyway” to count it, or “Search online” to check. Send us the missing answer and we'll add it.",
        },
        {
          q: 'I changed iPhone and my packs are gone',
          a: 'Open the Shop and tap “Restore purchases”, using the same Apple ID as when you bought them. You never pay twice.',
        },
        {
          q: 'How do I get a refund?',
          a: 'Payments are handled by Apple: request a refund at reportaproblem.apple.com.',
        },
        {
          q: 'How do I change the language?',
          a: 'Use the language picker on the home screen. Topics and answers adapt automatically.',
        },
      ],
      privacy: 'Privacy policy',
      version: 'Version',
    },
    result: {
      nextRound: 'NEXT ROUND',
      madeBid: 'you made your bid',
      missedBid: 'you missed your bid',
      toFind: 'Answers to find:',
      foundCount: 'Answers found:',
      eliminated: 'is out!',
      pointsAtStake: 'Points at stake:',
      finalResults: 'RESULTS',
    },
  },
  de: {
    auction: {
      instruction: 'Sie haben 60 Sekunden. Wie viele können Sie nennen?',
      opens: 'eröffnet das Gebot',
      raises: 'erhöht oder passt',
      bid: (n) => `ICH NENNE ${n}`,
      pass: 'PASSEN',
      passTurn: 'ICH PASSE',
      concludeAuction: 'AUKTION BEENDEN',
      max: (n) => `Maximum: ${n}`,
    },
    ready: {
      round: 'Runde',
      target: 'Ziel:',
      play: 'SPIELEN',
      start: 'STARTEN',
      holdsPhone: 'hält das Gerät',
      answers: 'antwortet',
      wonAuction: 'gewinnt die Auktion',
      yourTurn: 'ihr seid dran!',
      yourStart: 'ihr fangt an!',
      yourGo: 'ihr antwortet!',
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
      sortPopular: 'Nach Beliebtheit sortieren',
      sortAlpha: 'Alphabetisch sortieren',
    },
    home: {
      play: 'Spielen',
      shop: 'Shop',
      rules: 'Regeln',
      subtitle: 'Setz auf dein Wissen!',
    },
    gameMode: {
      modesTitle: 'Spielmodi',
      classic: 'Auktionen',
      charades: 'Überleben',
      classicDesc: 'Wettet, wie viele Antworten ihr in 60 Sekunden findet!',
      survieDesc: 'Antwortet nacheinander, wer zuerst passt, verliert',
      continueBtn: 'Weiter',
      pickModeFirst: 'Wählen Sie zuerst einen Spielmodus',
    },
    matchSettings: {
      settingsTitle: 'Spieleinstellungen',
      teamCount: 'Teams',
      roundCount: 'Runden',
      timer: 'Timer',
      categoriesTitle: 'Kategorien',
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
    shop: {
      packsTitle: 'Fragenpakete',
      unlock: 'Freischalten',
      unlockA11y: (pack) => `Freischalten: ${pack}`,
      questionCount: (n) => `${n} Fragen`,
      unlocked: 'Paket freigeschaltet ✓',
      comingSoon: 'Demnächst verfügbar',
      packTitles: { 'harry-potter': 'Hogwarts-Express', nintendo: 'Retro-Gaming', anime: 'Anime & Manga' },
      restore: 'Käufe wiederherstellen',
      restoredTitle: 'Käufe wiederhergestellt',
      restoredMsg: 'Deine Pakete sind wieder freigeschaltet.',
      nothingToRestore: 'Keine Käufe für diese Apple-ID gefunden.',
      errors: {
        load: 'Deine Käufe konnten nicht geladen werden.',
        purchase: 'Kauf fehlgeschlagen. Bitte versuche es erneut.',
        restore: 'Wiederherstellung fehlgeschlagen. Prüfe deine Verbindung.',
      },
      back: 'Zurück',
      settings: 'Einstellungen',
      lockedAvailable: 'Im Shop erhältlich',
      goToShop: 'Zum Shop',
      trialMsg: 'Spiel dieses Paket gratis – schau dir dafür kurz Werbung an!',
      trialUsedMsg: 'Du hast dieses Paket schon getestet. Schalte es frei, um weiterzuspielen!',
      watchAd: 'WERBUNG ANSEHEN',
      trialBadge: 'TEST',
      close: 'Schließen',
      upsellMsg: 'Hat es gefallen? Behalte dieses Paket für alle Partien!',
      later: 'SPÄTER',
    },
    gift: {
      welcomeTitle: 'Willkommensgeschenk!',
      chooseMsg: 'Wähle dein Gratis-Paket:',
      claim: 'ABHOLEN',
      later: 'SPÄTER',
      doneTitle: 'Es gehört dir!',
      doneMsg: 'Dein Paket ist freigeschaltet. Viel Spaß!',
      ok: 'SUPER',
      failedMsg: 'Das Geschenk kann gerade nicht abgeholt werden. Versuche es später erneut.',
      welcomeCardTitle: 'Dein Willkommenspaket',
      welcomeCardMsg: (games) => `Erhalte nach ${games} Spielen ein Gratis-Paket.`,
      playBtn: 'SPIELEN',
    },
    survie: {
      phoneTitle: 'Legt das Handy in die Mitte',
      phoneMsg: 'Alle Teams müssen den Bildschirm sehen können.',
      phoneGo: "LOS GEHT'S!",
      validate: 'RICHTIG',
      validateA11y: 'Richtige Antwort',
      noAnswer: 'KEINE ANTWORT',
      timeoutNo: 'NEIN, AUSSCHEIDEN',
      timeoutYes: 'JA, BESTÄTIGEN',
      passA11y: 'Keine Antwort – Ausscheiden',
      clear: 'Löschen',
      someAnswers: 'Einige mögliche Antworten',
      elimPassTitle: 'Keine Antwort?',
      elimPassMsg: 'Das Team scheidet in dieser Runde aus.',
      elimTimeoutTitle: 'Zeit abgelaufen!',
      elimTimeoutMsg: 'Hat das Team rechtzeitig geantwortet?',
      eliminate: 'AUSSCHEIDEN',
      resume: 'WEITER',
    },
    final: {
      tie: 'UNENTSCHIEDEN!',
      victoryOf: 'Sieg für',
      rematch: 'Revanche',
      home: 'Hauptmenü',
    },
    prefs: {
      title: 'Einstellungen',
      soundEffects: 'Soundeffekte',
      haptics: 'Haptisches Feedback',
      adChoices: 'Werbeeinstellungen',
    },
    rules: {
      close: 'Verstanden',
      auctionTitle: 'Modus Auktionen',
      auctionSteps: [
        'Ein Thema erscheint, zum Beispiel „Hauptstädte der Welt“.',
        'Jedes Team sagt reihum, wie viele Antworten es nennen kann. Es erhöht das Gebot oder passt.',
        'Das Team mit dem höchsten Gebot muss liefern. Das überbotene Team hält das Handy und zählt die richtigen Antworten.',
        '60 Sekunden, um das Gebot zu erreichen!',
      ],
      pointsTitle: 'Punkte',
      auctionPoints: [
        'Gebot geschafft: Jedes Team, das geboten hat, bekommt sein letztes Gebot.',
        'Gebot verfehlt: Das Team mit dem Handy bekommt die Punkte des Gebots.',
      ],
      survieTitle: 'Modus Überleben',
      survieSteps: [
        'Ein Thema erscheint, zum Beispiel „Hauptstädte der Welt“.',
        'Jedes Team hat abwechselnd 10 Sekunden (einstellbar), um eine neue Antwort zu nennen.',
        'Antwort bestätigt: Das nächste Team ist dran.',
        'Keine Antwort in der Zeit oder „Passen“: Das Team scheidet in dieser Runde aus.',
        'Die Runde läuft, bis nur noch ein Team übrig ist.',
      ],
      surviePoints: [
        'Start: Der Jackpot ist 1 Punkt wert.',
        'Richtige Antwort: Der Jackpot steigt um 1 Punkt.',
        'Rundenende: Das letzte Team im Spiel gewinnt den ganzen Jackpot.',
      ],
    },
    support: {
      title: 'Hilfe',
      intro: 'Ein Fehler, eine fehlende Antwort, eine Themenidee? Schreib uns, wir antworten innerhalb von 48 Stunden.',
      contactBtn: 'Schreib uns',
      mailSubject: 'Banco – Hilfe',
      noMailApp: 'Keine E-Mail-App gefunden. Schreib uns an:',
      faqTitle: 'Häufige Fragen',
      faq: [
        {
          q: 'Wie spielt man?',
          a: 'Erstellt 2 bis 4 Teams, wählt eure Themen und dann einen Modus. Auktionen: Bietet, wie viele Antworten ihr in 60 Sekunden nennen könnt; verfehlt ihr euer Gebot, gehen die Punkte an den Gegner. Überleben: Nennt abwechselnd je eine Antwort; das Team, dem nichts mehr einfällt, scheidet aus.',
        },
        {
          q: 'Eine richtige Antwort wird nicht akzeptiert',
          a: 'Unsere Datenbank enthält nicht alle möglichen Antworten. Tippe auf „Trotzdem bestätigen“, um sie zu zählen, oder auf „Online suchen“, um sie zu prüfen. Schick uns die fehlende Antwort, wir fügen sie hinzu.',
        },
        {
          q: 'Neues iPhone, meine Packs sind weg',
          a: 'Öffne den Shop und tippe auf „Käufe wiederherstellen“, mit derselben Apple-ID wie beim Kauf. Du zahlst nie zweimal.',
        },
        {
          q: 'Wie bekomme ich eine Rückerstattung?',
          a: 'Zahlungen laufen über Apple: Stelle deine Anfrage auf reportaproblem.apple.com.',
        },
        {
          q: 'Wie ändere ich die Sprache?',
          a: 'Mit der Sprachauswahl auf dem Startbildschirm. Themen und Antworten passen sich automatisch an.',
        },
      ],
      privacy: 'Datenschutzerklärung',
      version: 'Version',
    },
    result: {
      nextRound: 'NÄCHSTE RUNDE',
      madeBid: 'Gebot geschafft',
      missedBid: 'Gebot verfehlt',
      toFind: 'Zu findende Antworten:',
      foundCount: 'Gefundene Antworten:',
      eliminated: 'ist ausgeschieden',
      pointsAtStake: 'Punkte im Spiel:',
      finalResults: 'ERGEBNISSE',
    },
  },
  es: {
    auction: {
      instruction: 'Tendrás 60 segundos. ¿Cuántas puedes decir?',
      opens: 'abre la puja',
      raises: 'sube o pasa',
      bid: (n) => `DIGO ${n}`,
      pass: 'PASAR',
      passTurn: 'PASAR MI TURNO',
      concludeAuction: 'CERRAR LA SUBASTA',
      max: (n) => `Máximo: ${n}`,
    },
    ready: {
      round: 'Ronda',
      target: 'Objetivo:',
      play: 'JUGAR',
      start: 'EMPEZAR',
      holdsPhone: 'tiene el dispositivo',
      answers: 'responde',
      wonAuction: 'gana la subasta',
      yourTurn: '¡os toca jugar!',
      yourStart: '¡empezáis vosotros!',
      yourGo: '¡os toca responder!',
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
      sortPopular: 'Ordenar por popularidad',
      sortAlpha: 'Ordenar alfabéticamente',
    },
    home: {
      play: 'Jugar',
      shop: 'Tienda',
      rules: 'Reglas',
      subtitle: '¡Apuesta por lo que sabes!',
    },
    gameMode: {
      modesTitle: 'Modos de juego',
      classic: 'Subastas',
      charades: 'Supervivencia',
      classicDesc: '¡Apostad cuántas respuestas daréis en 60 segundos!',
      survieDesc: 'Responded por turnos, el primero que se quede en blanco pierde',
      continueBtn: 'Continuar',
      pickModeFirst: 'Elija primero un modo de juego',
    },
    matchSettings: {
      settingsTitle: 'Ajustes de juego',
      teamCount: 'Equipos',
      roundCount: 'Rondas',
      timer: 'Cronómetro',
      categoriesTitle: 'Categorías',
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
    shop: {
      packsTitle: 'Packs de preguntas',
      unlock: 'Desbloquear',
      unlockA11y: (pack) => `Desbloquear ${pack}`,
      questionCount: (n) => `${n} preguntas`,
      unlocked: 'Pack desbloqueado ✓',
      comingSoon: 'Próximamente',
      packTitles: { 'harry-potter': 'Expreso de Hogwarts', nintendo: 'Retro gaming', anime: 'Anime y manga' },
      restore: 'Restaurar compras',
      restoredTitle: 'Compras restauradas',
      restoredMsg: 'Tus packs vuelven a estar desbloqueados.',
      nothingToRestore: 'No hay compras que restaurar para este ID de Apple.',
      errors: {
        load: 'No se pudieron cargar tus compras.',
        purchase: 'La compra ha fallado. Inténtalo de nuevo.',
        restore: 'La restauración ha fallado. Comprueba tu conexión.',
      },
      back: 'Volver',
      settings: 'Ajustes',
      lockedAvailable: 'Disponible en la tienda',
      goToShop: 'Ir a la tienda',
      trialMsg: '¡Juega gratis con este pack viendo un anuncio corto!',
      trialUsedMsg: 'Ya has probado este pack. ¡Desbloquéalo para seguir jugando con él!',
      watchAd: 'VER UN ANUNCIO',
      trialBadge: 'PRUEBA',
      close: 'Cerrar',
      upsellMsg: '¿Te ha gustado? ¡Quédate este pack para todas tus partidas!',
      later: 'MÁS TARDE',
    },
    gift: {
      welcomeTitle: '¡Regalo de bienvenida!',
      chooseMsg: 'Elige tu pack gratis:',
      claim: 'RECOGER',
      later: 'MÁS TARDE',
      doneTitle: '¡Es tuyo!',
      doneMsg: 'Tu pack está desbloqueado. ¡A jugar!',
      ok: 'GENIAL',
      failedMsg: 'No se ha podido entregar el regalo. Inténtalo más tarde.',
      welcomeCardTitle: 'Tu pack de bienvenida',
      welcomeCardMsg: (games) => `Recibe un pack gratis después de ${games} partidas.`,
      playBtn: 'JUGAR',
    },
    survie: {
      phoneTitle: 'Poned el móvil en el centro',
      phoneMsg: 'Todos los equipos deben poder ver la pantalla.',
      phoneGo: '¡VAMOS!',
      validate: 'RESPUESTA CORRECTA',
      validateA11y: 'Respuesta correcta',
      noAnswer: 'SIN RESPUESTA',
      timeoutNo: 'NO, ELIMINAR',
      timeoutYes: 'SÍ, VALIDAR',
      passA11y: 'Sin respuesta — eliminación',
      clear: 'Borrar',
      someAnswers: 'Algunas respuestas posibles',
      elimPassTitle: '¿Sin respuesta?',
      elimPassMsg: 'El equipo quedará eliminado de esta ronda.',
      elimTimeoutTitle: '¡Se acabó el tiempo!',
      elimTimeoutMsg: '¿Respondió el equipo a tiempo?',
      eliminate: 'ELIMINAR',
      resume: 'REANUDAR',
    },
    final: {
      tie: '¡EMPATE!',
      victoryOf: 'Victoria de',
      rematch: 'Revancha',
      home: 'Menú principal',
    },
    prefs: {
      title: 'Preferencias',
      soundEffects: 'Efectos de sonido',
      haptics: 'Respuesta háptica',
      adChoices: 'Preferencias de anuncios',
    },
    rules: {
      close: 'Entendido',
      auctionTitle: 'Modo Subastas',
      auctionSteps: [
        'Aparece un tema, por ejemplo «Capitales del mundo».',
        'Cada equipo, por turnos, dice cuántas respuestas puede decir. Sube la apuesta o pasa.',
        'El equipo que más apuesta debe cumplir. El equipo al que superó sostiene el móvil y cuenta las respuestas correctas.',
        '¡60 segundos para alcanzar la apuesta!',
      ],
      pointsTitle: 'Los puntos',
      auctionPoints: [
        'Apuesta cumplida: cada equipo que apostó suma su última apuesta.',
        'Apuesta fallida: el equipo que sostenía el móvil suma los puntos de la apuesta.',
      ],
      survieTitle: 'Modo Supervivencia',
      survieSteps: [
        'Aparece un tema, por ejemplo «Capitales del mundo».',
        'Cada equipo, por turnos, tiene 10 segundos (ajustable) para decir una respuesta nueva.',
        'Respuesta validada: le toca al equipo siguiente.',
        'Sin respuesta a tiempo, o «Pasar»: el equipo queda eliminado de la ronda.',
        'La ronda sigue hasta que solo quede un equipo.',
      ],
      surviePoints: [
        'Inicio: el bote vale 1 punto.',
        'Respuesta correcta: el bote suma 1 punto.',
        'Fin de ronda: el último equipo en juego se lleva todo el bote.',
      ],
    },
    support: {
      title: 'Ayuda',
      intro: '¿Un error, una respuesta que falta, una idea de tema? Escríbenos, te respondemos en 48 h.',
      contactBtn: 'Escríbenos',
      mailSubject: 'Banco – Ayuda',
      noMailApp: 'No se encontró ninguna app de correo. Escríbenos a:',
      faqTitle: 'Preguntas frecuentes',
      faq: [
        {
          q: '¿Cómo se juega?',
          a: 'Cread de 2 a 4 equipos, elegid vuestros temas y luego un modo. Subastas: apostad cuántas respuestas podéis decir en 60 segundos; si falláis la apuesta, los puntos van al rival. Supervivencia: decid una respuesta por turnos; el equipo que se queda en blanco queda eliminado.',
        },
        {
          q: 'Una respuesta correcta no se acepta',
          a: 'Nuestra base no contiene todas las respuestas posibles. Toca «Validar de todos modos» para contarla, o «Buscar en línea» para comprobarla. Envíanos la respuesta que falta y la añadiremos.',
        },
        {
          q: 'He cambiado de iPhone y mis packs han desaparecido',
          a: 'Abre la Tienda y toca «Restaurar compras», con el mismo ID de Apple que usaste al comprar. Nunca pagas dos veces.',
        },
        {
          q: '¿Cómo pido un reembolso?',
          a: 'Los pagos los gestiona Apple: haz tu solicitud en reportaproblem.apple.com.',
        },
        {
          q: '¿Cómo cambio el idioma?',
          a: 'Con el selector de idioma de la pantalla de inicio. Los temas y las respuestas se adaptan automáticamente.',
        },
      ],
      privacy: 'Política de privacidad',
      version: 'Versión',
    },
    result: {
      nextRound: 'RONDA SIGUIENTE',
      madeBid: 'habéis cumplido vuestra apuesta',
      missedBid: 'habéis fallado vuestra apuesta',
      toFind: 'Respuestas por encontrar:',
      foundCount: 'Respuestas encontradas:',
      eliminated: 'queda eliminado',
      pointsAtStake: 'Puntos en juego:',
      finalResults: 'RESULTADOS',
    },
  },
};

export function getT(lang: Lang): Translations {
  return translations[lang];
}
