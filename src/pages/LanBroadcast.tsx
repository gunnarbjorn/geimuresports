import { useTournamentRealtime } from '@/hooks/useTournamentRealtime';
import BroadcastView from '@/components/lan-manager/BroadcastView';
import { Loader2 } from 'lucide-react';

/**
 * Standalone broadcast page powered by Supabase Realtime.
 * Open in a separate tab/window for stream overlay — no auth required (public read).
 */
export default function LanBroadcast() {
  const { state, isLoading } = useTournamentRealtime({ readOnly: true });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d0f' }}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return <BroadcastView state={state} />;
}
