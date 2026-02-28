import { useState } from 'react';
import {
  SoloTournamentState,
  SoloTournamentAction,
  getRankedSoloPlayers,
  getSoloPlayerTotalPoints,
  getPlayerWins,
  getPlayerTotalKills,
} from './types';

interface Props {
  state: SoloTournamentState;
  dispatch: React.Dispatch<SoloTournamentAction>;
}

interface PlayerInput {
  playerId: string;
  kills: number;
  placement: number;
}

export default function SoloGameView({ state, dispatch }: Props) {
  const ranked = getRankedSoloPlayers(state.players);
  const [editingGame, setEditingGame] = useState<number | null>(null);

  const createEmptyInputs = (): PlayerInput[] =>
    state.players.map((p, i) => ({ playerId: p.id, kills: 0, placement: i + 1 }));

  const [inputs, setInputs] = useState<PlayerInput[]>(createEmptyInputs);

  const updateInput = (playerId: string, field: 'kills' | 'placement', value: number) => {
    setInputs(prev => prev.map(inp => (inp.playerId === playerId ? { ...inp, [field]: value } : inp)));
  };

  const getPreviewPoints = (inp: PlayerInput) => {
    const killPts = inp.kills * state.killPointsPerKill;
    const placePts = state.placementPointsConfig[inp.placement - 1] || 0;
    return { killPts, placePts, total: killPts + placePts };
  };

  const handleSubmit = () => {
    const hasValidPlacements = inputs.every(inp => inp.placement >= 1);
    if (!hasValidPlacements) return;

    if (editingGame !== null) {
      dispatch({ type: 'EDIT_GAME_RESULTS', gameNumber: editingGame, results: inputs });
      setEditingGame(null);
    } else {
      dispatch({ type: 'SUBMIT_GAME_RESULTS', results: inputs });
    }
    setInputs(createEmptyInputs());
  };

  const handleEditGame = (gameNumber: number) => {
    const game = state.gameHistory.find(g => g.gameNumber === gameNumber);
    if (!game) return;
    setEditingGame(gameNumber);
    setInputs(
      state.players.map(p => {
        const pl = game.placements.find(x => x.playerId === p.id);
        return { playerId: p.id, kills: pl?.kills || 0, placement: pl?.placement || 0 };
      })
    );
  };

  const cancelEdit = () => {
    setEditingGame(null);
    setInputs(createEmptyInputs());
  };

  const sortedInputs = [...inputs].sort((a, b) => a.placement - b.placement);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 h-full">
      {/* Left Panel: Game Input Form */}
      <div className="flex-1 flex flex-col gap-4">
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: editingGame ? '#f59e0b' : '#22c55e' }}
        >
          {editingGame ? `✏️ BREYTA LEIK ${editingGame}` : `🎮 LEIKUR ${state.currentGame} — NIÐURSTÖÐUR`}
        </h2>

        <div
          className="rounded-xl overflow-hidden"
          style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-[1fr_80px_80px_60px_60px_60px] gap-2 px-4 py-2 text-xs font-bold text-gray-500"
            style={{ fontFamily: 'Rajdhani, sans-serif', borderBottom: '1px solid #2a2a30' }}
          >
            <span>Leikmaður</span>
            <span className="text-center">Fellur</span>
            <span className="text-center">Sæti</span>
            <span className="text-center text-gray-600">K-stig</span>
            <span className="text-center text-gray-600">P-stig</span>
            <span className="text-center text-gray-600">Samt.</span>
          </div>

          {/* Rows */}
          <div className="max-h-[60vh] overflow-y-auto">
            {sortedInputs.map(inp => {
              const player = state.players.find(p => p.id === inp.playerId);
              if (!player) return null;
              const preview = getPreviewPoints(inp);
              return (
                <div
                  key={inp.playerId}
                  className="grid grid-cols-[1fr_80px_80px_60px_60px_60px] gap-2 px-4 py-2.5 items-center"
                  style={{ borderBottom: '1px solid #1f1f25' }}
                >
                  <span className="font-bold text-sm truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {player.name}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={inp.kills}
                    onChange={e => updateInput(inp.playerId, 'kills', Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-2 py-1.5 text-sm rounded text-white text-center"
                    style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }}
                  />
                  <input
                    type="number"
                    min={1}
                    max={state.players.length}
                    value={inp.placement}
                    onChange={e =>
                      updateInput(inp.playerId, 'placement', Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-full px-2 py-1.5 text-sm rounded text-white text-center"
                    style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }}
                  />
                  <span className="text-center text-xs text-gray-500">{preview.killPts}</span>
                  <span className="text-center text-xs text-gray-500">{preview.placePts}</span>
                  <span
                    className="text-center text-sm font-bold"
                    style={{ color: '#e8341c', fontFamily: 'Rajdhani, sans-serif' }}
                  >
                    {preview.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

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
                  <button
                    onClick={() => handleEditGame(game.gameNumber)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all hover:scale-105"
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid #f59e0b55',
                      color: '#f59e0b',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    ✏️ BREYTA
                  </button>
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
          {/* Leaderboard header */}
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
            const totalKills = getPlayerTotalKills(player.id, state.gameHistory);
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
                  <span
                    className="text-sm font-bold w-6 text-center"
                    style={{ fontFamily: 'Rajdhani, sans-serif', color: medalColor || '#666' }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-bold text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {player.name}
                  </span>
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
          {editingGame
            ? `BREYTA LEIK ${editingGame}`
            : `LEIKUR ${state.currentGame} AF ${state.totalGames}`}
        </span>
        <div className="flex gap-3">
          {editingGame && (
            <button
              onClick={cancelEdit}
              className="px-6 py-3 font-bold rounded-xl transition-all hover:scale-105"
              style={{
                fontFamily: 'Rajdhani, sans-serif',
                background: '#2a2a30',
                color: '#888',
              }}
            >
              HÆTTA VIÐ
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="px-8 py-3 font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: editingGame
                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              boxShadow: editingGame
                ? '0 0 20px rgba(245, 158, 11, 0.3)'
                : '0 0 20px rgba(34, 197, 94, 0.3)',
            }}
          >
            {editingGame ? '💾 VISTA BREYTINGAR' : '✅ VISTA LEIK'}
          </button>
        </div>
      </div>
    </div>
  );
}
