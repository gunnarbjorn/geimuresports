-- Allow public read access to registrations for displaying registered teams
DROP POLICY IF EXISTS "No public read access to registrations" ON public.registrations;

CREATE POLICY "Public can view registrations" 
ON public.registrations 
FOR SELECT 
USING (true);