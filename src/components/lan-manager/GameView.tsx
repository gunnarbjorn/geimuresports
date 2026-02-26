import { useState } from 'react';
import { TournamentState, TournamentAction, getRankedTeams, getTeamTotalPoints } from './types';

interface Props {
  state: TournamentState;
  dispatch: React.Dispatch<TournamentAction>;
}

export default function GameView({ state, dispatch }: Props) {
  const [eliminatingTeam, setEliminatingTeam] = useState<string | null>(null);

  const aliveTeams = state.teams.filter(t => t.alive);
  const eliminatedTeams = state.teams.filter(t => !t.alive);
  const ranked = getRankedTeams(state.teams);

  const handleEliminate = (teamId: string) => {
    setEliminatingTeam(teamId);
  };

  const handleSelectKiller = (killerTeamId: string) => {
    if (!eliminatingTeam) return;
    dispatch({ type: 'ELIMINATE_TEAM', teamId: eliminatingTeam, killerTeamId });
    setEliminatingTeam(null);
  };

  const handleRevive = (teamId: string) => {
    dispatch({ type: 'REVIVE_TEAM', teamId });
  };

  const handleEndGame = () => {
    if (window.confirm(`Ljúka leik ${state.currentGame}? Placement stig verða reiknuð sjálfkrafa.`)) {
      dispatch({ type: 'END_GAME' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 h-full">
      {/* Left Panel: Teams Alive */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#22c55e' }}>
            🟢 SPILARAR Á LÍFI ({aliveTeams.length})
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {aliveTeams.map(team => (
            <div
              key={team.id}
              className="p-4 rounded-xl flex items-center justify-between transition-all"
              style={{
                background: '#1a1a1f',
                border: '1px solid #22c55e33',
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.1)',
              }}
            >
              <div>
                <h3 className="font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{team.name}</h3>
                <p className="text-xs text-gray-400">{team.players[0]} & {team.players[1]}</p>
                {team.gameKills > 0 && (
                  <p className="text-xs mt-1" style={{ color: '#e8341c' }}>
                    {team.gameKills} kills ({team.gameKills * 2} stig)
                  </p>
                )}
              </div>
              <button
                onClick={() => handleEliminate(team.id)}
                className="px-4 py-2 text-sm font-bold rounded-lg transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(232, 52, 28, 0.2)',
                  border: '1px solid #e8341c',
                  color: '#e8341c',
                  fontFamily: 'Rajdhani, sans-serif',
                }}
              >
                FELL
              </button>
            </div>
          ))}
        </div>

        {/* Eliminated teams */}
        {eliminatedTeams.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-gray-500 mt-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              ÚR LEIK ({eliminatedTeams.length})
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {eliminatedTeams.map(team => (
                <div
                  key={team.id}
                  className="p-3 rounded-xl flex items-center justify-between opacity-50"
                  style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}
                >
                  <div>
                    <h3 className="font-bold text-sm line-through" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {team.name}
                    </h3>
                    <p className="text-xs text-gray-500">{team.players[0]} & {team.players[1]}</p>
                  </div>
                  <button
                    onClick={() => handleRevive(team.id)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all hover:scale-105"
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid #22c55e',
                      color: '#22c55e',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    REVIVE
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right Panel: Leaderboard */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          📊 STIGATAFLA
        </h2>

        <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1f', border: '1px solid #2a2a30' }}>
          {ranked.map((team, i) => {
            const medalColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : undefined;
            return (
              <div
                key={team.id}
                className="flex items-center justify-between px-4 py-3 transition-all"
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
                  <div>
                    <span className="font-bold text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {team.name}
                    </span>
                    {team.alive && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">{team.killPoints}k</span>
                  <span className="text-gray-500">{team.placementPoints}p</span>
                  <span className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#e8341c' }}>
                    {getTeamTotalPoints(team)}
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
          LEIKUR {state.currentGame} AF 5
        </span>
        <button
          onClick={handleEndGame}
          className="px-8 py-3 font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            background: 'linear-gradient(135deg, #e8341c, #c62a17)',
            color: '#fff',
            boxShadow: '0 0 20px rgba(232, 52, 28, 0.3)',
          }}
        >
          LJÚKA LEIK
        </button>
      </div>

      {/* Elimination Modal */}
      {eliminatingTeam && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setEliminatingTeam(null)}
        >
          <div
            className="p-6 rounded-2xl w-full max-w-md mx-4"
            style={{ background: '#1a1a1f', border: '1px solid #e8341c' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              HVER FELDI ÞETTA LIÐ?
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {state.teams.find(t => t.id === eliminatingTeam)?.name} var fellt
            </p>
            <div className="grid gap-2">
              {aliveTeams
                .filter(t => t.id !== eliminatingTeam)
                .map(team => (
                  <button
                    key={team.id}
                    onClick={() => handleSelectKiller(team.id)}
                    className="w-full p-3 text-left rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: '#0d0d0f',
                      border: '1px solid #2a2a30',
                      fontFamily: 'Rajdhani, sans-serif',
                    }}
                  >
                    {team.name}
                    <span className="text-xs text-gray-500 ml-2">
                      {team.players[0]} & {team.players[1]}
                    </span>
                  </button>
                ))}
            </div>
            <button
              onClick={() => setEliminatingTeam(null)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
            >
              Hætta við
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
