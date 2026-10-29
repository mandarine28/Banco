import { router } from 'expo-router';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Keyboard, Linking, StyleSheet, Text, View } from 'react-native';

import { FinalPhase } from '@/components/game/FinalPhase';
import { AuctionPhase } from '@/components/game/AuctionPhase';
import { AuctionWonTransition } from '@/components/game/AuctionWonTransition';
import { CounterFooter } from '@/components/game/CounterFooter';
import { PlayIntroTransition } from '@/components/game/PlayIntroTransition';
import { PlayPhase } from '@/components/game/PlayPhase';
import { ReadyPhase } from '@/components/game/ReadyPhase';
import { ResultPhase } from '@/components/game/ResultPhase';
import { TurnEndTransition } from '@/components/game/TurnEndTransition';
import { SurvieFinalPhase } from '@/components/game/SurvieFinalPhase';
import { SurviePhoneIntro } from '@/components/game/SurviePhoneIntro';
import { SurviePlayPhase } from '@/components/game/SurviePlayPhase';
import { SurvieReadyPhase } from '@/components/game/SurvieReadyPhase';
import { SurvieResultPhase } from '@/components/game/SurvieResultPhase';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { GameLayout } from '@/components/GameLayout';
import { ConfirmModal, PauseModal } from '@/components/InfoModal';
import { PACK_THEME_IDS, type ProductId, WELCOME_GAMES } from '@/config/shop';
import { giftAfter, giftChain } from '@/lib/giftChain';
import { questions } from '@/data/questions';
import { themes } from '@/data/themes';
import { contract, createGame, gameReducer, type GameTeam, isLastRound, isSuccess, opponent, TURN_SECONDS } from '@/game/engine';
import { createSurvieGame, isLastSurvieRound, survieReducer, survieTurboSeconds } from '@/game/survie-engine';
import { useBackToQuitConfirm } from '@/hooks/useBackToQuitConfirm';
import { useCountdown } from '@/hooks/useCountdown';
import { useHapticWarning } from '@/hooks/useHapticWarning';
import { usePauseOnBackground } from '@/hooks/usePauseOnBackground';
import { preloadInterstitial, showInterstitial } from '@/lib/ads';
import { shouldShowInterstitial } from '@/lib/adRule';
import { maybeRequestReview, recordGameCompleted } from '@/lib/engagement';
import { getT } from '@/lib/i18n';
import { useLang } from '@/lib/LangContext';
import { markTrialUsed } from '@/lib/trials';
import { type SurvieTimer, useGameSettings } from '@/state/gameSettings';
import { usePurchases } from '@/state/purchases';
import { SurviePulseBorder } from '@/state/survieOverlay';
import { colors, fonts, teamColors } from '@/theme';

const BADGE_TEXT_COLOR: Record<string, string> = { '#EF1ACC': '#FEF1CC' };
/** Laisse passer l'annonce du gagnant et les confettis avant la fenêtre d'avis. */
const REVIEW_DELAY_MS = 2000;

/** Appelle onFinished une seule fois quand la partie atteint l'écran final. */
function useOnFinal(isFinal: boolean, onFinished: () => void) {
  const done = useRef(false);
  useEffect(() => {
    if (!isFinal || done.current) return;
    done.current = true;
    onFinished();
  }, [isFinal, onFinished]);
}

