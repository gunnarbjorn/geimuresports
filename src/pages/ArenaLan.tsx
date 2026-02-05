import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy,
  Gamepad2,
  Pizza,
  Tv,
  Gift,
  ShieldCheck,
  ChevronDown,
  Ticket,
  Target,
  Timer,
  Pause,
  Award,
  Sparkles,
  PartyPopper,
  Eye,
  Heart,
  MessageCircle,
  Percent
} from "lucide-react";

const ArenaLan = () => {
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
            {/* Event Badge */}
            <Badge className="mb-6 bg-[hsl(var(--arena-green)/0.1)] text-[hsl(var(--arena-green))] border-0 text-sm px-4 py-2">
              <Gamepad2 className="h-4 w-4 mr-2" />
              LAN mót í Arena
            </Badge>
            
            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Fortnite Duos mót í Arena
            </h1>
            
            {/* Subtext */}
            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Keppnisdagur í Arena með stemningu, áhorfendum og streymi.
            </p>
            
            {/* Info Chips */}
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
            
            {/* Primary CTA */}
            <Button 
              size="lg" 
              className="btn-arena-gradient text-lg px-8"
              onClick={scrollToRegistration}
            >
              Skrá mig í mót
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
            
            {/* Hard Cap Notice */}
            <p className="text-sm text-muted-foreground mt-4">
              <span className="text-[hsl(var(--arena-green))] font-semibold">HARD CAP</span> – Hámarksfjöldi er 100 keppendur
            </p>
          </div>
        </div>
      </section>

      {/* 2. GRUNNUPPLÝSINGAR UM MÓTIÐ */}
      <section className="py-12 md:py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
              Grunnupplýsingar
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="glass-card text-center p-4">
                <Gamepad2 className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Keppnisform</p>
                <p className="font-semibold">Duos</p>
              </Card>
              <Card className="glass-card text-center p-4">
                <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Spilun</p>
                <p className="font-semibold">Build</p>
              </Card>
              <Card className="glass-card text-center p-4">
                <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Staðsetning</p>
                <p className="font-semibold">Arena</p>
              </Card>
              <Card className="glass-card text-center p-4">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Hámarksfjöldi</p>
                <p className="font-semibold">100 keppendur</p>
              </Card>
              <Card className="glass-card text-center p-4">
                <ShieldCheck className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aldur</p>
                <p className="font-semibold">Allur aldur</p>
              </Card>
              <Card className="glass-card text-center p-4">
                <Ticket className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Skráning</p>
                <p className="font-semibold">geimuresports.is</p>
              </Card>
            </div>
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
              {/* Keppnisgjald */}
              <Card className="glass-card border-[hsl(var(--arena-green)/0.3)]">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Keppnisgjald</CardTitle>
                    </div>
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
              
              {/* Pizza pakki */}
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
            
            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
              
              {/* Timeline items */}
              <div className="space-y-4">
                {/* Game 1 */}
                <div className="relative flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center z-10 shrink-0">
                    <Timer className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                  </div>
                  <Card className="flex-1 glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Leikur 1</p>
                          <p className="text-sm text-muted-foreground">30 mín</p>
                        </div>
                        <Badge variant="outline">11:00</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Game 2 */}
                <div className="relative flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center z-10 shrink-0">
                    <Timer className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                  </div>
                  <Card className="flex-1 glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Leikur 2</p>
                          <p className="text-sm text-muted-foreground">30 mín</p>
                        </div>
                        <Badge variant="outline">11:30</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Game 3 */}
                <div className="relative flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center z-10 shrink-0">
                    <Timer className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                  </div>
                  <Card className="flex-1 glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Leikur 3</p>
                          <p className="text-sm text-muted-foreground">30 mín</p>
                        </div>
                        <Badge variant="outline">12:00</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Break */}
                <div className="relative flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center z-10 shrink-0">
                    <Pause className="h-5 w-5 text-accent" />
                  </div>
                  <Card className="flex-1 glass-card border-accent/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Pása</p>
                          <p className="text-sm text-muted-foreground">Pizza, hvíld & félagsstemning</p>
                        </div>
                        <Badge variant="outline" className="bg-accent/10">30 mín</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Game 4 */}
                <div className="relative flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center z-10 shrink-0">
                    <Timer className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                  </div>
                  <Card className="flex-1 glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Leikur 4</p>
                          <p className="text-sm text-muted-foreground">30 mín</p>
                        </div>
                        <Badge variant="outline">13:00</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Game 5 */}
                <div className="relative flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center z-10 shrink-0">
                    <Timer className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                  </div>
                  <Card className="flex-1 glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Leikur 5</p>
                          <p className="text-sm text-muted-foreground">30 mín</p>
                        </div>
                        <Badge variant="outline">13:30</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Awards */}
                <div className="relative flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center z-10 shrink-0">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <Card className="flex-1 glass-card border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Verðlaun & raffle</p>
                          <p className="text-sm text-muted-foreground">Verðlaunaafhending og happadrætti</p>
                        </div>
                        <Badge variant="outline" className="bg-primary/10">14:00</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Schedule note */}
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

      {/* Registration CTA Section */}
      <section id="skraning" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-8 w-8 text-[hsl(var(--arena-green))]" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Tilbúinn að keppa?
            </h2>
            <p className="text-muted-foreground mb-8">
              Skráðu þig og liðsfélaga þinn í Fortnite Duos mótið í Arena. Aðeins 100 sæti í boði.
            </p>
            <Button size="lg" className="btn-arena-gradient text-lg px-8" asChild>
              <Link to="/mot#skraning">
                Skrá mig í mót
                <ChevronDown className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Skráning fer fram á Mót síðunni
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ArenaLan;
