import { useState, useEffect } from 'react';
import {
  SoloTournamentState,
  getRankedSoloPlayers,
  getSoloPlayerTotalPoints,
  getPlayerWins,
  getPlayerTotalKills,
} from './types';

const SEASON_KEY = 'allt-undir-season-history';
const ENTRY_FEE = 3057;
const PLACEMENT_SHARES = [0.4167, 0.1667, 0.0833];
const KILL_POOL_SHARE = 0.3333;

export interface SeasonTournamentRecord {
  date: string;
  name: string;
  playerCount: number;
  players: {
    id: string;
    name: string;
    fullName: string;
    kills: number;
    wins: number;
    totalPrize: number;
  }[];
}

export function saveSeasonRecord(state: SoloTournamentState) {
  const history = loadSeasonHistory();
  // Don't save duplicates
  if (history.some(h => h.date === state.tournamentDate)) return;

  const ranked = getRankedSoloPlayers(state.players);
  const totalPot = state.players.length * ENTRY_FEE;
  const totalKillsAll = state.players.reduce(
    (sum, p) => sum + getPlayerTotalKills(p.id, state.gameHistory), 0
  );
  const killPool = totalPot * KILL_POOL_SHARE;
  const perKillPrize = totalKillsAll > 0 ? killPool / totalKillsAll : 0;

  const players = ranked.map((player, i) => {
    const kills = getPlayerTotalKills(player.id, state.gameHistory);
    const wins = getPlayerWins(player.id, state.gameHistory);
    const placementPrize = i < 3 ? totalPot * PLACEMENT_SHARES[i] : 0;
    const killPrize = kills * perKillPrize;
    return {
      id: player.id,
      name: player.name,
      fullName: player.fullName,
      kills,
      wins,
      totalPrize: Math.round(placementPrize + killPrize),
    };
  });

  const record: SeasonTournamentRecord = {
    date: state.tournamentDate,
    name: state.tournamentName,
    playerCount: state.players.length,
    players,
  };

  history.push(record);
  try {
    localStorage.setItem(SEASON_KEY, JSON.stringify(history));
  } catch {}
}

export function loadSeasonHistory(): SeasonTournamentRecord[] {
  try {
    const stored = localStorage.getItem(SEASON_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

interface SeasonPlayer {
  name: string;
  fullName: string;
  tournamentsPlayed: number;
  totalKills: number;
  totalWins: number;
  totalPrize: number;
}

function formatKr(amount: number): string {
  return Math.round(amount).toLocaleString('is-IS') + ' kr';
}

export default function SeasonView() {
  const [history, setHistory] = useState<SeasonTournamentRecord[]>([]);

  useEffect(() => {
    setHistory(loadSeasonHistory());
  }, []);

  // Aggregate across all tournaments
  const playerMap = new Map<string, SeasonPlayer>();
  for (const tournament of history) {
    for (const p of tournament.players) {
      const key = p.name.toLowerCase();
      const existing = playerMap.get(key);
      if (existing) {
        existing.tournamentsPlayed += 1;
        existing.totalKills += p.kills;
        existing.totalWins += p.wins;
        existing.totalPrize += p.totalPrize;
      } else {
        playerMap.set(key, {
          name: p.name,
          fullName: p.fullName,
          tournamentsPlayed: 1,
          totalKills: p.kills,
          totalWins: p.wins,
          totalPrize: p.totalPrize,
        });
      }
    }
  }

  const seasonPlayers = Array.from(playerMap.values()).sort(
    (a, b) => b.totalPrize - a.totalPrize
  );

  const totalPrizeAll = seasonPlayers.reduce((s, p) => s + p.totalPrize, 0);

  return (
    <div className="flex flex-col items-center gap-8 p-6 max-w-5xl mx-auto pb-20">
      <div className="text-center">
        <h1
          className="text-4xl md:text-5xl font-black tracking-tighter"
          style={{ fontFamily: 'Rajdhani, sans-serif', color: '#ffd700' }}
        >
          🏆 SEASON LEADERBOARD
        </h1>
        <p className="text-gray-400 mt-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          Allt Undir – Solo · {history.length} mót kláruð
        </p>
        {totalPrizeAll > 0 && (
          <p className="text-lg font-bold mt-1" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#22c55e' }}>
            Samtals útborgað: {formatKr(totalPrizeAll)}
          </p>
        )}
      </div>

      {/* Tournament history cards */}
      {history.length > 0 && (
        <div className="w-full max-w-3xl">
          <h3 className="text-sm font-bold text-gray-500 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            KLÁRUÐ MÓT
          </h3>
          <div className="flex gap-3 flex-wrap">
            {history.map(t => (
              <div
                key={t.date}
                className="px-4 py-2 rounded-lg"
                style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
              >
                <p className="text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {t.date}
                </p>
                <p className="text-xs text-gray-500">{t.playerCount} keppendur</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Season Leaderboard */}
      {seasonPlayers.length > 0 ? (
        <div className="w-full max-w-3xl">
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
          >
            {/* Header */}
            <div
              className="grid items-center px-4 py-2 text-xs text-gray-500 font-bold"
              style={{
                borderBottom: '1px solid #2a2a30',
                fontFamily: 'Rajdhani, sans-serif',
                gridTemplateColumns: '30px 1fr 70px 60px 60px 110px',
                gap: '8px',
              }}
            >
              <span>#</span>
              <span>Nafn</span>
              <span className="text-center">Mót sótt</span>
              <span className="text-center">Fellur</span>
              <span className="text-center">Sigrar</span>
              <span className="text-right">Verðlaun (kr)</span>
            </div>

            {seasonPlayers.map((player, i) => {
              const medalColor =
                i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : undefined;
              const hasPrize = player.totalPrize > 0;
              return (
                <div
                  key={player.name}
                  className="grid items-center px-4 py-3"
                  style={{
                    borderBottom: i < seasonPlayers.length - 1 ? '1px solid #2a2a30' : undefined,
                    borderLeft: medalColor ? `3px solid ${medalColor}` : '3px solid transparent',
                    gridTemplateColumns: '30px 1fr 70px 60px 60px 110px',
                    gap: '8px',
                  }}
                >
                  <span
                    className="font-bold"
                    style={{
                      color: medalColor || '#666',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <span
                      className="font-bold text-sm truncate block"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}
                    >
                      {player.name}
                    </span>
                    <span className="text-xs text-gray-600 truncate block">{player.fullName}</span>
                  </div>
                  <span className="text-center text-sm text-gray-400">{player.tournamentsPlayed}</span>
                  <span className="text-center text-sm text-gray-500">{player.totalKills}</span>
                  <span className="text-center text-sm text-yellow-500">
                    {player.totalWins > 0 ? `${player.totalWins}🏆` : '—'}
                  </span>
                  <span
                    className="text-right text-sm font-black"
                    style={{
                      color: hasPrize ? '#22c55e' : '#333',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    {hasPrize ? formatKr(player.totalPrize) : '0 kr'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          <p className="text-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Engin mót hafa verið kláruð ennþá.
          </p>
          <p className="text-sm mt-2">
            Þegar mót lýkur vistast niðurstöður sjálfkrafa hér.
          </p>
        </div>
      )}
    </div>
  );
}
