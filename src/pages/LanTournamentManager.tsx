import { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TournamentState,
  createInitialState,
  tournamentReducer,
  Team,
} from '@/components/lan-manager/types';
import DashboardView from '@/components/lan-manager/DashboardView';
import GameView from '@/components/lan-manager/GameView';
import BroadcastView from '@/components/lan-manager/BroadcastView';
import ResultsView from '@/components/lan-manager/ResultsView';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2, ShieldAlert } from 'lucide-react';

type View = 'dashboard' | 'game' | 'broadcast' | 'results';

function syncToStorage(state: TournamentState) {
  try {
    localStorage.setItem('lan-tournament-state', JSON.stringify(state));
  } catch {}
}

export default function LanTournamentManager() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAdminAuth();
  const [state, dispatch] = useReducer(tournamentReducer, undefined, () => createInitialState());
  const [view, setView] = useState<View>('dashboard');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  // Fetch registered teams from DB and merge
  useEffect(() => {
    if (!isAdmin) return;
    async function fetchTeams() {
      try {
        const { data } = await (supabase as any).rpc('get_lan_registered_teams');
        if (data && data.length > 0) {
          const existingNames = new Set(state.teams.map(t => t.name.toLowerCase()));
          const dbTeams: Team[] = data
            .filter((row: any) => !existingNames.has(row.team_name.toLowerCase()))
            .map((row: any) => ({
              id: row.id,
              name: row.team_name,
              players: [row.player1, row.player2] as [string, string],
              playersAlive: [true, true] as [boolean, boolean],
              killPoints: 0,
              placementPoints: 0,
              alive: true,
              gameKills: 0,
            }));

          if (dbTeams.length > 0) {
            dispatch({ type: 'SET_TEAMS', teams: [...state.teams, ...dbTeams] });
          }
        }
      } catch {}
    }
    fetchTeams();
  }, [isAdmin]);

  // Sync state to localStorage
  useEffect(() => {
    syncToStorage(state);
  }, [state]);

  // Auto-switch views based on state
  useEffect(() => {
    if (state.status === 'lobby' && view === 'game') setView('dashboard');
    if (state.status === 'active' && view === 'dashboard') setView('game');
    if (state.status === 'finished' && view !== 'results' && view !== 'broadcast') setView('results');
  }, [state.status]);

  const openBroadcastTab = () => {
    window.open(window.location.origin + '/admin/lan-broadcast', '_blank');
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d0f' }}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Not admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d0f' }}>
        <div className="text-center">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Aðgangur bannaður</h2>
          <p className="text-gray-400 mb-6">Þú hefur ekki admin réttindi.</p>
          <button onClick={signOut} className="px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700">Útskrá</button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen text-white" style={{ background: '#0d0d0f', fontFamily: 'Rajdhani, sans-serif' }}>
      {/* Top Nav */}
      <nav
        className="flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: '#0d0d0fee', borderBottom: '1px solid #1a1a1f' }}
      >
        <div className="flex items-center gap-1">
          {(['dashboard', 'game', 'broadcast', 'results'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-2 text-sm font-bold rounded-lg transition-all"
              style={{
                background: view === v ? '#e8341c22' : 'transparent',
                color: view === v ? '#e8341c' : '#666',
                border: view === v ? '1px solid #e8341c44' : '1px solid transparent',
              }}
            >
              {v === 'dashboard' && '🏠 Yfirlit'}
              {v === 'game' && '🎮 Leikur'}
              {v === 'broadcast' && '📺 Útsending'}
              {v === 'results' && '🏆 Niðurstöður'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openBroadcastTab}
            className="px-3 py-1.5 text-xs font-bold rounded-lg"
            style={{ background: '#1a1a1f', color: '#888', border: '1px solid #2a2a30' }}
          >
            📺 Opna útsendingu í nýjum flipa
          </button>
          <span className="text-xs text-gray-600">
            {state.status === 'lobby' && 'Lobby'}
            {state.status === 'active' && `Leikur ${state.currentGame}/5`}
            {state.status === 'finished' && 'Lokið'}
          </span>
        </div>
      </nav>

      {/* Views */}
      <main className={view === 'game' ? 'pb-20' : ''}>
        {view === 'dashboard' && <DashboardView state={state} dispatch={dispatch} />}
        {view === 'game' && <GameView state={state} dispatch={dispatch} />}
        {view === 'broadcast' && <BroadcastView state={state} />}
        {view === 'results' && <ResultsView state={state} dispatch={dispatch} />}
      </main>
    </div>
  );
}
