import { useState, useEffect } from 'react';
import { TournamentState, TournamentAction, Team, getTeamTotalPoints } from './types';
import { toast } from 'sonner';

interface Props {
  team: Team;
  state: TournamentState;
  dispatch: React.Dispatch<TournamentAction>;
  onClose: () => void;
}

interface EditableGame {
  gameNumber: number;
  kills: number;
  killPoints: number;
  placementPoints: number;
  originalKills: number;
  originalKillPoints: number;
  originalPlacementPoints: number;
}

export default function PointsAdjustModal({ team, state, dispatch, onClose }: Props) {
  const [games, setGames] = useState<EditableGame[]>([]);
  const [adjKill, setAdjKill] = useState(0);
  const [adjPlace, setAdjPlace] = useState(0);

  useEffect(() => {
    setGames(
      state.gameHistory.map(g => {
        const p = g.placements.find(pl => pl.teamId === team.id);
        return {
          gameNumber: g.gameNumber,
          kills: p?.kills ?? 0,
          killPoints: p?.killPoints ?? 0,
          placementPoints: p?.placementPoints ?? 0,
          originalKills: p?.kills ?? 0,
          originalKillPoints: p?.killPoints ?? 0,
          originalPlacementPoints: p?.placementPoints ?? 0,
        };
      }),
    );
  }, [state.gameHistory, team.id]);

  const handleSave = () => {
    // Save per-game overrides
    for (const g of games) {
      if (
        g.kills !== g.originalKills ||
        g.killPoints !== g.originalKillPoints ||
        g.placementPoints !== g.originalPlacementPoints
      ) {
        dispatch({
          type: 'OVERRIDE_GAME_SCORE',
          teamId: team.id,
          gameNumber: g.gameNumber,
          kills: g.kills,
          killPoints: g.killPoints,
          placementPoints: g.placementPoints,
        });
      }
    }
    // Save general adjustments
    if (adjKill !== 0 || adjPlace !== 0) {
      dispatch({
        type: 'ADJUST_POINTS',
        teamId: team.id,
        killPointsDelta: adjKill,
        placementPointsDelta: adjPlace,
      });
    }
    toast.success('Stig vistuð');
    onClose();
  };

  const updateGame = (idx: number, field: keyof EditableGame, value: number) => {
    setGames(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <div
        className="p-6 rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-auto"
        style={{ background: '#1a1a1f', border: '1px solid #3b82f6' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          LEIÐRÉTTA STIG
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          {team.name} — núv. {getTeamTotalPoints(team)} stig
        </p>

        {/* Per-game editable breakdown */}
        {games.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden" style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a30' }}>
                  <th className="text-left px-3 py-2 text-gray-500 font-bold text-xs">Leikur</th>
                  <th className="text-center px-2 py-2 text-gray-500 font-bold text-xs">Kills</th>
                  <th className="text-center px-2 py-2 text-gray-500 font-bold text-xs">K-stig</th>
                  <th className="text-center px-2 py-2 text-gray-500 font-bold text-xs">P-stig</th>
                  <th className="text-right px-3 py-2 text-gray-500 font-bold text-xs">Samtals</th>
                </tr>
              </thead>
              <tbody>
                {games.map((g, idx) => (
                  <tr key={g.gameNumber} style={{ borderBottom: '1px solid #1a1a1f' }}>
                    <td className="px-3 py-1.5 text-gray-300 font-bold">#{g.gameNumber}</td>
                    <td className="text-center px-1 py-1">
                      <input
                        type="number"
                        value={g.kills}
                        onChange={e => {
                          const kills = parseInt(e.target.value) || 0;
                          updateGame(idx, 'kills', kills);
                          updateGame(idx, 'killPoints', kills * state.killPointsPerKill);
                        }}
                        className="w-12 px-1 py-1 text-center rounded text-white text-xs font-bold"
                        style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
                      />
                    </td>
                    <td className="text-center px-1 py-1">
                      <input
                        type="number"
                        value={g.killPoints}
                        onChange={e => updateGame(idx, 'killPoints', parseInt(e.target.value) || 0)}
                        className="w-12 px-1 py-1 text-center rounded text-white text-xs font-bold"
                        style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
                      />
                    </td>
                    <td className="text-center px-1 py-1">
                      <input
                        type="number"
                        value={g.placementPoints}
                        onChange={e => updateGame(idx, 'placementPoints', parseInt(e.target.value) || 0)}
                        className="w-12 px-1 py-1 text-center rounded text-white text-xs font-bold"
                        style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
                      />
                    </td>
                    <td className="text-right px-3 py-1.5 font-bold" style={{ color: '#e8341c' }}>
                      {g.killPoints + g.placementPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* General adjustment */}
        <p className="text-xs text-gray-600 mb-2 mt-2">Almenn leiðrétting (bætist ofan á leikjastig)</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Kill stig (+/-)</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setAdjKill(v => v - 1)} className="w-10 h-10 rounded-lg text-lg font-bold" style={{ background: '#0d0d0f', border: '1px solid #2a2a30', color: '#e8341c' }}>−</button>
              <input type="number" value={adjKill} onChange={e => setAdjKill(parseInt(e.target.value) || 0)} className="w-20 px-2 py-2 text-center rounded-lg text-white font-bold" style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }} />
              <button onClick={() => setAdjKill(v => v + 1)} className="w-10 h-10 rounded-lg text-lg font-bold" style={{ background: '#0d0d0f', border: '1px solid #2a2a30', color: '#22c55e' }}>+</button>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Placement stig (+/-)</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setAdjPlace(v => v - 1)} className="w-10 h-10 rounded-lg text-lg font-bold" style={{ background: '#0d0d0f', border: '1px solid #2a2a30', color: '#e8341c' }}>−</button>
              <input type="number" value={adjPlace} onChange={e => setAdjPlace(parseInt(e.target.value) || 0)} className="w-20 px-2 py-2 text-center rounded-lg text-white font-bold" style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }} />
              <button onClick={() => setAdjPlace(v => v + 1)} className="w-10 h-10 rounded-lg text-lg font-bold" style={{ background: '#0d0d0f', border: '1px solid #2a2a30', color: '#22c55e' }}>+</button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 py-3 font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ fontFamily: 'Rajdhani, sans-serif', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff' }}
          >
            VISTA
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 font-bold rounded-xl text-gray-500 hover:text-white transition-colors"
            style={{ background: '#2a2a30', fontFamily: 'Rajdhani, sans-serif' }}
          >
            HÆTTA VIÐ
          </button>
        </div>
      </div>
    </div>
  );
}
