import { useState, useEffect, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tournaments, Tournament } from "@/data/tournaments";
import { ElkoRegistrationForm } from "@/components/forms/ElkoRegistrationForm";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  Gamepad2,
  Lock,
  Coins,
  Gift,
  Monitor,
  Tv,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";

const DiscordSupportActions = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(DISCORD_INVITE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: do nothing (user can still copy the visible URL)
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
        <ExternalLink className="h-4 w-4" />
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

const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
  const isComingSoon = tournament.isComingSoon;
  
  return (
    <Card className={`bg-card border-border flex flex-col ${isComingSoon ? 'opacity-80' : 'card-hover'}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            {tournament.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-0">
                {tag}
              </Badge>
            ))}
          </div>
          {isComingSoon ? (
            <Lock className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Trophy className="h-5 w-5 text-accent" />
          )}
        </div>
        <CardTitle className="font-display text-xl">{tournament.name}</CardTitle>
        <CardDescription className="text-base">{tournament.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3 mb-6">
          {/* Dates */}
          {tournament.dates.length > 0 && (
            <div className="flex items-start gap-3 text-sm">
              <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <span className="font-medium">Tímabil:</span>
                <p className="text-muted-foreground">{tournament.dates.join(' · ')}</p>
              </div>
            </div>
          )}
          
          {/* Format */}
          {tournament.format && (
            <div className="flex items-center gap-3 text-sm">
              <Gamepad2 className="h-4 w-4 text-primary shrink-0" />
              <span><span className="font-medium">Format:</span> {tournament.format}</span>
            </div>
          )}
          
          {/* Location */}
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span><span className="font-medium">Staðsetning:</span> {tournament.location}</span>
          </div>
          
          {/* Age limit */}
          {tournament.ageLimit && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 text-primary shrink-0" />
              <span><span className="font-medium">Aldur:</span> {tournament.ageLimit}</span>
            </div>
          )}
          
          {/* Entry fee */}
          {tournament.entryFee && (
            <div className="flex items-center gap-3 text-sm">
              <Coins className="h-4 w-4 text-primary shrink-0" />
              <span><span className="font-medium">Þátttökugjald:</span> {tournament.entryFee}</span>
            </div>
          )}
          
          {/* Prize pool */}
          {tournament.prizePool && (
            <div className="flex items-center gap-3 text-sm">
              <Gift className="h-4 w-4 text-primary shrink-0" />
              <span><span className="font-medium">Verðlaunafé:</span> {tournament.prizePool}</span>
            </div>
          )}
          
          {/* Coming soon specific details */}
          {isComingSoon && (
            <>
              <div className="flex items-center gap-3 text-sm">
                <Monitor className="h-4 w-4 text-primary shrink-0" />
                <span>100 manna lobby</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Tv className="h-4 w-4 text-primary shrink-0" />
                <span>Livestream & stemning</span>
              </div>
            </>
          )}
        </div>
        
        {/* CTA Button */}
        {isComingSoon ? (
          <Button 
            className="w-full" 
            variant="outline"
            disabled
          >
            <Lock className="mr-2 h-4 w-4" />
            {tournament.ctaText || "Tilkynnt síðar"}
          </Button>
        ) : (
          <Button 
            className="w-full btn-primary-gradient"
            onClick={() => {
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
            }}
          >
            {tournament.ctaText || "Skrá mig í mót"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        {/* Note */}
        {tournament.note && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {tournament.discordUrl ? (
              <>
                {tournament.note.split('Discord').map((part, i) => 
                  i === 0 ? part : (
                    <span key={i}>
                      <a
                        href={tournament.discordUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer"
                        className="text-primary hover:underline"
                      >
                        Discord
                      </a>
                      {part}
                    </span>
                  )
                )}
              </>
            ) : tournament.note}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const Mot = () => {
  const location = useLocation();

  // Scroll to hash anchor or top when navigating to this page
  useEffect(() => {
    if (location.hash) {
      // Wait for the page to render, then scroll to the anchor
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location]);

  // Filter active and coming soon tournaments
  const activeTournaments = tournaments.filter(t => !t.isComingSoon);
  const comingSoonTournaments = tournaments.filter(t => t.isComingSoon);
  
  // If there's only one active tournament, hide the coming soon section
  const showComingSoon = activeTournaments.length === 0 || comingSoonTournaments.length > 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative hero-section-lg overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Gamepad2 className="h-5 w-5" />
              <span className="font-medium">Fortnite</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Fortnite mót
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Taktu þátt í skipulögðum Fortnite mótum og mæt þig við aðra spilara. 
              Solo, Duo og Squad flokkar í boði.
            </p>
          </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Komandi mót
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Veldu mót og skráðu þig. Við bætum reglulega við nýjum mótum.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {activeTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
            {showComingSoon && comingSoonTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="skraning" className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-xl md:text-2xl">
                      Skráning í mót
                    </CardTitle>
                    <CardDescription>
                      Elko-deildin Vor 2026 – Duos
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <ElkoRegistrationForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rules & Trust Section */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="rules" className="bg-card border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="font-display font-semibold">Reglur & mikilvægar upplýsingar</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary">Aldurstakmörk</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Allir spilarar þurfa að vera 13 ára eða eldri
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Yngri en 13 ára mega keppa með leyfi foreldra
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary">Hegðun & viðurlög</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Brot á reglum getur leitt til banns úr mótum
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Allir keppendur þurfa að vera á Discord á meðan mót stendur
                        </li>
                      </ul>
                    </div>
                    
                    <DiscordSupportActions />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Trust Note */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground text-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Skráning og mót eru í samstarfi við Rafíþróttasamband Íslands</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Mot;
