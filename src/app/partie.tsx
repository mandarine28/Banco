import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useReducer, useState } from 'react';

import { FinalPhase } from '@/components/game/FinalPhase';
import { AuctionPhase } from '@/components/game/AuctionPhase';
import { PlayPhase } from '@/components/game/PlayPhase';
import { ReadyPhase } from '@/components/game/ReadyPhase';
import { ResultPhase } from '@/components/game/ResultPhase';
import { TimerBar } from '@/components/game/TimerBar';
import { GameLayout } from '@/components/GameLayout';
import { ConfirmModal, PauseModal } from '@/components/InfoModal';
import { LabelButton } from '@/components/PillButton';
import { questions } from '@/data/questions';
import { contract, createGame, gameReducer, type GameTeam, isLastRound, TURN_SECONDS } from '@/game/engine';
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
  // Chrono suspendu pendant une recherche web, jusqu'à ce que les joueurs reprennent.
  const [paused, setPaused] = useState(false);
  const remainingMs = useCountdown(state.phase === 'play', paused, TURN_SECONDS, () =>
    dispatch({ type: 'END_TURN', reason: 'time' }),
  );

  // Le chrono peut finir pendant que la confirmation « Terminer le tour » est ouverte.
  const [phase, setPhase] = useState(state.phase);
  if (phase !== state.phase) {
    setPhase(state.phase);
    setPaused(false);
    if (confirm === 'skip') setConfirm(null);
  }

  const goHome = () => router.dismissTo('/');

  const searchWeb = (query: string) => {
    setPaused(true);
    WebBrowser.openBrowserAsync(`https://www.google.com/search?q=${encodeURIComponent(query)}`).catch(() => {
      // Navigateur indisponible : la pause reste affichée, les joueurs reprennent à la main.
    });
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
      paused ? (
        <LabelButton label="REPRENDRE LE CHRONO" onPress={() => setPaused(false)} />
      ) : (
        <TimerBar remainingMs={remainingMs} onSkip={() => setConfirm('skip')} />
      )
    ) : state.phase === 'result' ? (
      <LabelButton label={isLastRound(state) ? 'RÉSULTATS' : 'SUIVANT'} onPress={() => dispatch({ type: 'NEXT' })} />
    ) : undefined;

  return (
    <GameLayout banner={banner} onHome={() => (state.phase === 'final' ? goHome() : setConfirm('quit'))} footer={footer}>
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
          onToggle={(label) => dispatch({ type: 'TOGGLE_ANSWER', label })}
          onAdjust={(delta) => dispatch({ type: 'ADJUST', delta })}
          onWebSearch={searchWeb}
        />
      ) : null}
      {state.phase === 'result' ? <ResultPhase state={state} /> : null}
      {state.phase === 'final' ? <FinalPhase state={state} onReplay={onReplay} onHome={goHome} /> : null}

      <PauseModal
        visible={paused && state.phase === 'play'}
        secondsLeft={Math.ceil(remainingMs / 1000)}
        onResume={() => setPaused(false)}
      />
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