export default function GameScreen() {
  const settings = useGameSettings();
  const teams: GameTeam[] =
    settings.teams.length > 0
      ? settings.teams
      : Array.from({ length: settings.teamCount }, (_, i) => ({ name: `ÉQUIPE ${i + 1}`, color: teamColors[i] }));
  const [gameId, setGameId] = useState(0);
  const { hasPurchased, purchase, prices, claimGiftedPack } = usePurchases();
  const { lang } = useLang();
  const t = getT(lang);
  // Revanche : un pack en essai ne vaut que pour une partie, on le retire s'il n'a pas été acheté
  const replay = () => {
    const trialThemes = (Object.keys(PACK_THEME_IDS) as ProductId[])
      .filter((product) => !hasPurchased(product))
      .map((product) => PACK_THEME_IDS[product]);
    const kept = settings.selectedThemes.filter((id) => !trialThemes.includes(id));
    if (kept.length !== settings.selectedThemes.length) {
      settings.setSelectedThemes(kept.length > 0 ? kept : themes.map((theme) => theme.id));
    }
    setGameId((id) => id + 1);
  };

  // Partie d'essai : on propose l'achat du pack une seule fois, au moment de quitter l'écran final
  const trialProduct = (Object.keys(PACK_THEME_IDS) as ProductId[]).find(
    (product) => !hasPurchased(product) && settings.selectedThemes.includes(PACK_THEME_IDS[product] ?? ''),
  );
  const trialTheme = trialProduct ? PACK_THEME_IDS[trialProduct] : undefined;
  const trialPrice = trialProduct ? prices[trialProduct] : undefined;
  const ownedPackThemes = (Object.keys(PACK_THEME_IDS) as ProductId[])
    .filter((product) => hasPurchased(product))
    .map((product) => PACK_THEME_IDS[product] ?? '');
  // Aucun thème coché = tous les thèmes gratuits + les packs achetés (jamais les packs non achetés)
  const playableThemes =
    settings.selectedThemes.length > 0 ? settings.selectedThemes : [...themes.map((theme) => theme.id), ...ownedPackThemes];
  // La partie d'essai a commencé : le pack ne pourra plus être essayé avec une pub
  useEffect(() => {
    if (trialTheme) markTrialUsed(trialTheme);
  }, [trialTheme]);
  const [upsellNext, setUpsellNext] = useState<(() => void) | null>(null);
  const [upsellShown, setUpsellShown] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseFailed, setPurchaseFailed] = useState(false);
  // Pub de fin de partie due (règle adRule) : affichée en quittant l'écran final, jamais pendant le jeu
  const [adDue, setAdDue] = useState(false);
  const leave = (next: () => void) => {
    if (!adDue) return next();
    setAdDue(false);
    showInterstitial().finally(next);
  };
  const beforeLeave = (next: () => void) => {
    if (!trialProduct || upsellShown) return leave(next);
    setUpsellShown(true);
    setUpsellNext(() => () => leave(next));
  };
  const closeUpsell = () => {
    setUpsellNext(null);
    setPurchaseFailed(false);
  };
  const buyTrialPack = async () => {
    if (!trialProduct || purchasing) return;
    setPurchasing(true);
    setPurchaseFailed(false);
    try {
      // Annulé par le joueur : la fenêtre reste ouverte pour « Plus tard »
      if (await purchase(trialProduct)) closeUpsell();
    } catch {
      setPurchaseFailed(true);
    } finally {
      setPurchasing(false);
    }
  };

  // Fenêtre « pack débloqué » sur l'écran final de la partie qui complète un objectif
  const [unlockedGift, setUnlockedGift] = useState<ProductId | null>(null);
  const packTitle = (product: ProductId | undefined) => (product ? (t.shop.packTitles[PACK_THEME_IDS[product] ?? ''] ?? '') : '');
  const nextGift = unlockedGift ? giftAfter(unlockedGift) : undefined;

  const onGameFinished = () => {
    // Plancher : après réinstallation, le compteur repart de 0 alors que les packs gagnés restent
    recordGameCompleted(giftChain(hasPurchased, 0).floor).then(async (count) => {
      const { next, played } = giftChain(hasPurchased, count);
      if (next && played >= WELCOME_GAMES) {
        try {
          await claimGiftedPack(next);
          // La fenêtre du cadeau occupe l'écran final : ni demande d'avis ni pub cette fois
          setUnlockedGift(next);
          return;
        } catch (e) {
          // Échec d'écriture : nouvel essai à la prochaine partie terminée
          if (__DEV__) console.warn('[partie] déblocage du pack offert impossible', e);
        }
      }
      // Pas après une partie d'essai : la proposition d'achat occupe déjà l'écran final
      if (!trialProduct) setTimeout(() => maybeRequestReview(count), REVIEW_DELAY_MS);
      // Pas non plus de pub après une partie d'essai : le joueur vient déjà d'en regarder une
      if (!trialProduct && shouldShowInterstitial(count)) {
        setAdDue(true);
        preloadInterstitial();
      }
    });
  };

  const upsell = (
    <ConfirmModal
      visible={upsellNext !== null}
      title={trialTheme ? (t.shop.packTitles[trialTheme] ?? '') : ''}
      message={purchaseFailed ? t.shop.errors.purchase : t.shop.upsellMsg}
      cancelLabel={t.shop.later}
      confirmLabel={trialPrice ? `${t.shop.unlock} · ${trialPrice}` : t.shop.unlock}
      confirmIcon="lock-open-variant"
      onCancel={() => {
        const next = upsellNext;
        closeUpsell();
        next?.();
      }}
      onConfirm={buyTrialPack}
      onDismiss={closeUpsell}
      onClose={closeUpsell}
      closeLabel={t.shop.close}
    />
  );

  const welcomeModal = (
    <ConfirmModal
      visible={unlockedGift !== null}
      title={t.gift.doneTitle}
      // Objectif suivant annoncé tout de suite : le compteur repart de 0 pour le pack d'après
      message={nextGift ? `${t.gift.doneMsg(packTitle(unlockedGift ?? undefined))}\n\n${t.gift.nextGoal(packTitle(nextGift), WELCOME_GAMES)}` : t.gift.doneMsg(packTitle(unlockedGift ?? undefined))}
      confirmLabel={t.gift.ok}
      confirmIcon="party-popper"
      onConfirm={() => setUnlockedGift(null)}
      onDismiss={() => setUnlockedGift(null)}
    />
  );

  if (settings.mode === 'survie') {
    return (
      <>
        <SurvieGame
          key={gameId}
          teams={teams}
          roundCount={settings.roundCount}
          selectedThemes={playableThemes}
          timer={settings.survieTimer}
          onReplay={replay}
          beforeLeave={beforeLeave}
          onFinished={onGameFinished}
        />
        {upsell}
        {welcomeModal}
      </>
    );
  }

  return (
    <>
      <Game
        key={gameId}
        teams={teams}
        roundCount={settings.roundCount}
        selectedThemes={playableThemes}
        onReplay={replay}
        beforeLeave={beforeLeave}
        onFinished={onGameFinished}
      />
      {upsell}
      {welcomeModal}
    </>
  );
}

