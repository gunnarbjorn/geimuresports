export interface SoloPlayer {
  id: string;
  name: string; // Fortnite name
  fullName: string;
  killPoints: number;
  placementPoints: number;
  alive: boolean;
  gameKills: number; // kills in current game
}

export interface SoloGameResult {
  gameNumber: number;
  placements: {
    playerId: string;
    placement: number;
    kills: number;
    killPoints: number;
    placementPoints: number;
  }[];
}

export interface SoloTournamentState {
  status: 'lobby' | 'active' | 'finished';
  currentGame: number;
  totalGames: number;
  players: SoloPlayer[];
  gameHistory: SoloGameResult[];
  placementPointsConfig: number[];
  killPointsPerKill: number;
  raffleWinners: string[];
  eliminationOrder: string[]; // player ids in order of elimination
  tournamentDate: string; // e.g. "2026-03-05"
  tournamentName: string;
}

export const DEFAULT_SOLO_PLACEMENT_POINTS = [25, 20, 16, 14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1];

export type SoloTournamentAction =
  | { type: 'START_TOURNAMENT' }
  | { type: 'RESET_TOURNAMENT' }
  | { type: 'ELIMINATE_PLAYER'; playerId: string; killerPlayerId: string }
  | { type: 'REVIVE_PLAYER'; playerId: string }
  | { type: 'END_GAME' }
  | { type: 'SUBMIT_GAME_RESULTS'; results: { playerId: string; kills: number; placement: number }[] }
  | { type: 'EDIT_GAME_RESULTS'; gameNumber: number; results: { playerId: string; kills: number; placement: number }[] }
  | { type: 'UPDATE_PLACEMENT_CONFIG'; config: number[] }
  | { type: 'UPDATE_KILL_POINTS'; killPointsPerKill: number }
  | { type: 'SET_RAFFLE_WINNERS'; winners: string[] }
  | { type: 'SET_PLAYERS'; players: SoloPlayer[] }
  | { type: 'SET_TOTAL_GAMES'; totalGames: number };

export function createSoloInitialState(date?: string): SoloTournamentState {
  return {
    status: 'lobby',
    currentGame: 0,
    totalGames: 1,
    players: [],
    gameHistory: [],
    placementPointsConfig: DEFAULT_SOLO_PLACEMENT_POINTS,
    killPointsPerKill: 1,
    raffleWinners: [],
    eliminationOrder: [],
    tournamentDate: date || '2026-03-05',
    tournamentName: 'Allt Undir – Solo',
  };
}

