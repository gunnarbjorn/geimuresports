
-- Tournament table for real-time multi-admin collaboration
CREATE TABLE public.lan_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'lobby',
  current_game int NOT NULL DEFAULT 0,
  placement_config jsonb NOT NULL DEFAULT '[10,7,5,3,2,2,1,1,1,1]'::jsonb,
  kill_points_per_kill int NOT NULL DEFAULT 2,
  game_locked boolean NOT NULL DEFAULT false,
  raffle_winners jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Events table (immutable event log for event-sourced scoring)
CREATE TABLE public.lan_tournament_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES public.lan_tournaments(id) ON DELETE CASCADE,
  game_number int NOT NULL DEFAULT 0,
  event_type text NOT NULL,
  event_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  admin_user_id uuid,
  admin_email text NOT NULL DEFAULT '',
  undone boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lan_events_tournament ON public.lan_tournament_events(tournament_id, game_number);

-- RLS
ALTER TABLE public.lan_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lan_tournament_events ENABLE ROW LEVEL SECURITY;

-- Public read (for broadcast overlay)
CREATE POLICY "Public can view tournaments" ON public.lan_tournaments FOR SELECT USING (true);
CREATE POLICY "Public can view events" ON public.lan_tournament_events FOR SELECT USING (true);

-- Admin write
CREATE POLICY "Admins can insert tournaments" ON public.lan_tournaments FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update tournaments" ON public.lan_tournaments FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete tournaments" ON public.lan_tournaments FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert events" ON public.lan_tournament_events FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update events" ON public.lan_tournament_events FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete events" ON public.lan_tournament_events FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.lan_tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lan_tournament_events;

-- Updated_at trigger
CREATE TRIGGER update_lan_tournaments_updated_at
  BEFORE UPDATE ON public.lan_tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lan_orders_updated_at();
