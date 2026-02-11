
-- RPC for order confirmation page (lookup by order_id, returns limited fields)
CREATE OR REPLACE FUNCTION public.get_lan_order_by_id(p_order_id TEXT)
RETURNS TABLE(order_id TEXT, team_name TEXT, player1 TEXT, player2 TEXT, email TEXT, status lan_order_status, paid_at TIMESTAMPTZ, amount INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT order_id, team_name, player1, player2, email, status, paid_at, amount
  FROM public.lan_tournament_orders
  WHERE order_id = p_order_id
  LIMIT 1;
$$;

-- RPC for public team list (no PII - no email, card, auth code)
CREATE OR REPLACE FUNCTION public.get_lan_registered_teams()
RETURNS TABLE(id UUID, team_name TEXT, player1 TEXT, player2 TEXT, created_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, team_name, player1, player2, created_at
  FROM public.lan_tournament_orders
  WHERE status = 'PAID'
  ORDER BY created_at ASC;
$$;

-- Remove the dangerous public SELECT policy
DROP POLICY "Public can read lan orders" ON public.lan_tournament_orders;
