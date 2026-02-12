import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ElkoRegistrationForm } from "@/components/forms/ElkoRegistrationForm";
import { CompetitorChecklist } from "@/components/tournaments/CompetitorChecklist";
import { GameDayGuide, CommonMistakes, DiscordRulesCard } from "@/components/tournaments/GameDayGuide";
import elkoCampaignBg from "@/assets/elko-campaign-bg.jpeg";
import elkoCampaignBgMobile from "@/assets/elko-campaign-bg-mobile.png";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import {
  Calendar,
  Users,
  Trophy,
  ChevronDown,
  ChevronUp,
  Globe,
  MessageCircle,
  Clock,
  Ticket,
  ShieldCheck,
  Gamepad2,
  Copy,
  Medal,
  Tv,
  Swords,
} from "lucide-react";

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";

const TOURNAMENT_CONFIG = {
  name: "Elko Deildin – Duos – Vor 2026",
  game: "Fortnite",
  format: "Duo",
  formatLabel: "2 manna lið",
  location: "Online",
  dates: "25. feb – 4. mars",
  time: "18:30 – 21:00",
  entryFeePerPlayer: 2000,
  entryFeePerTeam: 4000,
  maxTeams: 50,
  prizePool: "100.000 kr.",
};

const PRIZE_TIERS = [
  { place: "1. sæti", amount: "40.000 kr.", highlight: true },
  { place: "2. sæti", amount: "22.000 kr.", highlight: false },
  { place: "3. sæti", amount: "16.000 kr.", highlight: false },
  { place: "4. sæti", amount: "12.000 kr.", highlight: false },
  { place: "5. sæti", amount: "10.000 kr.", highlight: false },
];

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
          Þeir sem eru með kveikt á adblock geta fengið villu: afritaðu hlekkinn og opnaðu í nýjum vafra.
        </p>
      </div>
      <p className="text-xs text-muted-foreground break-all">
        Beinn hlekkur: <span className="text-foreground">{DISCORD_INVITE_URL}</span>
      </p>
    </div>
  );
};

