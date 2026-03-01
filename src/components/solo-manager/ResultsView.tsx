import { useState, useCallback, useEffect } from 'react';
import { SoloTournamentState, SoloTournamentAction, getRankedSoloPlayers, getSoloPlayerTotalPoints, getPlayerWins, getPlayerTotalKills } from './types';

interface Props {
  state: SoloTournamentState;
  dispatch: React.Dispatch<SoloTournamentAction>;
}

const ENTRY_FEE = 3057;
const PLACEMENT_SHARES = [0.4167, 0.1667, 0.0833]; // 1st, 2nd, 3rd
const KILL_POOL_SHARE = 0.3333;

function playRaffleSound(duration: number): { stop: () => void } {
  const ctx = new AudioContext();
  const startTime = ctx.currentTime;
  const endTime = startTime + duration;
  const totalBeeps = 40;
  for (let i = 0; i < totalBeeps; i++) {
    const progress = i / totalBeeps;
    const time = startTime + duration * (1 - Math.pow(1 - progress, 2));
    const freq = 300 + progress * 600;
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
  return { stop: () => { try { ctx.close(); } catch {} } };
}

function formatKr(amount: number): string {
  return Math.round(amount).toLocaleString('is-IS') + ' kr';
}

export default function SoloResultsView({ state, dispatch }: Props) {
  const ranked = getRankedSoloPlayers(state.players);
  const [showConfetti, setShowConfetti] = useState(true);
  const [raffleRunning, setRaffleRunning] = useState(false);
  const [raffleHighlight, setRaffleHighlight] = useState<number | null>(null);
  const [raffleWinners, setRaffleWinners] = useState<string[]>(state.raffleWinners);
  const [raffleCount, setRaffleCount] = useState(1);

  const allPlayerNames = state.players.map(p => p.name);

  // Prize calculations
  const totalPot = state.players.length * ENTRY_FEE;
  const totalKillsAll = state.players.reduce((sum, p) => sum + getPlayerTotalKills(p.id, state.gameHistory), 0);
  const killPool = totalPot * KILL_POOL_SHARE;
  const perKillPrize = totalKillsAll > 0 ? killPool / totalKillsAll : 0;

  const getPlayerPrizes = (playerId: string, rank: number) => {
    const kills = getPlayerTotalKills(playerId, state.gameHistory);
    const placementPrize = rank < 3 ? totalPot * PLACEMENT_SHARES[rank] : 0;
    const killPrize = kills * perKillPrize;
    const total = placementPrize + killPrize;
    return { placementPrize, killPrize, total, kills };
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const runRaffle = useCallback(() => {
    if (raffleRunning) return;
    setRaffleRunning(true);
    setRaffleWinners([]);

    const drawWinner = (winnerIndex: number, alreadyPicked: string[]) => {
      if (winnerIndex >= raffleCount) {
        setRaffleRunning(false);
        dispatch({ type: 'SET_RAFFLE_WINNERS', winners: alreadyPicked });
        return;
      }
      playRaffleSound(3);
      let tick = 0;
      const maxTicks = 50;
      const runTick = () => {
        tick++;
        setRaffleHighlight(Math.floor(Math.random() * allPlayerNames.length));
        if (tick >= maxTicks) {
          const available = allPlayerNames.filter(p => !alreadyPicked.includes(p));
          const winner = available[Math.floor(Math.random() * available.length)];
          const newPicked = [...alreadyPicked, winner];
          setRaffleWinners(newPicked);
          setRaffleHighlight(null);
          if (winnerIndex < raffleCount - 1) {
            setTimeout(() => drawWinner(winnerIndex + 1, newPicked), 1500);
          } else {
            setRaffleRunning(false);
            dispatch({ type: 'SET_RAFFLE_WINNERS', winners: newPicked });
          }
          return;
        }
        setTimeout(runTick, 50 + (tick / maxTicks) * 150);
      };
      runTick();
    };
    drawWinner(0, []);
  }, [allPlayerNames, raffleRunning, raffleCount, dispatch]);

  const confettiColors = ['#ffd700', '#22c55e', '#3b82f6', '#f59e0b', '#e8341c'];

  const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd
  const podiumHeights = ['200px', '260px', '160px'];
  const podiumMedals = ['🥇', '🥈', '🥉'];
  const podiumColors = ['#ffd700', '#c0c0c0', '#cd7f32'];
  const podiumEmojis = ['👑', '🥈', '🥉'];

  return (
    <div className="flex flex-col items-center gap-8 p-6 max-w-5xl mx-auto pb-20 relative overflow-hidden">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
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
          <style>{`@keyframes fall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#ffd700' }}>
          🏆 LOKANIÐURSTÖÐUR
        </h1>
        <p className="text-gray-400 mt-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          {state.tournamentName.toUpperCase()} — {state.gameHistory.length} leikir
        </p>
        <p className="text-lg font-bold mt-1" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#22c55e' }}>
          Verðlaunapottur: {formatKr(totalPot)}
        </p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-6 w-full max-w-3xl mt-4">
        {podiumOrder.map(pos => {
          const player = ranked[pos];
          if (!player) return <div key={pos} className="flex-1" />;
          const prizes = getPlayerPrizes(player.id, pos);
          const color = podiumColors[pos];
          return (
            <div key={pos} className="flex flex-col items-center flex-1">
              <span className={pos === 0 ? 'text-5xl mb-3' : 'text-4xl mb-2'}>{podiumEmojis[pos]}</span>
              <div
                className="w-full rounded-t-2xl p-5 text-center flex flex-col justify-end"
                style={{
                  background: `linear-gradient(180deg, ${color}44, ${color}11)`,
                  border: `2px solid ${color}66`,
                  height: podiumHeights[podiumOrder.indexOf(pos)],
                  boxShadow: pos === 0 ? `0 0 60px ${color}33` : `0 0 20px ${color}15`,
                }}
              >
                <h3
                  className={pos === 0 ? 'font-black text-2xl' : 'font-bold text-xl'}
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  {player.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{player.fullName}</p>
                <p
                  className={pos === 0 ? 'text-4xl font-black mt-2' : 'text-2xl font-black mt-2'}
                  style={{ color }}
                >
                  {getSoloPlayerTotalPoints(player)} stig
                </p>
                <p
                  className="text-lg font-bold mt-1"
                  style={{ color: '#22c55e', fontFamily: 'Rajdhani, sans-serif' }}
                >
                  💰 {formatKr(prizes.total)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sæti: {formatKr(prizes.placementPrize)} · Fellur: {formatKr(prizes.killPrize)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pot Breakdown */}
      <div className="flex gap-4 text-center">
        <div className="px-4 py-2 rounded-lg" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>PLACEMENT POTTUR</p>
          <p className="text-sm font-bold" style={{ color: '#ffd700' }}>{formatKr(totalPot * (PLACEMENT_SHARES[0] + PLACEMENT_SHARES[1] + PLACEMENT_SHARES[2]))}</p>
        </div>
        <div className="px-4 py-2 rounded-lg" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>FELL POTTUR</p>
          <p className="text-sm font-bold" style={{ color: '#e8341c' }}>{formatKr(killPool)}</p>
        </div>
        <div className="px-4 py-2 rounded-lg" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>PER FELL</p>
          <p className="text-sm font-bold" style={{ color: '#e8341c' }}>{formatKr(perKillPrize)}</p>
        </div>
        <div className="px-4 py-2 rounded-lg" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>HEILDAR FELLUR</p>
          <p className="text-sm font-bold text-gray-300">{totalKillsAll}</p>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          FULL STIGATAFLA
        </h2>
        <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          {/* Header */}
          <div
            className="grid items-center px-4 py-2 text-xs text-gray-500 font-bold"
            style={{
              borderBottom: '1px solid #2a2a30',
              fontFamily: 'Rajdhani, sans-serif',
              gridTemplateColumns: '30px 1fr 50px 50px 60px 90px 90px 90px',
              gap: '4px',
            }}
          >
            <span>#</span>
            <span>Leikmaður</span>
            <span className="text-center">Sigrar</span>
            <span className="text-center">Fellur</span>
            <span className="text-center">Stig</span>
            <span className="text-right">Sæti kr</span>
            <span className="text-right">Fell kr</span>
            <span className="text-right">Samtals</span>
          </div>
          {ranked.map((player, i) => {
            const medalColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : undefined;
            const wins = getPlayerWins(player.id, state.gameHistory);
            const totalKills = getPlayerTotalKills(player.id, state.gameHistory);
            const prizes = getPlayerPrizes(player.id, i);
            const hasPrize = prizes.total > 0;
            return (
              <div
                key={player.id}
                className="grid items-center px-4 py-3"
                style={{
                  borderBottom: i < ranked.length - 1 ? '1px solid #2a2a30' : undefined,
                  borderLeft: medalColor ? `3px solid ${medalColor}` : '3px solid transparent',
                  gridTemplateColumns: '30px 1fr 50px 50px 60px 90px 90px 90px',
                  gap: '4px',
                }}
              >
                <span className="font-bold" style={{ color: medalColor || '#666', fontFamily: 'Rajdhani, sans-serif' }}>
                  {i + 1}
                </span>
                <span className="font-bold truncate" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{player.name}</span>
                <span className="text-center text-sm text-yellow-500">{wins > 0 ? `${wins}🏆` : '—'}</span>
                <span className="text-center text-sm text-gray-500">{totalKills}</span>
                <span className="text-center text-lg font-black" style={{ color: '#e8341c', fontFamily: 'Rajdhani, sans-serif' }}>
                  {getSoloPlayerTotalPoints(player)}
                </span>
                <span
                  className="text-right text-sm font-bold"
                  style={{ color: prizes.placementPrize > 0 ? '#22c55e' : '#333', fontFamily: 'Rajdhani, sans-serif' }}
                >
                  {prizes.placementPrize > 0 ? formatKr(prizes.placementPrize) : '—'}
                </span>
                <span
                  className="text-right text-sm font-bold"
                  style={{ color: prizes.killPrize > 0 ? '#22c55e' : '#333', fontFamily: 'Rajdhani, sans-serif' }}
                >
                  {prizes.killPrize > 0 ? formatKr(prizes.killPrize) : '—'}
                </span>
                <span
                  className="text-right text-sm font-black"
                  style={{ color: hasPrize ? '#22c55e' : '#333', fontFamily: 'Rajdhani, sans-serif' }}
                >
                  {hasPrize ? formatKr(prizes.total) : '0 kr'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raffle */}
      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f59e0b' }}>
          🎰 HAPPDRÆTTI
        </h2>
        <div className="flex justify-center gap-3 mb-4">
          <label className="text-sm text-gray-500">Fjöldi vinningshafa:</label>
          <input
            type="number"
            min={1}
            max={allPlayerNames.length}
            value={raffleCount}
            onChange={e => setRaffleCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 px-2 py-1 text-sm rounded text-white text-center"
            style={{ background: '#0d0d0f', border: '1px solid #2a2a30' }}
          />
        </div>
        <div
          className="grid gap-2 mb-6 p-4 rounded-xl"
          style={{ background: '#0d0d0f', border: '1px solid #2a2a30', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
        >
          {allPlayerNames.map((name, i) => {
            const isWinner = raffleWinners.includes(name);
            const isHighlighted = raffleRunning && raffleHighlight === i;
            return (
              <div
                key={`${name}-${i}`}
                className="px-3 py-2 rounded-lg text-sm font-bold text-center transition-all duration-100"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: isWinner ? 'rgba(245,158,11,0.3)' : isHighlighted ? 'rgba(232,52,28,0.3)' : '#1a1a1f',
                  border: isWinner ? '2px solid #f59e0b' : isHighlighted ? '2px solid #e8341c' : '1px solid #2a2a30',
                  color: isWinner ? '#f59e0b' : '#fff',
                  transform: isWinner ? 'scale(1.1)' : isHighlighted ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isWinner ? '0 0 20px rgba(245,158,11,0.4)' : 'none',
                }}
              >
                {name}
              </div>
            );
          })}
        </div>
        {raffleWinners.length > 0 && !raffleRunning && (
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#f59e0b' }}>
              🎉 VINNINGSHAFAR! 🎉
            </h3>
            <div className="flex gap-4 justify-center flex-wrap">
              {raffleWinners.map(w => (
                <span key={w} className="text-2xl font-black px-6 py-2 rounded-xl" style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: 'rgba(245,158,11,0.2)',
                  border: '2px solid #f59e0b',
                  color: '#f59e0b',
                  boxShadow: '0 0 30px rgba(245,158,11,0.3)',
                }}>{w}</span>
              ))}
            </div>
          </div>
        )}
        <div className="text-center">
          <button
            onClick={runRaffle}
            disabled={raffleRunning}
            className="px-12 py-4 text-xl font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              background: raffleRunning ? '#333' : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              boxShadow: raffleRunning ? 'none' : '0 0 30px rgba(245,158,11,0.4)',
            }}
          >
            {raffleRunning ? '🎰 DREG...' : '🎰 DRAGA HAPPDRÆTTI'}
          </button>
        </div>
      </div>
    </div>
  );
}
