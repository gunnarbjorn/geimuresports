import { useState, useCallback, useRef, useEffect } from 'react';
import { TournamentState, TournamentAction, getRankedTeams, getTeamTotalPoints } from './types';

interface Props {
  state: TournamentState;
  dispatch: React.Dispatch<TournamentAction>;
}

// Web Audio API raffle sound
function playRaffleSound(duration: number): { stop: () => void } {
  const ctx = new AudioContext();
  const startTime = ctx.currentTime;
  const endTime = startTime + duration;

  // Create rising beeps that slow down
  const totalBeeps = 40;
  for (let i = 0; i < totalBeeps; i++) {
    const progress = i / totalBeeps;
    // Exponential slowdown
    const time = startTime + duration * (1 - Math.pow(1 - progress, 2));
    const freq = 300 + progress * 600; // rising pitch

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';

    const beepDuration = 0.05 + progress * 0.1;
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + beepDuration);

    osc.start(time);
    osc.stop(time + beepDuration);
  }

  // Final ding
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 1200;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.3, endTime);
  gain.gain.exponentialRampToValueAtTime(0.001, endTime + 0.5);
  osc.start(endTime);
  osc.stop(endTime + 0.5);

  return {
    stop: () => {
      try { ctx.close(); } catch {}
    },
  };
}

