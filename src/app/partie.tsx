import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useReducer, useState } from 'react';
import { Keyboard } from 'react-native';

import { FinalPhase } from '@/components/game/FinalPhase';
import { AuctionPhase } from '@/components/game/AuctionPhase';
import { CounterFooter } from '@/components/game/CounterFooter';
import { PlayPhase } from '@/components/game/PlayPhase';
import { ReadyPhase } from '@/components/game/ReadyPhase';
import { ResultPhase } from '@/components/game/ResultPhase';
import { ConfettiOverlay } from '@/components/ConfettiOverlay';
import { GameLayout } from '@/components/GameLayout';
import { ConfirmModal, PauseModal } from '@/components/InfoModal';
import { questions } from '@/data/questions';
import { contract, createGame, gameReducer, type GameTeam, isLastRound, remaining, TURN_SECONDS } from '@/game/engine';
import { useCountdown } from '@/hooks/useCountdown';
import { useGameSettings } from '@/state/gameSettings';
import { colors, teamColors } from '@/theme';

export default function GameScreen() {
  const settings = useGameSettings();
  // Équipes par défaut si l'écran est ouvert sans passer par la configuration.
  const teams: GameTeam[] =
    settings.teams.length > 0
      ? settings.teams
      : Array.from({ length: settings.teamCount }, (_, i) => ({ name: `ÉQUIPE ${i + 1}`, color: teamColors[i] }));
  const [gameId, setGameId] = useState(0);

  return (
    <Game
      key={gameId}
      teams={teams}
      roundCount={settings.roundCount}
      onReplay={() => setGameId((id) => id + 1)}
    />
  );
}

type GameProps = {
  teams: GameTeam[];
  roundCount: number;
  onReplay: () => void;
};

type Confirm = 'quit' | 'skip' | null;

function Game({ teams, roundCount, onReplay }: GameProps) {
  const [state, dispatch] = useReducer(gameReducer, null, () => createGame(teams, roundCount, questions));
  const [confirm, setConfirm] = useState<Confirm>(null);
  // 'search' → pause auto (recherche web), 'manual' → pause bouton, null → en cours
  const [pauseSource, setPauseSource] = useState<'search' | 'manual' | null>(null);
  const paused = pauseSource !== null;
  const remainingMs = useCountdown(state.phase === 'play', paused, TURN_SECONDS, () =>
    dispatch({ type: 'END_TURN', reason: 'time' }),
  );

  // Le chrono peut finir pendant que la confirmation « Terminer le tour » est ouverte.
  const [phase, setPhase] = useState(state.phase);
  if (phase !== state.phase) {
    setPhase(state.phase);
    setPauseSource(null);
    if (confirm === 'skip') setConfirm(null);
  }

  const goHome = () => router.dismissTo('/');

  const searchWeb = (query: string) => {
    setPauseSource('search');
    // isPaused=true → PlayPhase blur son TextInput immédiatement, avant que le
    // navigateur s'ouvre. Quand le navigateur se ferme, le champ est déjà blurred.
    WebBrowser.openBrowserAsync(`https://www.google.com/search?q=${encodeURIComponent(query)}`).catch(() => {});
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
      onHome={() => (state.phase === 'final' ? goHome() : setConfirm('quit'))}
      footer={footer}
      scrollDisabled={state.phase === 'play' || state.phase === 'result' || state.phase === 'final'}
      overlay={
        pauseSource === 'search' && state.phase === 'play' ? (
          <PauseModal visible onResume={() => setPauseSource(null)} />
        ) : state.phase === 'final' ? (
          <ConfettiOverlay />
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
      {state.phase === 'ready' ? <ReadyPhase state={state} onStart={() => dispatch({ type: 'START_TURN' })} /> : null}
      {state.phase === 'play' ? (
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
      {state.phase === 'result' ? (
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
