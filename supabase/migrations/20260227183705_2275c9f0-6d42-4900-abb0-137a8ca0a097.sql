
CREATE OR REPLACE FUNCTION public.get_allt_undir_players(p_date text)
RETURNS TABLE(id uuid, fortnite_name text, full_name text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    r.id,
    r.data->>'fortniteName' as fortnite_name,
    r.data->>'fullName' as full_name,
    r.created_at
  FROM public.registrations r
  WHERE r.type = 'allt-undir-' || p_date
    AND r.verified = true
  ORDER BY r.created_at ASC;
$$;