type GameProps = {
  teams: GameTeam[];
  roundCount: number;
  selectedThemes: string[];
  onReplay: () => void;
  /** Appelé avant Revanche / Menu depuis l'écran final (proposition d'achat après un essai). */
  beforeLeave: (next: () => void) => void;
  /** Partie menée jusqu'à l'écran final (compteur de parties, demande d'avis). */
  onFinished: () => void;
};

type Confirm = 'quit' | 'skip' | null;

function Game({ teams, roundCount, selectedThemes, onReplay, beforeLeave, onFinished }: GameProps) {
  const showCategory = selectedThemes.length > 1;
  const t = getT(useLang().lang);
  const filteredQuestions =
    selectedThemes.length > 0 ? questions.filter((q) => selectedThemes.includes(q.theme)) : questions;
  const [state, dispatch] = useReducer(gameReducer, null, () => createGame(teams, roundCount, filteredQuestions));
  useOnFinal(state.phase === 'final', onFinished);
  const [confirm, setConfirm] = useState<Confirm>(null);
  // Transition « remporte les enchères » : 'covering' masque l'écran prêt, 'revealing' = fondu de sortie
  const [wonTransition, setWonTransition] = useState<'covering' | 'revealing' | null>(null);
  // Transition « à vous de jouer ! » entre l'écran prêt et le jeu — le chrono attend la fin
  const [playIntro, setPlayIntro] = useState<'covering' | 'revealing' | null>(null);
  // Transition de fin de tour (mise réussie / loupée) avant l'écran de résultat
  const [turnEnd, setTurnEnd] = useState<'covering' | 'revealing' | null>(null);
  // 'search' → pause auto avec fenêtre « Reprendre » (recherche web, app quittée), 'manual' → pause bouton, null → en cours
  const [pauseSource, setPauseSource] = useState<'search' | 'manual' | null>(null);
  const paused = pauseSource !== null;
  // Dernière action d'enchère : seule une mise (pas un passe) déclenche le pulse chez l'équipe suivante
  const [lastAuctionAction, setLastAuctionAction] = useState<'bid' | 'pass' | null>(null);
  const remainingMs = useCountdown(state.phase === 'play', paused || playIntro === 'covering', TURN_SECONDS, () =>
    dispatch({ type: 'END_TURN', reason: 'time' }),
  );
  useHapticWarning(remainingMs, 10);
  // App quittée en plein tour : même pause que la recherche web, avec la fenêtre « Reprendre » au retour
  usePauseOnBackground(state.phase === 'play', () => setPauseSource('search'));

  // Le chrono peut finir pendant que la confirmation « Terminer le tour » est ouverte.
  const [phase, setPhase] = useState(state.phase);
  if (phase !== state.phase) {
    if (phase === 'auction' && state.phase === 'ready') setWonTransition('covering');
    if (phase === 'ready' && state.phase === 'play') setPlayIntro('covering');
    if (phase === 'play' && state.phase === 'result') setTurnEnd('covering');
    setPhase(state.phase);
    setPauseSource(null);
    if (confirm === 'skip') setConfirm(null);
  }

  const goHome = () => router.dismissTo('/');
  useBackToQuitConfirm(() => (state.phase === 'final' ? goHome() : setConfirm('quit')));

  const searchWeb = (query: string) => {
    setPauseSource('search');
    // isPaused=true → PlayPhase blur son TextInput immédiatement, avant que le
    // navigateur s'ouvre. Quand le navigateur se ferme, le champ est déjà blurred.
    const url = query.trim()
      ? `https://www.google.com/search?q=${encodeURIComponent(query)}`
      : 'https://www.google.com';
    Linking.openURL(url).catch(() => {});
  };
  // Bandeau : l'équipe qui enchérit, puis celle qui a remporté l'enchère.
  const bannerTeam =
    state.phase === 'auction' || state.phase === 'final' ? state.teams[state.auction.current] : state.teams[contract(state).team];
  const banner =
    state.phase === 'final'
      ? { label: 'FIN DE LA PARTIE', color: colors.pink }
      : { label: bannerTeam.name, color: bannerTeam.color };

  const footer =
    state.phase === 'play' ? (
      <CounterFooter
        progress={state.progress}
        amount={contract(state).amount}
        onAdjust={(delta) => dispatch({ type: 'ADJUST', delta })}
      />
    ) : undefined;

  return (
    <GameLayout
      banner={banner}
      closeIcon
      onHome={() => (state.phase === 'final' ? goHome() : setConfirm('quit'))}
      footer={footer}
      scrollDisabled={state.phase === 'play' || state.phase === 'result' || state.phase === 'final'}
      overlay={
        pauseSource === 'search' && state.phase === 'play' ? (
          <PauseModal visible onResume={() => setPauseSource(null)} />
        ) : state.phase === 'final' ? (
          <ConfettiOverlay />
        ) : wonTransition && state.phase === 'ready' ? (
          <AuctionWonTransition
            team={state.teams[contract(state).team]}
            onReveal={() => setWonTransition('revealing')}
            onDone={() => setWonTransition(null)}
          />
        ) : playIntro && state.phase === 'play' ? (
          <PlayIntroTransition
            team={state.teams[contract(state).team]}
            holder={state.teams[opponent(state)]}
            onReveal={() => setPlayIntro('revealing')}
            onDone={() => setPlayIntro(null)}
          />
        ) : turnEnd && state.phase === 'result' ? (
          <TurnEndTransition
            team={state.teams[contract(state).team]}
            kind={isSuccess(state) ? 'madeBid' : 'missedBid'}
            count={isSuccess(state) ? state.progress : contract(state).amount}
            onReveal={() => setTurnEnd('revealing')}
            onDone={() => setTurnEnd(null)}
          />
        ) : undefined
      }
    >
      {state.phase === 'auction' ? (
        <AuctionPhase
          key={`${state.round}-${state.auction.current}`}
          state={state}
          justRaised={lastAuctionAction === 'bid'}
          showCategory={showCategory}
          onBid={(amount) => {
            setLastAuctionAction('bid');
            dispatch({ type: 'BID', amount });
          }}
          onPass={() => {
            setLastAuctionAction('pass');
            dispatch({ type: 'PASS' });
          }}
        />
      ) : null}
      {state.phase === 'ready' && wonTransition !== 'covering' ? <ReadyPhase state={state} onStart={() => { dispatch({ type: 'START_TURN' }); }} /> : null}
      {state.phase === 'play' && playIntro !== 'covering' ? (
        <PlayPhase
          state={state}
          remainingMs={remainingMs}
          onToggle={(label) => dispatch({ type: 'TOGGLE_ANSWER', label })}
          onWebSearch={searchWeb}
          onSkip={() => setConfirm('skip')}
          isPaused={paused}
          onTogglePause={() =>
            setPauseSource((s) => (s === null ? 'manual' : s === 'manual' ? null : s))
          }
        />
      ) : null}
      {state.phase === 'result' && turnEnd !== 'covering' ? (
        <ResultPhase
          state={state}
          onNext={() => { dispatch({ type: 'NEXT' }); }}
          isLastRound={isLastRound(state)}
        />
      ) : null}
      {state.phase === 'final' ? <FinalPhase state={state} onReplay={() => beforeLeave(onReplay)} onHome={() => beforeLeave(goHome)} /> : null}

      <ConfirmModal
        visible={confirm === 'quit'}
        title={t.common.quitTitle}
        message={t.common.quitMsg}
        confirmLabel={t.common.quit}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          goHome();
        }}
      />
      <ConfirmModal
        visible={confirm === 'skip'}
        title={t.common.endTurnTitle}
        message={t.common.endTurnMsg}
        confirmLabel={t.common.endTurnBtn}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          dispatch({ type: 'END_TURN', reason: 'skip' });
        }}
      />
    </GameLayout>
  );
}

