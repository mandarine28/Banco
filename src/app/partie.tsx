import { router } from 'expo-router';
import { useReducer, useState } from 'react';
import { Keyboard, Linking, View } from 'react-native';

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
import { SurviePlayPhase } from '@/components/game/SurviePlayPhase';
import { SurvieReadyPhase } from '@/components/game/SurvieReadyPhase';
import { SurvieResultPhase } from '@/components/game/SurvieResultPhase';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { GameLayout } from '@/components/GameLayout';
import { ConfirmModal, PauseModal } from '@/components/InfoModal';
import { questions } from '@/data/questions';
import { contract, createGame, gameReducer, type GameTeam, isLastRound, isSuccess, opponent, remaining, TURN_SECONDS } from '@/game/engine';
import { createSurvieGame, isLastSurvieRound, survieReducer } from '@/game/survie-engine';
import { useCountdown } from '@/hooks/useCountdown';
import { useGameSettings } from '@/state/gameSettings';
import { SurviePulseBorder } from '@/state/survieOverlay';
import { colors, teamColors } from '@/theme';

export default function GameScreen() {
  const settings = useGameSettings();
  const teams: GameTeam[] =
    settings.teams.length > 0
      ? settings.teams
      : Array.from({ length: settings.teamCount }, (_, i) => ({ name: `ÉQUIPE ${i + 1}`, color: teamColors[i] }));
  const [gameId, setGameId] = useState(0);

  if (settings.mode === 'survie') {
    return (
      <SurvieGame
        key={gameId}
        teams={teams}
        roundCount={settings.roundCount}
        selectedThemes={settings.selectedThemes}
        onReplay={() => setGameId((id) => id + 1)}
      />
    );
  }

  return (
    <Game
      key={gameId}
      teams={teams}
      roundCount={settings.roundCount}
      selectedThemes={settings.selectedThemes}
      onReplay={() => setGameId((id) => id + 1)}
    />
  );
}

// Fond navy + pattern 1 % pendant la manche (accessibilité) : de l'écran prêt jusqu'au résultat, dans les deux modes
function roundBackground(phase: string) {
  return phase === 'ready' || phase === 'play' || phase === 'result'
    ? { background: colors.purpleDeep, patternOpacity: 0.01 }
    : {};
}

type GameProps = {
  teams: GameTeam[];
  roundCount: number;
  selectedThemes: string[];
  onReplay: () => void;
};

type Confirm = 'quit' | 'skip' | null;

function Game({ teams, roundCount, selectedThemes, onReplay }: GameProps) {
  const filteredQuestions =
    selectedThemes.length > 0 ? questions.filter((q) => selectedThemes.includes(q.theme)) : questions;
  const [state, dispatch] = useReducer(gameReducer, null, () => createGame(teams, roundCount, filteredQuestions));
  const [confirm, setConfirm] = useState<Confirm>(null);
  // Transition « remporte les enchères » : 'covering' masque l'écran prêt, 'revealing' = fondu de sortie
  const [wonTransition, setWonTransition] = useState<'covering' | 'revealing' | null>(null);
  // Transition « à vous de jouer ! » entre l'écran prêt et le jeu — le chrono attend la fin
  const [playIntro, setPlayIntro] = useState<'covering' | 'revealing' | null>(null);
  // Transition de fin de tour (mise réussie / loupée) avant l'écran de résultat
  const [turnEnd, setTurnEnd] = useState<'covering' | 'revealing' | null>(null);
  // Puis, si la mise est loupée, « l'adversaire remporte la manche » — en fondu enchaîné avec turnEnd
  const [roundWin, setRoundWin] = useState<'covering' | 'revealing' | null>(null);
  // 'search' → pause auto (recherche web), 'manual' → pause bouton, null → en cours
  const [pauseSource, setPauseSource] = useState<'search' | 'manual' | null>(null);
  const paused = pauseSource !== null;
  const remainingMs = useCountdown(state.phase === 'play', paused || playIntro === 'covering', TURN_SECONDS, () =>
    dispatch({ type: 'END_TURN', reason: 'time' }),
  );

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
        left={remaining(state)}
        amount={contract(state).amount}
        onAdjust={(delta) => dispatch({ type: 'ADJUST', delta })}
      />
    ) : undefined;

  return (
    <GameLayout
      banner={banner}
      closeIcon
      {...roundBackground(state.phase)}
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
        ) : (turnEnd || roundWin) && state.phase === 'result' ? (
          <>
            {roundWin ? (
              <TurnEndTransition
                team={state.teams[opponent(state)]}
                kind="roundWon"
                count={contract(state).amount}
                onReveal={() => setRoundWin('revealing')}
                onDone={() => setRoundWin(null)}
              />
            ) : null}
            {turnEnd ? (
              <TurnEndTransition
                team={state.teams[contract(state).team]}
                kind={isSuccess(state) ? 'madeBid' : 'missedBid'}
                count={isSuccess(state) ? state.progress : contract(state).amount}
                onReveal={() => (isSuccess(state) ? setTurnEnd('revealing') : setRoundWin('covering'))}
                onDone={() => setTurnEnd(null)}
              />
            ) : null}
          </>
        ) : undefined
      }
    >
      {state.phase === 'auction' ? (
        <AuctionPhase
          key={`${state.round}-${state.auction.current}`}
          state={state}
          onBid={(amount) => dispatch({ type: 'BID', amount })}
          onPass={() => dispatch({ type: 'PASS' })}
        />
      ) : null}
      {state.phase === 'ready' && wonTransition !== 'covering' ? <ReadyPhase state={state} onStart={() => dispatch({ type: 'START_TURN' })} /> : null}
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
      {state.phase === 'result' && turnEnd !== 'covering' && roundWin !== 'covering' ? (
        <ResultPhase
          state={state}
          onNext={() => dispatch({ type: 'NEXT' })}
          isLastRound={isLastRound(state)}
        />
      ) : null}
      {state.phase === 'final' ? <FinalPhase state={state} onReplay={onReplay} onHome={goHome} /> : null}

      <ConfirmModal
        visible={confirm === 'quit'}
        title="Quitter la partie ?"
        message="La partie en cours sera perdue."
        confirmLabel="QUITTER"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          goHome();
        }}
      />
      <ConfirmModal
        visible={confirm === 'skip'}
        title="Terminer le tour ?"
        message="Si la mise n’est pas atteinte, elle revient à l’adversaire."
        confirmLabel="TERMINER"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          dispatch({ type: 'END_TURN', reason: 'skip' });
        }}
      />
    </GameLayout>
  );
}

