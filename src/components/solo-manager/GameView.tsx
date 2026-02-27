import { useState } from 'react';
import { SoloTournamentState, SoloTournamentAction, getRankedSoloPlayers, getSoloPlayerTotalPoints, SoloPlayer } from './types';

interface Props {
  state: SoloTournamentState;
  dispatch: React.Dispatch<SoloTournamentAction>;
}

export default function SoloGameView({ state, dispatch }: Props) {
  const [eliminatingPlayer, setEliminatingPlayer] = useState<SoloPlayer | null>(null);
  const ranked = getRankedSoloPlayers(state.players);

  const alivePlayers = state.players.filter(p => p.alive).sort((a, b) => a.name.localeCompare(b.name, 'is'));
  const eliminatedPlayers = state.players.filter(p => !p.alive).sort((a, b) => a.name.localeCompare(b.name, 'is'));

  const handleSelectKiller = (killer: SoloPlayer) => {
    if (!eliminatingPlayer) return;
    dispatch({
      type: 'ELIMINATE_PLAYER',
      playerId: eliminatingPlayer.id,
      killerPlayerId: killer.id,
    });
    setEliminatingPlayer(null);
  };

  const handleStormKill = () => {
    if (!eliminatingPlayer) return;
    dispatch({
      type: 'ELIMINATE_PLAYER',
      playerId: eliminatingPlayer.id,
      killerPlayerId: '__storm__',
    });
    setEliminatingPlayer(null);
  };

  const handleRevive = (player: SoloPlayer) => {
    dispatch({ type: 'REVIVE_PLAYER', playerId: player.id });
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
          🟢 Á LÍFI ({alivePlayers.length})
        </h2>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {alivePlayers.map(p => (
            <div
              key={p.id}
              className="p-4 rounded-xl flex items-center justify-between transition-all min-h-[70px]"
              style={{
                background: '#1a1a1f',
                border: '1px solid #22c55e33',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.08)',
              }}
            >
              <div className="min-w-0">
                <h3 className="font-bold text-lg truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {p.gameKills > 0 && <span className="text-red-400">{p.gameKills} kills</span>}
                </p>
              </div>
              <button
                onClick={() => setEliminatingPlayer(p)}
                className="ml-2 px-5 py-2.5 text-sm font-bold rounded-lg shrink-0 transition-all hover:scale-105 active:scale-95"
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

        {eliminatedPlayers.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-gray-500 mt-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              ÚR LEIK ({eliminatedPlayers.length})
            </h3>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
              {eliminatedPlayers.map(p => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl flex items-center justify-between opacity-50"
                  style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
                >
                  <h3 className="font-bold text-sm line-through truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {p.name}
                  </h3>
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
        <div className="rounded-xl overflow-hidden max-h-[70vh] overflow-y-auto" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          {ranked.map((player, i) => {
            const medalColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : undefined;
            return (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-2.5 transition-all"
                style={{
                  borderBottom: i < ranked.length - 1 ? '1px solid #2a2a30' : undefined,
                  borderLeft: medalColor ? `3px solid ${medalColor}` : '3px solid transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold w-6 text-center" style={{ fontFamily: 'Rajdhani, sans-serif', color: medalColor || '#666' }}>
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {player.name}
                    </span>
                    {player.alive && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">{player.killPoints}k</span>
                  <span className="text-gray-500">{player.placementPoints}p</span>
                  <span className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8341c' }}>
                    {getSoloPlayerTotalPoints(player)}
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
          LEIKUR {state.currentGame} AF {state.totalGames} · {alivePlayers.length} á lífi
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
            className="p-6 rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-auto"
            style={{ background: '#1a1a1f', border: '1px solid #e8341c' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              HVER FELDI {eliminatingPlayer.name.toUpperCase()}?
            </h3>
            <p className="text-sm text-gray-400 mb-4">{eliminatingPlayer.name} var felld/ur</p>
            <div className="grid gap-2">
              <button
                onClick={handleStormKill}
                className="w-full p-3 text-left rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid #f59e0b',
                  color: '#f59e0b',
                  fontFamily: 'Rajdhani, sans-serif',
                }}
              >
                ⚡ Stormur / Fall damage
                <span className="text-xs ml-2 opacity-60">Engin kill stig</span>
              </button>
              {alivePlayers
                .filter(p => p.id !== eliminatingPlayer.id)
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectKiller(p)}
                    className="w-full p-3 text-left rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: '#0d0d0f',
                      border: '1px solid #2a2a30',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    {p.name}
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
