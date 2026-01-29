-- Create registrations table to store all signups
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('training', 'tournament', 'contact')),
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow insert from anyone (public form submissions)
CREATE POLICY "Anyone can insert registrations"
  ON public.registrations
  FOR INSERT
  WITH CHECK (true);

-- Only allow select/update/delete via service role (admin access)
-- No public read access to protect personal information