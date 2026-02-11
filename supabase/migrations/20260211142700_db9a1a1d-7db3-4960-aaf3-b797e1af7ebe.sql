-- Fix RLS: Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Public can read lan orders by order_id" ON public.lan_tournament_orders;
DROP POLICY IF EXISTS "Admins can manage lan orders" ON public.lan_tournament_orders;

-- Public can SELECT (permissive)
CREATE POLICY "Public can read lan orders"
  ON public.lan_tournament_orders
  FOR SELECT
  USING (true);

-- Admins can do everything (permissive)
CREATE POLICY "Admins can manage lan orders"
  ON public.lan_tournament_orders
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
