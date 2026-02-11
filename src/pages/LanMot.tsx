import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import {
  MapPin,
  Calendar,
  Clock,
  Trophy,
  Gamepad2,
  Loader2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import arenaLanBg from "@/assets/arena-lan-bg.jpeg";
import arenaLanBgMobile from "@/assets/arena-lan-bg-mobile.jpeg";

const TOURNAMENT_INFO = {
  name: "Fortnite Duos LAN",
  location: "Arena",
  date: "Lau 28. feb",
  time: "11:00 – 14:00",
  entryFeePerTeam: 8880,
};

export default function LanMot() {
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");

  const [teamName, setTeamName] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "lan-securepay-create",
        {
          body: {
            teamName: teamName.trim(),
            player1: player1.trim(),
            player2: player2.trim(),
            email: email.trim(),
          },
        }
      );

      if (fnError || !data?.paymentUrl || !data?.fields) {
        setError(data?.error || "Villa við skráningu — reyndu aftur");
        setIsSubmitting(false);
        return;
      }

      // Create hidden form and POST to Teya SecurePay
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;
      form.style.display = "none";

      for (const [key, value] of Object.entries(data.fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Villa — reyndu aftur");
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-screen h-screen z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-80 bg-cover bg-center bg-no-repeat hidden md:block"
            style={{ backgroundImage: `url(${arenaLanBg})` }}
          />
          <div
            className="absolute inset-0 opacity-80 bg-cover bg-center bg-no-repeat md:hidden"
            style={{ backgroundImage: `url(${arenaLanBgMobile})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-4 py-12 space-y-6">
          {/* Status alerts from redirects */}
          {statusParam === "cancelled" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>Greiðsla hætt við — skráning var ekki kláruð.</AlertDescription>
            </Alert>
          )}
          {statusParam === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Villa í greiðslu — prófaðu aftur.</AlertDescription>
            </Alert>
          )}

          {/* Hero */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card border-[hsl(var(--arena-green)/0.5)]">
              <MapPin className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--arena-green))]" />
              {TOURNAMENT_INFO.location}
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{TOURNAMENT_INFO.name}</h1>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Calendar className="h-4 w-4 mr-2 text-[hsl(var(--planet-tournament))]" />
                {TOURNAMENT_INFO.date}
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Clock className="h-4 w-4 mr-2 text-[hsl(var(--planet-tournament))]" />
                {TOURNAMENT_INFO.time}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Keppnisgjald:{" "}
              <span className="text-[hsl(var(--arena-green))] font-bold">
                {TOURNAMENT_INFO.entryFeePerTeam.toLocaleString("is-IS")} kr
              </span>{" "}
              á lið
            </p>
          </div>

          {/* Registration + Payment form */}
          <Card className="glass-card border-[hsl(var(--arena-green)/0.3)] overflow-hidden glow-green-sm">
            <CardHeader className="bg-gradient-to-r from-[hsl(var(--arena-green)/0.1)] to-transparent border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                </div>
                <div>
                  <CardTitle className="font-display text-lg">Skrá lið & greiða</CardTitle>
                  <p className="text-sm text-muted-foreground">Skráning er fyrir lið (2 keppendur)</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="teamName">Liðsheiti</Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Nafn liðsins"
                    required
                    maxLength={50}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="player1">
                      <Gamepad2 className="inline h-3.5 w-3.5 mr-1" />
                      Leikmaður 1
                    </Label>
                    <Input
                      id="player1"
                      value={player1}
                      onChange={(e) => setPlayer1(e.target.value)}
                      placeholder="Nafn"
                      required
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <Label htmlFor="player2">
                      <Gamepad2 className="inline h-3.5 w-3.5 mr-1" />
                      Leikmaður 2
                    </Label>
                    <Input
                      id="player2"
                      value={player2}
                      onChange={(e) => setPlayer2(e.target.value)}
                      placeholder="Nafn"
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Netfang</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="netfang@dæmi.is"
                    required
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Staðfesting send á þetta netfang</p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full btn-arena-gradient text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vinnsla...
                    </>
                  ) : (
                    <>
                      Skrá og greiða — {TOURNAMENT_INFO.entryFeePerTeam.toLocaleString("is-IS")} kr
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Þú verður vísað á örugg greiðslusíðu Teya/Borgun
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
