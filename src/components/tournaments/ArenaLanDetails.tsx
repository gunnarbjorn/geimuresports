import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import arenaLanBg from "@/assets/arena-lan-bg.jpeg";
import arenaLanBgMobile from "@/assets/arena-lan-bg-mobile.jpeg";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Gamepad2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  MessageCircle,
  Copy,
  Clock,
  Ticket,
  Timer,
  Pause,
  PartyPopper,
  Eye,
  Heart,
  Pizza,
  Loader2,
  AlertCircle,
  XCircle,
} from "lucide-react";

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";

const TOURNAMENT_CONFIG = {
  name: "Fortnite DUO LAN",
  game: "Fortnite",
  format: "Duo",
  formatLabel: "2 manna lið",
  location: "Arena",
  date: "Lau 28. feb",
  time: "11:00 – 14:00",
  duration: "3 klst",
  ageLimit: "Allur aldur",
  entryFeePerPlayer: 4440,
  entryFeePerTeam: 8880,
  pizzaUpsell: 1000,
  maxTeams: 50,
  maxPlayers: 100,
};

interface RegisteredTeam {
  id: string;
  teamName: string;
  player1Name: string;
  player2Name: string;
}

const DiscordSupportActions = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(DISCORD_INVITE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="pt-4 border-t border-border space-y-3">
      <a
        href={DISCORD_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="no-referrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
      >
        <MessageCircle className="h-4 w-4" />
        Discord aðstoð & spurningar
      </a>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="sm:w-auto">
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Afritað!" : "Afrita hlekk"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Þeir sem eru með kveikt á adblock geta fengið villu við að opna: afritaðu hlekkinn og opnaðu í nýjum vafra.
        </p>
      </div>
      <p className="text-xs text-muted-foreground break-all">
        Beinn hlekkur: <span className="text-foreground">{DISCORD_INVITE_URL}</span>
      </p>
    </div>
  );
};

