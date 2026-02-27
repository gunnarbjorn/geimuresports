CREATE OR REPLACE FUNCTION public.get_verified_registration_count(_type text)
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.registrations
  WHERE type = _type AND verified = true
$$;