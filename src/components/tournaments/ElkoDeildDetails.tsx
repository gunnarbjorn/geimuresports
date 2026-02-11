import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar,
  Users,
  Trophy,
  ChevronDown,
  ChevronUp,
  Globe,
  Swords,
  MessageCircle,
  Clock,
  Ticket,
  ShieldCheck,
  Gamepad2,
  ExternalLink,
  Copy,
  Medal,
  Mail,
  Tv,
  Dumbbell,
  Map,
  Radio,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileText,
  Send,
} from "lucide-react";

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";

const PRIZE_TIERS = [
  { place: "1. sæti", amount: "40.000 kr.", highlight: true },
  { place: "2. sæti", amount: "22.000 kr.", highlight: false },
  { place: "3. sæti", amount: "16.000 kr.", highlight: false },
  { place: "4. sæti", amount: "12.000 kr.", highlight: false },
  { place: "5. sæti", amount: "10.000 kr.", highlight: false },
];

const REGISTRATION_STEPS = [
  {
    step: 1,
    title: "Discord aðgangur",
    description: "Vertu með Discord aðgang og skráður á Fortnite Ísland",
    icon: MessageCircle,
    cta: { label: "Opna Discord", url: "https://discord.gg/57P9SAy4Fq" },
  },
  {
    step: 2,
    title: "Greiða þátttökugjald",
    description: "2.000 kr. á einstakling",
    icon: CreditCard,
    cta: { label: "Greiða", url: "https://linkar.rafithrottir.is/greida-elko-deildina" },
  },
  {
    step: 3,
    title: "Fylla út skráningarform",
    description: "Fullt nafn, email, símanúmer, kennitala, Fortnite nafn, liðsfélagi, Discord User ID, Epic ID og Order ID",
    icon: FileText,
    cta: null,
  },
  {
    step: 4,
    title: "Staðfestingarpóstur",
    description: "Sjálfvirkt email sent með nánari leiðbeiningum um þátttöku",
    icon: Send,
    cta: null,
  },
];

interface RegisteredTeam {
  id: string;
  teamName: string;
  player1Name: string;
  player2Name: string;
}

/* ── Discord support block ── */
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
          Þeir sem eru með kveikt á adblock geta fengið villu: afritaðu hlekkinn og opnaðu í nýjum vafra.
        </p>
      </div>
      <p className="text-xs text-muted-foreground break-all">
        Beinn hlekkur: <span className="text-foreground">{DISCORD_INVITE_URL}</span>
      </p>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════ */
