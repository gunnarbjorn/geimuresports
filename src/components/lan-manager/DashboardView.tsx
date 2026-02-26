import { TournamentState, TournamentAction, getRankedTeams, getTeamTotalPoints, DEFAULT_PLACEMENT_POINTS } from './types';
import { useState } from 'react';

interface Props {
  state: TournamentState;
  dispatch: React.Dispatch<TournamentAction>;
}

export default function DashboardView({ state, dispatch }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState(state.placementPointsConfig);
  const [killPts, setKillPts] = useState(state.killPointsPerKill);

  const handleStart = () => dispatch({ type: 'START_TOURNAMENT' });
  const handleReset = () => {
    if (window.confirm('Ertu viss? Þetta eyðir öllum stigum og byrjar upp á nýtt.')) {
      dispatch({ type: 'RESET_TOURNAMENT' });
    }
  };

  const handleSaveConfig = () => {
    dispatch({ type: 'UPDATE_PLACEMENT_CONFIG', config });
    dispatch({ type: 'UPDATE_KILL_POINTS', killPointsPerKill: killPts });
    setShowSettings(false);
  };

  const ranked = getRankedTeams(state.teams);
  const hasPoints = ranked.some(t => getTeamTotalPoints(t) > 0);

  return (
    <div className="flex flex-col items-center gap-8 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          FORTNITE DUO LAN
        </h1>
        <p className="text-lg text-gray-400 mt-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          Lau 28. feb · 13:00–16:00
        </p>
        {state.gameHistory.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {state.gameHistory.length} leikir kláraðir
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleStart}
          className="px-12 py-4 text-2xl font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: '#fff',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)',
          }}
        >
          🎮 BYRJA MÓT
        </button>

        <button
          onClick={handleReset}
          className="px-8 py-2 text-sm font-bold rounded-lg transition-all hover:scale-105"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            background: 'rgba(232, 52, 28, 0.2)',
            border: '1px solid #e8341c',
            color: '#e8341c',
          }}
        >
          RESET / STOP MÓT
        </button>
      </div>

      {/* Settings toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        ⚙️ Stigagjöf stillingar
      </button>

      {showSettings && (
        <div className="p-4 rounded-xl w-full max-w-md" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          {/* Kill points config */}
          <h3 className="text-sm font-bold mb-3 text-gray-300" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            STIG FYRIR FELL (KILL)
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="number"
              min={0}
              value={killPts}
              onChange={e => setKillPts(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 px-2 py-1 text-sm rounded text-white text-center"
              style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }}
            />
            <span className="text-xs text-gray-600">stig per kill</span>
          </div>

          <h3 className="text-sm font-bold mb-3 text-gray-300" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            PLACEMENT STIG
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {config.map((pts, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-8">{i + 1}.</span>
                <input
                  type="number"
                  value={pts}
                  onChange={e => {
                    const newConfig = [...config];
                    newConfig[i] = parseInt(e.target.value) || 0;
                    setConfig(newConfig);
                  }}
                  className="w-16 px-2 py-1 text-sm rounded text-white text-center"
                  style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }}
                />
                <span className="text-xs text-gray-600">stig</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSaveConfig}
              className="px-4 py-1.5 text-xs font-bold rounded"
              style={{ background: '#22c55e', color: '#000' }}
            >
              VISTA
            </button>
            <button
              onClick={() => { setConfig(DEFAULT_PLACEMENT_POINTS); setKillPts(2); }}
              className="px-4 py-1.5 text-xs rounded text-gray-400 hover:text-white"
              style={{ background: '#2a2a30' }}
            >
              RESET
            </button>
          </div>
        </div>
      )}

      {/* Teams */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4 text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          SKRÁÐ LIÐ ({state.teams.length})
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(hasPoints ? ranked : state.teams).map((team, i) => (
            <div
              key={team.id}
              className="p-4 rounded-xl transition-all hover:scale-[1.02]"
              style={{
                background: '#1a1a1f',
                border: hasPoints && i < 3
                  ? `1px solid ${i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : '#cd7f32'}`
                  : '1px solid #2a2a30',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {hasPoints && <span className="text-gray-500 mr-2">#{i + 1}</span>}
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {team.players[0]} & {team.players[1]}
                  </p>
                </div>
                {hasPoints && (
                  <div className="text-right">
                    <span className="text-xl font-bold" style={{ color: '#e8341c', fontFamily: 'Rajdhani, sans-serif' }}>
                      {getTeamTotalPoints(team)}
                    </span>
                    <p className="text-xs text-gray-500">stig</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game info */}
      <p className="text-gray-500 text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
        Leikur {Math.max(state.currentGame, 1)} af 5
      </p>
    </div>
  );
}
