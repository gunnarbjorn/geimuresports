import { useEffect, useState } from 'react';
import { TournamentState, getRankedTeams, getTeamTotalPoints } from './types';

interface Props {
  state: TournamentState;
}

export default function BroadcastView({ state }: Props) {
  const ranked = getRankedTeams(state.teams);
  const [flashTeamId, setFlashTeamId] = useState<string | null>(null);
  const [prevPoints, setPrevPoints] = useState<Record<string, number>>({});

  // Detect point changes and flash
  useEffect(() => {
    const newPoints: Record<string, number> = {};
    state.teams.forEach(t => {
      const total = getTeamTotalPoints(t);
      newPoints[t.id] = total;
      if (prevPoints[t.id] !== undefined && prevPoints[t.id] !== total) {
        setFlashTeamId(t.id);
        setTimeout(() => setFlashTeamId(null), 1000);
      }
    });
    setPrevPoints(newPoints);
  }, [state.teams]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1020 0%, #0d0d0f 50%, #000 100%)',
        fontFamily: 'Rajdhani, sans-serif',
      }}
    >
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ color: '#e8341c' }}>
          FORTNITE DUO LAN
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-gray-400 mt-2">
          LEIKUR {state.currentGame} AF 5
        </p>
      </div>

      {/* Leaderboard */}
      <div className="w-full max-w-3xl">
        {ranked.map((team, i) => {
          const total = getTeamTotalPoints(team);
          const medalColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : undefined;
          const isFlashing = flashTeamId === team.id;

          return (
            <div
              key={team.id}
              className="flex items-center justify-between px-6 py-4 mb-1 rounded-lg transition-all duration-500"
              style={{
                background: isFlashing
                  ? 'rgba(232, 52, 28, 0.3)'
                  : i < 3
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.02)',
                borderLeft: medalColor ? `4px solid ${medalColor}` : '4px solid transparent',
                transform: isFlashing ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="text-3xl font-black w-10 text-center"
                  style={{ color: medalColor || '#444' }}
                >
                  {i + 1}
                </span>
                <div>
                  <span className="text-xl md:text-2xl font-bold">{team.name}</span>
                  {team.alive && (
                    <span
                      className="ml-3 inline-block w-3 h-3 rounded-full animate-pulse"
                      style={{ background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}
                    />
                  )}
                  <p className="text-sm text-gray-500">{team.players[0]} & {team.players[1]}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-600 uppercase">Kills</p>
                  <p className="text-lg font-bold text-gray-400">{team.killPoints / 2}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 uppercase">Placement</p>
                  <p className="text-lg font-bold text-gray-400">{team.placementPoints}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 uppercase">Total</p>
                  <p
                    className="text-3xl font-black transition-all duration-300"
                    style={{
                      color: '#e8341c',
                      transform: isFlashing ? 'scale(1.3)' : 'scale(1)',
                      textShadow: isFlashing ? '0 0 20px rgba(232,52,28,0.8)' : 'none',
                    }}
                  >
                    {total}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alive indicator row */}
      <div className="mt-8 flex gap-3 flex-wrap justify-center">
        {state.teams.map(team => (
          <div
            key={team.id}
            className="px-3 py-1 rounded-full text-xs font-bold transition-all"
            style={{
              background: team.alive ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
              color: team.alive ? '#22c55e' : '#333',
              border: `1px solid ${team.alive ? '#22c55e44' : '#222'}`,
            }}
          >
            {team.name}
          </div>
        ))}
      </div>

      {/* Scoring guide */}
      <div
        className="fixed bottom-4 right-4 p-3 rounded-lg text-xs leading-relaxed"
        style={{
          background: 'rgba(13, 13, 15, 0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'Rajdhani, sans-serif',
          color: '#888',
          minWidth: '160px',
        }}
      >
        <p className="font-bold text-gray-400 mb-1" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
          🎯 STIGAKERFI
        </p>
        <p>Fell (kill): <span style={{ color: '#e8341c' }}>+{state.killPointsPerKill}</span> stig</p>
        {state.placementPointsConfig.slice(0, 6).map((pts, i) => {
          const label = i < 5 ? `${i + 1}. sæti` : `6.-${state.placementPointsConfig.length}. sæti`;
          if (i === 5) {
            return <p key={i}>{label}: <span style={{ color: '#ffd700' }}>+{pts}</span> stig</p>;
          }
          return <p key={i}>{i + 1}. sæti: <span style={{ color: '#ffd700' }}>+{pts}</span> stig</p>;
        })}
      </div>
    </div>
  );
}
