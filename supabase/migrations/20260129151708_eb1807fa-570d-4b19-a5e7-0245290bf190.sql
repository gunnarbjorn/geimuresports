-- Explicit deny policies for registrations table
-- With RLS enabled, no policy = denied by default, but these make the security intent explicit

-- Deny all SELECT access to registrations (only service role can read)
CREATE POLICY "No public read access to registrations"
ON public.registrations
FOR SELECT
USING (false);

-- Deny all UPDATE access to registrations
CREATE POLICY "No public update access to registrations"
ON public.registrations
FOR UPDATE
USING (false);

-- Deny all DELETE access to registrations
CREATE POLICY "No public delete access to registrations"
ON public.registrations
FOR DELETE
USING (false);