export function ElkoDeildDetails({ onBack }: { onBack?: () => void }) {
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

  const scrollToRegistration = () => {
    const element = document.getElementById("skraning-elko");
    if (element) {
      const offset = element.getBoundingClientRect().top + window.scrollY - 104;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  const scrollToSchedule = () => {
    setScheduleOpen("dagskra");
    setTimeout(() => {
      const element = document.getElementById("dagskra-elko");
      if (element) {
        const offset = element.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }, 100);
  };

  const accent = "arena-green";

  return (
    <div className="relative">
      {/* Full-page campaign background */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-screen h-screen z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-80 bg-cover bg-center bg-no-repeat hidden md:block"
          style={{ backgroundImage: `url(${elkoCampaignBg})` }}
        />
        <div 
          className="absolute inset-0 opacity-80 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: `url(${elkoCampaignBgMobile})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      <div className="relative z-10 space-y-6">
      {/* Hero */}
      <div className="text-center py-8 px-4">
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
          <Badge variant="outline" className={`text-xs px-3 py-1.5 bg-card border-[hsl(var(--${accent})/0.5)]`}>
            <Globe className={`h-3.5 w-3.5 mr-1.5 text-[hsl(var(--${accent}))]`} />
            {TOURNAMENT_CONFIG.location}
          </Badge>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{TOURNAMENT_CONFIG.name}</h2>
        <p className="text-muted-foreground mb-4">
          {TOURNAMENT_CONFIG.game} · {TOURNAMENT_CONFIG.format} ({TOURNAMENT_CONFIG.formatLabel})
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Calendar className={`h-4 w-4 mr-2 text-[hsl(var(--${accent}))]`} />
            {TOURNAMENT_CONFIG.dates}
          </Badge>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Clock className={`h-4 w-4 mr-2 text-[hsl(var(--${accent}))]`} />
            {TOURNAMENT_CONFIG.time}
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="btn-arena-gradient text-base"
            onClick={scrollToRegistration}
          >
            Skrá mitt lið <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" className="btn-primary-gradient" onClick={scrollToSchedule}>
            Sjá dagskrá
          </Button>
        </div>
      </div>

      {/* Registration status */}
      <Card className={`bg-card border-[hsl(var(--${accent})/0.3)]`}>
        <Collapsible open={isTeamsListOpen} onOpenChange={setIsTeamsListOpen}>
          <CollapsibleTrigger asChild>
            <CardContent className="p-5 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className={`h-5 w-5 text-[hsl(var(--${accent}))]`} />
                  <span className="font-semibold">Skráning opin</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{remainingSpots} laus pláss</span>
                  {isTeamsListOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-3" />
              <div className="flex justify-between text-sm">
                <span className={`text-[hsl(var(--${accent}))] font-bold`}>
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
                  <Users className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
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

      {/* Competitor Checklist */}
      <CompetitorChecklist />

      {/* Pricing / Prizes – collapsible accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="verd" className="bg-card border border-border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-[hsl(var(--${accent})/0.1)] flex items-center justify-center shrink-0`}>
                <Ticket className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
              </div>
              <span className="font-display font-semibold text-left">Verð & verðlaun</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Þátttökugjald</p>
                  <p className="text-sm text-muted-foreground">á einstakling</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold text-[hsl(var(--${accent}))]`}>
                    {TOURNAMENT_CONFIG.entryFeePerPlayer.toLocaleString("is-IS")} kr
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {TOURNAMENT_CONFIG.entryFeePerTeam.toLocaleString("is-IS")} kr/lið
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <Medal className={`h-5 w-5 text-[hsl(var(--${accent}))]`} />
                  <p className="font-medium text-sm">Heildarverðlaunafé: {TOURNAMENT_CONFIG.prizePool}</p>
                </div>
                <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                  {PRIZE_TIERS.map((tier) => (
                    <div
                      key={tier.place}
                      className={`flex items-center justify-between px-4 py-3 ${
                        tier.highlight ? `bg-[hsl(var(--${accent})/0.06)]` : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Trophy
                          className={`h-4 w-4 ${
                            tier.highlight ? `text-[hsl(var(--${accent}))]` : "text-muted-foreground"
                          }`}
                        />
                        <span className={`text-sm ${tier.highlight ? "font-semibold" : "text-muted-foreground"}`}>
                          {tier.place}
                        </span>
                      </div>
                      <span className={`font-bold ${tier.highlight ? `text-[hsl(var(--${accent}))]` : ""}`}>
                        {tier.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Schedule – collapsible accordion */}
      <div id="dagskra-elko" className="scroll-mt-24">
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
              <div className="space-y-6">
                {/* Undankeppni */}
                <div className={`relative pl-6 border-l-2 border-[hsl(var(--${accent})/0.3)]`}>
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[hsl(var(--${accent}))]`} />
                  <Badge className={`mb-2 bg-[hsl(var(--${accent})/0.15)] text-[hsl(var(--${accent}))] border-[hsl(var(--${accent})/0.3)]`}>
                    <Calendar className="h-3 w-3 mr-1.5" />
                    25. / 26. Febrúar
                  </Badge>
                  <h4 className="font-display font-semibold mb-1">Undankeppni</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <span className={`text-[hsl(var(--${accent}))]`}>•</span>
                      Lið keppa upp á seed fyrir úrslitakvöld
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`text-[hsl(var(--${accent}))]`}>•</span>
                      Því ofar sem lið endar, því fleiri byrjunarstig í úrslitum
                    </li>
                  </ul>
                </div>

                {/* Úrslit */}
                <div className={`relative pl-6 border-l-2 border-[hsl(var(--${accent})/0.3)]`}>
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[hsl(var(--${accent}))]`} />
                  <Badge className={`mb-2 bg-[hsl(var(--${accent})/0.15)] text-[hsl(var(--${accent}))] border-[hsl(var(--${accent})/0.3)]`}>
                    <Calendar className="h-3 w-3 mr-1.5" />
                    4. Mars
                  </Badge>
                  <h4 className="font-display font-semibold mb-1">Úrslitakeppni</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <span className={`text-[hsl(var(--${accent}))]`}>•</span>
                      Stig safnast með eliminations og placement
                    </li>
                    <li className="flex items-start gap-2">
                      <span className={`text-[hsl(var(--${accent}))]`}>•</span>
                      Hæsta heildarstig vinnur mótið
                    </li>
                  </ul>
                </div>

                {/* Time & Broadcast */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Clock className={`h-5 w-5 text-[hsl(var(--${accent}))] shrink-0`} />
                    <div>
                      <p className="text-sm font-medium">Keppnistími</p>
                      <p className="text-xs text-muted-foreground">18:30 – 21:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Tv className={`h-5 w-5 text-[hsl(var(--${accent}))] shrink-0`} />
                    <div>
                      <p className="text-sm font-medium">Útsending</p>
                      <p className="text-xs text-muted-foreground">Sjónvarp Símans & RÍSÍ</p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Game Day Guide */}
      <GameDayGuide />

      {/* Registration form */}
      <div id="skraning-elko" className="scroll-mt-24">
        <Card className={`bg-card border-[hsl(var(--${accent})/0.3)] overflow-hidden`}>
          <CardHeader className={`bg-gradient-to-r from-[hsl(var(--${accent})/0.1)] to-transparent border-b border-border`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-[hsl(var(--${accent})/0.1)] flex items-center justify-center`}>
                <Trophy className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
              </div>
              <div>
                <CardTitle className="font-display text-lg">Skráning liðs</CardTitle>
                <p className="text-sm text-muted-foreground">Skráning er fyrir lið (2 keppendur)</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 md:p-6">
            <ElkoRegistrationForm />
          </CardContent>
        </Card>
      </div>

      {/* Common Mistakes */}
      <CommonMistakes />

      {/* Discord Rules */}
      <DiscordRulesCard />

      {/* Rules – collapsible accordion */}
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
                {
                  title: "Format",
                  icon: Swords,
                  items: ["Duos Build", "Online play – allir keppa heiman"],
                },
                {
                  title: "Aldur",
                  icon: Gamepad2,
                  items: [
                    "Allir spilarar 13 ára og eldri",
                    "Undir 13 ára aðeins með leyfi foreldra",
                  ],
                },
                {
                  title: "Discord & samskipti",
                  icon: MessageCircle,
                  items: [
                    "Allir keppendur verða að vera á Fortnite Ísland Discord",
                    "Samskipti við mótastjórn á Discord á meðan keppni stendur yfir",
                    "Upplýsingar sendar í rauntíma",
                  ],
                },
                {
                  title: "Reglubrot",
                  icon: ShieldCheck,
                  items: [
                    "Brot á reglum getur leitt til brottreksturs úr deild",
                    "Bann á Fortnite Íslandi og framtíðarmótum",
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <section.icon className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
                    {section.title}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5 pl-6">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className={`text-[hsl(var(--${accent}))]`}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <DiscordSupportActions />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </div>
    </div>
  );
}
