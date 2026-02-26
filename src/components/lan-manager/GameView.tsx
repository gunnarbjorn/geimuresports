import { useState } from 'react';
import { TournamentState, TournamentAction, getRankedTeams, getTeamTotalPoints } from './types';

interface Props {
  state: TournamentState;
  dispatch: React.Dispatch<TournamentAction>;
}

interface PlayerRef {
  teamId: string;
  playerIndex: number;
  name: string;
  teamName: string;
}

export default function GameView({ state, dispatch }: Props) {
  const [eliminatingPlayer, setEliminatingPlayer] = useState<PlayerRef | null>(null);
  const ranked = getRankedTeams(state.teams);

  // Build flat lists of alive/eliminated players
  const alivePlayers: PlayerRef[] = [];
  const eliminatedPlayers: PlayerRef[] = [];

  state.teams.forEach(team => {
    team.players.forEach((name, idx) => {
      const ref: PlayerRef = { teamId: team.id, playerIndex: idx, name, teamName: team.name };
      if (team.playersAlive[idx]) {
        alivePlayers.push(ref);
      } else {
        eliminatedPlayers.push(ref);
      }
    });
  });

  alivePlayers.sort((a, b) => a.name.localeCompare(b.name, 'is'));
  eliminatedPlayers.sort((a, b) => a.name.localeCompare(b.name, 'is'));

  const handleEliminate = (player: PlayerRef) => {
    setEliminatingPlayer(player);
  };

  const handleSelectKiller = (killerPlayer: PlayerRef) => {
    if (!eliminatingPlayer) return;
    dispatch({
      type: 'ELIMINATE_PLAYER',
      teamId: eliminatingPlayer.teamId,
      playerIndex: eliminatingPlayer.playerIndex,
      killerTeamId: killerPlayer.teamId,
    });
    setEliminatingPlayer(null);
  };

  const handleRevive = (player: PlayerRef) => {
    dispatch({ type: 'REVIVE_PLAYER', teamId: player.teamId, playerIndex: player.playerIndex });
  };

  const handleEndGame = () => {
    if (window.confirm(`Ljúka leik ${state.currentGame}? Placement stig verða reiknuð sjálfkrafa.`)) {
      dispatch({ type: 'END_GAME' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 h-full">
      {/* Left Panel: Players */}
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#22c55e' }}>
          🟢 SPILARAR Á LÍFI ({alivePlayers.length})
        </h2>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {alivePlayers.map(p => (
            <div
              key={`${p.teamId}-${p.playerIndex}`}
              className="p-3 rounded-xl flex items-center justify-between transition-all"
              style={{
                background: '#1a1a1f',
                border: '1px solid #22c55e33',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.08)',
              }}
            >
              <div className="min-w-0">
                <h3 className="font-bold text-base truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">{p.teamName}</p>
              </div>
              <button
                onClick={() => handleEliminate(p)}
                className="ml-2 px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(232, 52, 28, 0.2)',
                  border: '1px solid #e8341c',
                  color: '#e8341c',
                  fontFamily: 'Rajdhani, sans-serif',
                }}
              >
                FELL
              </button>
            </div>
          ))}
        </div>

        {/* Eliminated players */}
        {eliminatedPlayers.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-gray-500 mt-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              ÚR LEIK ({eliminatedPlayers.length})
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {eliminatedPlayers.map(p => (
                <div
                  key={`${p.teamId}-${p.playerIndex}`}
                  className="p-3 rounded-xl flex items-center justify-between opacity-50"
                  style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
                >
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm line-through truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">{p.teamName}</p>
                  </div>
                  <button
                    onClick={() => handleRevive(p)}
                    className="ml-2 px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 transition-all hover:scale-105"
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid #22c55e',
                      color: '#22c55e',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    REVIVE
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right Panel: Leaderboard */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          📊 STIGATAFLA
        </h2>

        <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          {ranked.map((team, i) => {
            const medalColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : undefined;
            return (
              <div
                key={team.id}
                className="flex items-center justify-between px-4 py-3 transition-all"
                style={{
                  borderBottom: i < ranked.length - 1 ? '1px solid #2a2a30' : undefined,
                  borderLeft: medalColor ? `3px solid ${medalColor}` : '3px solid transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold w-6 text-center"
                    style={{ fontFamily: 'Rajdhani, sans-serif', color: medalColor || '#666' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {team.name}
                    </span>
                    {team.alive && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">{team.killPoints}k</span>
                  <span className="text-gray-500">{team.placementPoints}p</span>
                  <span className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8341c' }}>
                    {getTeamTotalPoints(team)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-50"
        style={{ background: '#0d0d0fee', borderTop: '1px solid #2a2a30' }}
      >
        <span className="text-lg font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          LEIKUR {state.currentGame} AF 5
        </span>
        <button
          onClick={handleEndGame}
          className="px-8 py-3 font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            background: 'linear-gradient(135deg, #e8341c, #c62a17)',
            color: '#fff',
            boxShadow: '0 0 20px rgba(232, 52, 28, 0.3)',
          }}
        >
          LJÚKA LEIK
        </button>
      </div>

      {/* Elimination Modal */}
      {eliminatingPlayer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setEliminatingPlayer(null)}
        >
          <div
            className="p-6 rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-auto"
            style={{ background: '#1a1a1f', border: '1px solid #e8341c' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              HVER FELDI {eliminatingPlayer.name.toUpperCase()}?
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {eliminatingPlayer.name} ({eliminatingPlayer.teamName}) var felld/ur
            </p>
            <div className="grid gap-2">
              {alivePlayers
                .filter(p => !(p.teamId === eliminatingPlayer.teamId && p.playerIndex === eliminatingPlayer.playerIndex))
                .map(p => (
                  <button
                    key={`${p.teamId}-${p.playerIndex}`}
                    onClick={() => handleSelectKiller(p)}
                    className="w-full p-3 text-left rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: '#0d0d0f',
                      border: '1px solid #2a2a30',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    {p.name}
                    <span className="text-xs text-gray-500 ml-2">{p.teamName}</span>
                  </button>
                ))}
            </div>
            <button
              onClick={() => setEliminatingPlayer(null)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
            >
              Hætta við
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
