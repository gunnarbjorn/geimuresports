
-- Tournament statuses table to track status of each tournament
CREATE TABLE public.tournament_statuses (
  tournament_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'active',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add validation trigger instead of CHECK constraint
CREATE OR REPLACE FUNCTION public.validate_tournament_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status NOT IN ('upcoming', 'active', 'completed') THEN
    RAISE EXCEPTION 'Invalid status: %. Must be upcoming, active, or completed.', NEW.status;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_tournament_status
  BEFORE INSERT OR UPDATE ON public.tournament_statuses
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_tournament_status();

-- Enable RLS
ALTER TABLE public.tournament_statuses ENABLE ROW LEVEL SECURITY;

-- Public can read statuses
CREATE POLICY "Public can view tournament statuses"
  ON public.tournament_statuses
  FOR SELECT
  USING (true);

-- Admins can manage statuses
CREATE POLICY "Admins can manage tournament statuses"
  ON public.tournament_statuses
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed initial statuses for existing tournaments
INSERT INTO public.tournament_statuses (tournament_id, status) VALUES
  ('elko-deild-vor-2026', 'completed'),
  ('arena-lan-coming-soon', 'completed'),
  ('allt-undir', 'completed')
ON CONFLICT (tournament_id) DO NOTHING;
