import { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SoloTournamentState,
  createSoloInitialState,
  soloTournamentReducer,
  SoloPlayer,
} from '@/components/solo-manager/types';
import SoloDashboardView from '@/components/solo-manager/DashboardView';
import SoloGameView from '@/components/solo-manager/GameView';
import SoloBroadcastView from '@/components/solo-manager/BroadcastView';
import SoloResultsView from '@/components/solo-manager/ResultsView';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2, ShieldAlert } from 'lucide-react';

type View = 'dashboard' | 'game' | 'broadcast' | 'results';

const STORAGE_KEY = 'allt-undir-tournament-state';

function syncToStorage(state: SoloTournamentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function loadFromStorage(): SoloTournamentState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export default function AlltUndirManager() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAdminAuth();
  const [state, dispatch] = useReducer(soloTournamentReducer, undefined, () => {
    return loadFromStorage() || createSoloInitialState();
  });
  const [view, setView] = useState<View>('dashboard');

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  // Fetch registered players from DB
  useEffect(() => {
    if (!isAdmin) return;
    async function fetchPlayers() {
      try {
        const { data } = await (supabase as any).rpc('get_allt_undir_players', {
          p_date: state.tournamentDate,
        });
        if (data && data.length > 0) {
          const existingNames = new Set(state.players.map(p => p.name.toLowerCase()));
          const dbPlayers: SoloPlayer[] = data
            .filter((row: any) => !existingNames.has((row.fortnite_name || '').toLowerCase()))
            .map((row: any) => ({
              id: row.id,
              name: row.fortnite_name || row.full_name,
              fullName: row.full_name,
              killPoints: 0,
              placementPoints: 0,
              alive: true,
              gameKills: 0,
            }));
          if (dbPlayers.length > 0) {
            dispatch({ type: 'SET_PLAYERS', players: [...state.players, ...dbPlayers] });
          }
        }
      } catch {}
    }
    fetchPlayers();
  }, [isAdmin]);

  useEffect(() => {
    syncToStorage(state);
  }, [state]);

  useEffect(() => {
    if (state.status === 'lobby' && view === 'game') setView('dashboard');
    if (state.status === 'active' && view === 'dashboard') setView('game');
    if (state.status === 'finished' && view !== 'results' && view !== 'broadcast') setView('results');
  }, [state.status]);

  const openBroadcastTab = () => {
    window.open(window.location.origin + '/admin/allt-undir-broadcast', '_blank');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d0f' }}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

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
                background: view === v ? '#22c55e22' : 'transparent',
                color: view === v ? '#22c55e' : '#666',
                border: view === v ? '1px solid #22c55e44' : '1px solid transparent',
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
            {state.status === 'active' && `Leikur ${state.currentGame}/${state.totalGames}`}
            {state.status === 'finished' && 'Lokið'}
          </span>
        </div>
      </nav>

      <main className={view === 'game' ? 'pb-20' : ''}>
        {view === 'dashboard' && <SoloDashboardView state={state} dispatch={dispatch} />}
        {view === 'game' && <SoloGameView state={state} dispatch={dispatch} />}
        {view === 'broadcast' && <SoloBroadcastView state={state} />}
        {view === 'results' && <SoloResultsView state={state} dispatch={dispatch} />}
      </main>
    </div>
  );
}
