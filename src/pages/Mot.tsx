import { useState, useEffect, type MouseEvent } from "react";
import { useLocation, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ElkoRegistrationForm } from "@/components/forms/ElkoRegistrationForm";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  Gamepad2,
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  Copy,
  Clock,
  Ticket,
  Timer,
  Pause,
  Award,
  PartyPopper,
  Eye,
  Heart,
  Pizza,
} from "lucide-react";

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

  useEffect(() => {
    if (location.hash) {
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

  return (
    <Layout>
      {/* 1. HERO SECTION – Minimal, Mobile-First */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Fortnite Duos mót í Arena
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Lau 28. feb
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" />
                11:00–14:00
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--arena-green))]" />
                Arena
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card">
                <Users className="h-3.5 w-3.5 mr-1.5 text-primary" />
                50 lið / 100 keppendur
              </Badge>
            </div>
            
            <Button 
              size="lg" 
              className="btn-arena-gradient text-base w-full sm:w-auto"
              onClick={scrollToRegistration}
            >
              Skrá mig í mót
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="text-xs text-muted-foreground mt-3">
              <span className="text-[hsl(var(--arena-green))] font-semibold">HARD CAP</span> – Hámarksfjöldi 100 keppendur
            </p>
          </div>
        </div>
      </section>

      {/* 2. WHO IS THIS FOR – Accordion */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="keppendur" className="bg-card border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center shrink-0">
                      <Gamepad2 className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                    </div>
                    <span className="font-display font-semibold text-left">Fyrir keppendur</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-[hsl(var(--arena-green))]">•</span>
                      5 leikir
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[hsl(var(--arena-green))]">•</span>
                      Custom games (Build mode)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[hsl(var(--arena-green))]">•</span>
                      Sama lobby allan tímann
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="foreldrar" className="bg-card border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
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
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* 3. PRICE SECTION – Single Card */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card border-[hsl(var(--arena-green)/0.3)]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                    <Ticket className="h-5 w-5 text-[hsl(var(--arena-green))]" />
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
                    <p className="text-xl font-bold text-[hsl(var(--arena-green))]">4.440 kr</p>
                    <p className="text-xs text-muted-foreground">8.880 kr/lið</p>
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
                    <p className="text-lg font-bold">+1.000 kr</p>
                    <p className="text-xs text-muted-foreground">+2.000 kr/lið</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. SCHEDULE – Accordion */}
      <section className="py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="dagskra" className="bg-card border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-display font-semibold text-left">Sjá dagskrá mótsins</span>
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
                          className={`text-xs font-mono ${
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

      {/* 5. Registration Form Section */}
      <section id="skraning" className="py-10 md:py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card border-[hsl(var(--arena-green)/0.3)] overflow-hidden glow-green-sm">
              <CardHeader className="bg-gradient-to-r from-[hsl(var(--arena-green)/0.1)] to-transparent border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                  </div>
                  <CardTitle className="font-display text-lg md:text-xl">
                    Skráning í mót
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 md:p-6">
                <ElkoRegistrationForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Rules & Trust */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="rules" className="bg-card border border-border rounded-xl overflow-hidden">
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

      {/* Sticky bottom CTA on mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:hidden z-40">
        <Button 
          size="lg" 
          className="btn-arena-gradient w-full"
          onClick={scrollToRegistration}
        >
          Skrá mig í mót
        </Button>
      </div>

      {/* Bottom padding for sticky CTA */}
      <div className="h-20 md:hidden" />
    </Layout>
  );
};

export default Mot;
