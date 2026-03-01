import { useState, useEffect } from 'react';
import {
  SoloTournamentState,
  SoloTournamentAction,
  SoloPlayer,
  getRankedSoloPlayers,
  getSoloPlayerTotalPoints,
  getPlayerWins,
  getPlayerTotalKills,
} from './types';

interface Props {
  state: SoloTournamentState;
  dispatch: React.Dispatch<SoloTournamentAction>;
}

export default function SoloGameView({ state, dispatch }: Props) {
  // killerPlayer = the player who GOT a kill (clicked + FELLA)
  const [killerPlayer, setKillerPlayer] = useState<SoloPlayer | null>(null);
  // For storm/fall deaths where no one gets kill credit
  const [showDeathDialog, setShowDeathDialog] = useState<'storm' | 'fall' | null>(null);
  const [showWinner, setShowWinner] = useState(false);

  const alivePlayers = state.players
    .filter(p => p.alive)
    .sort((a, b) => a.name.localeCompare(b.name, 'is'));

  const eliminatedPlayers = [...state.eliminationOrder]
    .reverse()
    .map(id => state.players.find(p => p.id === id)!)
    .filter(Boolean);

  const ranked = getRankedSoloPlayers(state.players);

  // Detect winner
  useEffect(() => {
    if (alivePlayers.length === 1 && state.players.length > 1 && !showWinner) {
      setShowWinner(true);
    }
  }, [alivePlayers.length, state.players.length]);

  // Player clicked + FELLA → they got a kill, now pick victim
  const handleKillClick = (player: SoloPlayer) => {
    setKillerPlayer(player);
  };

  // Select victim from dialog → victim dies, killer gets +1
  const handleSelectVictim = (victimId: string) => {
    if (!killerPlayer) return;
    dispatch({
      type: 'ELIMINATE_PLAYER',
      playerId: victimId,
      killerPlayerId: killerPlayer.id,
    });
    setKillerPlayer(null);
  };

  // Storm/Fall death → select who died, no kill credit
  const handleStormFallDeath = (victimId: string) => {
    const deathType = showDeathDialog === 'storm' ? '__storm__' : '__fall_damage__';
    dispatch({
      type: 'ELIMINATE_PLAYER',
      playerId: victimId,
      killerPlayerId: deathType,
    });
    setShowDeathDialog(null);
  };

  const handleRevive = (player: SoloPlayer) => {
    dispatch({ type: 'REVIVE_PLAYER', playerId: player.id });
    setShowWinner(false);
  };

  const handleEndGame = () => {
    dispatch({ type: 'END_GAME' });
    setShowWinner(false);
  };

  const winnerPlayer = alivePlayers.length === 1 ? alivePlayers[0] : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 h-full">
      {/* Left Panel: Players */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#22c55e' }}>
            🟢 Á LÍFI ({alivePlayers.length})
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeathDialog('storm')}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all hover:scale-105"
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #f59e0b55',
                color: '#f59e0b',
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              🌪️ STORMUR
            </button>
            <button
              onClick={() => setShowDeathDialog('fall')}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all hover:scale-105"
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #f59e0b55',
                color: '#f59e0b',
                fontFamily: 'Rajdhani, sans-serif',
              }}
            >
              💥 FALL DAMAGE
            </button>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-2">
          {alivePlayers.map(p => (
            <div
              key={p.id}
              className="p-5 rounded-xl flex items-center justify-between transition-all min-h-[80px]"
              style={{
                background: '#1a1a1f',
                border: '1px solid #22c55e33',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.08)',
              }}
            >
              <div className="min-w-0">
                <h3 className="font-bold text-xl truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">{p.fullName}</p>
                {p.gameKills > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: '#e8341c' }}>
                    {p.gameKills} fell í þessum leik
                  </p>
                )}
              </div>
              <button
                onClick={() => handleKillClick(p)}
                className="ml-3 px-6 py-3 text-sm font-bold rounded-lg shrink-0 transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  color: '#22c55e',
                  fontFamily: 'Rajdhani, sans-serif',
                }}
              >
                + FELLA
              </button>
            </div>
          ))}
        </div>

        {/* Eliminated players */}
        {eliminatedPlayers.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-gray-500 mt-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              FALLNIR ({eliminatedPlayers.length})
            </h3>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {eliminatedPlayers.map(p => {
                const placement = state.players.length - state.eliminationOrder.indexOf(p.id);
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl flex items-center justify-between opacity-50"
                    style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
                  >
                    <div className="min-w-0">
                      <h3
                        className="font-bold text-sm line-through truncate"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        {p.name}
                      </h3>
                      <p className="text-xs text-gray-600">#{placement}. sæti</p>
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
                );
              })}
            </div>
          </>
        )}

        {/* Game History */}
        {state.gameHistory.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold text-gray-400 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              LEIKJASAGA
            </h3>
            <div className="grid gap-2">
              {state.gameHistory.map(game => (
                <div
                  key={game.gameNumber}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
                >
                  <div>
                    <span className="font-bold text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Leikur {game.gameNumber}
                    </span>
                    <span className="text-xs text-gray-500 ml-3">
                      🥇{' '}
                      {state.players.find(p => p.id === game.placements.find(x => x.placement === 1)?.playerId)
                        ?.name || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Leaderboard */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          📊 STIGATAFLA
        </h2>
        <div
          className="rounded-xl overflow-hidden max-h-[70vh] overflow-y-auto"
          style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
        >
          <div
            className="flex items-center justify-between px-4 py-2 text-xs text-gray-500 font-bold"
            style={{ borderBottom: '1px solid #2a2a30', fontFamily: 'Rajdhani, sans-serif' }}
          >
            <span>Leikmaður</span>
            <div className="flex items-center gap-3">
              <span className="w-10 text-center">Sigrar</span>
              <span className="w-10 text-center">Fellur</span>
              <span className="w-12 text-center">Stig</span>
            </div>
          </div>
          {ranked.map((player, i) => {
            const medalColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : undefined;
            const wins = getPlayerWins(player.id, state.gameHistory);
            const totalKills = getPlayerTotalKills(player.id, state.gameHistory) + player.gameKills;
            const isAlive = player.alive;
            return (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-2.5 transition-all"
                style={{
                  borderBottom: i < ranked.length - 1 ? '1px solid #2a2a30' : undefined,
                  borderLeft: medalColor ? `3px solid ${medalColor}` : '3px solid transparent',
                  opacity: isAlive ? 1 : 0.4,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold w-6 text-center"
                    style={{ fontFamily: 'Rajdhani, sans-serif', color: medalColor || '#666' }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-bold text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {player.name}
                  </span>
                  {isAlive && (
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-10 text-center text-yellow-500">{wins > 0 ? `${wins}🏆` : '—'}</span>
                  <span className="w-10 text-center text-gray-500">{totalKills}</span>
                  <span
                    className="w-12 text-center font-bold text-lg"
                    style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8341c' }}
                  >
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
          LEIKUR {state.currentGame} AF {state.totalGames} — {alivePlayers.length} á lífi
        </span>
        <div className="flex gap-3">
          {winnerPlayer && (
            <button
              onClick={handleEndGame}
              className="px-8 py-3 font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
              }}
            >
              ✅ VISTA LEIK
            </button>
          )}
        </div>
      </div>

      {/* Kill Dialog: "Hvern felldi [nafn]?" — select victim */}
      {killerPlayer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setKillerPlayer(null)}
        >
          <div
            className="p-6 rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-auto"
            style={{ background: '#1a1a1f', border: '1px solid #22c55e' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              HVERN FELLDI {killerPlayer.name.toUpperCase()}?
            </h3>

            <div className="grid gap-2">
              {alivePlayers
                .filter(p => p.id !== killerPlayer.id)
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectVictim(p.id)}
                    className="w-full p-3 text-left rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: '#0d0d0f',
                      border: '1px solid #2a2a30',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    {p.name}
                    <span className="text-xs text-gray-500 ml-2">{p.fullName}</span>
                  </button>
                ))}
            </div>

            <button
              onClick={() => setKillerPlayer(null)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
            >
              Hætta við
            </button>
          </div>
        </div>
      )}

      {/* Storm/Fall Damage Dialog: select who died */}
      {showDeathDialog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setShowDeathDialog(null)}
        >
          <div
            className="p-6 rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-auto"
            style={{ background: '#1a1a1f', border: '1px solid #f59e0b' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f59e0b' }}>
              {showDeathDialog === 'storm' ? '🌪️ STORMUR' : '💥 FALL DAMAGE'}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Hver dó? Enginn fær fell-stig.
            </p>

            <div className="grid gap-2">
              {alivePlayers.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleStormFallDeath(p.id)}
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
              onClick={() => setShowDeathDialog(null)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
            >
              Hætta við
            </button>
          </div>
        </div>
      )}

      {/* Winner Popup */}
      {showWinner && winnerPlayer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}
        >
          <div
            className="p-8 rounded-2xl text-center max-w-sm mx-4"
            style={{
              background: '#1a1a1f',
              border: '2px solid #ffd700',
              boxShadow: '0 0 60px rgba(255, 215, 0, 0.3)',
            }}
          >
            <span className="text-6xl mb-4 block">🏆</span>
            <h2
              className="text-3xl font-black mb-2"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: '#ffd700' }}
            >
              {winnerPlayer.name.toUpperCase()}
            </h2>
            <p className="text-gray-400 mb-6" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              VANN LEIKINN!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowWinner(false)}
                className="px-6 py-3 font-bold rounded-xl transition-all hover:scale-105"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: '#2a2a30',
                  color: '#888',
                }}
              >
                LOKA
              </button>
              <button
                onClick={handleEndGame}
                className="px-8 py-3 font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                }}
              >
                ✅ VISTA LEIK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
