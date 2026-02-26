import { useEffect, useState } from 'react';
import { TournamentState, createInitialState } from '@/components/lan-manager/types';
import BroadcastView from '@/components/lan-manager/BroadcastView';

/**
 * Standalone broadcast page that reads tournament state from localStorage.
 * Open this in a separate tab/window for stream overlay.
 */
export default function LanBroadcast() {
  const [state, setState] = useState<TournamentState>(createInitialState());

  useEffect(() => {
    // Initial load
    const stored = localStorage.getItem('lan-tournament-state');
    if (stored) {
      try { setState(JSON.parse(stored)); } catch {}
    }

    // Listen for changes from the manager tab
    const handler = (e: StorageEvent) => {
      if (e.key === 'lan-tournament-state' && e.newValue) {
        try { setState(JSON.parse(e.newValue)); } catch {}
      }
    };

    window.addEventListener('storage', handler);
    
    // Also poll every 2s as fallback
    const interval = setInterval(() => {
      const s = localStorage.getItem('lan-tournament-state');
      if (s) {
        try { setState(JSON.parse(s)); } catch {}
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handler);
      clearInterval(interval);
    };
  }, []);

  return <BroadcastView state={state} />;
}
