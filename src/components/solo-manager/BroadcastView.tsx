import { useEffect, useState } from 'react';
import { SoloTournamentState, getRankedSoloPlayers, getSoloPlayerTotalPoints } from './types';

interface Props {
  state: SoloTournamentState;
}

export default function SoloBroadcastView({ state }: Props) {
  const ranked = getRankedSoloPlayers(state.players);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [prevPoints, setPrevPoints] = useState<Record<string, number>>({});

  useEffect(() => {
    const newPoints: Record<string, number> = {};
    state.players.forEach(p => {
      const total = getSoloPlayerTotalPoints(p);
      newPoints[p.id] = total;
      if (prevPoints[p.id] !== undefined && prevPoints[p.id] !== total) {
        setFlashId(p.id);
        setTimeout(() => setFlashId(null), 1000);
      }
    });
    setPrevPoints(newPoints);
  }, [state.players]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1020 0%, #0d0d0f 50%, #000 100%)',
        fontFamily: 'Rajdhani, sans-serif',
      }}
    >
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ color: '#22c55e' }}>
          {state.tournamentName.toUpperCase()}
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-gray-400 mt-2">
          LEIKUR {state.currentGame} AF {state.totalGames}
        </p>
      </div>

      <div className="w-full max-w-3xl">
        {ranked.slice(0, 20).map((player, i) => {
          const total = getSoloPlayerTotalPoints(player);
          const medalColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : undefined;
          const isFlashing = flashId === player.id;

          return (
            <div
              key={player.id}
              className="flex items-center justify-between px-6 py-3 mb-1 rounded-lg transition-all duration-500"
              style={{
                background: isFlashing
                  ? 'rgba(34, 197, 94, 0.3)'
                  : i < 3 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                borderLeft: medalColor ? `4px solid ${medalColor}` : '4px solid transparent',
                transform: isFlashing ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black w-8 text-center" style={{ color: medalColor || '#444' }}>
                  {i + 1}
                </span>
                <div>
                  <span className="text-xl md:text-2xl font-bold">{player.name}</span>
                  {player.alive && (
                    <span
                      className="ml-3 inline-block w-3 h-3 rounded-full animate-pulse"
                      style={{ background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-600 uppercase">Kills</p>
                  <p className="text-lg font-bold text-gray-400">{Math.round(player.killPoints / Math.max(state.killPointsPerKill, 1))}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 uppercase">Placement</p>
                  <p className="text-lg font-bold text-gray-400">{player.placementPoints}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 uppercase">Total</p>
                  <p
                    className="text-3xl font-black transition-all duration-300"
                    style={{
                      color: '#22c55e',
                      transform: isFlashing ? 'scale(1.3)' : 'scale(1)',
                      textShadow: isFlashing ? '0 0 20px rgba(34,197,94,0.8)' : 'none',
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

      {/* Alive count */}
      <div className="mt-8 text-center">
        <span className="text-2xl font-bold text-gray-500">
          {state.players.filter(p => p.alive).length} / {state.players.length} á lífi
        </span>
      </div>

      {/* Scoring guide */}
      <div
        className="fixed left-0 top-1/2 -translate-y-1/2 py-6 px-6 rounded-r-xl text-base leading-loose"
        style={{
          background: 'rgba(13, 13, 15, 0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderLeft: 'none',
          backdropFilter: 'blur(12px)',
          fontFamily: 'Rajdhani, sans-serif',
          color: '#aaa',
          minWidth: '220px',
        }}
      >
        <p className="font-black text-lg tracking-wider mb-3" style={{ color: '#ccc', letterSpacing: '0.08em' }}>
          🎯 STIGAKERFI
        </p>
        <p className="font-bold">Fell (kill): <span style={{ color: '#e8341c' }}>+{state.killPointsPerKill}</span> stig</p>
        <div className="mt-2 flex flex-col gap-0.5">
          {state.placementPointsConfig.slice(0, 5).map((pts, i) => (
            <p key={i} className="font-semibold">
              {i + 1}. sæti: <span style={{ color: '#ffd700' }}>+{pts}</span> stig
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
