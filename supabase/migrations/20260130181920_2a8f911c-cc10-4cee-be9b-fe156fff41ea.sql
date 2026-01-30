-- Drop the existing constraint and add a new one with elko-tournament
ALTER TABLE public.registrations DROP CONSTRAINT registrations_type_check;

ALTER TABLE public.registrations ADD CONSTRAINT registrations_type_check 
  CHECK (type = ANY (ARRAY['training'::text, 'tournament'::text, 'contact'::text, 'elko-tournament'::text]));