
-- Fix linter warning: Replace SECURITY DEFINER view with a SECURITY DEFINER function
-- This is safer and avoids the view security concern while still allowing public access to non-PII data

DROP VIEW IF EXISTS public.registrations_public;

-- Create a function that returns only non-PII fields for verified registrations
CREATE OR REPLACE FUNCTION public.get_public_registrations()
RETURNS TABLE (
  id UUID,
  type TEXT,
  created_at TIMESTAMPTZ,
  team_name TEXT,
  player1_name TEXT,
  player2_name TEXT,
  full_name TEXT,
  teammate_name TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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
  WHERE r.verified = true
$$;

-- Create a count function for public use (e.g., showing remaining spots)
CREATE OR REPLACE FUNCTION public.get_registration_count(_type TEXT)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.registrations
  WHERE type = _type AND verified = true
$$;
