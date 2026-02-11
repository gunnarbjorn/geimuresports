import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock, RefreshCw, ArrowLeft, Loader2 } from "lucide-react";

interface OrderData {
  order_id: string;
  team_name: string;
  player1: string;
  player2: string;
  email: string;
  status: string;
  paid_at: string | null;
  amount: number;
}

export default function LanMotStadfesting() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderid") || "";
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOrder = async () => {
    if (!orderId) { setLoading(false); setError(true); return; }
    setLoading(true);
    const { data, error: err } = await supabase
      .rpc("get_lan_order_by_id", { p_order_id: orderId });

    const row = Array.isArray(data) ? data[0] : data;
    if (err || !row) {
      setError(true);
    } else {
      setOrder(row as OrderData);
    }
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrder();
  }, [orderId]);

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-16 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error || !order ? (
          <Card className="bg-card border-destructive/30">
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-lg font-semibold">Pöntun fannst ekki</p>
              <p className="text-sm text-muted-foreground">Athugaðu pöntunarnúmerið og reyndu aftur.</p>
              <Button asChild variant="outline">
                <Link to="/keppa/arena-lan"><ArrowLeft className="mr-2 h-4 w-4" />Til baka</Link>
              </Button>
            </CardContent>
          </Card>
        ) : order.status === "PAID" ? (
          <Card className="bg-card border-[hsl(var(--arena-green)/0.5)] glow-green-sm">
            <CardContent className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-[hsl(var(--arena-green))]" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold mb-1">Greitt ✅</h1>
                <p className="text-[hsl(var(--arena-green))] font-semibold">Liðið er skráð á mótið!</p>
              </div>
              <div className="text-left space-y-2 bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lið:</span>
                  <span className="font-medium">{order.team_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leikmaður 1:</span>
                  <span>{order.player1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leikmaður 2:</span>
                  <span>{order.player2}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pöntun:</span>
                  <Badge variant="outline" className="font-mono text-xs">{order.order_id}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Upphæð:</span>
                  <span>{order.amount.toLocaleString("is-IS")} kr</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Staðfesting hefur verið send á <strong>{order.email}</strong></p>
              <Button asChild className="btn-arena-gradient mt-2">
                <Link to="/keppa/arena-lan">Sjá skráð lið</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold mb-1">Greiðsla í vinnslu</h1>
                <p className="text-muted-foreground text-sm">
                  Staða: <Badge variant="secondary" className="ml-1">{order.status}</Badge>
                </p>
              </div>
              <Button onClick={fetchOrder} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Endurhlaða
              </Button>
              <p className="text-xs text-muted-foreground">Ef greiðsla tókst gæti tekið smá stund að uppfæra stöðu.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
