
-- Drop the restrictive policy
DROP POLICY "Admins can manage lan orders" ON public.lan_tournament_orders;

-- Create a permissive policy instead
CREATE POLICY "Admins can manage lan orders"
ON public.lan_tournament_orders
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