export function soloTournamentReducer(state: SoloTournamentState, action: SoloTournamentAction): SoloTournamentState {
  switch (action.type) {
    case 'START_TOURNAMENT': {
      const players = state.players.map(p => ({ ...p, alive: true, gameKills: 0 }));
      return { ...state, status: 'active', currentGame: 1, players, eliminationOrder: [] };
    }

    case 'RESET_TOURNAMENT': {
      return createSoloInitialState(state.tournamentDate);
    }

    case 'ELIMINATE_PLAYER': {
      const isNoPoints = action.killerPlayerId === '__storm__' || action.killerPlayerId === '__fall_damage__';
      const kpp = state.killPointsPerKill;
      const players = state.players.map(p => {
        if (p.id === action.playerId) return { ...p, alive: false };
        if (!isNoPoints && p.id === action.killerPlayerId) return { ...p, killPoints: p.killPoints + kpp, gameKills: p.gameKills + 1 };
        return p;
      });
      const newElimOrder = !state.eliminationOrder.includes(action.playerId)
        ? [...state.eliminationOrder, action.playerId]
        : state.eliminationOrder;
      return { ...state, players, eliminationOrder: newElimOrder };
    }

    case 'REVIVE_PLAYER': {
      const players = state.players.map(p =>
        p.id === action.playerId ? { ...p, alive: true } : p
      );
      return {
        ...state,
        players,
        eliminationOrder: state.eliminationOrder.filter(id => id !== action.playerId),
      };
    }

    case 'END_GAME': {
      const alivePlayers = state.players.filter(p => p.alive);
      const eliminatedPlayers = state.eliminationOrder.map(id => state.players.find(p => p.id === id)!).filter(Boolean);
      
      const orderedPlayers = [...alivePlayers, ...eliminatedPlayers.reverse()];
      
      const placements = orderedPlayers.map((player, index) => ({
        playerId: player.id,
        placement: index + 1,
        kills: player.gameKills,
        killPoints: player.gameKills * state.killPointsPerKill,
        placementPoints: state.placementPointsConfig[index] || 0,
      }));

      const gameResult: SoloGameResult = {
        gameNumber: state.currentGame,
        placements,
      };

      const players = state.players.map(p => {
        const pl = placements.find(x => x.playerId === p.id);
        if (!pl) return p;
        return {
          ...p,
          placementPoints: p.placementPoints + pl.placementPoints,
          alive: true,
          gameKills: 0,
        };
      });

      const isFinished = state.currentGame >= state.totalGames;

      return {
        ...state,
        players,
        gameHistory: [...state.gameHistory, gameResult],
        currentGame: isFinished ? state.currentGame : state.currentGame + 1,
        status: isFinished ? 'finished' : 'active',
        eliminationOrder: [],
      };
    }

    case 'SUBMIT_GAME_RESULTS': {
      const { results } = action;
      const placements = results.map(r => ({
        playerId: r.playerId,
        placement: r.placement,
        kills: r.kills,
        killPoints: r.kills * state.killPointsPerKill,
        placementPoints: state.placementPointsConfig[r.placement - 1] || 0,
      }));

      const gameResult: SoloGameResult = {
        gameNumber: state.currentGame,
        placements,
      };

      const newHistory = [...state.gameHistory, gameResult];
      const players = recalcPlayersFromHistory(state.players, newHistory, state.killPointsPerKill, state.placementPointsConfig);
      const isFinished = state.currentGame >= state.totalGames;

      return {
        ...state,
        players,
        gameHistory: newHistory,
        currentGame: isFinished ? state.currentGame : state.currentGame + 1,
        status: isFinished ? 'finished' : 'active',
        eliminationOrder: [],
      };
    }

    case 'EDIT_GAME_RESULTS': {
      const { gameNumber, results } = action;
      const placements = results.map(r => ({
        playerId: r.playerId,
        placement: r.placement,
        kills: r.kills,
        killPoints: r.kills * state.killPointsPerKill,
        placementPoints: state.placementPointsConfig[r.placement - 1] || 0,
      }));

      const newHistory = state.gameHistory.map(g =>
        g.gameNumber === gameNumber ? { ...g, placements } : g
      );
      const players = recalcPlayersFromHistory(state.players, newHistory, state.killPointsPerKill, state.placementPointsConfig);

      return { ...state, players, gameHistory: newHistory };
    }

    case 'UPDATE_PLACEMENT_CONFIG':
      return { ...state, placementPointsConfig: action.config };
    case 'UPDATE_KILL_POINTS':
      return { ...state, killPointsPerKill: action.killPointsPerKill };
    case 'SET_RAFFLE_WINNERS':
      return { ...state, raffleWinners: action.winners };
    case 'SET_PLAYERS':
      return { ...state, players: action.players };
    case 'SET_TOTAL_GAMES':
      return { ...state, totalGames: action.totalGames };
    default:
      return state;
  }
}

function recalcPlayersFromHistory(
  players: SoloPlayer[],
  history: SoloGameResult[],
  killPointsPerKill: number,
  placementConfig: number[]
): SoloPlayer[] {
  return players.map(p => {
    let killPoints = 0;
    let placementPoints = 0;
    for (const game of history) {
      const pl = game.placements.find(x => x.playerId === p.id);
      if (pl) {
        killPoints += pl.kills * killPointsPerKill;
        placementPoints += placementConfig[pl.placement - 1] || 0;
      }
    }
    return { ...p, killPoints, placementPoints, alive: true, gameKills: 0 };
  });
}

export function getSoloPlayerTotalPoints(player: SoloPlayer): number {
  return player.killPoints + player.placementPoints;
}

export function getRankedSoloPlayers(players: SoloPlayer[]): SoloPlayer[] {
  return [...players].sort((a, b) => getSoloPlayerTotalPoints(b) - getSoloPlayerTotalPoints(a));
}

export function getPlayerWins(playerId: string, gameHistory: SoloGameResult[]): number {
  return gameHistory.filter(g => {
    const first = g.placements.find(p => p.placement === 1);
    return first?.playerId === playerId;
  }).length;
}

export function getPlayerTotalKills(playerId: string, gameHistory: SoloGameResult[]): number {
  return gameHistory.reduce((sum, g) => {
    const pl = g.placements.find(p => p.playerId === playerId);
    return sum + (pl?.kills || 0);
  }, 0);
}