function SurvieGame({ teams, roundCount, selectedThemes, onReplay }: GameProps) {
  const filteredQuestions =
    selectedThemes.length > 0 ? questions.filter((q) => selectedThemes.includes(q.theme)) : questions;
  const [state, dispatch] = useReducer(survieReducer, null, () =>
    createSurvieGame(teams, roundCount, filteredQuestions),
  );
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [pauseSource, setPauseSource] = useState<'search' | 'manual' | null>(null);
  // Transition « à vous de jouer ! » entre l'écran prêt et le jeu — SurviePlayPhase (et son chrono) monte à la fin
  const [playIntro, setPlayIntro] = useState<'covering' | 'revealing' | null>(null);
  const [phase, setPhase] = useState(state.phase);
  if (phase !== state.phase) {
    if (phase === 'ready' && state.phase === 'play') setPlayIntro('covering');
    setPhase(state.phase);
  }
  const isPaused = pauseSource !== null;
  const goHome = () => router.dismissTo('/');
  const currentTeam = state.teams[state.currentTeam];
  const showBorder = state.phase === 'play' || state.phase === 'ready';

  const searchWeb = (query: string) => {
    setPauseSource('search');
    const url = query.trim()
      ? `https://www.google.com/search?q=${encodeURIComponent(query)}`
      : 'https://www.google.com';
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={{ flex: 1 }}>
    <GameLayout
      closeIcon
      {...roundBackground(state.phase)}
      onHome={() => (state.phase === 'final' ? goHome() : setConfirmQuit(true))}
      scrollDisabled={state.phase === 'play' || state.phase === 'ready' || state.phase === 'result'}
      overlay={
        pauseSource === 'search' && state.phase === 'play' ? (
          <PauseModal visible onResume={() => setPauseSource(null)} />
        ) : state.phase === 'final' ? (
          <ConfettiOverlay />
        ) : playIntro && state.phase === 'play' ? (
          <PlayIntroTransition
            team={currentTeam}
            isSurvie
            onReveal={() => setPlayIntro('revealing')}
            onDone={() => setPlayIntro(null)}
          />
        ) : undefined
      }
    >
      {state.phase === 'ready' ? (
        <SurvieReadyPhase
          state={state}
          onStart={() => { dispatch({ type: 'START' }); setPauseSource(null); }}
        />
      ) : null}
      {state.phase === 'play' && playIntro !== 'covering' ? (
        <SurviePlayPhase
          key={`${state.round}-${state.currentTeam}`}
          state={state}
          onValidate={(answer) => dispatch({ type: 'VALIDATE', answer })}
          onPass={() => dispatch({ type: 'PASS' })}
          onTimeout={() => dispatch({ type: 'TIMEOUT' })}
          isPaused={isPaused}
          onTogglePause={() =>
            setPauseSource((s) => (s === null ? 'manual' : s === 'manual' ? null : s))
          }
          onWebSearch={searchWeb}
        />
      ) : null}
      {state.phase === 'result' ? (
        <SurvieResultPhase
          state={state}
          onNext={() => dispatch({ type: 'NEXT' })}
          isLastRound={isLastSurvieRound(state)}
        />
      ) : null}
      {state.phase === 'final' ? (
        <SurvieFinalPhase state={state} onReplay={onReplay} onHome={goHome} />
      ) : null}

      <ConfirmModal
        visible={confirmQuit}
        title="Quitter la partie ?"
        message="La partie en cours sera perdue."
        confirmLabel="QUITTER"
        onCancel={() => setConfirmQuit(false)}
        onConfirm={() => { setConfirmQuit(false); goHome(); }}
      />
    </GameLayout>
    {showBorder && <SurviePulseBorder color={currentTeam.color} />}
    </View>
  );
}