export default function ResultsView({ state, dispatch }: Props) {
  const ranked = getRankedTeams(state.teams);
  const [showConfetti, setShowConfetti] = useState(true);
  const [raffleRunning, setRaffleRunning] = useState(false);
  const [raffleHighlight, setRaffleHighlight] = useState<number | null>(null);
  const [raffleWinners, setRaffleWinners] = useState<string[]>(state.raffleWinners);
  const [raffleCount, setRaffleCount] = useState(2);
  const intervalRef = useRef<number | null>(null);

  // All player names for raffle
  const allPlayers = state.teams.flatMap(t => t.players);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const runRaffle = useCallback(() => {
    if (raffleRunning) return;
    setRaffleRunning(true);
    setRaffleWinners([]);

    const sound = playRaffleSound(4);
    let tick = 0;
    const maxTicks = 60;

    intervalRef.current = window.setInterval(() => {
      tick++;
      const progress = tick / maxTicks;
      const idx = Math.floor(Math.random() * allPlayers.length);
      setRaffleHighlight(idx);

      if (tick >= maxTicks) {
        clearInterval(intervalRef.current!);
        // Pick random winners
        const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
        const winners = shuffled.slice(0, raffleCount);
        setRaffleWinners(winners);
        setRaffleRunning(false);
        dispatch({ type: 'SET_RAFFLE_WINNERS', winners });
      }

      // Slow down the interval over time
      if (tick % 10 === 0 && tick < maxTicks) {
        clearInterval(intervalRef.current!);
        const newDelay = 50 + progress * 200;
        intervalRef.current = window.setInterval(arguments.callee as any, newDelay);
      }
    }, 50);
  }, [allPlayers, raffleRunning, raffleCount, dispatch]);

  // Simple confetti effect with CSS
  const confettiColors = ['#ffd700', '#e8341c', '#22c55e', '#3b82f6', '#f59e0b'];

  return (
    <div className="flex flex-col items-center gap-8 p-6 max-w-5xl mx-auto pb-20 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                width: '8px',
                height: '8px',
                background: confettiColors[i % confettiColors.length],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                animation: `fall ${2 + Math.random() * 3}s linear forwards`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes fall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Title */}
      <div className="text-center">
        <h1
          className="text-5xl md:text-6xl font-black tracking-tighter"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: '#ffd700' }}
        >
          🏆 LOKANIÐURSTÖÐUR
        </h1>
        <p className="text-gray-400 mt-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          FORTNITE DUO LAN — {state.gameHistory.length} leikir
        </p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 w-full max-w-2xl">
        {/* 2nd place */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-3xl mb-2">🥈</span>
          <div
            className="w-full rounded-t-xl p-4 text-center"
            style={{
              background: 'linear-gradient(180deg, #c0c0c033, #c0c0c011)',
              border: '1px solid #c0c0c044',
              height: '140px',
            }}
          >
            <h3 className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {ranked[1]?.name}
            </h3>
            <p className="text-xs text-gray-400">{ranked[1]?.players.join(' & ')}</p>
            <p className="text-2xl font-black mt-2" style={{ color: '#c0c0c0' }}>
              {ranked[1] ? getTeamTotalPoints(ranked[1]) : 0}
            </p>
          </div>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-4xl mb-2">🥇</span>
          <div
            className="w-full rounded-t-xl p-4 text-center"
            style={{
              background: 'linear-gradient(180deg, #ffd70033, #ffd70011)',
              border: '1px solid #ffd70044',
              height: '180px',
              boxShadow: '0 0 40px rgba(255, 215, 0, 0.15)',
            }}
          >
            <h3 className="font-bold text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {ranked[0]?.name}
            </h3>
            <p className="text-xs text-gray-400">{ranked[0]?.players.join(' & ')}</p>
            <p className="text-3xl font-black mt-2" style={{ color: '#ffd700' }}>
              {ranked[0] ? getTeamTotalPoints(ranked[0]) : 0}
            </p>
          </div>
        </div>

        {/* 3rd place */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-3xl mb-2">🥉</span>
          <div
            className="w-full rounded-t-xl p-4 text-center"
            style={{
              background: 'linear-gradient(180deg, #cd7f3233, #cd7f3211)',
              border: '1px solid #cd7f3244',
              height: '110px',
            }}
          >
            <h3 className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {ranked[2]?.name}
            </h3>
            <p className="text-xs text-gray-400">{ranked[2]?.players.join(' & ')}</p>
            <p className="text-2xl font-black mt-2" style={{ color: '#cd7f32' }}>
              {ranked[2] ? getTeamTotalPoints(ranked[2]) : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Prizes */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          VERÐLAUN
        </h2>
        <div className="grid gap-3">
          {[
            { place: '🥇 1. Sæti', prize: '5 kls. spilatími á mann + 2x HyperX heyrnatól frá Senu', color: '#ffd700' },
            { place: '🥈 2. Sæti', prize: '3 kls. spilatími á mann', color: '#c0c0c0' },
            { place: '🥉 3. Sæti', prize: '2 kls. spilatími á mann', color: '#cd7f32' },
          ].map(p => (
            <div
              key={p.place}
              className="p-4 rounded-xl flex items-center gap-4"
              style={{ background: '#1a1a1f', borderLeft: `3px solid ${p.color}` }}
            >
              <span className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', color: p.color }}>
                {p.place}
              </span>
              <span className="text-gray-300">{p.prize}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          FULL STIGATAFLA
        </h2>
        <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          {ranked.map((team, i) => {
            const medalColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : undefined;
            return (
              <div
                key={team.id}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  borderBottom: i < ranked.length - 1 ? '1px solid #2a2a30' : undefined,
                  borderLeft: medalColor ? `3px solid ${medalColor}` : '3px solid transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold w-6 text-center" style={{ color: medalColor || '#666', fontFamily: 'Rajdhani, sans-serif' }}>
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{team.name}</span>
                    <p className="text-xs text-gray-500">{team.players.join(' & ')}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm items-center">
                  <span className="text-gray-500">{team.killPoints}k</span>
                  <span className="text-gray-500">{team.placementPoints}p</span>
                  <span className="text-xl font-black" style={{ color: '#e8341c', fontFamily: 'Rajdhani, sans-serif' }}>
                    {getTeamTotalPoints(team)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raffle */}
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f59e0b' }}>
          🎰 HAPPDRÆTTI
        </h2>
        <p className="text-center text-gray-400 text-sm mb-4">
          Revolution Pro pinnar frá Senu
        </p>

        <div className="flex justify-center gap-3 mb-4">
          <label className="text-sm text-gray-500">Fjöldi vinningshafa:</label>
          <input
            type="number"
            min={1}
            max={allPlayers.length}
            value={raffleCount}
            onChange={e => setRaffleCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 px-2 py-1 text-sm rounded text-white text-center"
            style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }}
          />
        </div>

        {/* Player list */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 p-4 rounded-xl max-h-64 overflow-auto"
          style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }}
        >
          {allPlayers.map((name, i) => {
            const isWinner = raffleWinners.includes(name);
            const isHighlighted = raffleRunning && raffleHighlight === i;
            return (
              <div
                key={`${name}-${i}`}
                className="px-3 py-2 rounded-lg text-sm font-bold text-center transition-all duration-100"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: isWinner
                    ? 'rgba(245, 158, 11, 0.3)'
                    : isHighlighted
                    ? 'rgba(232, 52, 28, 0.3)'
                    : '#1a1a1f',
                  border: isWinner
                    ? '2px solid #f59e0b'
                    : isHighlighted
                    ? '2px solid #e8341c'
                    : '1px solid #2a2a30',
                  color: isWinner ? '#f59e0b' : '#fff',
                  transform: isWinner ? 'scale(1.1)' : isHighlighted ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isWinner ? '0 0 20px rgba(245, 158, 11, 0.4)' : 'none',
                }}
              >
                {name}
              </div>
            );
          })}
        </div>

        {/* Winners display */}
        {raffleWinners.length > 0 && !raffleRunning && (
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f59e0b' }}>
              🎉 VINNINGSHAFAR! 🎉
            </h3>
            <div className="flex gap-4 justify-center flex-wrap">
              {raffleWinners.map(w => (
                <span
                  key={w}
                  className="text-2xl font-black px-6 py-2 rounded-xl"
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '2px solid #f59e0b',
                    color: '#f59e0b',
                    boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={runRaffle}
            disabled={raffleRunning}
            className="px-12 py-4 text-xl font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: raffleRunning
                ? '#333'
                : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              boxShadow: raffleRunning ? 'none' : '0 0 30px rgba(245, 158, 11, 0.4)',
            }}
          >
            {raffleRunning ? '🎰 DREG...' : '🎰 DRAGA HAPPDRÆTTI'}
          </button>
        </div>
      </div>
    </div>
  );
}
