import { router } from 'expo-router';
import { useEffect, useReducer, useState } from 'react';

import { FinalPhase } from '@/components/game/FinalPhase';
import { IntroPhase } from '@/components/game/IntroPhase';
import { PlayPhase } from '@/components/game/PlayPhase';
import { ResultPhase } from '@/components/game/ResultPhase';
import { GameLayout } from '@/components/GameLayout';
import { ConfirmModal } from '@/components/InfoModal';
import { LabelButton, NextButton } from '@/components/PillButton';
import { questions } from '@/data/questions';
import { createGame, gameReducer, type GameTeam, isLastTurn, TURN_SECONDS } from '@/game/engine';
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
      sameTheme={settings.sameThemePerRound}
      onReplay={() => setGameId((id) => id + 1)}
    />
  );
}

type GameProps = {
  teams: GameTeam[];
  roundCount: number;
  sameTheme: boolean;
  onReplay: () => void;
};

type Confirm = 'quit' | 'skip' | null;

function Game({ teams, roundCount, sameTheme, onReplay }: GameProps) {
  const [state, dispatch] = useReducer(gameReducer, null, () => createGame(teams, roundCount, sameTheme, questions));
  const [confirm, setConfirm] = useState<Confirm>(null);
  const remainingMs = useCountdown(state.phase === 'play', TURN_SECONDS, () =>
    dispatch({ type: 'END_TURN', reason: 'time' }),
  );

  // Le chrono peut finir pendant que la confirmation « Terminer le tour » est ouverte.
  useEffect(() => {
    if (state.phase !== 'play') setConfirm((c) => (c === 'skip' ? null : c));
  }, [state.phase]);

  const goHome = () => router.dismissTo('/');
  const team = state.teams[state.turn];
  const banner = state.phase === 'final' ? { label: 'FIN DE LA PARTIE', color: colors.pink } : { label: team.name, color: team.color };

  const footer =
    state.phase === 'play' ? (
      <NextButton accessibilityLabel="Terminer le tour" onPress={() => setConfirm('skip')} />
    ) : state.phase === 'result' ? (
      <LabelButton label={isLastTurn(state) ? 'RÉSULTATS' : 'SUIVANT'} onPress={() => dispatch({ type: 'NEXT' })} />
    ) : undefined;

  return (
    <GameLayout banner={banner} onHome={() => (state.phase === 'final' ? goHome() : setConfirm('quit'))} footer={footer}>
      {state.phase === 'intro' ? <IntroPhase state={state} onStart={() => dispatch({ type: 'START_TURN' })} /> : null}
      {state.phase === 'play' ? (
        <PlayPhase
          state={state}
          remainingMs={remainingMs}
          onToggle={(index) => dispatch({ type: 'TOGGLE_ANSWER', index })}
        />
      ) : null}
      {state.phase === 'result' ? <ResultPhase state={state} /> : null}
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
        message="Les réponses validées jusqu’ici sont comptées."
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
