
-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Add verified column to registrations (payment verification)
ALTER TABLE public.registrations ADD COLUMN verified BOOLEAN NOT NULL DEFAULT false;

-- 6. Create public view that exposes ONLY non-PII fields and only verified registrations
CREATE VIEW public.registrations_public AS
SELECT
  id,
  type,
  created_at,
  data->>'teamName' AS team_name,
  data->>'player1Name' AS player1_name,
  data->>'player2Name' AS player2_name,
  data->>'fullName' AS full_name,
  data->>'teammateName' AS teammate_name
FROM public.registrations
WHERE verified = true;

GRANT SELECT ON public.registrations_public TO anon, authenticated;

-- 7. Drop existing overly-permissive RLS policies on registrations
DROP POLICY IF EXISTS "Public can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "No public delete access to registrations" ON public.registrations;
DROP POLICY IF EXISTS "No public update access to registrations" ON public.registrations;
DROP POLICY IF EXISTS "Anyone can insert registrations" ON public.registrations;

-- 8. Create new strict RLS policies

-- Public can still insert (form submissions go through edge function with service role,
-- but keeping this for defense-in-depth)
CREATE POLICY "Public can insert registrations"
ON public.registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated admins can SELECT full registration data (with PII)
CREATE POLICY "Admins can view all registrations"
ON public.registrations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete registrations"
ON public.registrations FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update (e.g., toggling verified status)
CREATE POLICY "Admins can update registrations"
ON public.registrations FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
