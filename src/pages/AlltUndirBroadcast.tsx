import { useEffect, useState } from 'react';
import { SoloTournamentState, createSoloInitialState } from '@/components/solo-manager/types';
import SoloBroadcastView from '@/components/solo-manager/BroadcastView';

const STORAGE_KEY = 'allt-undir-tournament-state';

export default function AlltUndirBroadcast() {
  const [state, setState] = useState<SoloTournamentState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return createSoloInitialState();
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch {}
      }
    };

    // Also poll for same-tab changes
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setState(parsed);
        }
      } catch {}
    }, 500);

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return <SoloBroadcastView state={state} />;
}
