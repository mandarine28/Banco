export type Lang = 'fr' | 'en' | 'de' | 'es' | 'it' | 'pt';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português (Brasil)' },
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
  tutorial: {
    next: string;
    skip: string;
    done: string;
    welcome: string;
    shop: string;
    giftFirst: (pack: string, games: number) => string;
    giftNext: (pack: string, games: number) => string;
    play: string;
    auction: string;
    survie: string;
    teams: string;
  };
  common: {
    cancel: string;
    quitTitle: string;
    quitMsg: string;
    quit: string;
    endTurnTitle: string;
    endTurnMsg: string;
    endTurnBtn: string;
    pausedTitle: string;
    pausedMsg: string;
    auctionSettings: string;
    survieSettings: string;
    selectAll: string;
    deselectAll: string;
    locked: string;
    answersFound: (n: number) => string;
    outOf: (found: number, total: number) => string;
    removeAnswer: string;
    addAnswer: string;
    expandQuestion: string;
    collapseQuestion: string;
    secondsLeft: (n: number) => string;
    decreaseBid: string;
    bidAmount: string;
    increaseBid: string;
  };
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
    pickCategoryFirst: string;
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
    /** Sous le titre : packs offerts aux premiers joueurs, payants plus tard. */
    earlyAccess: string;
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
    welcomeMsg: (pack: string, games: number) => string;
    doneTitle: string;
    doneMsg: (pack: string) => string;
    ok: string;
    progress: (played: number, total: number) => string;
    lockedMsg: (left: number) => string;
    gotIt: string;
    /** Annonce du pack offert suivant, après en avoir gagné un. */
    nextGoal: (pack: string, games: number) => string;
    /** Pack offert pas encore en jeu : gagné après le précédent. */
    after: (pack: string) => string;
    /** Toast au toucher d'un pack offert en attente du précédent. */
    unlockFirst: (pack: string) => string;
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
    language: string;
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
    tutorial: {
      next: 'Suivant',
      skip: 'Passer',
      done: 'C\'est parti !',
      welcome: 'Bienvenue dans Banco ! Je vous fais faire le tour en 30 secondes.',
      shop: 'Ici, la Boutique : des packs de questions à gagner en jouant.',
      giftFirst: (pack, n) => `Terminez ${n} parties et le pack « ${pack} » est à vous, offert !`,
      giftNext: (pack, n) => `Ensuite, le compteur repart à 0 : ${n} parties de plus pour « ${pack} ». Offerts aux premiers joueurs, profitez-en !`,
      play: 'Prêts ? Tout commence par ce bouton.',
      auction: 'Enchères : misez sur le nombre de réponses que vous pouvez citer. Une seule équipe répond, en 60 secondes.',
      survie: 'Survie : une réponse chacun son tour. L\'équipe qui n\'a plus d\'idée est éliminée !',
      teams: 'Ici, c\'est le nombre d\'équipes, pas de joueurs ! Réunissez autant de cerveaux que vous voulez dans chaque équipe : il n\'y a pas de limite. Bonne partie !',
    },
    common: {
      cancel: 'ANNULER',
      quitTitle: 'Quitter la partie ?',
      quitMsg: 'La partie en cours sera perdue.',
      quit: 'QUITTER',
      endTurnTitle: 'Terminer le tour ?',
      endTurnMsg: 'Si la mise n’est pas atteinte, elle revient à l’adversaire.',
      endTurnBtn: 'TERMINER',
      pausedTitle: 'Jeu en pause',
      pausedMsg: 'Vérifiez la réponse puis\nreprenez la partie.',
      auctionSettings: 'Paramètre des enchères',
      survieSettings: 'Paramètre de la survie',
      selectAll: 'Tout sélectionner',
      deselectAll: 'Tout désélectionner',
      locked: 'verrouillé',
      answersFound: (n) => `réponse${n > 1 ? 's' : ''} trouvée${n > 1 ? 's' : ''}`,
      outOf: (f, t) => `${f} sur ${t}`,
      removeAnswer: 'Annuler une réponse',
      addAnswer: 'Valider une réponse',
      expandQuestion: 'Agrandir la zone question',
      collapseQuestion: 'Réduire la zone question',
      secondsLeft: (n) => `${n} secondes restantes`,
      decreaseBid: 'Diminuer la mise',
      bidAmount: 'Montant de la mise',
      increaseBid: 'Augmenter la mise',
    },
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
      round: 'Manche',
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
      someAnswers: 'Quelques réponses possibles...',
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
      classicDesc: 'Une seule équipe répond en 60 secondes',
      survieDesc: 'Répondez en chaîne, le premier qui sèche perd',
      continueBtn: 'Continuer',
      pickModeFirst: "Choisissez d'abord un mode de jeu",
    },
    matchSettings: {
      settingsTitle: 'Paramètre de jeux',
      teamCount: 'Équipes',
      roundCount: 'Manches',
      timer: 'Chrono',
      categoriesTitle: 'Catégories',
      continueBtn: 'Continuer',
      pickCategoryFirst: 'Choisissez au moins une catégorie',
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
      earlyAccess: 'Merci d\'être parmi les premiers ! Ces packs sont offerts aujourd\'hui et deviendront payants : profitez-en.',
      unlock: 'Débloquer',
      unlockA11y: (pack) => `Débloquer ${pack}`,
      questionCount: (n) => `${n} questions`,
      unlocked: 'Pack débloqué ✓',
      comingSoon: 'Bientôt disponible',
      packTitles: { 'harry-potter': 'Poudlard Express', 'rap-francais': 'Rap français', nintendo: 'Rétro-gaming', anime: 'Anime & mangas' },
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
      welcomeMsg: (pack, games) => `Jouez ${games} parties et le pack « ${pack} » est à vous !`,
      doneTitle: "C'est à vous !",
      doneMsg: (pack) => `Le pack « ${pack} » est débloqué. Bonne partie !`,
      ok: 'SUPER',
      progress: (played, total) => `${played} partie${played > 1 ? 's' : ''} sur ${total}`,
      lockedMsg: (left) => `Jouez encore ${left} partie${left > 1 ? 's' : ''} pour débloquer ce pack offert !`,
      gotIt: 'COMPRIS',
      nextGoal: (pack, games) => `Prochain objectif : encore ${games} parties pour débloquer « ${pack} » !`,
      after: (pack) => `Après ${pack}`,
      unlockFirst: (pack) => `Débloquez d’abord le cadeau gratuit « ${pack} » pour gagner celui-ci !`,
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
      haptics: 'Vibration',
      adChoices: 'Choix publicitaires',
      language: 'Langue',
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
          a: "Avec le sélecteur de langue de l'écran d'accueil, ou dans les Réglages, même en pleine partie. Les sujets et les réponses s'adaptent automatiquement.",
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
    tutorial: {
      next: 'Next',
      skip: 'Skip',
      done: 'Let\'s go!',
      welcome: 'Welcome to Banco! Let me show you around in 30 seconds.',
      shop: 'This is the Shop: question packs you earn by playing.',
      giftFirst: (pack, n) => `Finish ${n} games and the “${pack}” pack is yours, free!`,
      giftNext: (pack, n) => `Then the counter resets: ${n} more games for “${pack}”. Free for early players, enjoy!`,
      play: 'Ready? It all starts with this button.',
      auction: 'Auctions: bet on how many answers you can name. Only one team answers, in 60 seconds.',
      survie: 'Survival: one answer each, in turn. The team that runs out of ideas is out!',
      teams: 'This is the number of teams, not players! Gather as many brains as you like in each team: there\'s no limit. Have a great game!',
    },
    common: {
      cancel: 'CANCEL',
      quitTitle: 'Quit the game?',
      quitMsg: 'The current game will be lost.',
      quit: 'QUIT',
      endTurnTitle: 'End the turn?',
      endTurnMsg: 'If the bid isn’t reached, the points go to the opponent.',
      endTurnBtn: 'END TURN',
      pausedTitle: 'Game paused',
      pausedMsg: 'Check the answer, then\nresume the game.',
      auctionSettings: 'Auction settings',
      survieSettings: 'Survival settings',
      selectAll: 'Select all',
      deselectAll: 'Deselect all',
      locked: 'locked',
      answersFound: (n) => (n === 1 ? 'answer found' : 'answers found'),
      outOf: (f, t) => `${f} of ${t}`,
      removeAnswer: 'Remove an answer',
      addAnswer: 'Count an answer',
      expandQuestion: 'Expand the question area',
      collapseQuestion: 'Collapse the question area',
      secondsLeft: (n) => `${n} seconds left`,
      decreaseBid: 'Lower the bid',
      bidAmount: 'Bid amount',
      increaseBid: 'Raise the bid',
    },
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
      classicDesc: 'Only one team answers, in 60 seconds',
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
      pickCategoryFirst: 'Choose at least one category',
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
      earlyAccess: 'Thanks for being one of the first! These packs are free today and will become paid later: grab them now.',
      unlock: 'Unlock',
      unlockA11y: (pack) => `Unlock ${pack}`,
      questionCount: (n) => `${n} questions`,
      unlocked: 'Pack unlocked ✓',
      comingSoon: 'Coming soon',
      packTitles: { 'harry-potter': 'Hogwarts Express', 'rap-francais': 'French Rap', nintendo: 'Retro gaming', anime: 'Anime & manga' },
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
      welcomeMsg: (pack, games) => `Play ${games} games and the "${pack}" pack is yours!`,
      doneTitle: "It's yours!",
      doneMsg: (pack) => `The "${pack}" pack is unlocked. Have fun!`,
      ok: 'GREAT',
      progress: (played, total) => `${played} of ${total} games`,
      lockedMsg: (left) => `Play ${left} more game${left > 1 ? 's' : ''} to unlock this free pack!`,
      gotIt: 'GOT IT',
      nextGoal: (pack, games) => `Next goal: ${games} more games to unlock “${pack}”!`,
      after: (pack) => `After ${pack}`,
      unlockFirst: (pack) => `Unlock the free “${pack}” gift first to earn this one!`,
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
      haptics: 'Vibration',
      adChoices: 'Ad choices',
      language: 'Language',
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
          a: 'Use the language picker on the home screen, or in Settings, even mid-game. Topics and answers adapt automatically.',
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
    tutorial: {
      next: 'Weiter',
      skip: 'Überspringen',
      done: 'Los geht\'s!',
      welcome: 'Willkommen bei Banco! Ich zeige euch in 30 Sekunden alles.',
      shop: 'Das ist der Shop: Fragenpakete, die ihr beim Spielen gewinnt.',
      giftFirst: (pack, n) => `Spielt ${n} Partien zu Ende und das Paket „${pack}“ gehört euch, gratis!`,
      giftNext: (pack, n) => `Danach startet der Zähler neu: ${n} weitere Partien für „${pack}“. Gratis für die ersten Spieler, nutzt es!`,
      play: 'Bereit? Alles beginnt mit diesem Button.',
      auction: 'Auktionen: Wettet, wie viele Antworten ihr nennen könnt. Nur ein Team antwortet, in 60 Sekunden.',
      survie: 'Überleben: Abwechselnd eine Antwort. Wem nichts mehr einfällt, der fliegt raus!',
      teams: 'Hier zählen Teams, nicht Spieler! Holt so viele kluge Köpfe ins Team, wie ihr wollt: Es gibt kein Limit. Viel Spaß beim Spielen!',
    },
    common: {
      cancel: 'ABBRECHEN',
      quitTitle: 'Spiel verlassen?',
      quitMsg: 'Das laufende Spiel geht verloren.',
      quit: 'VERLASSEN',
      endTurnTitle: 'Runde beenden?',
      endTurnMsg: 'Wird das Gebot nicht erreicht, gehen die Punkte an den Gegner.',
      endTurnBtn: 'BEENDEN',
      pausedTitle: 'Spiel pausiert',
      pausedMsg: 'Prüft die Antwort und\nsetzt das Spiel fort.',
      auctionSettings: 'Auktionseinstellungen',
      survieSettings: 'Überleben-Einstellungen',
      selectAll: 'Alle auswählen',
      deselectAll: 'Alle abwählen',
      locked: 'gesperrt',
      answersFound: (n) => (n === 1 ? 'Antwort gefunden' : 'Antworten gefunden'),
      outOf: (f, t) => `${f} von ${t}`,
      removeAnswer: 'Antwort zurücknehmen',
      addAnswer: 'Antwort zählen',
      expandQuestion: 'Fragebereich vergrößern',
      collapseQuestion: 'Fragebereich verkleinern',
      secondsLeft: (n) => `Noch ${n} Sekunden`,
      decreaseBid: 'Gebot senken',
      bidAmount: 'Gebotshöhe',
      increaseBid: 'Gebot erhöhen',
    },
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
      classicDesc: 'Nur ein Team antwortet, in 60 Sekunden',
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
      pickCategoryFirst: 'Wählen Sie mindestens eine Kategorie',
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
      earlyAccess: 'Danke, dass ihr zu den Ersten gehört! Diese Pakete sind jetzt gratis und werden später kostenpflichtig: holt sie euch.',
      unlock: 'Freischalten',
      unlockA11y: (pack) => `Freischalten: ${pack}`,
      questionCount: (n) => `${n} Fragen`,
      unlocked: 'Paket freigeschaltet ✓',
      comingSoon: 'Demnächst verfügbar',
      packTitles: { 'harry-potter': 'Hogwarts-Express', 'rap-francais': 'Französischer Rap', nintendo: 'Retro-Gaming', anime: 'Anime & Manga' },
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
      welcomeMsg: (pack, games) => `Spiel ${games} Partien und das Paket „${pack}" gehört dir!`,
      doneTitle: 'Es gehört dir!',
      doneMsg: (pack) => `Das Paket „${pack}" ist freigeschaltet. Viel Spaß!`,
      ok: 'SUPER',
      progress: (played, total) => `${played} von ${total} Partien`,
      lockedMsg: (left) => `Spiel noch ${left} ${left > 1 ? 'Partien' : 'Partie'}, um dieses Gratis-Paket freizuschalten!`,
      gotIt: 'VERSTANDEN',
      nextGoal: (pack, games) => `Nächstes Ziel: noch ${games} Partien, um „${pack}“ freizuschalten!`,
      after: (pack) => `Nach ${pack}`,
      unlockFirst: (pack) => `Schaltet zuerst das Gratis-Geschenk „${pack}“ frei, um dieses zu bekommen!`,
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
      haptics: 'Vibration',
      adChoices: 'Werbeeinstellungen',
      language: 'Sprache',
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
          a: 'Mit der Sprachauswahl auf dem Startbildschirm oder in den Einstellungen, auch mitten im Spiel. Themen und Antworten passen sich automatisch an.',
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
    tutorial: {
      next: 'Siguiente',
      skip: 'Saltar',
      done: '¡Vamos!',
      welcome: '¡Bienvenidos a Banco! Os lo enseño todo en 30 segundos.',
      shop: 'Esta es la Tienda: packs de preguntas que se ganan jugando.',
      giftFirst: (pack, n) => `¡Terminad ${n} partidas y el pack «${pack}» es vuestro, gratis!`,
      giftNext: (pack, n) => `Después, el contador vuelve a 0: ${n} partidas más para «${pack}». ¡Gratis para los primeros jugadores, aprovechad!`,
      play: '¿Listos? Todo empieza con este botón.',
      auction: 'Subastas: apostad cuántas respuestas podéis decir. Solo un equipo responde, en 60 segundos.',
      survie: 'Supervivencia: una respuesta por turno. ¡El equipo que se queda sin ideas queda eliminado!',
      teams: '¡Aquí se cuentan equipos, no jugadores! Reunid en cada equipo todos los cerebros que queráis: no hay límite. ¡Buena partida!',
    },
    common: {
      cancel: 'CANCELAR',
      quitTitle: '¿Salir de la partida?',
      quitMsg: 'Se perderá la partida en curso.',
      quit: 'SALIR',
      endTurnTitle: '¿Terminar el turno?',
      endTurnMsg: 'Si no se alcanza la apuesta, los puntos son para el rival.',
      endTurnBtn: 'TERMINAR',
      pausedTitle: 'Juego en pausa',
      pausedMsg: 'Comprobad la respuesta y\nreanudad la partida.',
      auctionSettings: 'Ajustes de subasta',
      survieSettings: 'Ajustes de supervivencia',
      selectAll: 'Seleccionar todo',
      deselectAll: 'Deseleccionar todo',
      locked: 'bloqueado',
      answersFound: (n) => (n === 1 ? 'respuesta encontrada' : 'respuestas encontradas'),
      outOf: (f, t) => `${f} de ${t}`,
      removeAnswer: 'Quitar una respuesta',
      addAnswer: 'Contar una respuesta',
      expandQuestion: 'Ampliar la zona de la pregunta',
      collapseQuestion: 'Reducir la zona de la pregunta',
      secondsLeft: (n) => `Quedan ${n} segundos`,
      decreaseBid: 'Bajar la apuesta',
      bidAmount: 'Importe de la apuesta',
      increaseBid: 'Subir la apuesta',
    },
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
      classicDesc: 'Solo un equipo responde, en 60 segundos',
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
      pickCategoryFirst: 'Elija al menos una categoría',
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
      earlyAccess: '¡Gracias por estar entre los primeros! Estos packs son gratis hoy y serán de pago más adelante: aprovechad.',
      unlock: 'Desbloquear',
      unlockA11y: (pack) => `Desbloquear ${pack}`,
      questionCount: (n) => `${n} preguntas`,
      unlocked: 'Pack desbloqueado ✓',
      comingSoon: 'Próximamente',
      packTitles: { 'harry-potter': 'Expreso de Hogwarts', 'rap-francais': 'Rap francés', nintendo: 'Retro gaming', anime: 'Anime y manga' },
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
      welcomeMsg: (pack, games) => `¡Juega ${games} partidas y el pack «${pack}» es tuyo!`,
      doneTitle: '¡Es tuyo!',
      doneMsg: (pack) => `El pack «${pack}» está desbloqueado. ¡A jugar!`,
      ok: 'GENIAL',
      progress: (played, total) => `${played} de ${total} partidas`,
      lockedMsg: (left) => `¡Juega ${left} partida${left > 1 ? 's' : ''} más para desbloquear este pack gratis!`,
      gotIt: 'ENTENDIDO',
      nextGoal: (pack, games) => `¡Próximo objetivo: ${games} partidas más para desbloquear «${pack}»!`,
      after: (pack) => `Después de ${pack}`,
      unlockFirst: (pack) => `¡Desbloquead primero el regalo gratis «${pack}» para ganar este!`,
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
      haptics: 'Vibración',
      adChoices: 'Preferencias de anuncios',
      language: 'Idioma',
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
          a: 'Con el selector de idioma de la pantalla de inicio, o en Ajustes, incluso en plena partida. Los temas y las respuestas se adaptan automáticamente.',
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
  it: {
    tutorial: {
      next: 'Avanti',
      skip: 'Salta',
      done: 'Si parte!',
      welcome: 'Benvenuti in Banco! Vi faccio fare il giro in 30 secondi.',
      shop: 'Questo è il Negozio: pacchetti di domande da vincere giocando.',
      giftFirst: (pack, n) => `Finite ${n} partite e il pacchetto «${pack}» è vostro, in regalo!`,
      giftNext: (pack, n) => `Poi il contatore riparte da 0: altre ${n} partite per «${pack}». Gratis per i primi giocatori, approfittatene!`,
      play: 'Pronti? Tutto inizia da questo pulsante.',
      auction: 'Aste: scommettete quante risposte sapete dire. Risponde una sola squadra, in 60 secondi.',
      survie: 'Sopravvivenza: una risposta a turno. La squadra che resta senza idee è eliminata!',
      teams: 'Qui si contano le squadre, non i giocatori! Riunite in ogni squadra tutti i cervelli che volete: non c\'è limite. Buona partita!',
    },
    common: {
      cancel: 'ANNULLA',
      quitTitle: 'Uscire dalla partita?',
      quitMsg: 'La partita in corso andrà persa.',
      quit: 'ESCI',
      endTurnTitle: 'Terminare il turno?',
      endTurnMsg: 'Se la puntata non viene raggiunta, i punti vanno all’avversario.',
      endTurnBtn: 'TERMINA',
      pausedTitle: 'Gioco in pausa',
      pausedMsg: 'Controllate la risposta e\nriprendete la partita.',
      auctionSettings: 'Impostazioni asta',
      survieSettings: 'Impostazioni sopravvivenza',
      selectAll: 'Seleziona tutto',
      deselectAll: 'Deseleziona tutto',
      locked: 'bloccato',
      answersFound: (n) => (n === 1 ? 'risposta trovata' : 'risposte trovate'),
      outOf: (f, t) => `${f} su ${t}`,
      removeAnswer: 'Annulla una risposta',
      addAnswer: 'Conta una risposta',
      expandQuestion: 'Ingrandisci la zona domanda',
      collapseQuestion: 'Riduci la zona domanda',
      secondsLeft: (n) => `${n} secondi rimasti`,
      decreaseBid: 'Abbassa la puntata',
      bidAmount: 'Importo della puntata',
      increaseBid: 'Alza la puntata',
    },
    auction: {
      instruction: 'Avrete 60 secondi. Quante riuscite a dirne?',
      opens: 'apre le aste',
      raises: 'rilancia o passa',
      bid: (n) => `NE DICO ${n}`,
      pass: 'PASSO',
      passTurn: 'PASSO IL TURNO',
      concludeAuction: "CHIUDI L'ASTA",
      max: (n) => `Massimo: ${n}`,
    },
    ready: {
      round: 'Manche',
      target: 'Obiettivo:',
      play: 'GIOCA',
      start: 'INIZIA',
      holdsPhone: 'tiene il telefono',
      answers: 'risponde',
      wonAuction: "vince l'asta",
      yourTurn: 'tocca a voi giocare!',
      yourStart: 'iniziate voi!',
      yourGo: 'tocca a voi rispondere!',
    },
    play: {
      searchPlaceholder: 'Verifica una risposta',
      notInDatabase: (w) => `"${w}" non è nel database.`,
      validateAnyway: 'CONVALIDA COMUNQUE',
      searchOnline: 'CERCA ONLINE',
      answerAdded: '✓ Risposta aggiunta',
      pause: 'Pausa',
      resume: 'Riprendi',
      endTurn: 'Fine turno',
      someAnswers: 'Alcune risposte possibili...',
      sortPopular: 'Ordina per popolarità',
      sortAlpha: 'Ordina alfabeticamente',
    },
    home: {
      play: 'Gioca',
      shop: 'Negozio',
      rules: 'Regole',
      subtitle: 'Scommetti su ciò che sai!',
    },
    gameMode: {
      modesTitle: 'Modalità di gioco',
      classic: 'Aste',
      charades: 'Sopravvivenza',
      classicDesc: 'Una sola squadra risponde, in 60 secondi',
      survieDesc: 'Rispondete a turno, chi resta senza risposta perde',
      continueBtn: 'Continua',
      pickModeFirst: 'Scegli prima una modalità di gioco',
    },
    matchSettings: {
      settingsTitle: 'Impostazioni partita',
      teamCount: 'Squadre',
      roundCount: 'Manche',
      timer: 'Timer',
      categoriesTitle: 'Categorie',
      continueBtn: 'Continua',
      pickCategoryFirst: 'Scegli almeno una categoria',
    },
    teams: {
      setupTitle: 'Crea le squadre',
      chooseColor: 'Scegli il colore della squadra',
      chooseName: 'Scegli il nome della squadra',
      namePlaceholder: (n) => `Nome squadra ${n}`,
      inProgress: 'In corso...',
      nextBtn: 'Avanti',
      defaultName: (i) => `Squadra ${i + 1}`,
    },
    comingSoon: {
      subtitle: 'Prossimamente',
      back: 'Indietro',
    },
    pages: {
      shop: 'Negozio',
      rules: 'Regole',
      themes: 'Temi delle domande',
      settings: 'Impostazioni',
      info: 'Info',
    },
    shop: {
      packsTitle: 'Pack di domande',
      earlyAccess: 'Grazie di essere tra i primi! Questi pacchetti oggi sono gratis e in futuro saranno a pagamento: approfittatene.',
      unlock: 'Sblocca',
      unlockA11y: (pack) => `Sblocca ${pack}`,
      questionCount: (n) => `${n} domande`,
      unlocked: 'Pack sbloccato ✓',
      comingSoon: 'Prossimamente',
      packTitles: { 'harry-potter': 'Espresso per Hogwarts', 'rap-francais': 'Rap francese', nintendo: 'Retro gaming', anime: 'Anime e manga' },
      restore: 'Ripristina acquisti',
      restoredTitle: 'Acquisti ripristinati',
      restoredMsg: 'I tuoi pack sono di nuovo sbloccati.',
      nothingToRestore: 'Nessun acquisto da ripristinare per questo ID Apple.',
      errors: {
        load: 'Impossibile caricare i tuoi acquisti.',
        purchase: "L'acquisto non è riuscito. Riprova.",
        restore: 'Il ripristino non è riuscito. Controlla la connessione.',
      },
      back: 'Indietro',
      settings: 'Impostazioni',
      lockedAvailable: 'Disponibile nel negozio',
      goToShop: 'Vai al negozio',
      trialMsg: 'Gioca gratis con questo pack guardando un breve annuncio!',
      trialUsedMsg: 'Hai già provato questo pack. Sbloccalo per continuare a giocarci!',
      watchAd: 'GUARDA UN ANNUNCIO',
      trialBadge: 'PROVA',
      close: 'Chiudi',
      upsellMsg: 'Ti è piaciuto? Tieni questo pack per tutte le tue partite!',
      later: 'PIÙ TARDI',
    },
    gift: {
      welcomeTitle: 'Regalo di benvenuto!',
      welcomeMsg: (pack, games) => `Gioca ${games} partite e il pack «${pack}» è tuo!`,
      doneTitle: 'È tuo!',
      doneMsg: (pack) => `Il pack «${pack}» è sbloccato. Buon divertimento!`,
      ok: 'FANTASTICO',
      progress: (played, total) => `${played} partite su ${total}`,
      lockedMsg: (left) => `Gioca ancora ${left} partit${left > 1 ? 'e' : 'a'} per sbloccare gratis questo pack!`,
      gotIt: 'HO CAPITO',
      nextGoal: (pack, games) => `Prossimo obiettivo: altre ${games} partite per sbloccare «${pack}»!`,
      after: (pack) => `Dopo ${pack}`,
      unlockFirst: (pack) => `Sbloccate prima il regalo gratuito «${pack}» per ottenere questo!`,
    },
    survie: {
      phoneTitle: 'Mettete il telefono al centro',
      phoneMsg: 'Tutte le squadre devono poter vedere lo schermo.',
      phoneGo: 'VIA!',
      validate: 'RISPOSTA GIUSTA',
      validateA11y: 'Risposta giusta',
      noAnswer: 'NESSUNA RISPOSTA',
      timeoutNo: 'NO, ELIMINA',
      timeoutYes: 'SÌ, CONVALIDA',
      passA11y: 'Nessuna risposta — eliminazione',
      clear: 'Cancella',
      someAnswers: 'Alcune risposte possibili',
      elimPassTitle: 'Nessuna risposta?',
      elimPassMsg: 'La squadra sarà eliminata da questa manche.',
      elimTimeoutTitle: 'Tempo scaduto!',
      elimTimeoutMsg: 'La squadra ha risposto in tempo?',
      eliminate: 'ELIMINA',
      resume: 'RIPRENDI',
    },
    final: {
      tie: 'PAREGGIO!',
      victoryOf: 'Vittoria di',
      rematch: 'Rivincita',
      home: 'Menu principale',
    },
    prefs: {
      title: 'Preferenze',
      soundEffects: 'Effetti sonori',
      haptics: 'Vibrazione',
      adChoices: 'Preferenze pubblicitarie',
      language: 'Lingua',
    },
    rules: {
      close: 'Ho capito',
      auctionTitle: 'Modalità Aste',
      auctionSteps: [
        'Appare un tema, ad esempio «Capitali del mondo».',
        'A turno, ogni squadra dice quante risposte sa dare. Rilancia o passa.',
        'La squadra che punta di più deve mantenere la parola. La squadra superata tiene il telefono e conta le risposte giuste.',
        '60 secondi per raggiungere la puntata!',
      ],
      pointsTitle: 'I punti',
      auctionPoints: [
        'Puntata riuscita: ogni squadra che ha puntato guadagna la sua ultima puntata.',
        'Puntata fallita: la squadra che teneva il telefono guadagna i punti della puntata.',
      ],
      survieTitle: 'Modalità Sopravvivenza',
      survieSteps: [
        'Appare un tema, ad esempio «Capitali del mondo».',
        'A turno, ogni squadra ha 10 secondi (regolabili) per dire una risposta nuova.',
        'Risposta convalidata: tocca alla squadra successiva.',
        'Nessuna risposta in tempo, o «Passo»: la squadra è eliminata dalla manche.',
        'La manche continua finché resta una sola squadra.',
      ],
      surviePoints: [
        'Inizio: il montepremi vale 1 punto.',
        'Risposta giusta: il montepremi aumenta di 1 punto.',
        "Fine manche: l'ultima squadra in gioco vince tutto il montepremi.",
      ],
    },
    support: {
      title: 'Assistenza',
      intro: "Un bug, una risposta mancante, un'idea per un tema? Scrivici, ti rispondiamo entro 48 ore.",
      contactBtn: 'Scrivici',
      mailSubject: 'Banco – Assistenza',
      noMailApp: 'Nessuna app di posta trovata. Scrivici a:',
      faqTitle: 'Domande frequenti',
      faq: [
        {
          q: 'Come si gioca?',
          a: 'Create da 2 a 4 squadre, scegliete i temi e poi una modalità. Aste: scommettete quante risposte sapete dare in 60 secondi; se fallite la puntata, i punti vanno agli avversari. Sopravvivenza: dite una risposta a turno; la squadra che resta senza risposta è eliminata.',
        },
        {
          q: 'Una risposta giusta non viene accettata',
          a: 'Il nostro database non contiene tutte le risposte possibili. Tocca «Convalida comunque» per contarla, o «Cerca online» per verificarla. Inviaci la risposta mancante e la aggiungeremo.',
        },
        {
          q: 'Ho cambiato iPhone e i miei pack sono spariti',
          a: "Apri il Negozio e tocca «Ripristina acquisti», con lo stesso ID Apple usato per l'acquisto. Non paghi mai due volte.",
        },
        {
          q: 'Come chiedo un rimborso?',
          a: 'I pagamenti sono gestiti da Apple: invia la richiesta su reportaproblem.apple.com.',
        },
        {
          q: 'Come cambio lingua?',
          a: 'Con il selettore della lingua nella schermata iniziale, o nelle Impostazioni, anche durante la partita. Temi e risposte si adattano automaticamente.',
        },
      ],
      privacy: 'Informativa sulla privacy',
      version: 'Versione',
    },
    result: {
      nextRound: 'MANCHE SUCCESSIVA',
      madeBid: 'avete mantenuto la puntata',
      missedBid: 'avete fallito la puntata',
      toFind: 'Risposte da trovare:',
      foundCount: 'Risposte trovate:',
      eliminated: 'è eliminata',
      pointsAtStake: 'Punti in palio:',
      finalResults: 'RISULTATI',
    },
  },
  // Portugais du Brésil
  pt: {
    tutorial: {
      next: 'Próximo',
      skip: 'Pular',
      done: 'Vamos lá!',
      welcome: 'Bem-vindos ao Banco! Mostro tudo em 30 segundos.',
      shop: 'Esta é a Loja: pacotes de perguntas que vocês ganham jogando.',
      giftFirst: (pack, n) => `Terminem ${n} partidas e o pacote “${pack}” é de vocês, grátis!`,
      giftNext: (pack, n) => `Depois, o contador volta a 0: mais ${n} partidas para “${pack}”. Grátis para os primeiros jogadores, aproveitem!`,
      play: 'Prontos? Tudo começa por este botão.',
      auction: 'Leilão: apostem quantas respostas conseguem dizer. Só uma equipe responde, em 60 segundos.',
      survie: 'Sobrevivência: uma resposta por vez. A equipe que ficar sem ideias está eliminada!',
      teams: 'Aqui é o número de equipes, não de jogadores! Juntem quantos cérebros quiserem em cada equipe: não tem limite. Boa partida!',
    },
    common: {
      cancel: 'CANCELAR',
      quitTitle: 'Sair da partida?',
      quitMsg: 'A partida em andamento será perdida.',
      quit: 'SAIR',
      endTurnTitle: 'Encerrar a vez?',
      endTurnMsg: 'Se a aposta não for atingida, os pontos vão para o adversário.',
      endTurnBtn: 'ENCERRAR',
      pausedTitle: 'Jogo pausado',
      pausedMsg: 'Confiram a resposta e\ncontinuem a partida.',
      auctionSettings: 'Configurações do leilão',
      survieSettings: 'Configurações da sobrevivência',
      selectAll: 'Selecionar tudo',
      deselectAll: 'Desmarcar tudo',
      locked: 'bloqueado',
      answersFound: (n) => (n === 1 ? 'resposta encontrada' : 'respostas encontradas'),
      outOf: (f, t) => `${f} de ${t}`,
      removeAnswer: 'Remover uma resposta',
      addAnswer: 'Contar uma resposta',
      expandQuestion: 'Ampliar a área da pergunta',
      collapseQuestion: 'Reduzir a área da pergunta',
      secondsLeft: (n) => `${n} segundos restantes`,
      decreaseBid: 'Diminuir a aposta',
      bidAmount: 'Valor da aposta',
      increaseBid: 'Aumentar a aposta',
    },
    auction: {
      instruction: 'Vocês terão 60 segundos. Quantas conseguem dizer?',
      opens: 'abre o leilão',
      raises: 'aumenta ou passa',
      bid: (n) => `EU DIGO ${n}`,
      pass: 'PASSO',
      passTurn: 'PASSAR A VEZ',
      concludeAuction: 'ENCERRAR O LEILÃO',
      max: (n) => `Máximo: ${n}`,
    },
    ready: {
      round: 'Rodada',
      target: 'Objetivo:',
      play: 'JOGAR',
      start: 'COMEÇAR',
      holdsPhone: 'segura o celular',
      answers: 'responde',
      wonAuction: 'vence o leilão',
      yourTurn: 'é a vez de vocês jogarem!',
      yourStart: 'vocês começam!',
      yourGo: 'é a vez de vocês responderem!',
    },
    play: {
      searchPlaceholder: 'Verificar uma resposta',
      notInDatabase: (w) => `"${w}" não está na base.`,
      validateAnyway: 'VALIDAR MESMO ASSIM',
      searchOnline: 'PESQUISAR NA INTERNET',
      answerAdded: '✓ Resposta adicionada',
      pause: 'Pausa',
      resume: 'Continuar',
      endTurn: 'Encerrar a vez',
      someAnswers: 'Algumas respostas possíveis...',
      sortPopular: 'Ordenar por popularidade',
      sortAlpha: 'Ordenar em ordem alfabética',
    },
    home: {
      play: 'Jogar',
      shop: 'Loja',
      rules: 'Regras',
      subtitle: 'Aposte no que você sabe!',
    },
    gameMode: {
      modesTitle: 'Modos de jogo',
      classic: 'Leilão',
      charades: 'Sobrevivência',
      classicDesc: 'Só uma equipe responde, em 60 segundos',
      survieDesc: 'Respondam por turnos, quem ficar sem resposta perde',
      continueBtn: 'Continuar',
      pickModeFirst: 'Escolha primeiro um modo de jogo',
    },
    matchSettings: {
      settingsTitle: 'Configurações da partida',
      teamCount: 'Times',
      roundCount: 'Rodadas',
      timer: 'Cronômetro',
      categoriesTitle: 'Categorias',
      continueBtn: 'Continuar',
      pickCategoryFirst: 'Escolha pelo menos uma categoria',
    },
    teams: {
      setupTitle: 'Criar os times',
      chooseColor: 'Escolha a cor do time',
      chooseName: 'Escolha o nome do time',
      namePlaceholder: (n) => `Nome do time ${n}`,
      inProgress: 'Em andamento...',
      nextBtn: 'Próximo',
      defaultName: (i) => `Time ${i + 1}`,
    },
    comingSoon: {
      subtitle: 'Em breve',
      back: 'Voltar',
    },
    pages: {
      shop: 'Loja',
      rules: 'Regras',
      themes: 'Temas das perguntas',
      settings: 'Configurações',
      info: 'Info',
    },
    shop: {
      packsTitle: 'Pacotes de perguntas',
      earlyAccess: 'Obrigado por estar entre os primeiros! Estes pacotes são grátis hoje e depois serão pagos: aproveitem.',
      unlock: 'Desbloquear',
      unlockA11y: (pack) => `Desbloquear ${pack}`,
      questionCount: (n) => `${n} perguntas`,
      unlocked: 'Pacote desbloqueado ✓',
      comingSoon: 'Em breve',
      packTitles: { 'harry-potter': 'Expresso de Hogwarts', 'rap-francais': 'Rap francês', nintendo: 'Retro gaming', anime: 'Anime e mangá' },
      restore: 'Restaurar compras',
      restoredTitle: 'Compras restauradas',
      restoredMsg: 'Seus pacotes estão desbloqueados de novo.',
      nothingToRestore: 'Nenhuma compra para restaurar neste ID Apple.',
      errors: {
        load: 'Não foi possível carregar suas compras.',
        purchase: 'A compra falhou. Tente novamente.',
        restore: 'A restauração falhou. Verifique sua conexão.',
      },
      back: 'Voltar',
      settings: 'Configurações',
      lockedAvailable: 'Disponível na loja',
      goToShop: 'Ir para a loja',
      trialMsg: 'Jogue de graça com este pacote assistindo a um anúncio curto!',
      trialUsedMsg: 'Você já testou este pacote. Desbloqueie para continuar jogando com ele!',
      watchAd: 'VER UM ANÚNCIO',
      trialBadge: 'TESTE',
      close: 'Fechar',
      upsellMsg: 'Gostou? Fique com este pacote em todas as suas partidas!',
      later: 'MAIS TARDE',
    },
    gift: {
      welcomeTitle: 'Presente de boas-vindas!',
      welcomeMsg: (pack, games) => `Jogue ${games} partidas e o pacote «${pack}» é seu!`,
      doneTitle: 'É seu!',
      doneMsg: (pack) => `O pacote «${pack}» está desbloqueado. Divirta-se!`,
      ok: 'DEMAIS',
      progress: (played, total) => `${played} de ${total} partidas`,
      lockedMsg: (left) => `Jogue mais ${left} partida${left > 1 ? 's' : ''} para desbloquear este pacote de graça!`,
      gotIt: 'ENTENDI',
      nextGoal: (pack, games) => `Próximo objetivo: mais ${games} partidas para desbloquear “${pack}”!`,
      after: (pack) => `Depois de ${pack}`,
      unlockFirst: (pack) => `Desbloqueiem primeiro o presente grátis “${pack}” para ganhar este!`,
    },
    survie: {
      phoneTitle: 'Coloquem o celular no meio',
      phoneMsg: 'Todos os times precisam ver a tela.',
      phoneGo: 'VAMOS!',
      validate: 'RESPOSTA CERTA',
      validateA11y: 'Resposta certa',
      noAnswer: 'SEM RESPOSTA',
      timeoutNo: 'NÃO, ELIMINAR',
      timeoutYes: 'SIM, VALIDAR',
      passA11y: 'Sem resposta — eliminação',
      clear: 'Apagar',
      someAnswers: 'Algumas respostas possíveis',
      elimPassTitle: 'Sem resposta?',
      elimPassMsg: 'O time será eliminado desta rodada.',
      elimTimeoutTitle: 'Acabou o tempo!',
      elimTimeoutMsg: 'O time respondeu a tempo?',
      eliminate: 'ELIMINAR',
      resume: 'CONTINUAR',
    },
    final: {
      tie: 'EMPATE!',
      victoryOf: 'Vitória de',
      rematch: 'Revanche',
      home: 'Menu principal',
    },
    prefs: {
      title: 'Preferências',
      soundEffects: 'Efeitos sonoros',
      haptics: 'Vibração',
      adChoices: 'Preferências de anúncios',
      language: 'Idioma',
    },
    rules: {
      close: 'Entendi',
      auctionTitle: 'Modo Leilão',
      auctionSteps: [
        'Aparece um tema, por exemplo «Capitais do mundo».',
        'Cada time, na sua vez, diz quantas respostas consegue dar. Aumente a aposta ou passe.',
        'O time que apostar mais precisa cumprir. O time superado segura o celular e conta as respostas certas.',
        '60 segundos para alcançar a aposta!',
      ],
      pointsTitle: 'Os pontos',
      auctionPoints: [
        'Aposta cumprida: cada time que apostou ganha a sua última aposta.',
        'Aposta perdida: o time que segurava o celular ganha os pontos da aposta.',
      ],
      survieTitle: 'Modo Sobrevivência',
      survieSteps: [
        'Aparece um tema, por exemplo «Capitais do mundo».',
        'Cada time, na sua vez, tem 10 segundos (ajustável) para dizer uma resposta nova.',
        'Resposta validada: é a vez do próximo time.',
        'Sem resposta a tempo, ou «Passo»: o time é eliminado da rodada.',
        'A rodada continua até sobrar um único time.',
      ],
      surviePoints: [
        'Início: o pote vale 1 ponto.',
        'Resposta certa: o pote ganha 1 ponto.',
        'Fim da rodada: o último time em jogo leva o pote inteiro.',
      ],
    },
    support: {
      title: 'Ajuda',
      intro: 'Um bug, uma resposta faltando, uma ideia de tema? Escreva para a gente, respondemos em até 48 h.',
      contactBtn: 'Fale com a gente',
      mailSubject: 'Banco – Ajuda',
      noMailApp: 'Nenhum app de e-mail encontrado. Escreva para:',
      faqTitle: 'Perguntas frequentes',
      faq: [
        {
          q: 'Como se joga?',
          a: 'Criem de 2 a 4 times, escolham os temas e depois um modo. Leilão: apostem quantas respostas conseguem dar em 60 segundos; se perderem a aposta, os pontos vão para o adversário. Sobrevivência: digam uma resposta por turno; o time que ficar sem resposta é eliminado.',
        },
        {
          q: 'Uma resposta certa não é aceita',
          a: 'Nossa base não tem todas as respostas possíveis. Toque em «Validar mesmo assim» para contá-la, ou em «Pesquisar na internet» para conferir. Mande a resposta que faltou e nós a adicionaremos.',
        },
        {
          q: 'Troquei de iPhone e meus pacotes sumiram',
          a: 'Abra a Loja e toque em «Restaurar compras», com o mesmo ID Apple usado na compra. Você nunca paga duas vezes.',
        },
        {
          q: 'Como peço um reembolso?',
          a: 'Os pagamentos são gerenciados pela Apple: faça o pedido em reportaproblem.apple.com.',
        },
        {
          q: 'Como mudo o idioma?',
          a: 'Pelo seletor de idioma na tela inicial ou nas Configurações, até no meio da partida. Os temas e as respostas se adaptam automaticamente.',
        },
      ],
      privacy: 'Política de privacidade',
      version: 'Versão',
    },
    result: {
      nextRound: 'PRÓXIMA RODADA',
      madeBid: 'vocês cumpriram a aposta',
      missedBid: 'vocês perderam a aposta',
      toFind: 'Respostas para encontrar:',
      foundCount: 'Respostas encontradas:',
      eliminated: 'foi eliminado',
      pointsAtStake: 'Pontos em jogo:',
      finalResults: 'RESULTADOS',
    },
  },
};

export function getT(lang: Lang): Translations {
  return translations[lang];
}
