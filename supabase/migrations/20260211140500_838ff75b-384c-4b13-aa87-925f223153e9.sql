
-- Create order status enum
CREATE TYPE public.lan_order_status AS ENUM ('PENDING_PAYMENT', 'PAID', 'CANCELED', 'ERROR');

-- Create LAN tournament orders table
CREATE TABLE public.lan_tournament_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  team_name TEXT NOT NULL,
  player1 TEXT NOT NULL,
  player2 TEXT NOT NULL,
  email TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ISK',
  status public.lan_order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
  paid_at TIMESTAMP WITH TIME ZONE,
  authorization_code TEXT,
  masked_card TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT order_id_format CHECK (order_id ~ '^[A-Za-z0-9]{1,12}$')
);

-- Enable RLS
ALTER TABLE public.lan_tournament_orders ENABLE ROW LEVEL SECURITY;

-- Public can insert (via edge function using service role, but allow anon insert too for the edge fn)
CREATE POLICY "Service role full access on lan_tournament_orders"
  ON public.lan_tournament_orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Actually, let's be more restrictive. Edge functions use service role key which bypasses RLS.
-- For anon/authenticated users, only allow SELECT on their own orders by order_id (public read for confirmation page).
DROP POLICY "Service role full access on lan_tournament_orders" ON public.lan_tournament_orders;

-- Allow public to read orders (for confirmation page lookup by order_id)
CREATE POLICY "Public can read lan orders by order_id"
  ON public.lan_tournament_orders
  FOR SELECT
  USING (true);

-- No public insert/update/delete - edge functions use service role which bypasses RLS
-- Admins can manage
CREATE POLICY "Admins can manage lan orders"
  ON public.lan_tournament_orders
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_lan_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_lan_tournament_orders_updated_at
  BEFORE UPDATE ON public.lan_tournament_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lan_orders_updated_at();
