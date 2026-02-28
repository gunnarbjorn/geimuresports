import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type TournamentStatus = 'upcoming' | 'active' | 'completed';

interface TournamentStatusRecord {
  tournament_id: string;
  status: TournamentStatus;
  is_visible: boolean;
  updated_at: string;
}

export function useTournamentStatuses() {
  const [statuses, setStatuses] = useState<Record<string, TournamentStatus>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatuses = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from('tournament_statuses')
      .select('*');

    if (error) {
      console.error('Error fetching tournament statuses:', error);
    } else {
      const statusMap: Record<string, TournamentStatus> = {};
      const visMap: Record<string, boolean> = {};
      (data || []).forEach((r: TournamentStatusRecord) => {
        statusMap[r.tournament_id] = r.status;
        visMap[r.tournament_id] = r.is_visible;
      });
      setStatuses(statusMap);
      setVisibility(visMap);
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
      newStatus === 'active' ? 'Mót birt!' :
      newStatus === 'completed' ? 'Móti lokað!' :
      newStatus === 'upcoming' ? 'Mót tekið af lofti!' :
      'Staða uppfærð!'
    );
    return true;
  }, []);

  const updateVisibility = useCallback(async (tournamentId: string, isVisible: boolean) => {
    const { error } = await (supabase as any)
      .from('tournament_statuses')
      .upsert({ tournament_id: tournamentId, is_visible: isVisible }, { onConflict: 'tournament_id' });

    if (error) {
      console.error('Error updating tournament visibility:', error);
      toast.error('Villa við að uppfæra sýnileika');
      return false;
    }

    setVisibility(prev => ({ ...prev, [tournamentId]: isVisible }));
    toast.success(isVisible ? 'Mót birt á /keppa!' : 'Mót falið af /keppa!');
    return true;
  }, []);

  const getStatus = useCallback((tournamentId: string): TournamentStatus => {
    return statuses[tournamentId] || 'upcoming';
  }, [statuses]);

  const isVisible = useCallback((tournamentId: string): boolean => {
    return visibility[tournamentId] ?? false;
  }, [visibility]);

  return { statuses, isLoading, getStatus, updateStatus, updateVisibility, isVisible, refetch: fetchStatuses };
}
