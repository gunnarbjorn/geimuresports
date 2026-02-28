import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type TournamentStatus = 'upcoming' | 'active' | 'completed';

interface TournamentStatusRecord {
  tournament_id: string;
  status: TournamentStatus;
  updated_at: string;
}

export function useTournamentStatuses() {
  const [statuses, setStatuses] = useState<Record<string, TournamentStatus>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatuses = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('tournament_statuses')
      .select('*');

    if (error) {
      console.error('Error fetching tournament statuses:', error);
    } else {
      const map: Record<string, TournamentStatus> = {};
      (data || []).forEach((r: TournamentStatusRecord) => {
        map[r.tournament_id] = r.status;
      });
      setStatuses(map);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const updateStatus = useCallback(async (tournamentId: string, newStatus: TournamentStatus) => {
    const { error } = await (supabase as any)
      .from('tournament_statuses')
      .upsert({ tournament_id: tournamentId, status: newStatus }, { onConflict: 'tournament_id' });

    if (error) {
      console.error('Error updating tournament status:', error);
      toast.error('Villa við að uppfæra stöðu móts');
      return false;
    }

    setStatuses(prev => ({ ...prev, [tournamentId]: newStatus }));
    toast.success(
      newStatus === 'active' ? 'Skráning opnuð!' :
      newStatus === 'completed' ? 'Móti lokað!' :
      'Staða uppfærð!'
    );
    return true;
  }, []);

  const getStatus = useCallback((tournamentId: string): TournamentStatus => {
    return statuses[tournamentId] || 'active';
  }, [statuses]);

  return { statuses, isLoading, getStatus, updateStatus, refetch: fetchStatuses };
}
