
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Admins can manage lan orders" ON public.lan_tournament_orders;

CREATE POLICY "Admins can manage lan orders"
ON public.lan_tournament_orders
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
