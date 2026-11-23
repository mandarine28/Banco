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
  /** Défi du jour et mode solo. */
  daily: {
    /** Pour les dates (toLocaleDateString). */
    locale: string;
    title: string;
    titleDone: string;
    dateLabel: (date: string) => string;
    instructionDaily: (seconds: number) => string;
    instructionSolo: (seconds: number) => string;
    streakOn: (days: number) => string;
    comeBackDaily: string;
    record: (n: number) => string;
    noRecord: string;
    finished: string;
    foundLabel: string;
    foundCount: (n: number) => string;
    miss: string;
    placeholder: string;
    inputA11y: string;
    endA11y: string;
    alreadyPlayed: string;
    streak: string;
    recordLabel: string;
    newRecord: string;
    comeBackTomorrow: string;
    share: string;
    replay: string;
    shareMsg: (date: string, score: number, seconds: number, streak: number, url: string) => string;
    cardPlayed: (n: number) => string;
    cardStreak: (days: number) => string;
    historyTitle: string;
    played: string;
    best: string;
    empty: string;
    sortBy: string;
    sortDate: string;
    sortScore: string;
    /** Bouton qui déroule le choix du tri. */
    filter: string;
    recentTitle: string;
    seeAll: string;
    allTitle: string;
    bestThemes: string;
    themeCount: (n: number) => string;
    average: (n: number) => string;
    prevPeriod: string;
    nextPeriod: string;
    /** Bascule du calendrier : mois entier / deux dernières semaines. */
    monthView: string;
    weeksView: string;
    /** Titre du choix rapide du mois (toucher le mois du calendrier). */
    pickMonth: string;
    notSaved: string;
    noneFound: string;
    reminderTitle: string;
    reminderStreak: (days: number) => string;
    reminderNew: (seconds: number) => string;
    channel: string;
  };
  /** « Chacun pour soi » : les textes où « équipe » devient « joueur » (voir sideTexts). */
  players: {
    modeTeams: string;
    modeSolo: string;
    teams: Pick<
      Translations['teams'],
      'chooseColor' | 'chooseName' | 'removeTeamTitle' | 'clearTitle' | 'resetBtn' | 'namePlaceholder' | 'addTeam' | 'minTeams' | 'defaultName'
    >;
    survie: Pick<Translations['survie'], 'phoneMsg' | 'endRoundMsg' | 'elimPassMsg' | 'elimTimeoutMsg'>;
  };
  tutorial: {
    next: string;
    skip: string;
    done: string;
    welcome: string;
    shop: string;
    giftFirst: (pack: string, games: number) => string;

    morePacks: (count: number) => string;
    play: string;
    auction: string;
    survie: string;
    teams: string;
  };
  common: {
    cancel: string;
    /** Fenêtre « nouvelle version sur l'App Store » au lancement. */
    updateTitle: string;
    updateMsg: string;
    updateBtn: string;
    /** Fenêtre « nouveautés » au lancement, pour les joueurs existants. */
    whatsNewTitle: string;
    whatsNewMsg: string;
    whatsNewBtn: string;
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
    /** Sous le mot introuvable : la liste n'est qu'un échantillon, on peut vérifier soi-même. */
    notInDatabaseHint: string;
    validateAnyway: string;
    /** Chrono à zéro en Enchères : une réponse lancée in extremis reste à cocher. */
    lastSecondMsg: string;
    lastSecondYes: string;
    lastSecondNo: string;
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
    /** Deux pastilles courtes sous le ticket de chaque mode. */
    survieChips: [string, string];
    auctionChips: [string, string];
    /** Bouton du bas une fois le mode choisi. */
    playSurvie: string;
    playAuction: string;
  };
  matchSettings: {
    settingsTitle: string;
    teamCount: string;
    roundCount: string;
    timer: string;
    /** Légendes de l'illustration du chrono de survie (bouton info). */
    timerInfoFixed: string;
    timerInfoTurbo: string;
    categoriesTitle: string;
    /** Bandeau des packs offerts, façon passe de combat. */
    specialPacks: string;
    seeAllPacks: string;
    classicCategories: string;
    /** Fenêtre « Tout voir » : comment on gagne les packs offerts. */
    packsHowTo: (games: number) => string;
    /** Pack offert pas encore gagné : parties restantes. */
    freeIn: (games: number) => string;
    /** Version courte pour les vignettes : « 3 parties ». */
    gamesCount: (games: number) => string;
    questionsCount: (count: number) => string;
    tryPack: string;
    continueBtn: string;
    pickCategoryFirst: string;
  };
  teams: {
    setupTitle: string;
    chooseColor: (team: number) => string;
    chooseName: (team: number) => string;
    /** Lecteur d'écran : croix qui supprime une équipe. */
    removeTeam: (team: string) => string;
    /** Fenêtre de confirmation avant de supprimer une équipe. */
    removeTeamTitle: string;
    removeTeamConfirm: string;
    /** Poubelle de « Qui joue ? » : repartir d'équipes vides. */
    clearTitle: string;
    clearConfirm: string;
    /** Bouton sous les onglets de « Comment on joue ? ». */
    resetBtn: string;
    namePlaceholder: (n: number) => string;
    nextBtn: string;
    addTeam: string;
    /** « Suivant » touché avec une seule équipe. */
    minTeams: string;
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
    lockedTrialMsg: (left: number) => string;
    lockedTrialUsedMsg: (left: number) => string;
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
    endRoundTitle: string;
    endRoundMsg: string;
    endRoundBtn: string;
    elimPassMsg: string;
    elimTimeoutTitle: string;
    elimTimeoutMsg: string;
    eliminate: string;
    resume: string;
    phoneTitle: string;
    phoneMsg: string;
    phoneGo: string;
    /** Écran prêt après une élimination : équipes encore en jeu. */
    stillIn: string;
  };
  final: {
    leaveTitle: string;
    /** Bandeau de l'écran final des Enchères. */
    gameOver: string;
    /** Fin de partie : retour au choix du mode, équipes gardées. */
    otherMode: string;
    tie: string;
    victoryOf: string;
    rematch: string;
    home: string;
    share: string;
    shareWin: (team: string) => string;
    shareTie: string;
    shareInvite: string;
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
    daily: {
      locale: 'fr-FR',
      title: 'Défi du jour',
      titleDone: 'Défi du jour réussi',
      dateLabel: (date) => `Défi du ${date}`,
      instructionDaily: (s) => `${s} secondes pour en citer un maximum. Même question pour tout le monde aujourd’hui, une seule tentative.`,
      instructionSolo: (s) => `${s} secondes pour en citer un maximum.`,
      streakOn: (d) => `Série en cours : ${d} jours`,
      comeBackDaily: 'Reviens chaque jour pour faire grimper ta série.',
      record: (n) => `Ton record : ${n} réponses`,
      noRecord: 'Pas encore de record',
      finished: 'C’est terminé !',
      foundLabel: 'Réponses trouvées',
      foundCount: (n) => `${n} réponses trouvées`,
      miss: 'Pas dans notre liste, ou déjà trouvée',
      placeholder: 'Tape une réponse…',
      inputA11y: 'Ta réponse',
      endA11y: 'Terminer',
      alreadyPlayed: 'Tu as déjà joué le défi d’aujourd’hui.',
      streak: 'Série',
      recordLabel: 'Record',
      newRecord: 'Nouveau !',
      comeBackTomorrow: 'Reviens demain pour un nouveau défi.',
      share: 'Partager mon score',
      replay: 'Rejouer',
      shareMsg: (date, score, s, streak, url) => `Défi Bango du ${date} : ${score} réponses en ${s} s 🔥${streak > 1 ? ` · série de ${streak} jours` : ''}\nÀ toi de battre ça : ${url}`,
      cardPlayed: (n) => `${n} réponses · reviens demain`,
      cardStreak: (d) => `série de ${d} jours`,
      historyTitle: 'Défis quotidiens',
      played: 'Défis joués',
      best: 'Meilleur score',
      empty: 'Joue ton premier défi pour commencer ton suivi.',
      sortBy: 'Trier par',
      sortDate: 'Date',
      sortScore: "Réussite",
      filter: 'Filtrer',
      recentTitle: "Défis réalisés",
      seeAll: "Voir tout",
      allTitle: "Tous mes défis",
      bestThemes: "Thèmes les mieux réussis",
      themeCount: (n) => `${n} ${n > 1 ? "défis" : "défi"}`,
      average: (n) => `moyenne ${n}`,
      prevPeriod: "Précédent",
      nextPeriod: "Suivant",
      monthView: "Voir le mois",
      weeksView: "Voir 2 semaines",
      pickMonth: "Choisir le mois",
      notSaved: 'Réponses non enregistrées pour ce défi',
      noneFound: 'Aucune réponse trouvée',
      reminderTitle: 'Défi du jour 🔥',
      reminderStreak: (d) => `Ta série de ${d} jours t’attend, ne la laisse pas filer !`,
      reminderNew: (s) => `Un nouveau défi t’attend : combien de réponses en ${s} secondes ?`,
      channel: 'Défi du jour',
    },
    players: {
      modeTeams: "Équipe",
      modeSolo: "Individuel",
      teams: {
        chooseColor: (n) => `Choisissez la couleur du joueur ${n}`,
        chooseName: (n) => `Choisissez le nom du joueur ${n}`,
        removeTeamTitle: "Retirer ce joueur ?",
        clearTitle: "Réinitialiser les joueurs ?",
        resetBtn: "Réinitialiser les joueurs",
        namePlaceholder: (n) => `Nom du joueur ${n}`,
        addTeam: "Ajouter un joueur",
        minTeams: "Il faut au moins 2 joueurs pour jouer",
        defaultName: (i) => `Joueur ${i + 1}`,
      },
      survie: {
        phoneMsg: "Tous les joueurs doivent pouvoir voir l’écran.",
        endRoundMsg: "Aucun joueur ne remporte les points en jeu.",
        elimPassMsg: "Le joueur sera éliminé de cette manche.",
        elimTimeoutMsg: "Le joueur a-t-il répondu à temps ?",
      },
    },
    tutorial: {
      next: 'Suivant',
      skip: 'Passer',
      done: 'C\'est parti !',
      welcome: 'Bienvenue dans Bango ! Je vous fais faire le tour en 30 secondes.',
      shop: 'Ici, la Boutique : des packs de questions à gagner en jouant.',
      giftFirst: (pack, n) => (n > 1 ? `Terminez ${n} parties et le pack « ${pack} » est à vous, offert !` : `Terminez une partie et le pack « ${pack} » est à vous, offert !`),

      morePacks: (n) => `Et ce n’est pas tout : ${n} packs sont à débloquer en jouant, l’un après l’autre. Regardez !`,
      play: 'Prêts ? Tout commence par ce bouton.',
      auction: 'Enchères : misez sur le nombre de réponses que vous pouvez citer. Une seule équipe répond, en 60 secondes.',
      survie: 'Survie : une réponse chacun son tour. L\'équipe qui n\'a plus d\'idée est éliminée !',
      teams: "Jouez en équipe ou en individuel (jusqu'à 10 joueurs). En équipe, réunissez autant de cerveaux que vous voulez dans chacune : il n'y a pas de limite. Bonne partie !",
    },
    common: {
      cancel: 'ANNULER',
      updateTitle: 'Nouvelles questions et packs !',
      updateMsg: 'Une mise à jour vous attend pour en profiter.',
      updateBtn: 'METTRE À JOUR',
      whatsNewTitle: 'Nouveautés !',
      whatsNewMsg: 'Nouveau pack Football à gagner en jouant ! Et chaque pack pas encore gagné peut maintenant s’essayer le temps d’une partie.',
      whatsNewBtn: 'DÉCOUVRIR',
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
      notInDatabase: (w) => `« ${w} » ? Pas dans notre liste !`,
      notInDatabaseHint: "Notre liste n'est pas une encyclopédie. Vérifiez : la partie vous attend.",
      validateAnyway: 'Valider quand même',
      lastSecondMsg: "Une bonne réponse a-t-elle été donnée au dernier moment ?",
      lastSecondYes: 'OUI, AJOUTER',
      lastSecondNo: 'NON, TERMINER',
      answerAdded: '✓ Réponse ajoutée',
      pause: 'Pause',
      resume: 'Reprendre',
      endTurn: 'Terminer le tour',
      someAnswers: 'Quelques réponses possibles...',
      sortPopular: 'Les plus connues',
      sortAlpha: 'De A à Z',
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
      survieChips: ['Chacun son tour', 'Qui sèche perd'],
      auctionChips: ['Misez juste', '60 secondes'],
      playSurvie: 'Jouer en Survie',
      playAuction: 'Jouer aux Enchères',
    },
    matchSettings: {
      settingsTitle: 'Paramètre de jeux',
      teamCount: 'Équipes',
      roundCount: 'Manches',
      timer: 'Chrono',
      timerInfoFixed: 'Même temps à chaque tour',
      timerInfoTurbo: '2 s de moins à chaque tour',
      categoriesTitle: 'Catégories',
      specialPacks: 'Packs spéciaux',
      seeAllPacks: 'Tout voir',
      classicCategories: 'Classique',
      packsHowTo: (games) => (games > 1 ? `Jouez pour les débloquer : un pack offert toutes les ${games} parties.` : 'Jouez pour les débloquer : un pack offert à chaque partie terminée.'),
      freeIn: (n) => `Offert dans ${n} partie${n > 1 ? 's' : ''}`,
      gamesCount: (n) => `${n} partie${n > 1 ? 's' : ''}`,
      questionsCount: (n) => `${n} questions`,
      tryPack: 'Essayer',
      continueBtn: 'Continuer',
      pickCategoryFirst: 'Choisissez au moins une catégorie',
    },
    teams: {
      setupTitle: "Comment on joue ?",
      chooseColor: (n) => `Choisissez la couleur de l'équipe ${n}`,
      chooseName: (n) => `Choisissez le nom de l'équipe ${n}`,
      removeTeam: (team) => `Supprimer ${team}`,
      removeTeamTitle: 'Supprimer cette équipe ?',
      removeTeamConfirm: 'SUPPRIMER',
      clearTitle: "Réinitialiser les équipes ?",
      clearConfirm: "RÉINITIALISER",
      resetBtn: "Réinitialiser les équipes",
      namePlaceholder: (n) => `Nom de l'équipe ${n}`,
      nextBtn: 'Suivant',
      addTeam: 'Ajouter une équipe',
      minTeams: 'Il faut au moins 2 équipes pour jouer',
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
      earlyAccess: "Merci d'être parmi les premiers ! Ces packs sont offerts aujourd'hui : débloquez-les avant qu'ils deviennent payants.",
      unlock: 'Débloquer',
      unlockA11y: (pack) => `Débloquer ${pack}`,
      questionCount: (n) => `${n} questions`,
      unlocked: 'Pack débloqué ✓',
      comingSoon: 'Bientôt disponible',
      packTitles: { 'harry-potter': 'Poudlard Express', 'rap-francais': 'Rap français', dresseur: 'Meilleur dresseur', 'art-litterature': 'Art & littérature', 'retro-gaming': 'Rétro-gaming', anime: 'Anime & mangas', football: 'Football', 'dessins-animes': 'Dessins animés', 'jeux-video': 'Jeux vidéo', cuisine: 'Cuisine', auto: 'Auto & mécanique' },
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
      welcomeMsg: (pack, games) => (games > 1 ? `Jouez ${games} parties et le pack « ${pack} » est à vous !` : `Jouez une partie et le pack « ${pack} » est à vous !`),
      doneTitle: "C'est à vous !",
      doneMsg: (pack) => `Le pack « ${pack} » est débloqué. Bonne partie !`,
      ok: 'SUPER',
      progress: (played, total) => `${played} partie${played > 1 ? 's' : ''} sur ${total}`,
      lockedMsg: (left) => `Jouez encore ${left} partie${left > 1 ? 's' : ''} pour débloquer ce pack offert !`,
      lockedTrialMsg: (left) => `Plus que ${left} partie${left > 1 ? 's' : ''} avant de le débloquer. Envie de le découvrir tout de suite ? Une courte vidéo vous offre une partie d'essai, une seule fois.`,
      lockedTrialUsedMsg: (left) => `Votre partie d'essai a déjà été jouée. Plus que ${left} partie${left > 1 ? 's' : ''} avant de le débloquer !`,
      gotIt: 'COMPRIS',
      nextGoal: (pack, games) => (games > 1 ? `Prochain objectif : encore ${games} parties pour débloquer « ${pack} » !` : `Prochain objectif : une partie de plus pour débloquer « ${pack} » !`),
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
      timeoutYes: "OUI, BONNE RÉPONSE",
      passA11y: 'Pas de réponse — élimination',
      clear: 'Effacer',
      someAnswers: 'Quelques réponses qui étaient possibles',
      elimPassTitle: 'Pas de réponse ?',
      endRoundTitle: 'Terminer la manche ?',
      endRoundMsg: 'Aucune équipe ne remporte les points en jeu.',
      endRoundBtn: 'TERMINER',
      elimPassMsg: "L'équipe sera éliminée de cette manche.",
      elimTimeoutTitle: 'Temps écoulé !',
      elimTimeoutMsg: "L'équipe a-t-elle répondu à temps ?",
      eliminate: 'ÉLIMINER',
      resume: 'REPRENDRE',
      stillIn: "Encore en lice",
    },
    final: {
      leaveTitle: "Retour au menu ?",
      gameOver: "FIN DE LA PARTIE",
      otherMode: "Autre mode",
      tie: 'ÉGALITÉ !',
      victoryOf: 'Victoire de',
      rematch: 'Revanche',
      home: 'Menu principal',
      share: 'Partager le résultat',
      shareWin: (team) => `🏆 Victoire de ${team} sur Bango !`,
      shareTie: '🤝 Égalité parfaite sur Bango !',
      shareInvite: 'Viens jouer avec nous :',
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
        'Chaque équipe, à son tour, cite une nouvelle réponse. Chrono Turbo (réglable) : 15 secondes, puis 2 de moins à chaque tour de table.',
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
      mailSubject: 'Bango – Assistance',
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
    daily: {
      locale: 'en-GB',
      title: 'Daily challenge',
      titleDone: 'Daily challenge done',
      dateLabel: (date) => `Challenge of ${date}`,
      instructionDaily: (s) => `${s} seconds to name as many as you can. Same question for everyone today, one attempt only.`,
      instructionSolo: (s) => `${s} seconds to name as many as you can.`,
      streakOn: (d) => `Current streak: ${d} days`,
      comeBackDaily: 'Come back every day to grow your streak.',
      record: (n) => `Your record: ${n} answers`,
      noRecord: 'No record yet',
      finished: 'It’s over!',
      foundLabel: 'Answers found',
      foundCount: (n) => `${n} answers found`,
      miss: 'Not in our list, or already found',
      placeholder: 'Type an answer…',
      inputA11y: 'Your answer',
      endA11y: 'Finish',
      alreadyPlayed: 'You’ve already played today’s challenge.',
      streak: 'Streak',
      recordLabel: 'Record',
      newRecord: 'New!',
      comeBackTomorrow: 'Come back tomorrow for a new challenge.',
      share: 'Share my score',
      replay: 'Play again',
      shareMsg: (date, score, s, streak, url) => `Bango challenge of ${date}: ${score} answers in ${s} s 🔥${streak > 1 ? ` · ${streak}-day streak` : ''}\nCan you beat that? ${url}`,
      cardPlayed: (n) => `${n} answers · come back tomorrow`,
      cardStreak: (d) => `${d}-day streak`,
      historyTitle: 'Daily challenges',
      played: 'Challenges played',
      best: 'Best score',
      empty: 'Play your first challenge to start tracking.',
      sortBy: 'Sort by',
      sortDate: 'Date',
      sortScore: "Success",
      filter: 'Filter',
      recentTitle: "Completed challenges",
      seeAll: "See all",
      allTitle: "All my challenges",
      bestThemes: "Best themes",
      themeCount: (n) => `${n} ${n > 1 ? "challenges" : "challenge"}`,
      average: (n) => `average ${n}`,
      prevPeriod: "Previous",
      nextPeriod: "Next",
      monthView: "Show month",
      weeksView: "Show 2 weeks",
      pickMonth: "Choose a month",
      notSaved: 'Answers not saved for this challenge',
      noneFound: 'No answers found',
      reminderTitle: 'Daily challenge 🔥',
      reminderStreak: (d) => `Your ${d}-day streak is waiting, don’t let it slip!`,
      reminderNew: (s) => `A new challenge awaits: how many answers in ${s} seconds?`,
      channel: 'Daily challenge',
    },
    players: {
      modeTeams: "Team",
      modeSolo: "Individual",
      teams: {
        chooseColor: (n) => `Choose player ${n}'s color`,
        chooseName: (n) => `Choose player ${n}'s name`,
        removeTeamTitle: "Remove this player?",
        clearTitle: "Reset the players?",
        resetBtn: "Reset the players",
        namePlaceholder: (n) => `Player ${n} name`,
        addTeam: "Add a player",
        minTeams: "You need at least 2 players to play",
        defaultName: (i) => `Player ${i + 1}`,
      },
      survie: {
        phoneMsg: "Every player must be able to see the screen.",
        endRoundMsg: "No player wins the points at stake.",
        elimPassMsg: "The player will be out for this round.",
        elimTimeoutMsg: "Did the player answer in time?",
      },
    },
    tutorial: {
      next: 'Next',
      skip: 'Skip',
      done: 'Let\'s go!',
      welcome: 'Welcome to Bango! Let me show you around in 30 seconds.',
      shop: 'This is the Shop: question packs you earn by playing.',
      giftFirst: (pack, n) => (n > 1 ? `Finish ${n} games and the “${pack}” pack is yours, free!` : `Finish one game and the “${pack}” pack is yours, free!`),

      morePacks: (n) => `And that’s not all: ${n} packs to unlock by playing, one after another. Take a look!`,
      play: 'Ready? It all starts with this button.',
      auction: 'Auctions: bet on how many answers you can name. Only one team answers, in 60 seconds.',
      survie: 'Survival: one answer each, in turn. The team that runs out of ideas is out!',
      teams: "Play as a team or individually (up to 10 players). In teams, gather as many brains as you like in each one: there's no limit. Have a great game!",
    },
    common: {
      cancel: 'CANCEL',
      updateTitle: 'New questions & packs!',
      updateMsg: 'An update is waiting for you so you can enjoy them.',
      updateBtn: 'UPDATE',
      whatsNewTitle: 'What\'s new?',
      whatsNewMsg: 'New Football pack to earn by playing! And any pack you haven’t earned yet can now be tried for one game.',
      whatsNewBtn: 'DISCOVER',
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
      notInDatabase: (w) => `"${w}"? Not on our list!`,
      notInDatabaseHint: "Our list isn't an encyclopedia. Go check, the game will wait.",
      validateAnyway: 'Validate anyway',
      lastSecondMsg: "Was a right answer given at the last second?",
      lastSecondYes: 'YES, ADD IT',
      lastSecondNo: 'NO, END TURN',
      answerAdded: '✓ Answer added',
      pause: 'Pause',
      resume: 'Resume',
      endTurn: 'End turn',
      someAnswers: 'A few possible answers...',
      sortPopular: 'Most popular',
      sortAlpha: 'A to Z',
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
      survieChips: ['Take turns', 'Go blank, you lose'],
      auctionChips: ['Bet right', '60 seconds'],
      playSurvie: 'Play Survival',
      playAuction: 'Play Auctions',
    },
    matchSettings: {
      settingsTitle: 'Game settings',
      teamCount: 'Teams',
      roundCount: 'Rounds',
      timer: 'Timer',
      timerInfoFixed: 'Same time every turn',
      timerInfoTurbo: '2 s less every round',
      categoriesTitle: 'Categories',
      specialPacks: 'Special packs',
      seeAllPacks: 'See all',
      classicCategories: 'Classic',
      packsHowTo: (games) => (games > 1 ? `Play to unlock them: a free pack every ${games} games.` : 'Play to unlock them: a free pack for every game you finish.'),
      freeIn: (n) => `Free in ${n} game${n > 1 ? 's' : ''}`,
      gamesCount: (n) => `${n} game${n > 1 ? 's' : ''}`,
      questionsCount: (n) => `${n} questions`,
      tryPack: 'Try it',
      continueBtn: 'Continue',
      pickCategoryFirst: 'Choose at least one category',
    },
    teams: {
      setupTitle: "How do we play?",
      chooseColor: (n) => `Choose team ${n}'s colour`,
      chooseName: (n) => `Choose team ${n}'s name`,
      removeTeam: (team) => `Remove ${team}`,
      removeTeamTitle: 'Remove this team?',
      removeTeamConfirm: 'REMOVE',
      clearTitle: "Reset the teams?",
      clearConfirm: "RESET",
      resetBtn: "Reset the teams",
      namePlaceholder: (n) => `Team ${n} name`,
      nextBtn: 'Next',
      addTeam: 'Add a team',
      minTeams: 'You need at least 2 teams to play',
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
      earlyAccess: "Thanks for being one of the first! These packs are free today: unlock them before they become paid.",
      unlock: 'Unlock',
      unlockA11y: (pack) => `Unlock ${pack}`,
      questionCount: (n) => `${n} questions`,
      unlocked: 'Pack unlocked ✓',
      comingSoon: 'Coming soon',
      packTitles: { 'harry-potter': 'Hogwarts Express', 'rap-francais': 'French Rap', dresseur: 'The Very Best Trainer', 'art-litterature': 'Art & Literature', 'retro-gaming': 'Retro gaming', anime: 'Anime & manga', football: 'Football', 'dessins-animes': 'Cartoons', 'jeux-video': 'Video games', cuisine: 'Cooking', auto: 'Cars & mechanics' },
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
      welcomeMsg: (pack, games) => (games > 1 ? `Play ${games} games and the "${pack}" pack is yours!` : `Play one game and the "${pack}" pack is yours!`),
      doneTitle: "It's yours!",
      doneMsg: (pack) => `The "${pack}" pack is unlocked. Have fun!`,
      ok: 'GREAT',
      progress: (played, total) => `${played} of ${total} games`,
      lockedMsg: (left) => `Play ${left} more game${left > 1 ? 's' : ''} to unlock this free pack!`,
      lockedTrialMsg: (left) => `Just ${left} more game${left > 1 ? 's' : ''} to unlock it. Can't wait? A short video gets you one trial game, once only.`,
      lockedTrialUsedMsg: (left) => `You've already played your trial game. Just ${left} more game${left > 1 ? 's' : ''} to unlock it!`,
      gotIt: 'GOT IT',
      nextGoal: (pack, games) => (games > 1 ? `Next goal: ${games} more games to unlock “${pack}”!` : `Next goal: one more game to unlock “${pack}”!`),
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
      timeoutYes: "YES, RIGHT ANSWER",
      passA11y: 'No answer — elimination',
      clear: 'Clear',
      someAnswers: 'Some possible answers',
      elimPassTitle: 'No answer?',
      endRoundTitle: 'End the round?',
      endRoundMsg: 'No team wins the points at stake.',
      endRoundBtn: 'END ROUND',
      elimPassMsg: 'The team will be out for this round.',
      elimTimeoutTitle: "Time's up!",
      elimTimeoutMsg: 'Did the team answer in time?',
      eliminate: 'ELIMINATE',
      resume: 'RESUME',
      stillIn: "Still in the game",
    },
    final: {
      leaveTitle: "Back to the menu?",
      gameOver: "GAME OVER",
      otherMode: "Other mode",
      tie: 'IT\'S A TIE!',
      victoryOf: 'Victory for',
      rematch: 'Rematch',
      home: 'Main menu',
      share: 'Share the result',
      shareWin: (team) => `🏆 ${team} wins at Bango!`,
      shareTie: '🤝 A perfect tie at Bango!',
      shareInvite: 'Come play with us:',
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
        'Each team, in turn, names a new answer. Turbo timer (adjustable): 15 seconds, then 2 less each time round the table.',
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
      mailSubject: 'Bango – Support',
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
    daily: {
      locale: 'de-DE',
      title: 'Tages-Challenge',
      titleDone: 'Tages-Challenge geschafft',
      dateLabel: (date) => `Challenge vom ${date}`,
      instructionDaily: (s) => `${s} Sekunden, um so viele wie möglich zu nennen. Heute dieselbe Frage für alle, nur ein Versuch.`,
      instructionSolo: (s) => `${s} Sekunden, um so viele wie möglich zu nennen.`,
      streakOn: (d) => `Aktuelle Serie: ${d} Tage`,
      comeBackDaily: 'Komm jeden Tag wieder, damit deine Serie wächst.',
      record: (n) => `Dein Rekord: ${n} Antworten`,
      noRecord: 'Noch kein Rekord',
      finished: 'Vorbei!',
      foundLabel: 'Gefundene Antworten',
      foundCount: (n) => `${n} Antworten gefunden`,
      miss: 'Nicht in unserer Liste oder schon gefunden',
      placeholder: 'Antwort eingeben…',
      inputA11y: 'Deine Antwort',
      endA11y: 'Beenden',
      alreadyPlayed: 'Du hast die heutige Challenge schon gespielt.',
      streak: 'Serie',
      recordLabel: 'Rekord',
      newRecord: 'Neu!',
      comeBackTomorrow: 'Komm morgen für eine neue Challenge wieder.',
      share: 'Meinen Score teilen',
      replay: 'Nochmal spielen',
      shareMsg: (date, score, s, streak, url) => `Bango-Challenge vom ${date}: ${score} Antworten in ${s} s 🔥${streak > 1 ? ` · Serie von ${streak} Tagen` : ''}\nSchaffst du mehr? ${url}`,
      cardPlayed: (n) => `${n} Antworten · bis morgen`,
      cardStreak: (d) => `Serie von ${d} Tagen`,
      historyTitle: 'Tägliche Challenges',
      played: 'Gespielte Challenges',
      best: 'Bester Score',
      empty: 'Spiel deine erste Challenge, um deinen Verlauf zu starten.',
      sortBy: 'Sortieren nach',
      sortDate: 'Datum',
      sortScore: "Erfolg",
      filter: 'Filtern',
      recentTitle: "Gespielte Challenges",
      seeAll: "Alle ansehen",
      allTitle: "Alle meine Challenges",
      bestThemes: "Beste Themen",
      themeCount: (n) => `${n} ${n > 1 ? "Challenges" : "Challenge"}`,
      average: (n) => `Schnitt ${n}`,
      prevPeriod: "Zurück",
      nextPeriod: "Weiter",
      monthView: "Ganzen Monat zeigen",
      weeksView: "2 Wochen zeigen",
      pickMonth: "Monat wählen",
      notSaved: 'Antworten für diese Challenge nicht gespeichert',
      noneFound: 'Keine Antwort gefunden',
      reminderTitle: 'Tages-Challenge 🔥',
      reminderStreak: (d) => `Deine Serie von ${d} Tagen wartet, lass sie nicht abreißen!`,
      reminderNew: (s) => `Eine neue Challenge wartet: Wie viele Antworten in ${s} Sekunden?`,
      channel: 'Tages-Challenge',
    },
    players: {
      modeTeams: "Team",
      modeSolo: "Einzeln",
      teams: {
        chooseColor: (n) => `Farbe von Spieler ${n} wählen`,
        chooseName: (n) => `Name von Spieler ${n} wählen`,
        removeTeamTitle: "Diesen Spieler entfernen?",
        clearTitle: "Spieler zurücksetzen?",
        resetBtn: "Spieler zurücksetzen",
        namePlaceholder: (n) => `Name Spieler ${n}`,
        addTeam: "Spieler hinzufügen",
        minTeams: "Ihr braucht mindestens 2 Spieler zum Spielen",
        defaultName: (i) => `Spieler ${i + 1}`,
      },
      survie: {
        phoneMsg: "Alle Spieler müssen den Bildschirm sehen können.",
        endRoundMsg: "Kein Spieler gewinnt die Punkte im Spiel.",
        elimPassMsg: "Der Spieler scheidet in dieser Runde aus.",
        elimTimeoutMsg: "Hat der Spieler rechtzeitig geantwortet?",
      },
    },
    tutorial: {
      next: 'Weiter',
      skip: 'Überspringen',
      done: 'Los geht\'s!',
      welcome: 'Willkommen bei Bango! Ich zeige euch in 30 Sekunden alles.',
      shop: 'Das ist der Shop: Fragenpakete, die ihr beim Spielen gewinnt.',
      giftFirst: (pack, n) => (n > 1 ? `Spielt ${n} Partien zu Ende und das Paket „${pack}“ gehört euch, gratis!` : `Spielt eine Partie zu Ende und das Paket „${pack}“ gehört euch, gratis!`),

      morePacks: (n) => `Und das ist nicht alles: ${n} Pakete warten darauf, beim Spielen freigeschaltet zu werden, eines nach dem anderen. Schaut mal!`,
      play: 'Bereit? Alles beginnt mit diesem Button.',
      auction: 'Auktionen: Wettet, wie viele Antworten ihr nennen könnt. Nur ein Team antwortet, in 60 Sekunden.',
      survie: 'Überleben: Abwechselnd eine Antwort. Wem nichts mehr einfällt, der fliegt raus!',
      teams: "Spielt im Team oder einzeln (bis zu 10 Spieler). Im Team holt ihr so viele kluge Köpfe dazu, wie ihr wollt: Es gibt kein Limit. Viel Spaß beim Spielen!",
    },
    common: {
      cancel: 'ABBRECHEN',
      updateTitle: 'Neue Fragen & Packs!',
      updateMsg: 'Ein Update wartet auf dich, damit du sie spielen kannst.',
      updateBtn: 'AKTUALISIEREN',
      whatsNewTitle: 'Was ist neu?',
      whatsNewMsg: 'Neues Fußball-Paket, das ihr beim Spielen gewinnt! Und jedes noch nicht gewonnene Paket lässt sich jetzt eine Partie lang testen.',
      whatsNewBtn: 'ENTDECKEN',
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
      notInDatabase: (w) => `„${w}"? Nicht auf unserer Liste!`,
      notInDatabaseHint: 'Unsere Liste ist kein Lexikon. Schaut nach, das Spiel wartet.',
      validateAnyway: 'Trotzdem bestätigen',
      lastSecondMsg: "Wurde in letzter Sekunde noch eine richtige Antwort gegeben?",
      lastSecondYes: 'JA, HINZUFÜGEN',
      lastSecondNo: 'NEIN, BEENDEN',
      answerAdded: '✓ Antwort hinzugefügt',
      pause: 'Pause',
      resume: 'Weiter',
      endTurn: 'Runde beenden',
      someAnswers: 'Einige mögliche Antworten...',
      sortPopular: 'Bekannteste',
      sortAlpha: 'Von A bis Z',
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
      survieChips: ['Abwechselnd', 'Wer passt, verliert'],
      auctionChips: ['Richtig bieten', '60 Sekunden'],
      playSurvie: 'Überleben spielen',
      playAuction: 'Auktionen spielen',
    },
    matchSettings: {
      settingsTitle: 'Spieleinstellungen',
      teamCount: 'Teams',
      roundCount: 'Runden',
      timer: 'Timer',
      timerInfoFixed: 'Jede Runde gleich viel Zeit',
      timerInfoTurbo: 'Jede Runde 2 s weniger',
      categoriesTitle: 'Kategorien',
      specialPacks: 'Spezialpakete',
      seeAllPacks: 'Alle ansehen',
      classicCategories: 'Klassisch',
      packsHowTo: (games) => (games > 1 ? `Spielen Sie, um sie freizuschalten: alle ${games} Spiele ein Gratis-Paket.` : 'Spielen Sie, um sie freizuschalten: für jedes beendete Spiel ein Gratis-Paket.'),
      freeIn: (n) => `Gratis in ${n} ${n > 1 ? 'Spielen' : 'Spiel'}`,
      gamesCount: (n) => `${n} ${n > 1 ? 'Spiele' : 'Spiel'}`,
      questionsCount: (n) => `${n} Fragen`,
      tryPack: 'Testen',
      continueBtn: 'Weiter',
      pickCategoryFirst: 'Wählen Sie mindestens eine Kategorie',
    },
    teams: {
      setupTitle: "Wie spielen wir?",
      chooseColor: (n) => `Farbe von Team ${n} wählen`,
      chooseName: (n) => `Name von Team ${n} wählen`,
      removeTeam: (team) => `${team} entfernen`,
      removeTeamTitle: 'Dieses Team entfernen?',
      removeTeamConfirm: 'ENTFERNEN',
      clearTitle: "Teams zurücksetzen?",
      clearConfirm: "ZURÜCKSETZEN",
      resetBtn: "Teams zurücksetzen",
      namePlaceholder: (n) => `Team ${n} Name`,
      nextBtn: 'Weiter',
      addTeam: 'Team hinzufügen',
      minTeams: 'Ihr braucht mindestens 2 Teams zum Spielen',
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
      earlyAccess: "Danke, dass ihr zu den Ersten gehört! Diese Pakete sind heute gratis: Schaltet sie frei, bevor sie kostenpflichtig werden.",
      unlock: 'Freischalten',
      unlockA11y: (pack) => `Freischalten: ${pack}`,
      questionCount: (n) => `${n} Fragen`,
      unlocked: 'Paket freigeschaltet ✓',
      comingSoon: 'Demnächst verfügbar',
      packTitles: { 'harry-potter': 'Hogwarts-Express', 'rap-francais': 'Französischer Rap', dresseur: 'Der allerbeste Trainer', 'art-litterature': 'Kunst & Literatur', 'retro-gaming': 'Retro-Gaming', anime: 'Anime & Manga', football: 'Fußball', 'dessins-animes': 'Zeichentrick', 'jeux-video': 'Videospiele', cuisine: 'Küche', auto: 'Autos & Mechanik' },
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
      welcomeMsg: (pack, games) => (games > 1 ? `Spiel ${games} Partien und das Paket „${pack}" gehört dir!` : `Spiel eine Partie und das Paket „${pack}" gehört dir!`),
      doneTitle: 'Es gehört dir!',
      doneMsg: (pack) => `Das Paket „${pack}" ist freigeschaltet. Viel Spaß!`,
      ok: 'SUPER',
      progress: (played, total) => `${played} von ${total} Partien`,
      lockedMsg: (left) => `Spiel noch ${left} ${left > 1 ? 'Partien' : 'Partie'}, um dieses Gratis-Paket freizuschalten!`,
      lockedTrialMsg: (left) => `Nur noch ${left} ${left > 1 ? 'Partien' : 'Partie'} bis zum Freischalten. Ungeduldig? Ein kurzes Video schenkt dir eine Probepartie – nur einmal.`,
      lockedTrialUsedMsg: (left) => `Deine Probepartie hast du schon gespielt. Nur noch ${left} ${left > 1 ? 'Partien' : 'Partie'} bis zum Freischalten!`,
      gotIt: 'VERSTANDEN',
      nextGoal: (pack, games) => (games > 1 ? `Nächstes Ziel: noch ${games} Partien, um „${pack}“ freizuschalten!` : `Nächstes Ziel: noch eine Partie, um „${pack}“ freizuschalten!`),
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
      timeoutYes: "JA, RICHTIG",
      passA11y: 'Keine Antwort – Ausscheiden',
      clear: 'Löschen',
      someAnswers: 'Einige mögliche Antworten',
      elimPassTitle: 'Keine Antwort?',
      endRoundTitle: 'Runde beenden?',
      endRoundMsg: 'Kein Team gewinnt die Punkte im Spiel.',
      endRoundBtn: 'BEENDEN',
      elimPassMsg: 'Das Team scheidet in dieser Runde aus.',
      elimTimeoutTitle: 'Zeit abgelaufen!',
      elimTimeoutMsg: 'Hat das Team rechtzeitig geantwortet?',
      eliminate: 'AUSSCHEIDEN',
      resume: 'WEITER',
      stillIn: "Noch im Spiel",
    },
    final: {
      leaveTitle: "Zurück zum Menü?",
      gameOver: "SPIELENDE",
      otherMode: "Anderer Modus",
      tie: 'UNENTSCHIEDEN!',
      victoryOf: 'Sieg für',
      rematch: 'Revanche',
      home: 'Hauptmenü',
      share: 'Ergebnis teilen',
      shareWin: (team) => `🏆 Sieg für ${team} bei Bango!`,
      shareTie: '🤝 Perfektes Unentschieden bei Bango!',
      shareInvite: 'Spiel mit uns:',
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
        'Jedes Team nennt abwechselnd eine neue Antwort. Turbo-Timer (einstellbar): 15 Sekunden, dann pro Runde 2 Sekunden weniger.',
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
      mailSubject: 'Bango – Hilfe',
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
    daily: {
      locale: 'es-ES',
      title: 'Reto del día',
      titleDone: 'Reto del día superado',
      dateLabel: (date) => `Reto del ${date}`,
      instructionDaily: (s) => `${s} segundos para decir el máximo. Hoy la misma pregunta para todos, un solo intento.`,
      instructionSolo: (s) => `${s} segundos para decir el máximo.`,
      streakOn: (d) => `Racha actual: ${d} días`,
      comeBackDaily: 'Vuelve cada día para aumentar tu racha.',
      record: (n) => `Tu récord: ${n} respuestas`,
      noRecord: 'Aún no hay récord',
      finished: '¡Se acabó!',
      foundLabel: 'Respuestas encontradas',
      foundCount: (n) => `${n} respuestas encontradas`,
      miss: 'No está en nuestra lista, o ya la encontraste',
      placeholder: 'Escribe una respuesta…',
      inputA11y: 'Tu respuesta',
      endA11y: 'Terminar',
      alreadyPlayed: 'Ya has jugado el reto de hoy.',
      streak: 'Racha',
      recordLabel: 'Récord',
      newRecord: '¡Nuevo!',
      comeBackTomorrow: 'Vuelve mañana para un nuevo reto.',
      share: 'Compartir mi puntuación',
      replay: 'Jugar otra vez',
      shareMsg: (date, score, s, streak, url) => `Reto Bango del ${date}: ${score} respuestas en ${s} s 🔥${streak > 1 ? ` · racha de ${streak} días` : ''}\n¿Puedes superarlo? ${url}`,
      cardPlayed: (n) => `${n} respuestas · vuelve mañana`,
      cardStreak: (d) => `racha de ${d} días`,
      historyTitle: 'Retos diarios',
      played: 'Retos jugados',
      best: 'Mejor puntuación',
      empty: 'Juega tu primer reto para empezar tu seguimiento.',
      sortBy: 'Ordenar por',
      sortDate: 'Fecha',
      sortScore: "Éxito",
      filter: 'Filtrar',
      recentTitle: "Retos completados",
      seeAll: "Ver todo",
      allTitle: "Todos mis retos",
      bestThemes: "Temas mejor superados",
      themeCount: (n) => `${n} ${n > 1 ? "retos" : "reto"}`,
      average: (n) => `media ${n}`,
      prevPeriod: "Anterior",
      nextPeriod: "Siguiente",
      monthView: "Ver el mes",
      weeksView: "Ver 2 semanas",
      pickMonth: "Elegir el mes",
      notSaved: 'Respuestas no guardadas para este reto',
      noneFound: 'Ninguna respuesta encontrada',
      reminderTitle: 'Reto del día 🔥',
      reminderStreak: (d) => `Tu racha de ${d} días te espera, ¡no la pierdas!`,
      reminderNew: (s) => `Te espera un nuevo reto: ¿cuántas respuestas en ${s} segundos?`,
      channel: 'Reto del día',
    },
    players: {
      modeTeams: "Equipo",
      modeSolo: "Individual",
      teams: {
        chooseColor: (n) => `Elige el color del jugador ${n}`,
        chooseName: (n) => `Elige el nombre del jugador ${n}`,
        removeTeamTitle: "¿Quitar este jugador?",
        clearTitle: "¿Reiniciar los jugadores?",
        resetBtn: "Reiniciar los jugadores",
        namePlaceholder: (n) => `Nombre jugador ${n}`,
        addTeam: "Añadir un jugador",
        minTeams: "Hacen falta al menos 2 jugadores para jugar",
        defaultName: (i) => `Jugador ${i + 1}`,
      },
      survie: {
        phoneMsg: "Todos los jugadores deben poder ver la pantalla.",
        endRoundMsg: "Ningún jugador gana los puntos en juego.",
        elimPassMsg: "El jugador quedará eliminado de esta ronda.",
        elimTimeoutMsg: "¿Respondió el jugador a tiempo?",
      },
    },
    tutorial: {
      next: 'Siguiente',
      skip: 'Saltar',
      done: '¡Vamos!',
      welcome: '¡Bienvenidos a Bango! Os lo enseño todo en 30 segundos.',
      shop: 'Esta es la Tienda: packs de preguntas que se ganan jugando.',
      giftFirst: (pack, n) => (n > 1 ? `¡Terminad ${n} partidas y el pack «${pack}» es vuestro, gratis!` : `¡Terminad una partida y el pack «${pack}» es vuestro, gratis!`),

      morePacks: (n) => `Y eso no es todo: ${n} packs por desbloquear jugando, uno tras otro. ¡Mirad!`,
      play: '¿Listos? Todo empieza con este botón.',
      auction: 'Subastas: apostad cuántas respuestas podéis decir. Solo un equipo responde, en 60 segundos.',
      survie: 'Supervivencia: una respuesta por turno. ¡El equipo que se queda sin ideas queda eliminado!',
      teams: "Jugad en equipo o de forma individual (hasta 10 jugadores). En equipo, reunid todos los cerebros que queráis: no hay límite. ¡Buena partida!",
    },
    common: {
      cancel: 'CANCELAR',
      updateTitle: '¡Nuevas preguntas y packs!',
      updateMsg: 'Te espera una actualización para disfrutarlos.',
      updateBtn: 'ACTUALIZAR',
      whatsNewTitle: '¡Novedades!',
      whatsNewMsg: '¡Nuevo pack de Fútbol para ganar jugando! Y cualquier pack que aún no hayas ganado ya se puede probar durante una partida.',
      whatsNewBtn: 'DESCUBRIR',
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
      notInDatabase: (w) => `¿"${w}"? ¡No está en nuestra lista!`,
      notInDatabaseHint: 'Nuestra lista no es una enciclopedia. Comprobadlo, la partida os espera.',
      validateAnyway: 'Validar de todos modos',
      lastSecondMsg: "¿Se dio una respuesta correcta en el último segundo?",
      lastSecondYes: 'SÍ, AÑADIR',
      lastSecondNo: 'NO, TERMINAR',
      answerAdded: '✓ Respuesta añadida',
      pause: 'Pausa',
      resume: 'Reanudar',
      endTurn: 'Terminar turno',
      someAnswers: 'Algunas respuestas posibles...',
      sortPopular: 'Las más conocidas',
      sortAlpha: 'De la A a la Z',
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
      survieChips: ['Por turnos', 'Quien se atasca pierde'],
      auctionChips: ['Apuesta bien', '60 segundos'],
      playSurvie: 'Jugar a Supervivencia',
      playAuction: 'Jugar a Subastas',
    },
    matchSettings: {
      settingsTitle: 'Ajustes de juego',
      teamCount: 'Equipos',
      roundCount: 'Rondas',
      timer: 'Cronómetro',
      timerInfoFixed: 'El mismo tiempo en cada turno',
      timerInfoTurbo: '2 s menos en cada vuelta',
      categoriesTitle: 'Categorías',
      specialPacks: 'Packs especiales',
      seeAllPacks: 'Ver todo',
      classicCategories: 'Clásico',
      packsHowTo: (games) => (games > 1 ? `Juegue para desbloquearlos: un pack gratis cada ${games} partidas.` : 'Juegue para desbloquearlos: un pack gratis por cada partida terminada.'),
      freeIn: (n) => `Gratis en ${n} partida${n > 1 ? 's' : ''}`,
      gamesCount: (n) => `${n} partida${n > 1 ? 's' : ''}`,
      questionsCount: (n) => `${n} preguntas`,
      tryPack: 'Probar',
      continueBtn: 'Continuar',
      pickCategoryFirst: 'Elija al menos una categoría',
    },
    teams: {
      setupTitle: "¿Cómo jugamos?",
      chooseColor: (n) => `Elige el color del equipo ${n}`,
      chooseName: (n) => `Elige el nombre del equipo ${n}`,
      removeTeam: (team) => `Quitar ${team}`,
      removeTeamTitle: '¿Quitar este equipo?',
      removeTeamConfirm: 'QUITAR',
      clearTitle: "¿Reiniciar los equipos?",
      clearConfirm: "REINICIAR",
      resetBtn: "Reiniciar los equipos",
      namePlaceholder: (n) => `Nombre equipo ${n}`,
      nextBtn: 'Siguiente',
      addTeam: 'Añadir un equipo',
      minTeams: 'Hacen falta al menos 2 equipos para jugar',
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
      earlyAccess: "¡Gracias por estar entre los primeros! Estos packs son gratis hoy: desbloqueadlos antes de que sean de pago.",
      unlock: 'Desbloquear',
      unlockA11y: (pack) => `Desbloquear ${pack}`,
      questionCount: (n) => `${n} preguntas`,
      unlocked: 'Pack desbloqueado ✓',
      comingSoon: 'Próximamente',
      packTitles: { 'harry-potter': 'Expreso de Hogwarts', 'rap-francais': 'Rap francés', dresseur: 'El mejor entrenador', 'art-litterature': 'Arte y literatura', 'retro-gaming': 'Retro gaming', anime: 'Anime y manga', football: 'Fútbol', 'dessins-animes': 'Dibujos animados', 'jeux-video': 'Videojuegos', cuisine: 'Cocina', auto: 'Motor y mecánica' },
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
      welcomeMsg: (pack, games) => (games > 1 ? `¡Juega ${games} partidas y el pack «${pack}» es tuyo!` : `¡Juega una partida y el pack «${pack}» es tuyo!`),
      doneTitle: '¡Es tuyo!',
      doneMsg: (pack) => `El pack «${pack}» está desbloqueado. ¡A jugar!`,
      ok: 'GENIAL',
      progress: (played, total) => `${played} de ${total} partidas`,
      lockedMsg: (left) => `¡Juega ${left} partida${left > 1 ? 's' : ''} más para desbloquear este pack gratis!`,
      lockedTrialMsg: (left) => `Solo ${left} partida${left > 1 ? 's' : ''} más para desbloquearlo. ¿Impaciente? Un vídeo corto te regala una partida de prueba, solo una vez.`,
      lockedTrialUsedMsg: (left) => `Ya jugaste tu partida de prueba. ¡Solo ${left} partida${left > 1 ? 's' : ''} más para desbloquearlo!`,
      gotIt: 'ENTENDIDO',
      nextGoal: (pack, games) => (games > 1 ? `¡Próximo objetivo: ${games} partidas más para desbloquear «${pack}»!` : `¡Próximo objetivo: una partida más para desbloquear «${pack}»!`),
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
      timeoutYes: "SÍ, RESPUESTA CORRECTA",
      passA11y: 'Sin respuesta — eliminación',
      clear: 'Borrar',
      someAnswers: 'Algunas respuestas posibles',
      elimPassTitle: '¿Sin respuesta?',
      endRoundTitle: '¿Terminar la ronda?',
      endRoundMsg: 'Ningún equipo gana los puntos en juego.',
      endRoundBtn: 'TERMINAR',
      elimPassMsg: 'El equipo quedará eliminado de esta ronda.',
      elimTimeoutTitle: '¡Se acabó el tiempo!',
      elimTimeoutMsg: '¿Respondió el equipo a tiempo?',
      eliminate: 'ELIMINAR',
      resume: 'REANUDAR',
      stillIn: "Siguen en juego",
    },
    final: {
      leaveTitle: "¿Volver al menú?",
      gameOver: "FIN DE LA PARTIDA",
      otherMode: "Otro modo",
      tie: '¡EMPATE!',
      victoryOf: 'Victoria de',
      rematch: 'Revancha',
      home: 'Menú principal',
      share: 'Compartir el resultado',
      shareWin: (team) => `🏆 ¡Victoria de ${team} en Bango!`,
      shareTie: '🤝 ¡Empate perfecto en Bango!',
      shareInvite: 'Ven a jugar con nosotros:',
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
        'Cada equipo, por turnos, dice una respuesta nueva. Cronómetro Turbo (ajustable): 15 segundos y luego 2 menos en cada vuelta.',
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
      mailSubject: 'Bango – Ayuda',
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
    daily: {
      locale: 'it-IT',
      title: 'Sfida del giorno',
      titleDone: 'Sfida del giorno completata',
      dateLabel: (date) => `Sfida del ${date}`,
      instructionDaily: (s) => `${s} secondi per dirne il più possibile. Oggi la stessa domanda per tutti, un solo tentativo.`,
      instructionSolo: (s) => `${s} secondi per dirne il più possibile.`,
      streakOn: (d) => `Serie in corso: ${d} giorni`,
      comeBackDaily: 'Torna ogni giorno per far crescere la tua serie.',
      record: (n) => `Il tuo record: ${n} risposte`,
      noRecord: 'Ancora nessun record',
      finished: 'È finita!',
      foundLabel: 'Risposte trovate',
      foundCount: (n) => `${n} risposte trovate`,
      miss: 'Non è nella nostra lista, o già trovata',
      placeholder: 'Scrivi una risposta…',
      inputA11y: 'La tua risposta',
      endA11y: 'Termina',
      alreadyPlayed: 'Hai già giocato la sfida di oggi.',
      streak: 'Serie',
      recordLabel: 'Record',
      newRecord: 'Nuovo!',
      comeBackTomorrow: 'Torna domani per una nuova sfida.',
      share: 'Condividi il mio punteggio',
      replay: 'Gioca ancora',
      shareMsg: (date, score, s, streak, url) => `Sfida Bango del ${date}: ${score} risposte in ${s} s 🔥${streak > 1 ? ` · serie di ${streak} giorni` : ''}\nRiesci a battermi? ${url}`,
      cardPlayed: (n) => `${n} risposte · torna domani`,
      cardStreak: (d) => `serie di ${d} giorni`,
      historyTitle: 'Sfide quotidiane',
      played: 'Sfide giocate',
      best: 'Miglior punteggio',
      empty: 'Gioca la tua prima sfida per iniziare a tenerne traccia.',
      sortBy: 'Ordina per',
      sortDate: 'Data',
      sortScore: "Riuscita",
      filter: 'Filtra',
      recentTitle: "Sfide completate",
      seeAll: "Vedi tutto",
      allTitle: "Tutte le mie sfide",
      bestThemes: "Temi più riusciti",
      themeCount: (n) => `${n} ${n > 1 ? "sfide" : "sfida"}`,
      average: (n) => `media ${n}`,
      prevPeriod: "Precedente",
      nextPeriod: "Successivo",
      monthView: "Vedi il mese",
      weeksView: "Vedi 2 settimane",
      pickMonth: "Scegli il mese",
      notSaved: 'Risposte non salvate per questa sfida',
      noneFound: 'Nessuna risposta trovata',
      reminderTitle: 'Sfida del giorno 🔥',
      reminderStreak: (d) => `La tua serie di ${d} giorni ti aspetta, non lasciarla scappare!`,
      reminderNew: (s) => `Ti aspetta una nuova sfida: quante risposte in ${s} secondi?`,
      channel: 'Sfida del giorno',
    },
    players: {
      modeTeams: "Squadra",
      modeSolo: "Individuale",
      teams: {
        chooseColor: (n) => `Scegli il colore del giocatore ${n}`,
        chooseName: (n) => `Scegli il nome del giocatore ${n}`,
        removeTeamTitle: "Rimuovere questo giocatore?",
        clearTitle: "Azzerare i giocatori?",
        resetBtn: "Azzera i giocatori",
        namePlaceholder: (n) => `Nome giocatore ${n}`,
        addTeam: "Aggiungi un giocatore",
        minTeams: "Servono almeno 2 giocatori per giocare",
        defaultName: (i) => `Giocatore ${i + 1}`,
      },
      survie: {
        phoneMsg: "Tutti i giocatori devono poter vedere lo schermo.",
        endRoundMsg: "Nessun giocatore vince i punti in palio.",
        elimPassMsg: "Il giocatore sarà eliminato da questa manche.",
        elimTimeoutMsg: "Il giocatore ha risposto in tempo?",
      },
    },
    tutorial: {
      next: 'Avanti',
      skip: 'Salta',
      done: 'Si parte!',
      welcome: 'Benvenuti in Bango! Vi faccio fare il giro in 30 secondi.',
      shop: 'Questo è il Negozio: pacchetti di domande da vincere giocando.',
      giftFirst: (pack, n) => (n > 1 ? `Finite ${n} partite e il pacchetto «${pack}» è vostro, in regalo!` : `Finite una partita e il pacchetto «${pack}» è vostro, in regalo!`),

      morePacks: (n) => `E non è tutto: ${n} pack da sbloccare giocando, uno dopo l’altro. Guardate!`,
      play: 'Pronti? Tutto inizia da questo pulsante.',
      auction: 'Aste: scommettete quante risposte sapete dire. Risponde una sola squadra, in 60 secondi.',
      survie: 'Sopravvivenza: una risposta a turno. La squadra che resta senza idee è eliminata!',
      teams: "Giocate a squadre o individualmente (fino a 10 giocatori). A squadre, riunite tutti i cervelli che volete: non c'è limite. Buona partita!",
    },
    common: {
      cancel: 'ANNULLA',
      updateTitle: 'Nuove domande e pack!',
      updateMsg: 'Ti aspetta un aggiornamento per giocarci.',
      updateBtn: 'AGGIORNA',
      whatsNewTitle: 'Le novità!',
      whatsNewMsg: 'Nuovo pack Calcio da vincere giocando! E ogni pack non ancora vinto ora si può provare per una partita.',
      whatsNewBtn: 'SCOPRI',
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
      notInDatabase: (w) => `"${w}"? Non è nella nostra lista!`,
      notInDatabaseHint: "La nostra lista non è un'enciclopedia. Controllate, la partita vi aspetta.",
      validateAnyway: 'Convalida comunque',
      lastSecondMsg: "È stata data una risposta giusta all'ultimo secondo?",
      lastSecondYes: 'SÌ, AGGIUNGI',
      lastSecondNo: 'NO, TERMINA',
      answerAdded: '✓ Risposta aggiunta',
      pause: 'Pausa',
      resume: 'Riprendi',
      endTurn: 'Fine turno',
      someAnswers: 'Alcune risposte possibili...',
      sortPopular: 'Le più note',
      sortAlpha: 'Dalla A alla Z',
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
      survieChips: ['A turno', 'Chi si blocca perde'],
      auctionChips: ['Punta giusto', '60 secondi'],
      playSurvie: 'Gioca a Sopravvivenza',
      playAuction: 'Gioca alle Aste',
    },
    matchSettings: {
      settingsTitle: 'Impostazioni partita',
      teamCount: 'Squadre',
      roundCount: 'Manche',
      timer: 'Timer',
      timerInfoFixed: 'Stesso tempo a ogni turno',
      timerInfoTurbo: '2 s in meno a ogni giro',
      categoriesTitle: 'Categorie',
      specialPacks: 'Pack speciali',
      seeAllPacks: 'Vedi tutto',
      classicCategories: 'Classico',
      packsHowTo: (games) => (games > 1 ? `Gioca per sbloccarli: un pack in regalo ogni ${games} partite.` : 'Gioca per sbloccarli: un pack in regalo per ogni partita finita.'),
      freeIn: (n) => `Gratis tra ${n} partit${n > 1 ? 'e' : 'a'}`,
      gamesCount: (n) => `${n} partit${n > 1 ? 'e' : 'a'}`,
      questionsCount: (n) => `${n} domande`,
      tryPack: 'Prova',
      continueBtn: 'Continua',
      pickCategoryFirst: 'Scegli almeno una categoria',
    },
    teams: {
      setupTitle: "Come giochiamo?",
      chooseColor: (n) => `Scegli il colore della squadra ${n}`,
      chooseName: (n) => `Scegli il nome della squadra ${n}`,
      removeTeam: (team) => `Rimuovi ${team}`,
      removeTeamTitle: 'Rimuovere questa squadra?',
      removeTeamConfirm: 'RIMUOVI',
      clearTitle: "Azzerare le squadre?",
      clearConfirm: "AZZERA",
      resetBtn: "Azzera le squadre",
      namePlaceholder: (n) => `Nome squadra ${n}`,
      nextBtn: 'Avanti',
      addTeam: 'Aggiungi una squadra',
      minTeams: 'Servono almeno 2 squadre per giocare',
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
      earlyAccess: "Grazie di essere tra i primi! Questi pacchetti oggi sono gratis: sbloccateli prima che diventino a pagamento.",
      unlock: 'Sblocca',
      unlockA11y: (pack) => `Sblocca ${pack}`,
      questionCount: (n) => `${n} domande`,
      unlocked: 'Pack sbloccato ✓',
      comingSoon: 'Prossimamente',
      packTitles: { 'harry-potter': 'Espresso per Hogwarts', 'rap-francais': 'Rap francese', dresseur: 'Il miglior allenatore', 'art-litterature': 'Arte e letteratura', 'retro-gaming': 'Retro gaming', anime: 'Anime e manga', football: 'Calcio', 'dessins-animes': 'Cartoni animati', 'jeux-video': 'Videogiochi', cuisine: 'Cucina', auto: 'Auto e meccanica' },
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
      welcomeMsg: (pack, games) => (games > 1 ? `Gioca ${games} partite e il pack «${pack}» è tuo!` : `Gioca una partita e il pack «${pack}» è tuo!`),
      doneTitle: 'È tuo!',
      doneMsg: (pack) => `Il pack «${pack}» è sbloccato. Buon divertimento!`,
      ok: 'FANTASTICO',
      progress: (played, total) => `${played} partite su ${total}`,
      lockedMsg: (left) => `Gioca ancora ${left} partit${left > 1 ? 'e' : 'a'} per sbloccare gratis questo pack!`,
      lockedTrialMsg: (left) => `Ancora ${left} partit${left > 1 ? 'e' : 'a'} per sbloccarlo. Non resisti? Un breve video ti regala una partita di prova, una sola volta.`,
      lockedTrialUsedMsg: (left) => `Hai già giocato la tua partita di prova. Ancora ${left} partit${left > 1 ? 'e' : 'a'} per sbloccarlo!`,
      gotIt: 'HO CAPITO',
      nextGoal: (pack, games) => (games > 1 ? `Prossimo obiettivo: altre ${games} partite per sbloccare «${pack}»!` : `Prossimo obiettivo: un'altra partita per sbloccare «${pack}»!`),
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
      timeoutYes: "SÌ, RISPOSTA GIUSTA",
      passA11y: 'Nessuna risposta — eliminazione',
      clear: 'Cancella',
      someAnswers: 'Alcune risposte possibili',
      elimPassTitle: 'Nessuna risposta?',
      endRoundTitle: 'Terminare la manche?',
      endRoundMsg: 'Nessuna squadra vince i punti in palio.',
      endRoundBtn: 'TERMINA',
      elimPassMsg: 'La squadra sarà eliminata da questa manche.',
      elimTimeoutTitle: 'Tempo scaduto!',
      elimTimeoutMsg: 'La squadra ha risposto in tempo?',
      eliminate: 'ELIMINA',
      resume: 'RIPRENDI',
      stillIn: "Ancora in gara",
    },
    final: {
      leaveTitle: "Tornare al menu?",
      gameOver: "FINE DELLA PARTITA",
      otherMode: "Altra modalità",
      tie: 'PAREGGIO!',
      victoryOf: 'Vittoria di',
      rematch: 'Rivincita',
      home: 'Menu principale',
      share: 'Condividi il risultato',
      shareWin: (team) => `🏆 Vittoria di ${team} a Bango!`,
      shareTie: '🤝 Pareggio perfetto a Bango!',
      shareInvite: 'Vieni a giocare con noi:',
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
        'A turno, ogni squadra dice una risposta nuova. Timer Turbo (regolabile): 15 secondi, poi 2 in meno a ogni giro.',
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
      mailSubject: 'Bango – Assistenza',
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
    daily: {
      locale: 'pt-BR',
      title: 'Desafio do dia',
      titleDone: 'Desafio do dia concluído',
      dateLabel: (date) => `Desafio de ${date}`,
      instructionDaily: (s) => `${s} segundos para dizer o máximo possível. Hoje a mesma pergunta para todos, uma única tentativa.`,
      instructionSolo: (s) => `${s} segundos para dizer o máximo possível.`,
      streakOn: (d) => `Sequência atual: ${d} dias`,
      comeBackDaily: 'Volte todo dia para aumentar sua sequência.',
      record: (n) => `Seu recorde: ${n} respostas`,
      noRecord: 'Ainda sem recorde',
      finished: 'Acabou!',
      foundLabel: 'Respostas encontradas',
      foundCount: (n) => `${n} respostas encontradas`,
      miss: 'Não está na nossa lista, ou já foi encontrada',
      placeholder: 'Digite uma resposta…',
      inputA11y: 'Sua resposta',
      endA11y: 'Encerrar',
      alreadyPlayed: 'Você já jogou o desafio de hoje.',
      streak: 'Sequência',
      recordLabel: 'Recorde',
      newRecord: 'Novo!',
      comeBackTomorrow: 'Volte amanhã para um novo desafio.',
      share: 'Compartilhar minha pontuação',
      replay: 'Jogar de novo',
      shareMsg: (date, score, s, streak, url) => `Desafio Bango de ${date}: ${score} respostas em ${s} s 🔥${streak > 1 ? ` · sequência de ${streak} dias` : ''}\nConsegue me superar? ${url}`,
      cardPlayed: (n) => `${n} respostas · volte amanhã`,
      cardStreak: (d) => `sequência de ${d} dias`,
      historyTitle: 'Desafios diários',
      played: 'Desafios jogados',
      best: 'Melhor pontuação',
      empty: 'Jogue seu primeiro desafio para começar o acompanhamento.',
      sortBy: 'Ordenar por',
      sortDate: 'Data',
      sortScore: "Sucesso",
      filter: 'Filtrar',
      recentTitle: "Desafios concluídos",
      seeAll: "Ver tudo",
      allTitle: "Todos os meus desafios",
      bestThemes: "Temas com mais sucesso",
      themeCount: (n) => `${n} ${n > 1 ? "desafios" : "desafio"}`,
      average: (n) => `média ${n}`,
      prevPeriod: "Anterior",
      nextPeriod: "Próximo",
      monthView: "Ver o mês",
      weeksView: "Ver 2 semanas",
      pickMonth: "Escolher o mês",
      notSaved: 'Respostas não salvas para este desafio',
      noneFound: 'Nenhuma resposta encontrada',
      reminderTitle: 'Desafio do dia 🔥',
      reminderStreak: (d) => `Sua sequência de ${d} dias está esperando, não a perca!`,
      reminderNew: (s) => `Um novo desafio te espera: quantas respostas em ${s} segundos?`,
      channel: 'Desafio do dia',
    },
    players: {
      modeTeams: "Time",
      modeSolo: "Individual",
      teams: {
        chooseColor: (n) => `Escolha a cor do jogador ${n}`,
        chooseName: (n) => `Escolha o nome do jogador ${n}`,
        removeTeamTitle: "Remover este jogador?",
        clearTitle: "Redefinir os jogadores?",
        resetBtn: "Redefinir os jogadores",
        namePlaceholder: (n) => `Nome do jogador ${n}`,
        addTeam: "Adicionar um jogador",
        minTeams: "É preciso pelo menos 2 jogadores para jogar",
        defaultName: (i) => `Jogador ${i + 1}`,
      },
      survie: {
        phoneMsg: "Todos os jogadores precisam ver a tela.",
        endRoundMsg: "Nenhum jogador ganha os pontos em jogo.",
        elimPassMsg: "O jogador será eliminado desta rodada.",
        elimTimeoutMsg: "O jogador respondeu a tempo?",
      },
    },
    tutorial: {
      next: 'Próximo',
      skip: 'Pular',
      done: 'Vamos lá!',
      welcome: 'Bem-vindos ao Bango! Mostro tudo em 30 segundos.',
      shop: 'Esta é a Loja: pacotes de perguntas que vocês ganham jogando.',
      giftFirst: (pack, n) => (n > 1 ? `Terminem ${n} partidas e o pacote “${pack}” é de vocês, grátis!` : `Terminem uma partida e o pacote “${pack}” é de vocês, grátis!`),

      morePacks: (n) => `E não é só isso: ${n} pacotes para desbloquear jogando, um depois do outro. Olhem só!`,
      play: 'Prontos? Tudo começa por este botão.',
      auction: 'Leilão: apostem quantas respostas conseguem dizer. Só uma equipe responde, em 60 segundos.',
      survie: 'Sobrevivência: uma resposta por vez. A equipe que ficar sem ideias está eliminada!',
      teams: "Joguem em time ou individualmente (até 10 jogadores). Em time, juntem quantos cérebros quiserem: não tem limite. Boa partida!",
    },
    common: {
      cancel: 'CANCELAR',
      updateTitle: 'Novas perguntas e pacotes!',
      updateMsg: 'Uma atualização está esperando por você para aproveitar.',
      updateBtn: 'ATUALIZAR',
      whatsNewTitle: 'Novidades!',
      whatsNewMsg: 'Novo pacote de Futebol para ganhar jogando! E todo pacote ainda não ganho agora pode ser testado por uma partida.',
      whatsNewBtn: 'DESCOBRIR',
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
      notInDatabase: (w) => `"${w}"? Não está na nossa lista!`,
      notInDatabaseHint: 'Nossa lista não é uma enciclopédia. Confiram, a partida espera vocês.',
      validateAnyway: 'Validar mesmo assim',
      lastSecondMsg: "Uma resposta certa foi dada no último segundo?",
      lastSecondYes: 'SIM, ADICIONAR',
      lastSecondNo: 'NÃO, ENCERRAR',
      answerAdded: '✓ Resposta adicionada',
      pause: 'Pausa',
      resume: 'Continuar',
      endTurn: 'Encerrar a vez',
      someAnswers: 'Algumas respostas possíveis...',
      sortPopular: 'As mais conhecidas',
      sortAlpha: 'De A a Z',
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
      survieChips: ['Cada um na sua vez', 'Quem travar perde'],
      auctionChips: ['Aposte certo', '60 segundos'],
      playSurvie: 'Jogar Sobrevivência',
      playAuction: 'Jogar Leilão',
    },
    matchSettings: {
      settingsTitle: 'Configurações da partida',
      teamCount: 'Times',
      roundCount: 'Rodadas',
      timer: 'Cronômetro',
      timerInfoFixed: 'O mesmo tempo em cada vez',
      timerInfoTurbo: '2 s a menos a cada volta',
      categoriesTitle: 'Categorias',
      specialPacks: 'Pacotes especiais',
      seeAllPacks: 'Ver tudo',
      classicCategories: 'Clássico',
      packsHowTo: (games) => (games > 1 ? `Jogue para desbloqueá-los: um pacote grátis a cada ${games} partidas.` : 'Jogue para desbloqueá-los: um pacote grátis a cada partida terminada.'),
      freeIn: (n) => `Grátis em ${n} partida${n > 1 ? 's' : ''}`,
      gamesCount: (n) => `${n} partida${n > 1 ? 's' : ''}`,
      questionsCount: (n) => `${n} perguntas`,
      tryPack: 'Experimentar',
      continueBtn: 'Continuar',
      pickCategoryFirst: 'Escolha pelo menos uma categoria',
    },
    teams: {
      setupTitle: "Como vamos jogar?",
      chooseColor: (n) => `Escolha a cor do time ${n}`,
      chooseName: (n) => `Escolha o nome do time ${n}`,
      removeTeam: (team) => `Remover ${team}`,
      removeTeamTitle: 'Remover esta equipe?',
      removeTeamConfirm: 'REMOVER',
      clearTitle: "Redefinir os times?",
      clearConfirm: "REDEFINIR",
      resetBtn: "Redefinir os times",
      namePlaceholder: (n) => `Nome do time ${n}`,
      nextBtn: 'Próximo',
      addTeam: 'Adicionar uma equipe',
      minTeams: 'É preciso pelo menos 2 equipes para jogar',
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
      earlyAccess: "Obrigado por estar entre os primeiros! Estes pacotes são grátis hoje: desbloqueiem antes que fiquem pagos.",
      unlock: 'Desbloquear',
      unlockA11y: (pack) => `Desbloquear ${pack}`,
      questionCount: (n) => `${n} perguntas`,
      unlocked: 'Pacote desbloqueado ✓',
      comingSoon: 'Em breve',
      packTitles: { 'harry-potter': 'Expresso de Hogwarts', 'rap-francais': 'Rap francês', dresseur: 'O melhor treinador', 'art-litterature': 'Arte e literatura', 'retro-gaming': 'Retro gaming', anime: 'Anime e mangá', football: 'Futebol', 'dessins-animes': 'Desenhos animados', 'jeux-video': 'Videogames', cuisine: 'Culinária', auto: 'Carros e mecânica' },
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
      welcomeMsg: (pack, games) => (games > 1 ? `Jogue ${games} partidas e o pacote «${pack}» é seu!` : `Jogue uma partida e o pacote «${pack}» é seu!`),
      doneTitle: 'É seu!',
      doneMsg: (pack) => `O pacote «${pack}» está desbloqueado. Divirta-se!`,
      ok: 'DEMAIS',
      progress: (played, total) => `${played} de ${total} partidas`,
      lockedMsg: (left) => `Jogue mais ${left} partida${left > 1 ? 's' : ''} para desbloquear este pacote de graça!`,
      lockedTrialMsg: (left) => `Só mais ${left} partida${left > 1 ? 's' : ''} para desbloqueá-lo. Sem paciência? Um vídeo curto te dá uma partida de teste, uma única vez.`,
      lockedTrialUsedMsg: (left) => `Você já jogou sua partida de teste. Só mais ${left} partida${left > 1 ? 's' : ''} para desbloqueá-lo!`,
      gotIt: 'ENTENDI',
      nextGoal: (pack, games) => (games > 1 ? `Próximo objetivo: mais ${games} partidas para desbloquear “${pack}”!` : `Próximo objetivo: mais uma partida para desbloquear “${pack}”!`),
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
      timeoutYes: "SIM, RESPOSTA CERTA",
      passA11y: 'Sem resposta — eliminação',
      clear: 'Apagar',
      someAnswers: 'Algumas respostas possíveis',
      elimPassTitle: 'Sem resposta?',
      endRoundTitle: 'Terminar a rodada?',
      endRoundMsg: 'Nenhum time ganha os pontos em jogo.',
      endRoundBtn: 'TERMINAR',
      elimPassMsg: 'O time será eliminado desta rodada.',
      elimTimeoutTitle: 'Acabou o tempo!',
      elimTimeoutMsg: 'O time respondeu a tempo?',
      eliminate: 'ELIMINAR',
      resume: 'CONTINUAR',
      stillIn: "Ainda no jogo",
    },
    final: {
      leaveTitle: "Voltar ao menu?",
      gameOver: "FIM DA PARTIDA",
      otherMode: "Outro modo",
      tie: 'EMPATE!',
      victoryOf: 'Vitória de',
      rematch: 'Revanche',
      home: 'Menu principal',
      share: 'Compartilhar o resultado',
      shareWin: (team) => `🏆 Vitória de ${team} no Bango!`,
      shareTie: '🤝 Empate perfeito no Bango!',
      shareInvite: 'Vem jogar com a gente:',
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
        'Cada time, na sua vez, diz uma resposta nova. Cronômetro Turbo (ajustável): 15 segundos e depois 2 a menos a cada rodada.',
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
      mailSubject: 'Bango – Ajuda',
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

/** Nom par défaut (« Équipe 2 », « Player 1 »…) dans n'importe quelle langue : à régénérer dans la langue en cours. */
export function isDefaultTeamName(name: string): boolean {
  const wanted = name.trim().toLocaleLowerCase();
  if (!wanted) return false;
  return LANGUAGES.some(({ code }) => {
    const t = translations[code];
    return Array.from({ length: 8 }, (_, i) => [t.teams.defaultName(i), t.players.teams.defaultName(i)])
      .flat()
      .some((label) => label.toLocaleLowerCase() === wanted);
  });
}

/** Textes « équipe » ou « joueur » selon le choix de « Qui joue ? ». */
export function sideTexts(t: Translations, individual: boolean) {
  if (!individual) return { teams: t.teams, survie: t.survie };
  return { teams: { ...t.teams, ...t.players.teams }, survie: { ...t.survie, ...t.players.survie } };
}

export function getT(lang: Lang): Translations {
  return translations[lang];
}
