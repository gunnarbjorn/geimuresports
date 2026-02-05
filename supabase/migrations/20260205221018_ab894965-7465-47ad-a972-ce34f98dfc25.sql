
-- Update get_public_registrations to return ALL registrations (not just verified)
CREATE OR REPLACE FUNCTION public.get_public_registrations()
 RETURNS TABLE(id uuid, type text, created_at timestamp with time zone, team_name text, player1_name text, player2_name text, full_name text, teammate_name text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT
    r.id,
    r.type,
    r.created_at,
    r.data->>'teamName',
    r.data->>'player1Name',
    r.data->>'player2Name',
    r.data->>'fullName',
    r.data->>'teammateName'
  FROM public.registrations r
$$;

-- Update get_registration_count to count ALL registrations (not just verified)
CREATE OR REPLACE FUNCTION public.get_registration_count(_type text)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.registrations
  WHERE type = _type
$$;

-- Set verified default to true so new registrations appear immediately
ALTER TABLE public.registrations ALTER COLUMN verified SET DEFAULT true;

-- Update existing unverified registrations to verified
UPDATE public.registrations SET verified = true WHERE verified = false;