function SurvieGame({ teams, roundCount, selectedThemes, timer, onReplay, beforeLeave, onFinished }: GameProps & { timer: SurvieTimer | null }) {
  const showCategory = selectedThemes.length > 1;
  const filteredQuestions =
    selectedThemes.length > 0 ? questions.filter((q) => selectedThemes.includes(q.theme)) : questions;
  const [state, dispatch] = useReducer(survieReducer, null, () =>
    createSurvieGame(teams, roundCount, filteredQuestions),
  );
  useOnFinal(state.phase === 'final', onFinished);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [pauseSource, setPauseSource] = useState<'search' | 'manual' | null>(null);
  // Popup « Éliminer <équipe> ? » — NON : PASSER reprend le chrono, temps écoulé vaut VALIDER
  const [confirmElim, setConfirmElim] = useState<'pass' | 'timeout' | null>(null);
  const { lang } = useLang();
  const t = getT(lang);
  // Transition « à vous de jouer ! » entre l'écran prêt et le jeu — SurviePlayPhase (et son chrono) monte à la fin
  const [playIntro, setPlayIntro] = useState<'covering' | 'revealing' | null>(null);
  const [teamSwitch, setTeamSwitch] = useState<'covering' | 'revealing' | null>(null);
  // Avant la première manche : téléphone posé au centre, visible par toutes les équipes
  const [phoneIntro, setPhoneIntro] = useState(true);
  // PASSER / temps écoulé : transition grise « <équipe> a séché ! » avant l'écran prêt ou le résultat
  const [elimination, setElimination] = useState<{ stage: 'covering' | 'revealing'; team: number } | null>(null);
  // Équipe au tour précédent = équipe éliminée quand on quitte la phase de jeu
  const [prevTeam, setPrevTeam] = useState(state.currentTeam);
  const [phase, setPhase] = useState(state.phase);
  if (phase !== state.phase) {
    if (phase === 'ready' && state.phase === 'play') setPlayIntro('covering');
    if (phase === 'play') setElimination({ stage: 'covering', team: prevTeam });
    // Une élimination en plein fondu démonte la transition rapide sans onDone : on la purge
    setTeamSwitch(null);
    setPhase(state.phase);
  }
  // Après VALIDER (cagnotte +1), transition rapide « <équipe suivante> à vous ! »
  const [jackpot, setJackpot] = useState(state.jackpot);
  if (jackpot !== state.jackpot) {
    if (state.phase === 'play') setTeamSwitch('covering');
    setJackpot(state.jackpot);
  }
  if (prevTeam !== state.currentTeam) setPrevTeam(state.currentTeam);
  const isPaused = pauseSource !== null || confirmElim !== null;
  usePauseOnBackground(state.phase === 'play', () => setPauseSource('search'));
  const goHome = () => router.dismissTo('/');
  useBackToQuitConfirm(() => (state.phase === 'final' ? goHome() : setConfirmQuit(true)));
  const currentTeam = state.teams[state.currentTeam];
  const showBorder = (state.phase === 'play' || state.phase === 'ready') && elimination?.stage !== 'covering' && !phoneIntro;

  return (
    <View style={{ flex: 1 }}>
    <GameLayout
      closeIcon
      onHome={() => (state.phase === 'final' ? goHome() : setConfirmQuit(true))}
      scrollDisabled={state.phase === 'play' || state.phase === 'ready' || state.phase === 'result'}
      overlay={
        phoneIntro && state.phase === 'ready' ? (
          <SurviePhoneIntro teams={state.teams} onDone={() => setPhoneIntro(false)} />
        ) : pauseSource === 'search' && state.phase === 'play' ? (
          <PauseModal visible onResume={() => setPauseSource(null)} />
        ) : state.phase === 'final' ? (
          <ConfettiOverlay />
        ) : playIntro && state.phase === 'play' ? (
          <PlayIntroTransition
            team={currentTeam}
            variant="survieStart"
            onReveal={() => setPlayIntro('revealing')}
            onDone={() => setPlayIntro(null)}
          />
        ) : elimination && (state.phase === 'ready' || state.phase === 'result') ? (
          <TurnEndTransition
            team={state.teams[elimination.team]}
            kind="eliminated"
            count={state.jackpot}
            onReveal={() => setElimination((e) => (e ? { ...e, stage: 'revealing' } : e))}
            onDone={() => setElimination(null)}
          />
        ) : teamSwitch && state.phase === 'play' ? (
          <PlayIntroTransition
            // Nouvelle instance à chaque validation, même si la précédente est encore en fondu
            key={state.jackpot}
            team={currentTeam}
            variant="survieNext"
            onReveal={() => setTeamSwitch('revealing')}
            onDone={() => setTeamSwitch(null)}
          />
        ) : undefined
      }
    >
      {state.phase === 'ready' && elimination?.stage !== 'covering' ? (
        <SurvieReadyPhase
          state={state}
          showCategory={showCategory}
          onStart={() => { dispatch({ type: 'START' }); setPauseSource(null); }}
        />
      ) : null}
      {state.phase === 'play' && playIntro !== 'covering' && teamSwitch !== 'covering' ? (
        <SurviePlayPhase
          key={`${state.round}-${state.currentTeam}`}
          state={state}
          onValidate={() => dispatch({ type: 'VALIDATE' })}
          onPass={() => setConfirmElim('pass')}
          onTimeout={() => setConfirmElim('timeout')}
          turnSeconds={timer === 'turbo' ? survieTurboSeconds(state) : timer}
          isPaused={isPaused}
          onTogglePause={() =>
            setPauseSource((s) => (s === null ? 'manual' : s === 'manual' ? null : s))
          }
        />
      ) : null}
      {state.phase === 'result' && elimination?.stage !== 'covering' ? (
        <SurvieResultPhase
          state={state}
          onNext={() => { dispatch({ type: 'NEXT' }); }}
          isLastRound={isLastSurvieRound(state)}
        />
      ) : null}
      {state.phase === 'final' ? (
        <SurvieFinalPhase state={state} onReplay={() => beforeLeave(onReplay)} onHome={() => beforeLeave(goHome)} />
      ) : null}

      {/* Mêmes codes que l'écran de jeu : dégradé = on continue (comme VALIDER), contour = élimination (comme PASSER) */}
      <ConfirmModal
        visible={confirmElim !== null && state.phase === 'play'}
        header={
          <View style={[styles.teamBadge, { backgroundColor: currentTeam.color }]}>
            <Text
              style={[styles.teamBadgeText, { color: BADGE_TEXT_COLOR[currentTeam.color] ?? colors.purpleDeep }]}
              numberOfLines={1}
            >
              {currentTeam.name}
            </Text>
          </View>
        }
        title={confirmElim === 'timeout' ? t.survie.elimTimeoutTitle : t.survie.elimPassTitle}
        message={confirmElim === 'timeout' ? t.survie.elimTimeoutMsg : t.survie.elimPassMsg}
        cancelLabel={confirmElim === 'timeout' ? t.survie.timeoutNo : t.survie.eliminate}
        cancelIcon="skull"
        confirmLabel={confirmElim === 'timeout' ? t.survie.timeoutYes : t.survie.resume}
        confirmIcon={confirmElim === 'timeout' ? 'check-bold' : 'play'}
        onCancel={() => {
          dispatch({ type: confirmElim === 'timeout' ? 'TIMEOUT' : 'PASS' });
          setConfirmElim(null);
        }}
        onConfirm={() => {
          if (confirmElim === 'timeout') dispatch({ type: 'VALIDATE' });
          setConfirmElim(null);
        }}
        // Choix obligatoire : un tap à côté ne doit ni éliminer ni valider
        onDismiss={() => {}}
      />
      <ConfirmModal
        visible={confirmQuit}
        title={t.common.quitTitle}
        message={t.common.quitMsg}
        confirmLabel={t.common.quit}
        onCancel={() => setConfirmQuit(false)}
        onConfirm={() => { setConfirmQuit(false); goHome(); }}
      />
    </GameLayout>
    {showBorder && <SurviePulseBorder color={currentTeam.color} />}
    </View>
  );
}

const styles = StyleSheet.create({
  teamBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  teamBadgeText: {
    fontFamily: fonts.displayMedium,
    fontSize: 18,
  },
});
