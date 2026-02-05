import { useState, useEffect, type MouseEvent } from "react";
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
  Coins,
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
  Sparkles,
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
      {/* 1. TOP SECTION – Event Overview (NO IMAGE) */}
      <section className="pt-28 md:pt-32 pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-[hsl(var(--arena-green)/0.1)] text-[hsl(var(--arena-green))] border-0 text-sm px-4 py-2">
              <Gamepad2 className="h-4 w-4 mr-2" />
              LAN mót í Arena
            </Badge>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Fortnite Duos mót í Arena
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Keppnisdagur í Arena með stemningu, áhorfendum og streymi.
            </p>
            
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
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                Arena
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 bg-card">
                <Users className="h-4 w-4 mr-2 text-primary" />
                50 lið / 100 keppendur
              </Badge>
            </div>
            
            <Button 
              size="lg" 
              className="btn-arena-gradient text-lg px-8"
              onClick={scrollToRegistration}
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


      {/* 3. VERÐ & SKRÁNING */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
              Verð & skráning
            </h2>
            
            <div className="space-y-4">
              <Card className="glass-card border-[hsl(var(--arena-green)/0.3)]">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                    </div>
                    <CardTitle className="text-lg">Keppnisgjald</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
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
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Pizza className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Pizza pakki</CardTitle>
                      <CardDescription>Valfrjálst – veldu í skráningu</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
          </div>
        </div>
      </section>

      {/* 4. DAGSKRÁ MÓTSINS */}
      <section className="py-12 md:py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-2">
              Dagskrá mótsins
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Laugardagur 28. febrúar
            </p>
            
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-4">
                {[
                  { time: "11:00", title: "Leikur 1", duration: "30 mín", isGame: true },
                  { time: "11:30", title: "Leikur 2", duration: "30 mín", isGame: true },
                  { time: "12:00", title: "Leikur 3", duration: "30 mín", isGame: true },
                  { time: "12:30", title: "Pása", duration: "30 mín", isBreak: true, description: "Pizza, hvíld & félagsstemning" },
                  { time: "13:00", title: "Leikur 4", duration: "30 mín", isGame: true },
                  { time: "13:30", title: "Leikur 5", duration: "30 mín", isGame: true },
                  { time: "14:00", title: "Verðlaun & raffle", isAward: true, description: "Verðlaunaafhending og happadrætti" },
                ].map((item, index) => (
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
            
            <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Leikir á 30 mín fresti</span> · Sama lobbý alla keppnina · Skipulag haldið stöðugu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. KEPPNISFYRIRKOMULAG & STIG */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
              Keppnisfyrirkomulag
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Fyrirkomulag</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
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
                    <span className="text-sm">Sama lobbý og skipulag allan tímann</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                      <Award className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                    </div>
                    <CardTitle className="text-lg">Stig & utanumhald</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
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
          </div>
        </div>
      </section>

      {/* 6. VERÐLAUN & RAFFLE */}
      <section className="py-12 md:py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
              Verðlaun & raffle
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border-primary/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Verðlaun</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Top 5 lið fá verðlaun</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Gjafir frá styrktaraðilum</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                    Engin peningaverðlaun – áhersla á upplifun og stemning
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-[hsl(var(--arena-green)/0.3)]">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                      <PartyPopper className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                    </div>
                    <CardTitle className="text-lg">Raffle verðlaun</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                    <span className="text-sm font-medium">1 aukaverðlaun dregið út</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Allir skráðir keppendur eiga möguleika</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 7. STEMNING & ÁHORFENDUR */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
              Streymi & upplifun
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="glass-card p-6 text-center">
                <Tv className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live streymi</h3>
                <p className="text-sm text-muted-foreground">Streymi í gangi allan tímann</p>
              </Card>
              
              <Card className="glass-card p-6 text-center">
                <Eye className="h-8 w-8 text-[hsl(var(--arena-green))] mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Áhorfendur velkomnir</h3>
                <p className="text-sm text-muted-foreground">Vinir og foreldrar geta fylgst með</p>
              </Card>
              
              <Card className="glass-card p-6 text-center">
                <Gamepad2 className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live á skjám</h3>
                <p className="text-sm text-muted-foreground">Skjár í Arena sýnir keppnina live</p>
              </Card>
            </div>
            
            <p className="text-muted-foreground mt-8 max-w-lg mx-auto">
              Þetta er <span className="text-foreground font-medium">viðburður</span>, ekki bara mót. Áhorfendur skapa stemningu og keppendur finna fyrir sviðsljósi.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FYRIR FORELDRA */}
      <section className="py-12 md:py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display text-xl md:text-2xl">Fyrir foreldra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 9. AUKATILBOÐ Á MÓTSDAG */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card border-dashed">
              <CardHeader className="text-center pb-2">
                <Badge className="w-fit mx-auto mb-4 bg-[hsl(var(--arena-green)/0.1)] text-[hsl(var(--arena-green))] border-0">
                  <Percent className="h-3 w-3 mr-1" />
                  Tilboð á mótsdag
                </Badge>
                <CardTitle className="text-lg">11:00–14:00 á laugardaginn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Gamepad2 className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-semibold text-sm">10 tíma æfingakort</p>
                    <p className="text-[hsl(var(--arena-green))] font-bold">25% afsláttur</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-semibold text-sm">Duo-æfingakynning</p>
                    <p className="text-xs text-muted-foreground">Frekari upplýsingar á staðnum</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-semibold text-sm">Reglulegar æfingar</p>
                    <p className="text-xs text-muted-foreground">Kynning á æfingum í Arena</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="skraning" className="py-16 md:py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card border-[hsl(var(--arena-green)/0.3)] overflow-hidden glow-green-sm">
              <CardHeader className="bg-gradient-to-r from-[hsl(var(--arena-green)/0.1)] to-transparent border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-[hsl(var(--arena-green))]" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-xl md:text-2xl">
                      Skráning í mót
                    </CardTitle>
                    <CardDescription>
                      Fortnite Duos mót í Arena – 28. febrúar
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
      <section className="py-12 md:py-16">
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
