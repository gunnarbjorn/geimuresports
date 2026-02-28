export interface Team {
  id: string;
  name: string;
  players: [string, string];
  playersAlive: [boolean, boolean];
  killPoints: number;
  placementPoints: number;
  alive: boolean; // derived: true if any player alive
  gameKills: number; // kills in current game
}

export interface GameResult {
  gameNumber: number;
  placements: {
    teamId: string;
    placement: number;
    kills: number;
    killPoints: number;
    placementPoints: number;
  }[];
}

export interface TournamentState {
  status: 'lobby' | 'active' | 'finished';
  currentGame: number; // 1-5
  teams: Team[];
  gameHistory: GameResult[];
  placementPointsConfig: number[]; // index 0 = 1st place, index 8 = 9th place
  killPointsPerKill: number; // points awarded per kill (default 2)
  raffleWinners: string[];
  eliminationOrder: string[]; // track order teams were eliminated
}

export const DEFAULT_PLACEMENT_POINTS = [10, 7, 5, 3, 2, 2, 1, 1, 1, 1];

// No more hardcoded teams — all teams come from the database

export type TournamentAction =
  | { type: 'START_TOURNAMENT' }
  | { type: 'RESET_TOURNAMENT' }
  | { type: 'ELIMINATE_TEAM'; teamId: string; killerTeamId: string }
  | { type: 'ELIMINATE_PLAYER'; teamId: string; playerIndex: number; killerTeamId: string }
  | { type: 'REVIVE_TEAM'; teamId: string }
  | { type: 'REVIVE_PLAYER'; teamId: string; playerIndex: number }
  | { type: 'END_GAME' }
  | { type: 'UPDATE_PLACEMENT_CONFIG'; config: number[] }
  | { type: 'UPDATE_KILL_POINTS'; killPointsPerKill: number }
  | { type: 'SET_RAFFLE_WINNERS'; winners: string[] }
  | { type: 'SET_TEAMS'; teams: Team[] }
  | { type: 'REMOVE_TEAM'; teamId: string };

export function createInitialState(teams?: Team[]): TournamentState {
  return {
    status: 'lobby',
    currentGame: 0,
    teams: teams || [],
    gameHistory: [],
    placementPointsConfig: DEFAULT_PLACEMENT_POINTS,
    killPointsPerKill: 2,
    raffleWinners: [],
    eliminationOrder: [],
  };
}

export function tournamentReducer(state: TournamentState, action: TournamentAction): TournamentState {
  switch (action.type) {
    case 'START_TOURNAMENT': {
      const teams = state.teams.map(t => ({ ...t, alive: true, playersAlive: [true, true] as [boolean, boolean], gameKills: 0 }));
      return { ...state, status: 'active', currentGame: 1, teams, eliminationOrder: [] };
    }

    case 'RESET_TOURNAMENT': {
      return createInitialState(
        state.teams.map(t => ({
          ...t,
          killPoints: 0,
          placementPoints: 0,
          alive: true,
          playersAlive: [true, true] as [boolean, boolean],
          gameKills: 0,
        }))
      );
    }

    case 'ELIMINATE_TEAM': {
      const kpp = state.killPointsPerKill;
      const teams = state.teams.map(t => {
        if (t.id === action.teamId) return { ...t, alive: false, playersAlive: [false, false] as [boolean, boolean] };
        if (t.id === action.killerTeamId) return { ...t, killPoints: t.killPoints + kpp, gameKills: t.gameKills + 1 };
        return t;
      });
      return {
        ...state,
        teams,
        eliminationOrder: [...state.eliminationOrder, action.teamId],
      };
    }

    case 'ELIMINATE_PLAYER': {
      const isStorm = action.killerTeamId === '__storm__';
      const kpp = state.killPointsPerKill;
      const teams = state.teams.map(t => {
        if (t.id === action.teamId) {
          const newPlayersAlive = [...t.playersAlive] as [boolean, boolean];
          newPlayersAlive[action.playerIndex] = false;
          const teamAlive = newPlayersAlive.some(a => a);
          return { ...t, playersAlive: newPlayersAlive, alive: teamAlive };
        }
        if (!isStorm && t.id === action.killerTeamId) return { ...t, killPoints: t.killPoints + kpp, gameKills: t.gameKills + 1 };
        return t;
      });
      const eliminatedTeam = teams.find(t => t.id === action.teamId);
      const newElimOrder = eliminatedTeam && !eliminatedTeam.alive && !state.eliminationOrder.includes(action.teamId)
        ? [...state.eliminationOrder, action.teamId]
        : state.eliminationOrder;
      return { ...state, teams, eliminationOrder: newElimOrder };
    }

    case 'REVIVE_TEAM': {
      const teams = state.teams.map(t =>
        t.id === action.teamId ? { ...t, alive: true, playersAlive: [true, true] as [boolean, boolean] } : t
      );
      return {
        ...state,
        teams,
        eliminationOrder: state.eliminationOrder.filter(id => id !== action.teamId),
      };
    }

    case 'REVIVE_PLAYER': {
      const teams = state.teams.map(t => {
        if (t.id === action.teamId) {
          const newPlayersAlive = [...t.playersAlive] as [boolean, boolean];
          newPlayersAlive[action.playerIndex] = true;
          return { ...t, playersAlive: newPlayersAlive, alive: true };
        }
        return t;
      });
      return {
        ...state,
        teams,
        eliminationOrder: state.eliminationOrder.filter(id => id !== action.teamId),
      };
    }

    case 'END_GAME': {
      const aliveTeams = state.teams.filter(t => t.alive);
      const eliminatedTeams = state.eliminationOrder.map(id => state.teams.find(t => t.id === id)!);
      
      // Alive teams get top placements (reverse order — fewer alive = higher placement for last standing)
      // If multiple alive, they share top spots
      const orderedTeams = [...aliveTeams, ...eliminatedTeams.reverse()];
      
      const placements = orderedTeams.map((team, index) => ({
        teamId: team.id,
        placement: index + 1,
        kills: team.gameKills,
        killPoints: team.gameKills * state.killPointsPerKill,
        placementPoints: state.placementPointsConfig[index] || 0,
      }));

      const gameResult: GameResult = {
        gameNumber: state.currentGame,
        placements,
      };

      const teams = state.teams.map(t => {
        const p = placements.find(pl => pl.teamId === t.id);
        if (!p) return t;
        return {
          ...t,
          placementPoints: t.placementPoints + p.placementPoints,
          alive: true,
          playersAlive: [true, true] as [boolean, boolean],
          gameKills: 0,
        };
      });

      const isFinished = state.currentGame >= 5;

      return {
        ...state,
        teams,
        gameHistory: [...state.gameHistory, gameResult],
        currentGame: isFinished ? state.currentGame : state.currentGame + 1,
        status: isFinished ? 'finished' : 'active',
        eliminationOrder: [],
      };
    }

    case 'UPDATE_PLACEMENT_CONFIG':
      return { ...state, placementPointsConfig: action.config };

    case 'UPDATE_KILL_POINTS':
      return { ...state, killPointsPerKill: action.killPointsPerKill };

    case 'SET_RAFFLE_WINNERS':
      return { ...state, raffleWinners: action.winners };

    case 'SET_TEAMS':
      return { ...state, teams: action.teams };

    case 'REMOVE_TEAM':
      return { ...state, teams: state.teams.filter(t => t.id !== action.teamId) };

    default:
      return state;
  }
}

export function getTeamTotalPoints(team: Team): number {
  return team.killPoints + team.placementPoints;
}

export function getRankedTeams(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => getTeamTotalPoints(b) - getTeamTotalPoints(a));
}
