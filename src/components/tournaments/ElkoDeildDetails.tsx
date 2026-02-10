import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Swords,
  MessageCircle,
  Clock,
  Ticket,
  Timer,
  ShieldCheck,
  Gamepad2,
  ExternalLink,
  Copy,
} from "lucide-react";
import { tournaments } from "@/data/tournaments";

const elkoTournament = tournaments.find(t => t.id === "elko-deild-vor-2026")!;

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";

const TOURNAMENT_CONFIG = {
  name: elkoTournament.name,
  game: "Fortnite",
  format: elkoTournament.format || "Duos Build",
  formatLabel: "2 manna lið",
  location: elkoTournament.location,
  dates: elkoTournament.dates,
  ageLimit: elkoTournament.ageLimit || "13+",
  entryFee: elkoTournament.entryFee || "2.000 kr",
  maxTeams: 32,
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

export function ElkoDeildDetails() {
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
        const { data, error } = await supabase.rpc('get_public_registrations');
        if (error) { console.error('Error:', error); return; }
        if (data) {
          const teams: RegisteredTeam[] = (data as any[])
            .filter((r: any) => r.type === 'elko-tournament')
            .map((r: any) => ({
              id: r.id,
              teamName: r.team_name || r.full_name || 'Óþekkt lið',
              player1Name: r.player1_name || r.full_name || 'Óþekkt',
              player2Name: r.player2_name || r.teammate_name || 'Óþekkt',
            }));
          setRegisteredTeams(teams);
        }
      } catch (err) { console.error('Error:', err); }
      finally { setIsLoading(false); }
    };
    fetchRegisteredTeams();
  }, []);

  const scrollToSchedule = () => {
    setScheduleOpen("dagskra");
    setTimeout(() => {
      const element = document.getElementById('dagskra-elko');
      if (element) {
        const offset = element.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Hero info */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card border-[hsl(var(--planet-tournament)/0.5)]">
            <Globe className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--planet-tournament))]" />
            {TOURNAMENT_CONFIG.location}
          </Badge>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{TOURNAMENT_CONFIG.name}</h2>
        <p className="text-muted-foreground mb-4">
          {TOURNAMENT_CONFIG.game} · {TOURNAMENT_CONFIG.format} · {TOURNAMENT_CONFIG.ageLimit}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {TOURNAMENT_CONFIG.dates.map((d) => (
            <Badge key={d} variant="secondary" className="text-sm px-3 py-1.5">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--planet-tournament))]" />
              {d}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {elkoTournament.ctaUrl && (
            <Button size="lg" className="bg-[hsl(var(--planet-tournament))] hover:bg-[hsl(var(--planet-tournament-deep))] text-primary-foreground font-bold" asChild>
              <a href={elkoTournament.ctaUrl} target="_blank" rel="noopener noreferrer">
                {elkoTournament.ctaText || "Skrá mig í mót"} <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
          <Button size="lg" className="bg-[hsl(var(--planet-tournament))] hover:bg-[hsl(var(--planet-tournament-deep))] text-primary-foreground" onClick={scrollToSchedule}>
            Sjá dagskrá
          </Button>
        </div>
      </div>

      {/* Registration status */}
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
                  <span className="text-sm text-muted-foreground">{remainingSpots > 0 ? `${remainingSpots} laus pláss` : "Fullt"}</span>
                  {isTeamsListOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-3" />
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(var(--planet-tournament))] font-bold">
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

      {/* Pricing */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center">
              <Ticket className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
            </div>
            <CardTitle className="text-lg">Verð</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Þátttökugjald</p>
              <p className="text-sm text-muted-foreground">á einstakling</p>
            </div>
            <p className="text-xl font-bold text-[hsl(var(--planet-tournament))]">
              {TOURNAMENT_CONFIG.entryFee}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <div id="dagskra-elko" className="scroll-mt-24">
        <Accordion type="single" collapsible value={scheduleOpen} onValueChange={setScheduleOpen}>
          <AccordionItem value="dagskra" className="bg-card border border-border rounded-xl overflow-hidden">
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
                </div>
                <span className="font-display font-semibold text-left">Dagskrá mótsins</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="space-y-2">
                {TOURNAMENT_CONFIG.dates.map((date, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <Badge
                      variant="outline"
                      className="text-xs font-mono min-w-[80px] justify-center bg-[hsl(var(--planet-tournament)/0.1)] text-[hsl(var(--planet-tournament))] border-[hsl(var(--planet-tournament)/0.3)]"
                    >
                      <Timer className="h-3 w-3 mr-1" />
                      Vika {index + 1}
                    </Badge>
                    <span className="text-sm">{date}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Rules */}
      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem value="reglur" className="bg-card border border-border rounded-xl overflow-hidden">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[hsl(var(--planet-tournament))] shrink-0" />
              <span className="font-display font-semibold text-left">Reglur & upplýsingar</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-6">
              {[
                { title: "Fyrirkomulag", icon: Swords, items: ["Keppt í Duos Build", "4 mótakvöld yfir 4 vikur", "Úrslit 4. mars", "Online mót — spilaðu heiman"] },
                { title: "Kröfur", icon: Gamepad2, items: ["13+ ára (yngri með leyfi foreldra)", "Epic Games account", "Discord aðgangur", "Skráður á Fortnite á Íslandi Discord"] },
                { title: "Dómarar & reglur", icon: ShieldCheck, items: ["Dómarar taka lokaákvarðanir", "Brottvísun ef reglum er ekki fylgt", "Jákvæður leikandaandi"] },
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
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
                  Aðstoð & spurningar
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1.5 pl-6 mb-3">
                  <li className="flex items-start gap-2"><span className="text-[hsl(var(--planet-tournament))]">•</span>Discord er aðal samskiptaleið mótsins</li>
                  <li className="flex items-start gap-2"><span className="text-[hsl(var(--planet-tournament))]">•</span>Notað fyrir tilkynningar og aðstoð</li>
                </ul>
                <DiscordSupportActions />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {elkoTournament.note && (
        <p className="text-xs text-muted-foreground text-center">{elkoTournament.note}</p>
      )}
    </div>
  );
}