const LanPaymentForm = () => {
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const [teamName, setTeamName] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [email, setEmail] = useState("");
  const [wantsPizza, setWantsPizza] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = TOURNAMENT_CONFIG.entryFeePerTeam + (wantsPizza ? TOURNAMENT_CONFIG.pizzaUpsell * 2 : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("lan-securepay-create", {
        body: { teamName: teamName.trim(), player1: player1.trim(), player2: player2.trim(), email: email.trim(), pizza: wantsPizza, baseUrl: window.location.origin },
      });
      if (fnError || !data?.paymentUrl || !data?.fields) {
        setError(data?.error || "Villa við skráningu — reyndu aftur");
        setIsSubmitting(false);
        return;
      }
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
    <>
      {statusParam === "cancelled" && (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertDescription>Greiðsla hætt við — skráning var ekki kláruð.</AlertDescription>
        </Alert>
      )}
      {statusParam === "error" && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Villa í greiðslu — prófaðu aftur.</AlertDescription>
        </Alert>
      )}
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
              <Input id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Nafn liðsins" required maxLength={50} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="player1"><Gamepad2 className="inline h-3.5 w-3.5 mr-1" />Hvað heitir þú í fortnite?</Label>
                <Input id="player1" value={player1} onChange={(e) => setPlayer1(e.target.value)} placeholder="Fortnite nafn" required maxLength={50} />
              </div>
              <div>
                <Label htmlFor="player2"><Gamepad2 className="inline h-3.5 w-3.5 mr-1" />Hvað heitir vinur þinn í fortnite?</Label>
                <Input id="player2" value={player2} onChange={(e) => setPlayer2(e.target.value)} placeholder="Fortnite nafn" required maxLength={50} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Netfang</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="netfang@dæmi.is" required maxLength={100} />
              <p className="text-xs text-muted-foreground mt-1">Staðfesting send á þetta netfang</p>
            </div>
            {/* Pizza checkbox */}
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30">
              <Checkbox
                id="pizza"
                checked={wantsPizza}
                onCheckedChange={(checked) => setWantsPizza(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="pizza" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <Pizza className="h-4 w-4 text-accent" />
                  <span className="font-medium">Pizza pakki</span>
                  <span className="text-sm text-muted-foreground">+{(TOURNAMENT_CONFIG.pizzaUpsell * 2).toLocaleString("is-IS")} kr/lið</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Pizza fyrir báða leikmenn á pásunni</p>
              </Label>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" size="lg" className="w-full btn-arena-gradient text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Vinnsla...</>
              ) : (
                <>Skrá og greiða — 4.440 kr á mann</>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">Þú verður vísað á örugg greiðslusíðu Teya/Borgun</p>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export function ArenaLanDetails({ onBack }: { onBack?: () => void }) {
  const [registeredTeams, setRegisteredTeams] = useState<RegisteredTeam[]>([]);
  const [isTeamsListOpen, setIsTeamsListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState<string | undefined>(undefined);

  const registeredTeamsCount = registeredTeams.length;
  const remainingSpots = TOURNAMENT_CONFIG.maxTeams - registeredTeamsCount;
  const progressPercentage = (registeredTeamsCount / TOURNAMENT_CONFIG.maxTeams) * 100;

  useEffect(() => {
    const fetchRegisteredTeams = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .rpc('get_lan_registered_teams');
        if (error) { console.error('Error fetching LAN teams:', error); return; }
        if (data) {
          const teams: RegisteredTeam[] = data.map((r) => ({
            id: r.id,
            teamName: r.team_name,
            player1Name: r.player1,
            player2Name: r.player2,
          }));
          setRegisteredTeams(teams);
        }
      } catch (err) { console.error('Error:', err); }
      finally { setIsLoading(false); }
    };
    fetchRegisteredTeams();
  }, []);

  const scrollToRegistration = () => {
    const element = document.getElementById('skraning-arena');
    if (element) {
      const offset = element.getBoundingClientRect().top + window.scrollY - 104;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const scrollToSchedule = () => {
    setScheduleOpen("dagskra");
    setTimeout(() => {
      const element = document.getElementById('dagskra-arena');
      if (element) {
        const offset = element.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="relative">
      {/* Full-page campaign background */}
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

      <div className="relative z-10 space-y-6">
      {/* Hero info */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={onBack}
            asChild={!onBack}
          >
            {onBack ? (
              <span><ArrowLeft className="mr-2 h-4 w-4" /> Öll mót</span>
            ) : (
              <Link to="/keppa"><ArrowLeft className="mr-2 h-4 w-4" /> Öll mót</Link>
            )}
          </Button>
          <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card border-[hsl(var(--arena-green)/0.5)]">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--arena-green))]" />
            {TOURNAMENT_CONFIG.location}
          </Badge>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{TOURNAMENT_CONFIG.name}</h2>
        <p className="text-muted-foreground mb-4">
          {TOURNAMENT_CONFIG.game} · {TOURNAMENT_CONFIG.format} ({TOURNAMENT_CONFIG.formatLabel})
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Calendar className="h-4 w-4 mr-2 text-[hsl(var(--planet-tournament))]" />
            {TOURNAMENT_CONFIG.date}
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Clock className="h-4 w-4 mr-2 text-[hsl(var(--planet-tournament))]" />
            {TOURNAMENT_CONFIG.time}
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="btn-arena-gradient text-base" onClick={scrollToRegistration}>
            Skrá mitt lið <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" className="btn-primary-gradient" onClick={scrollToSchedule}>
            Sjá dagskrá
          </Button>
        </div>
      </div>

      {/* Registration status */}
      <Card className="bg-card border-[hsl(var(--arena-green)/0.3)] glow-green-sm">
        <Collapsible open={isTeamsListOpen} onOpenChange={setIsTeamsListOpen}>
          <CollapsibleTrigger asChild>
            <CardContent className="p-5 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                  <span className="font-semibold">Skráning opin</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{remainingSpots} laus pláss</span>
                  {isTeamsListOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-3" />
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(var(--arena-green))] font-bold">
                  {registeredTeamsCount} / {TOURNAMENT_CONFIG.maxTeams} lið skráð
                </span>
                <span className="text-muted-foreground text-xs">Smelltu til að sjá skráð lið</span>
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-5 pb-5 border-t border-border">
              <div className="pt-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                  Skráð lið
                </h3>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Hleður...</p>
                ) : registeredTeams.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Engin lið skráð ennþá</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {registeredTeams.map((team, index) => (
                      <div key={team.id} className="flex items-center gap-3 py-2 px-3 bg-muted/30 rounded-lg">
                        <span className="text-xs font-mono text-muted-foreground w-6">#{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{team.teamName}</p>
                          <p className="text-xs text-muted-foreground truncate">{team.player1Name} & {team.player2Name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Prizes */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-display text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5 text-[hsl(var(--arena-green))]" />
            VERÐLAUN
          </h3>
        </div>

        <div className="space-y-3">
          {/* 1st place - highlight */}
          <Card className="bg-card border-[hsl(var(--arena-green)/0.5)] relative overflow-hidden group hover:border-[hsl(var(--arena-green)/0.8)] transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--arena-green)/0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--arena-green)/0.08)] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--arena-green)/0.6)] via-[hsl(var(--arena-green))] to-[hsl(var(--arena-green)/0.6)]" />
            <CardContent className="p-4 md:p-5 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.15)] flex items-center justify-center border border-[hsl(var(--arena-green)/0.3)]">
                  <Trophy className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                </div>
                <h4 className="font-display text-lg font-bold text-[hsl(var(--arena-green))]">1. SÆTI</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--arena-green))] mt-0.5">•</span>
                  <div>
                    <p className="font-medium">5 klst. spilatími á mann í Arena</p>
                    <p className="text-xs text-muted-foreground">10 klst. samtals fyrir liðið</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--arena-green))] mt-0.5">•</span>
                  <div>
                    <p className="font-medium">2x HyperX heyrnartól frá Senu</p>
                    <p className="text-xs text-muted-foreground">1 stk á hvorn liðsfélaga</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 2nd & 3rd in a row on mobile too */}
          <div className="grid grid-cols-2 gap-3">
            {/* 2nd place */}
            <Card className="bg-card border-border group hover:border-[hsl(var(--arena-green)/0.4)] transition-all duration-300">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-display text-base font-bold">2. SÆTI</h4>
                </div>
                <p className="text-sm font-medium">3 klst. spilatími á mann í Arena</p>
                <p className="text-xs text-muted-foreground">6 klst. samtals fyrir liðið</p>
              </CardContent>
            </Card>

            {/* 3rd place */}
            <Card className="bg-card border-border group hover:border-[hsl(var(--arena-green)/0.4)] transition-all duration-300">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-display text-base font-bold">3. SÆTI</h4>
                </div>
                <p className="text-sm font-medium">2 klst. spilatími á mann í Arena</p>
                <p className="text-xs text-muted-foreground">4 klst. samtals fyrir liðið</p>
              </CardContent>
            </Card>
          </div>

          {/* Raffle */}
          <Card className="bg-card border-[hsl(var(--planet-tournament)/0.3)] relative overflow-hidden group hover:border-[hsl(var(--planet-tournament)/0.5)] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--planet-tournament)/0.05)] to-transparent pointer-events-none" />
            <CardContent className="p-4 md:p-5 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--planet-tournament)/0.12)] flex items-center justify-center">
                  <PartyPopper className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
                </div>
                <h4 className="font-display text-base font-bold">HAPPDRÆTTI</h4>
              </div>
              <ul className="space-y-2 text-sm mb-2">
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--planet-tournament))] mt-0.5">•</span>
                  <div>
                    <p className="font-medium">2x Revolution Pro pinnar frá Senu</p>
                    <p className="text-xs text-muted-foreground">Dregið af handahófi meðal allra skráðra keppenda</p>
                  </div>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground italic">Vinningshafar verða dregnir í lok móts.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pricing */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
              <Ticket className="h-4 w-4 text-[hsl(var(--arena-green))]" />
            </div>
            <CardTitle className="text-lg">Verð</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Keppnisgjald</p>
              <p className="text-sm text-muted-foreground">á keppanda</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[hsl(var(--arena-green))]">
                {TOURNAMENT_CONFIG.entryFeePerPlayer.toLocaleString('is-IS')} kr
              </p>
              <p className="text-xs text-muted-foreground">
                {TOURNAMENT_CONFIG.entryFeePerTeam.toLocaleString('is-IS')} kr/lið
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Pizza className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">Pizza pakki</p>
                <p className="text-xs text-muted-foreground">Valfrjálst – veldu í skráningu</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">+{TOURNAMENT_CONFIG.pizzaUpsell.toLocaleString('is-IS')} kr</p>
              <p className="text-xs text-muted-foreground">+{(TOURNAMENT_CONFIG.pizzaUpsell * 2).toLocaleString('is-IS')} kr/lið</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <div id="dagskra-arena" className="scroll-mt-24">
        <Accordion type="single" collapsible value={scheduleOpen} onValueChange={setScheduleOpen}>
          <AccordionItem value="dagskra" className="bg-card border border-border rounded-xl overflow-hidden">
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="font-display font-semibold text-left">Dagskrá mótsins</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="space-y-2">
                {[
                  { time: "11:00", title: "Leikur 1", icon: Timer, color: "arena-green" },
                  { time: "11:30", title: "Leikur 2", icon: Timer, color: "arena-green" },
                  { time: "12:00", title: "Leikur 3", icon: Timer, color: "arena-green" },
                  { time: "12:30", title: "Pása (pizza / hvíld)", icon: Pause, color: "accent" },
                  { time: "13:00", title: "Leikur 4", icon: Timer, color: "arena-green" },
                  { time: "13:30", title: "Leikur 5", icon: Timer, color: "arena-green" },
                  { time: "14:00", title: "Verðlaun & raffle", icon: PartyPopper, color: "primary" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-mono min-w-[60px] justify-center ${
                        item.color === 'accent' ? 'bg-accent/10 text-accent border-accent/30' :
                        item.color === 'primary' ? 'bg-primary/10 text-primary border-primary/30' :
                        'bg-[hsl(var(--arena-green)/0.1)] text-[hsl(var(--arena-green))] border-[hsl(var(--arena-green)/0.3)]'
                      }`}
                    >
                      {item.time}
                    </Badge>
                    <span className="text-sm">{item.title}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Registration + Payment form */}
      <div id="skraning-arena" className="scroll-mt-24">
        <LanPaymentForm />
      </div>

      {/* Rules */}
      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem value="reglur" className="bg-card border border-border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <span className="font-display font-semibold text-left">Reglur & upplýsingar</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-6">
              {[
                { title: "Check-in & mæting", icon: Clock, items: ["Mæting: 20–30 mínútum fyrir fyrsta leik", "Check-in fer fram við innritunarborð í Arena", "Order ID eða liðsheiti notað við innskráningu"] },
                { title: "Búnaður & aðgangar", icon: Gamepad2, items: ["Tölvur og skjáir á staðnum", "Epic Games account þarf að vera virkt", "Óheimilt er að nota svindl eða óviðeigandi hugbúnað"] },
                { title: "Leikjafyrirkomulag", icon: Timer, items: ["Leikir fara fram á 30 mínútna fresti", "30 mínútna pása í miðju móti", "Sama lobby allan tímann"] },
                { title: "Dómarar & ákvarðanir", icon: ShieldCheck, items: ["Dómarar taka allar lokaákvarðanir", "Brottvísun ef reglum er ekki fylgt", "Áhersla á sanngirni og jákvæðan leikandaanda"] },
                { title: "Myndir, video & áhorf", icon: Eye, items: ["Myndir og video teknar á staðnum", "Keppnir sýndar á skjám í Arena", "Vinir og foreldrar velkomnir sem áhorfendur", "Engin birting viðkvæmra upplýsinga án samþykkis"] },
                { title: "Fyrir foreldra", icon: Heart, items: ["Öruggt og skipulagt umhverfi", "Starfsfólk til staðar allan tímann", "Skýr dagskrá og reglur"] },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <section.icon className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                    {section.title}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5 pl-6">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[hsl(var(--arena-green))]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {/* Discord */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                  Aðstoð & spurningar
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1.5 pl-6 mb-3">
                  <li className="flex items-start gap-2"><span className="text-[hsl(var(--arena-green))]">•</span>Discord er aðal samskiptaleið mótsins</li>
                  <li className="flex items-start gap-2"><span className="text-[hsl(var(--arena-green))]">•</span>Notað fyrir tilkynningar og aðstoð</li>
                </ul>
                <DiscordSupportActions />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Event Disclaimer */}
      <div className="mt-8">
        <div className="h-px w-full bg-border mb-6" />
        <div className="rounded-xl bg-muted/40 border border-border px-5 py-6 space-y-4">
          <h3 className="font-display text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Event Disclaimer
          </h3>
          <div className="space-y-3 text-[11px] leading-relaxed text-muted-foreground/70">
            <p>
              THIS EVENT IS IN NO WAY SPONSORED, ENDORSED, OR ADMINISTERED BY, OR OTHERWISE ASSOCIATED WITH, EPIC GAMES, INC. THE INFORMATION PLAYERS PROVIDE IN CONNECTION WITH THIS EVENT IS BEING PROVIDED TO EVENT ORGANIZER AND NOT TO EPIC GAMES, INC.
            </p>
            <p>
              BY PARTICIPATING IN THIS EVENT, TO THE EXTENT PERMITTED BY APPLICABLE LAW, PLAYERS AGREE TO RELEASE AND HOLD HARMLESS EPIC GAMES, INC., ITS LICENSORS, ITS AND THEIR AFFILIATES, AND ITS AND THEIR EMPLOYEES, OFFICERS, DIRECTORS, AGENTS, CONTRACTORS, AND OTHER REPRESENTATIVES FROM ALL CLAIMS, DEMANDS, ACTIONS, LOSSES, LIABILITIES, AND EXPENSES RELATED TO THE EVENT.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
