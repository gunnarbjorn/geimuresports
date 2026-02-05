import { useState, useEffect, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ElkoRegistrationForm } from "@/components/forms/ElkoRegistrationForm";
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
} from "lucide-react";

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";

// Tournament config - update these values
const TOURNAMENT_CONFIG = {
  name: "Fortnite Duos LAN",
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

  const handleCopy = async (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(DISCORD_INVITE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: do nothing
    }
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

const Mot = () => {
  const location = useLocation();
  const [registeredTeams, setRegisteredTeams] = useState<RegisteredTeam[]>([]);
  const [isTeamsListOpen, setIsTeamsListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState<string | undefined>(undefined);

  const registeredTeamsCount = registeredTeams.length;
  const remainingSpots = TOURNAMENT_CONFIG.maxTeams - registeredTeamsCount;
  const progressPercentage = (registeredTeamsCount / TOURNAMENT_CONFIG.maxTeams) * 100;

  // Fetch registered teams from database
  useEffect(() => {
    const fetchRegisteredTeams = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('id, data')
          .eq('type', 'elko-tournament')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching registrations:', error);
          return;
        }

        if (data) {
          const teams: RegisteredTeam[] = data.map((reg) => {
            const regData = reg.data as { 
              teamName?: string; 
              player1Name?: string; 
              player2Name?: string;
              // Support legacy format
              fullName?: string; 
              teammateName?: string;
            };
            return {
              id: reg.id,
              teamName: regData.teamName || 'Óþekkt lið',
              player1Name: regData.player1Name || regData.fullName || 'Óþekkt',
              player2Name: regData.player2Name || regData.teammateName || 'Óþekkt',
            };
          });
          setRegisteredTeams(teams);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredTeams();
  }, []);

  useEffect(() => {
    if (location.hash) {
      // Auto-open teams list if navigating to #skrad-lid
      if (location.hash === '#skrad-lid') {
        setIsTeamsListOpen(true);
      }
      
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          const navbarHeight = 80;
          const additionalOffset = 24;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navbarHeight - additionalOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToRegistration = () => {
    const element = document.getElementById('skraning');
    if (element) {
      const navbarHeight = 80;
      const additionalOffset = 24;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight - additionalOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToSchedule = () => {
    // Open the accordion first
    setScheduleOpen("dagskra");
    
    // Then scroll after a brief delay to allow accordion to open
    setTimeout(() => {
      const element = document.getElementById('dagskra');
      if (element) {
        const navbarHeight = 80;
        const additionalOffset = 24;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight - additionalOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <Layout>
      {/* 1. HERO – Minimal, Mobile-First */}
      <section id="top" className="pt-24 pb-6 md:pt-28 md:pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
            {/* Location badge */}
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card border-[hsl(var(--arena-green)/0.5)]">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--arena-green))]" />
                {TOURNAMENT_CONFIG.location}
              </Badge>
            </div>
            
            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-3">
              {TOURNAMENT_CONFIG.name}
            </h1>
            
            {/* Subtitle with game + format */}
            <p className="text-center text-muted-foreground mb-6">
              {TOURNAMENT_CONFIG.game} · {TOURNAMENT_CONFIG.format} ({TOURNAMENT_CONFIG.formatLabel})
            </p>
            
            {/* Date & Time badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                {TOURNAMENT_CONFIG.date}
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                {TOURNAMENT_CONFIG.time}
              </Badge>
            </div>
            
            {/* Primary CTA + Secondary action */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg" 
                className="btn-arena-gradient text-base"
                onClick={scrollToRegistration}
              >
                Skrá mitt lið
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={scrollToSchedule}
              >
                Sjá dagskrá
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* 2. REGISTRATION STATUS – Capacity Card with Teams List */}
      <section className="py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
            <Card id="skrad-lid" className="bg-card border-[hsl(var(--arena-green)/0.3)] glow-green-sm scroll-mt-28">
              <Collapsible open={isTeamsListOpen} onOpenChange={setIsTeamsListOpen}>
                <CollapsibleTrigger asChild>
                  <CardContent className="p-5 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                        <span className="font-semibold">Skráning opin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {remainingSpots} laus pláss
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
                      <span className="text-[hsl(var(--arena-green))] font-bold">
                        {registeredTeamsCount} / {TOURNAMENT_CONFIG.maxTeams} lið skráð
                      </span>
                      <span className="text-muted-foreground text-xs">
                        Smelltu til að sjá skráð lið
                      </span>
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
                            <div 
                              key={team.id} 
                              className="flex items-center gap-3 py-2 px-3 bg-muted/30 rounded-lg"
                            >
                              <span className="text-xs font-mono text-muted-foreground w-6">
                                #{index + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {team.teamName}
                                </p>
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
          </div>
        </div>
      </section>

      {/* 3. PRICING CARD */}
      <section className="py-4 md:py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
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
                {/* Entry fee */}
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
                
                {/* Pizza option */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Pizza className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium">Pizza pakki</p>
                      <p className="text-xs text-muted-foreground">Valfrjálst – veldu í skráningu</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      +{TOURNAMENT_CONFIG.pizzaUpsell.toLocaleString('is-IS')} kr
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +{(TOURNAMENT_CONFIG.pizzaUpsell * 2).toLocaleString('is-IS')} kr/lið
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. SCHEDULE – Collapsible */}
      <section id="dagskra" className="py-4 md:py-6 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
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
        </div>
      </section>

      {/* 5. REGISTRATION FORM */}
      <section id="skraning" className="py-8 md:py-10 bg-card/30 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
            <Card className="glass-card border-[hsl(var(--arena-green)/0.3)] overflow-hidden glow-green-sm">
              <CardHeader className="bg-gradient-to-r from-[hsl(var(--arena-green)/0.1)] to-transparent border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">
                      Skráning liðs
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Skráning er fyrir lið (2 keppendur)
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 md:p-6">
                <ElkoRegistrationForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. CONTEXT ACCORDIONS – For Competitors & Parents */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {/* For Competitors */}
              <AccordionItem value="keppendur" className="bg-card border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center shrink-0">
                      <Gamepad2 className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                    </div>
                    <span className="font-display font-semibold text-left">Fyrir keppendur</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-[hsl(var(--arena-green))]">•</span>
                      5 leikir í custom lobby
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[hsl(var(--arena-green))]">•</span>
                      Build mode
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[hsl(var(--arena-green))]">•</span>
                      Sama lobby allan tímann
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[hsl(var(--arena-green))]">•</span>
                      LAN upplifun á staðnum
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* For Parents */}
              <AccordionItem value="foreldrar" className="bg-card border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-display font-semibold text-left">Fyrir foreldra</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[hsl(var(--arena-green))] shrink-0" />
                      Öruggt og skipulagt umhverfi
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[hsl(var(--arena-green))] shrink-0" />
                      Starfsfólk á staðnum
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[hsl(var(--arena-green))] shrink-0" />
                      Foreldrar velkomnir sem áhorfendur
                    </li>
                    <li className="flex items-center gap-2">
                      <Pizza className="h-4 w-4 text-accent shrink-0" />
                      Pizza í boði (valfrjálst)
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Rules */}
              <AccordionItem value="reglur" className="bg-card border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-display font-semibold text-left">Reglur & upplýsingar</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <div className="space-y-4">
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Allur aldur er leyfður
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Foreldrar velkomnir sem áhorfendur
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Brot á reglum getur leitt til banns
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Starfsfólk á staðnum allan tímann
                      </li>
                    </ul>
                    
                    <DiscordSupportActions />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Í samstarfi við Rafíþróttasamband Íslands
              </p>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Mot;
