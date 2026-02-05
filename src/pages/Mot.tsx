import { useState, useEffect, useCallback, type MouseEvent } from "react";
import { useLocation, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Gift,
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  Copy,
  Clock,
  Ticket,
  Target,
  Timer,
  Pause,
  Award,
  PartyPopper,
  Eye,
  Heart,
  Tv,
  Pizza,
  Percent
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
  const [openSection, setOpenSection] = useState<string>("skraning");

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

  const scrollToSection = useCallback((sectionId: string, accordionValue: string) => {
    setOpenSection(accordionValue);
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
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
    }, 350);
  }, []);

  const scheduleItems = [
    { time: "11:00", title: "Leikur 1", duration: "30 mín", isGame: true },
    { time: "11:30", title: "Leikur 2", duration: "30 mín", isGame: true },
    { time: "12:00", title: "Leikur 3", duration: "30 mín", isGame: true },
    { time: "12:30", title: "Pása", duration: "30 mín", isBreak: true, description: "Pizza, hvíld & félagsstemning" },
    { time: "13:00", title: "Leikur 4", duration: "30 mín", isGame: true },
    { time: "13:30", title: "Leikur 5", duration: "30 mín", isGame: true },
    { time: "14:00", title: "Verðlaun & raffle", isAward: true, description: "Verðlaunaafhending og happadrætti" },
  ];

  return (
    <Layout>
      {/* 1. TOP SECTION – Event Overview (NO IMAGE) */}
      <section className="pt-28 md:pt-32 pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-[hsl(var(--arena-green)/0.1)] text-[hsl(var(--arena-green))] border-0 text-sm px-4 py-2">
              <Gamepad2 className="h-4 w-4 mr-2" />
              LAN MÓT
            </Badge>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Fortnite Duos mót í Arena
            </h1>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="outline" className="text-sm px-4 py-2 bg-card">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Laugardagur 28. febrúar
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 bg-card">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                11:00 – 14:00
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 bg-card">
                <Users className="h-4 w-4 mr-2 text-primary" />
                50 lið / 100 keppendur
              </Badge>
            </div>
            
            <Button 
              size="lg" 
              className="btn-arena-gradient text-lg px-8"
              onClick={() => scrollToSection('skraning-section', 'skraning')}
            >
              Skrá mig í mót
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              <span className="text-[hsl(var(--arena-green))] font-semibold">HARD CAP</span> – Hámarksfjöldi er 100 keppendur
            </p>
          </div>
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion 
              type="single" 
              collapsible 
              value={openSection} 
              onValueChange={setOpenSection}
              className="space-y-4"
            >
              {/* Skráning */}
              <AccordionItem 
                id="skraning-section"
                value="skraning" 
                className="bg-card border border-[hsl(var(--arena-green)/0.3)] rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24 glow-green-sm"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-[hsl(var(--arena-green))]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                    </div>
                    Skráning í mót
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-6">
                    Fortnite Duos mót í Arena – 28. febrúar
                  </p>
                  <ElkoRegistrationForm />
                </AccordionContent>
              </AccordionItem>

              {/* Verð */}
              <AccordionItem 
                id="verd-section"
                value="verd" 
                className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    Verð & gjöld
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <Card className="glass-card border-[hsl(var(--arena-green)/0.3)]">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Ticket className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                          <span className="font-semibold">Keppnisgjald</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <p className="text-2xl font-bold text-[hsl(var(--arena-green))]">4.440 kr</p>
                            <p className="text-sm text-muted-foreground">á keppanda</p>
                          </div>
                          <div className="flex-1 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4">
                            <p className="text-2xl font-bold">8.880 kr</p>
                            <p className="text-sm text-muted-foreground">á lið (2 keppendur)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Pizza className="h-5 w-5 text-accent" />
                          <div>
                            <span className="font-semibold">Pizza pakki</span>
                            <span className="text-xs text-muted-foreground ml-2">(valfrjálst)</span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1">
                            <p className="text-xl font-bold">+1.000 kr</p>
                            <p className="text-sm text-muted-foreground">á keppanda</p>
                          </div>
                          <div className="flex-1 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-4">
                            <p className="text-xl font-bold">+2.000 kr</p>
                            <p className="text-sm text-muted-foreground">á lið (2 keppendur)</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                          Pizza afhent í pásum á milli leikja
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Dagskrá */}
              <AccordionItem 
                id="dagskra-section"
                value="dagskra" 
                className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    Dagskrá mótsins
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-6">Laugardagur 28. febrúar</p>
                  
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                    
                    <div className="space-y-4">
                      {scheduleItems.map((item, index) => (
                        <div key={index} className="relative flex gap-4 items-start">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 ${
                            item.isBreak ? 'bg-accent/20' : 
                            item.isAward ? 'bg-primary/10' : 
                            'bg-[hsl(var(--arena-green)/0.1)]'
                          }`}>
                            {item.isBreak ? <Pause className="h-5 w-5 text-accent" /> :
                             item.isAward ? <Trophy className="h-5 w-5 text-primary" /> :
                             <Timer className="h-5 w-5 text-[hsl(var(--arena-green))]" />}
                          </div>
                          <Card className={`flex-1 glass-card ${
                            item.isBreak ? 'border-accent/30' : 
                            item.isAward ? 'border-primary/30' : ''
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold">{item.title}</p>
                                  <p className="text-sm text-muted-foreground">{item.description || item.duration}</p>
                                </div>
                                <Badge variant="outline" className={item.isBreak ? 'bg-accent/10' : item.isAward ? 'bg-primary/10' : ''}>
                                  {item.time}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Leikir á 30 mín fresti</span> · Sama lobbý alla keppnina
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Keppnisfyrirkomulag */}
              <AccordionItem 
                id="fyrirkomulag-section"
                value="fyrirkomulag" 
                className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                    </div>
                    Keppnisfyrirkomulag
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="glass-card">
                      <CardContent className="p-4 space-y-3">
                        <p className="font-semibold">Fyrirkomulag</p>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">5 heildarleikir</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Custom games</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Sama lobbý allan tímann</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-card">
                      <CardContent className="p-4 space-y-3">
                        <p className="font-semibold">Stig & utanumhald</p>
                        <p className="text-sm text-muted-foreground">Geimur heldur utan um:</p>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Skráningu liða</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Stigagjöf</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Lokasæti</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Verðlaun & Raffle */}
              <AccordionItem 
                id="verdlaun-section"
                value="verdlaun" 
                className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    Verðlaun & raffle
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="glass-card border-primary/30">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Verðlaun</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Top 5 lið fá verðlaun</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Gjafir frá styrktaraðilum</span>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                          Engin peningaverðlaun – áhersla á upplifun
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="glass-card border-[hsl(var(--arena-green)/0.3)]">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <PartyPopper className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                          <span className="font-semibold">Raffle verðlaun</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                          <span className="text-sm">1 aukaverðlaun dregið út</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Allir keppendur eiga möguleika</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Streymi & upplifun */}
              <AccordionItem 
                id="streymi-section"
                value="streymi" 
                className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Tv className="h-5 w-5 text-primary" />
                    </div>
                    Streymi & upplifun
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Card className="glass-card p-4 text-center">
                      <Tv className="h-6 w-6 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-sm mb-1">Live streymi</h3>
                      <p className="text-xs text-muted-foreground">Streymi í gangi allan tímann</p>
                    </Card>
                    
                    <Card className="glass-card p-4 text-center">
                      <Eye className="h-6 w-6 text-[hsl(var(--arena-green))] mx-auto mb-3" />
                      <h3 className="font-semibold text-sm mb-1">Áhorfendur velkomnir</h3>
                      <p className="text-xs text-muted-foreground">Vinir og foreldrar geta fylgst með</p>
                    </Card>
                    
                    <Card className="glass-card p-4 text-center">
                      <Gamepad2 className="h-6 w-6 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-sm mb-1">Live á skjám</h3>
                      <p className="text-xs text-muted-foreground">Skjár í Arena sýnir keppnina</p>
                    </Card>
                  </div>
                  <p className="text-muted-foreground mt-6 text-center text-sm">
                    Þetta er <span className="text-foreground font-medium">viðburður</span>, ekki bara mót.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Fyrir foreldra */}
              <AccordionItem 
                id="foreldrar-section"
                value="foreldrar" 
                className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    Fyrir foreldra
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-[hsl(var(--arena-green))] mt-0.5 shrink-0" />
                      <p className="text-sm">Öruggt og skipulagt umhverfi</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-[hsl(var(--arena-green))] mt-0.5 shrink-0" />
                      <p className="text-sm">Starfsfólk á staðnum allan tímann</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-[hsl(var(--arena-green))] mt-0.5 shrink-0" />
                      <p className="text-sm">Skýr dagskrá og reglur</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-[hsl(var(--arena-green))] mt-0.5 shrink-0" />
                      <p className="text-sm">Foreldrar velkomnir sem áhorfendur</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border text-center">
                    <Button variant="outline" asChild>
                      <Link to="/hafa-samband">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Hafa samband
                      </Link>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tilboð á mótsdag */}
              <AccordionItem 
                id="tilbod-section"
                value="tilbod" 
                className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                      <Percent className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                    </div>
                    Tilboð á mótsdag
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-4 text-sm">11:00–14:00 á laugardaginn</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Card className="glass-card p-4 text-center">
                      <Gamepad2 className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="font-semibold text-sm">10 tíma æfingakort</p>
                      <p className="text-[hsl(var(--arena-green))] font-bold">25% afsláttur</p>
                    </Card>
                    <Card className="glass-card p-4 text-center">
                      <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="font-semibold text-sm">Duo-æfingakynning</p>
                      <p className="text-xs text-muted-foreground">Frekari upplýsingar á staðnum</p>
                    </Card>
                    <Card className="glass-card p-4 text-center">
                      <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                      <p className="font-semibold text-sm">Reglulegar æfingar</p>
                      <p className="text-xs text-muted-foreground">Kynning á æfingum í Arena</p>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Reglur */}
              <AccordionItem 
                id="reglur-section"
                value="reglur" 
                className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    Reglur & upplýsingar
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary">Aldurstakmörk</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Allur aldur er leyfður á þessu móti
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Foreldrar velkomnir sem áhorfendur
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
                          Starfsfólk á staðnum allan tímann
                        </li>
                      </ul>
                    </div>
                    
                    <DiscordSupportActions />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
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
