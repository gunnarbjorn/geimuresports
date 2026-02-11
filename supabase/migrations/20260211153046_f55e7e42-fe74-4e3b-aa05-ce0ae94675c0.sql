
-- Add pizza flag to lan_tournament_orders
ALTER TABLE public.lan_tournament_orders
ADD COLUMN pizza BOOLEAN NOT NULL DEFAULT false;