export function ElkoDeildDetails() {
  const [registeredTeams, setRegisteredTeams] = useState<RegisteredTeam[]>([]);
  const [isTeamsListOpen, setIsTeamsListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const maxTeams = 32;
  const registeredTeamsCount = registeredTeams.length;
  const remainingSpots = maxTeams - registeredTeamsCount;
  const progressPercentage = (registeredTeamsCount / maxTeams) * 100;

  useEffect(() => {
    const fetchRegisteredTeams = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_public_registrations");
        if (error) { console.error("Error:", error); return; }
        if (data) {
          const teams: RegisteredTeam[] = (data as any[])
            .filter((r: any) => r.type === "elko-tournament")
            .map((r: any) => ({
              id: r.id,
              teamName: r.team_name || r.full_name || "Óþekkt lið",
              player1Name: r.player1_name || r.full_name || "Óþekkt",
              player2Name: r.player2_name || r.teammate_name || "Óþekkt",
            }));
          setRegisteredTeams(teams);
        }
      } catch (err) { console.error("Error:", err); }
      finally { setIsLoading(false); }
    };
    fetchRegisteredTeams();
  }, []);

  const scrollTo = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = el.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }, 50);
  };

  const accent = "planet-tournament";
  const accentHsl = `hsl(var(--${accent}))`;
  const accentDeepHsl = `hsl(var(--${accent}-deep))`;

  return (
    <div className="space-y-8">

      {/* ═══ SECTION 1 – HERO ═══ */}
      <section className="text-center">
        <div className="flex justify-center mb-4">
          <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card border-[hsl(var(--planet-tournament)/0.5)]">
            <Globe className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--planet-tournament))]" />
            Online
          </Badge>
        </div>

        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Elko Deildin – Duos – Vor 2026
        </h2>
        <p className="text-muted-foreground mb-4">
          Opinber Fortnite deild á Íslandi – Keppt í neti, sýnt í sjónvarpi
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {["Duos", "Online", "Build", "Vor 2026"].map((tag) => (
            <Badge key={tag} variant="secondary" className="text-sm px-3 py-1.5">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="bg-[hsl(var(--planet-tournament))] hover:bg-[hsl(var(--planet-tournament-deep))] text-primary-foreground font-bold"
            asChild
          >
            <a href="https://linkar.rafithrottir.is/greida-elko-deildina" target="_blank" rel="noopener noreferrer">
              Skrá lið <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-[hsl(var(--planet-tournament)/0.4)] text-foreground hover:bg-[hsl(var(--planet-tournament)/0.1)]"
            onClick={() => scrollTo("um-motid")}
          >
            Kynna sér mótið <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ═══ SECTION 2 – UM MÓTIÐ ═══ */}
      <section id="um-motid" className="scroll-mt-28">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center">
                <Trophy className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
              </div>
              <CardTitle className="text-lg">Um mótið</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Keppnistímabilið 25/26 í Elko Deildinni heldur áfram með alvöru Duos mót sem hefst í lok febrúar.
              Mótið er spilað í gegnum netið og er öllum keppendum skylt að vera á Discord rás Fortnite Ísland
              á meðan keppni stendur yfir.
            </p>
            <div className="flex flex-col gap-2 pl-1">
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[hsl(var(--planet-tournament))] shrink-0" />
                Samskipti við mótastjórn á Discord
              </span>
              <span className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-[hsl(var(--planet-tournament))] shrink-0" />
                Upplýsingar sendar í rauntíma
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══ REGISTRATION STATUS ═══ */}
      <section>
        <Card className="bg-card border-[hsl(var(--planet-tournament)/0.3)]">
          <Collapsible open={isTeamsListOpen} onOpenChange={setIsTeamsListOpen}>
            <CollapsibleTrigger asChild>
              <CardContent className="p-5 cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[hsl(var(--planet-tournament))]" />
                    <span className="font-semibold">Skráning opin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {remainingSpots > 0 ? `${remainingSpots} laus pláss` : "Fullt"}
                    </span>
                    {isTeamsListOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <Progress value={progressPercentage} className="h-3 mb-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-[hsl(var(--planet-tournament))] font-bold">
                    {registeredTeamsCount} / {maxTeams} lið skráð
                  </span>
                  <span className="text-muted-foreground text-xs">Smelltu til að sjá skráð lið</span>
                </div>
              </CardContent>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-5 pb-5 border-t border-border">
                <div className="pt-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
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
                            <p className="text-xs text-muted-foreground truncate">
                              {team.player1Name} & {team.player2Name}
                            </p>
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
      </section>

      {/* ═══ SECTION 3 – DAGSKRÁ (Timeline) ═══ */}
      <section id="dagskra-elko" className="scroll-mt-28">
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center">
                <Clock className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
              </div>
              <CardTitle className="text-lg">Dagskrá</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Undankeppni */}
            <div className="relative pl-6 border-l-2 border-[hsl(var(--planet-tournament)/0.3)]">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[hsl(var(--planet-tournament))]" />
              <Badge className="mb-2 bg-[hsl(var(--planet-tournament)/0.15)] text-[hsl(var(--planet-tournament))] border-[hsl(var(--planet-tournament)/0.3)]">
                <Calendar className="h-3 w-3 mr-1.5" />
                25. / 26. Febrúar
              </Badge>
              <h4 className="font-display font-semibold mb-1">Undankeppni</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--planet-tournament))]">•</span>
                  Lið keppa upp á seed fyrir úrslitakvöld
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--planet-tournament))]">•</span>
                  Því ofar sem lið endar, því fleiri byrjunarstig í úrslitum
                </li>
              </ul>
            </div>

            {/* Úrslit */}
            <div className="relative pl-6 border-l-2 border-[hsl(var(--planet-tournament)/0.3)]">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[hsl(var(--planet-tournament))]" />
              <Badge className="mb-2 bg-[hsl(var(--planet-tournament)/0.15)] text-[hsl(var(--planet-tournament))] border-[hsl(var(--planet-tournament)/0.3)]">
                <Calendar className="h-3 w-3 mr-1.5" />
                4. Mars
              </Badge>
              <h4 className="font-display font-semibold mb-1">Úrslitakeppni</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--planet-tournament))]">•</span>
                  Stig safnast með eliminations og placement
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--planet-tournament))]">•</span>
                  Hæsta heildarstig vinnur mótið
                </li>
              </ul>
            </div>

            {/* Time & Broadcast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Clock className="h-5 w-5 text-[hsl(var(--planet-tournament))] shrink-0" />
                <div>
                  <p className="text-sm font-medium">Keppnistími</p>
                  <p className="text-xs text-muted-foreground">18:30 – 21:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Tv className="h-5 w-5 text-[hsl(var(--planet-tournament))] shrink-0" />
                <div>
                  <p className="text-sm font-medium">Útsending</p>
                  <p className="text-xs text-muted-foreground">Sjónvarp Símans & RÍSÍ</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══ SECTION 4 – FORMAT & REGLUR ═══ */}
      <section>
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
              </div>
              <CardTitle className="text-lg">Format & reglur</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              {
                title: "Format",
                icon: Swords,
                items: ["Duos Build", "Online play"],
              },
              {
                title: "Aldur",
                icon: Gamepad2,
                items: [
                  "Allir spilarar 13 ára og eldri",
                  "Undir 13 ára aðeins með leyfi foreldra",
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <section.icon className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
                  {section.title}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1.5 pl-6">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[hsl(var(--planet-tournament))]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Warning */}
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <h4 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Aðvörun
              </h4>
              <p className="text-sm text-muted-foreground mb-2">Brot á reglum getur leitt til:</p>
              <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Brottreksturs úr deild
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Banns á Fortnite Íslandi og framtíðarmótum
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══ SECTION 5 – VERÐLAUNAFÉ ═══ */}
      <section>
        <Card className="bg-card border-[hsl(var(--planet-tournament)/0.3)] overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-[hsl(var(--planet-tournament)/0.08)] to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center">
                <Medal className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
              </div>
              <div>
                <CardTitle className="text-lg">Verðlaunafé</CardTitle>
                <p className="text-sm text-muted-foreground">Heildarverðlaunafé: 100.000 kr.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {PRIZE_TIERS.map((tier) => (
                <div
                  key={tier.place}
                  className={`flex items-center justify-between px-5 py-4 ${
                    tier.highlight ? "bg-[hsl(var(--planet-tournament)/0.06)]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Trophy
                      className={`h-5 w-5 ${
                        tier.highlight
                          ? "text-[hsl(var(--planet-tournament))]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className={`font-medium ${tier.highlight ? "text-foreground" : "text-muted-foreground"}`}>
                      {tier.place}
                    </span>
                  </div>
                  <span
                    className={`font-bold text-lg ${
                      tier.highlight
                        ? "text-[hsl(var(--planet-tournament))]"
                        : "text-foreground"
                    }`}
                  >
                    {tier.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══ SECTION 6 – SKRÁNING (Step funnel) ═══ */}
      <section id="skraning-elko" className="scroll-mt-28">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center">
                <Ticket className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
              </div>
              <div>
                <CardTitle className="text-lg">Skráning – skref fyrir skref</CardTitle>
                <p className="text-sm text-muted-foreground">2.000 kr. á einstakling</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {REGISTRATION_STEPS.map((s) => (
              <div
                key={s.step}
                className="flex gap-4 p-4 rounded-xl bg-muted/20 border border-border"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--planet-tournament)/0.15)] flex items-center justify-center">
                  <span className="font-display font-bold text-[hsl(var(--planet-tournament))]">
                    {s.step}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                    <s.icon className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
                    {s.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                  {s.cta && (
                    <Button
                      size="sm"
                      className="mt-3 bg-[hsl(var(--planet-tournament))] hover:bg-[hsl(var(--planet-tournament-deep))] text-primary-foreground"
                      asChild
                    >
                      <a href={s.cta.url} target="_blank" rel="noopener noreferrer">
                        {s.cta.label} <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
                {s.step === 4 && (
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--planet-tournament))] shrink-0 mt-1" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ═══ SECTION 7 – SAMBAND ═══ */}
      <section>
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center">
                <Mail className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
              </div>
              <CardTitle className="text-lg">Samband</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <Mail className="h-5 w-5 text-[hsl(var(--planet-tournament))] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Skráning & greiðslur</p>
                <a
                  href="mailto:bjarkimar@rafithrottir.is"
                  className="text-sm text-[hsl(var(--planet-tournament))] hover:underline"
                >
                  bjarkimar@rafithrottir.is
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <MessageCircle className="h-5 w-5 text-[hsl(var(--planet-tournament))] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Önnur mál</p>
                <p className="text-sm text-muted-foreground">Mótastjórn Fortnite á Íslandi – Discord</p>
              </div>
            </div>
            <DiscordSupportActions />
          </CardContent>
        </Card>
      </section>

      {/* ═══ SECTION 8 – TENGINGAR INNAN GEIMUR ═══ */}
      <section className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium text-center">
          Skoðaðu meira
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Æfingar & þjálfun",
              href: "/aefingar",
              icon: Dumbbell,
              colorVar: "--planet-training",
            },
            {
              label: "Fortnite Maps & tips",
              href: "/fortnite",
              icon: Map,
              colorVar: "--planet-knowledge",
            },
            {
              label: "Samfélag & streymi",
              href: "/fortnite/community",
              icon: Radio,
              colorVar: "--planet-community",
            },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-[hsl(var(${link.colorVar})/0.4)] transition-all hover:bg-muted/30 group"
            >
              <link.icon className={`h-5 w-5 text-[hsl(var(${link.colorVar}))] shrink-0`} />
              <span className="text-sm font-medium">{link.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
