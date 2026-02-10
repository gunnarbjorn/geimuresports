import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Target, Users, Heart, Trophy, Calendar, Gamepad2, ArrowRight, ArrowDown,
  Swords, MapPin, ShieldCheck, ExternalLink, BookOpen, Zap, MessageCircle
} from "lucide-react";
import heroDesktop from "@/assets/hero-desktop.png";
import heroMobile from "@/assets/hero-mobile.jpeg";

const planets = [
  {
    title: "MÓT",
    subtitle: "Keppa",
    description: "Fortnite mót á Íslandi – skráðu þig og kepptu.",
    href: "/mot",
    icon: Trophy,
    cardClass: "planet-card-tournament",
    iconBg: "bg-[hsl(var(--planet-tournament)/0.12)]",
    iconColor: "text-[hsl(var(--planet-tournament))]",
    accentColor: "text-[hsl(var(--planet-tournament))]",
  },
  {
    title: "ÆFINGAR",
    subtitle: "Þjálfast",
    description: "Skipulagðar æfingar fyrir alla aldurshópa.",
    href: "/aefingar",
    icon: Target,
    cardClass: "planet-card-training",
    iconBg: "bg-[hsl(var(--planet-training)/0.12)]",
    iconColor: "text-[hsl(var(--planet-training))]",
    accentColor: "text-[hsl(var(--planet-training))]",
  },
  {
    title: "FORTNITE",
    subtitle: "Læra",
    description: "Maps, tips, stillingar og ranked leiðbeiningar.",
    href: "/fortnite",
    icon: BookOpen,
    cardClass: "planet-card-knowledge",
    iconBg: "bg-[hsl(var(--planet-knowledge)/0.12)]",
    iconColor: "text-[hsl(var(--planet-knowledge))]",
    accentColor: "text-[hsl(var(--planet-knowledge))]",
  },
  {
    title: "SAMFÉLAG",
    subtitle: "Tengja",
    description: "Clips, highlights og íslenskt Fortnite community.",
    href: "/fortnite/community",
    icon: MessageCircle,
    cardClass: "planet-card-community",
    iconBg: "bg-[hsl(var(--planet-community)/0.12)]",
    iconColor: "text-[hsl(var(--planet-community))]",
    accentColor: "text-[hsl(var(--planet-community))]",
  },
];

const benefits = [
  {
    title: "Markviss þjálfun",
    description: "Mechanics, game sense og strategy frá reyndum þjálfurum.",
    icon: Target,
  },
  {
    title: "Liðsandi & samskipti",
    description: "Lærðu að vinna sem lið og byggðu upp traust með öðrum.",
    icon: Users,
  },
  {
    title: "Öruggt umhverfi",
    description: "Eftirlit, skipulag og jákvætt andrúmsloft fyrir alla aldurshópa.",
    icon: ShieldCheck,
  },
  {
    title: "Mót & markmið",
    description: "Kepptu í skipulögðum mótum og settu þér skýr markmið.",
    icon: Trophy,
  },
];

const packages = [
  {
    name: "Nýliðar",
    value: "nylidar",
    description: "Fyrir þá sem eru að byrja.",
    sessionsPerWeek: 1,
    monthlyPrice: 12900,
    features: ["1x æfing í viku", "Grunnatriði Fortnite", "Hámark 10 í hóp", "Aðgangur að Discord"],
  },
  {
    name: "Framhald",
    value: "framhald",
    description: "Fyrir þá sem vilja þróast.",
    sessionsPerWeek: 2,
    monthlyPrice: 19900,
    features: ["2x æfingar í viku", "Ítarleg þjálfun", "Hámark 10 í hóp", "Mótþátttaka"],
    featured: true,
  },
  {
    name: "Foreldri + barn",
    value: "foreldri-barn",
    description: "Spilaðu saman.",
    sessionsPerWeek: 1,
    monthlyPrice: 16900,
    isFamily: true,
    features: ["1x æfing í viku", "Sérhópar fyrir fjölskyldur", "Hámark 10 í hóp", "Skemmtilegt og fræðandi"],
  },
];

const formatPrice = (price: number) => price.toLocaleString("is-IS");
const calculatePerSession = (monthlyPrice: number, sessionsPerWeek: number) => {
  const sessionsPerMonth = sessionsPerWeek * 4;
  return Math.round(monthlyPrice / sessionsPerMonth);
};

const faqs = [
  { question: "Hvernig virka æfingarnar í gegnum netið?", answer: "Æfingarnar fara fram í gegnum Discord. Þjálfarinn tengist við hópinn og fer yfir mechanics, strategy og game sense í beinni útsendingu. Þátttakendur spila saman og fá endurgjöf í rauntíma." },
  { question: "Hvaða aldurshópar eru hjá ykkur?", answer: "Við tökum við spilurum frá 8 ára og upp í 16 ára. Hópum er skipt eftir aldri og leikni til að tryggja að allir fái viðeigandi áskoranir." },
  { question: "Þarf ég að eiga eigin PlayStation eða PC?", answer: "Já, þátttakendur þurfa að hafa aðgang að eigin PlayStation eða PC með Fortnite uppsett. Þar sem æfingarnar fara fram í gegnum netið þarftu einnig stöðuga nettengingu og Discord." },
  { question: "Er ég of léleg/ur til að taka þátt?", answer: "Alls ekki! Við tökum á móti öllum, óháð leikni. Markmið okkar er að hjálpa þér að þróast á þínum hraða í litlum hópum með hámark 10 þátttakendum." },
  { question: "Hvernig virkar greiðslan?", answer: "Greitt er mánaðarlega án skuldbindinga. Þú getur sagt upp hvenær sem er og engin binding er á áskriftinni." },
  { question: "Hvað með foreldra – mega þeir vera með?", answer: "Já! Við bjóðum upp á sérstakan 'Foreldri + barn' pakka þar sem foreldri og barn spila og læra saman í æfingum í gegnum netið." },
];

const Index = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const scrollToGalaxy = () => {
    const el = document.getElementById("galaxy-map");
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <Layout>
      {/* ===== HERO PLANET – Dynamic, cinematic ===== */}
      <section className="relative min-h-[80vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block" style={{ backgroundImage: `url(${heroDesktop})` }} />
        <div className="absolute inset-0 bg-cover bg-no-repeat md:hidden" style={{ backgroundImage: `url(${heroMobile})`, backgroundPosition: "center 38%" }} />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 hero-glow-tournament" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/5 w-48 h-48 rounded-full bg-[hsl(var(--planet-tournament)/0.06)] blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[hsl(var(--arena-green)/0.04)] blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Active Event Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-[hsl(var(--arena-green)/0.4)] backdrop-blur-sm mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--arena-green))] animate-pulse" />
              <span className="text-sm font-medium">Fortnite Duos LAN – 28. febrúar</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-5 tracking-tight animate-fade-in">
              <span className="text-glow">FORTNITE</span>{" "}
              <span className="text-[hsl(var(--arena-green))] text-glow-green">DUOS</span>{" "}
              <span className="text-glow">MÓT</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.15s" }}>
              Miðstöð keppna, æfinga og community á Íslandi
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="btn-arena-gradient text-lg px-10 py-7 glow-green-sm font-bold">
                <Link to="/mot">
                  <ExternalLink className="mr-2.5 h-5 w-5" />
                  Skráning
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/40" onClick={scrollToGalaxy}>
                Kanna alheiminn
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALAXY MAP – Planet navigation ===== */}
      <section id="galaxy-map" className="section-spacing-lg relative scroll-mt-20">
        <div className="absolute inset-0 nebula-bg pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              Kannaðu Geiminn
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Veldu áfangastað – hvert viltu fara?
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {planets.map((planet) => (
              <Link key={planet.href} to={planet.href} className="group">
                <Card className={`${planet.cardClass} rounded-2xl h-full text-center py-8 md:py-12`}>
                  <CardContent className="p-4 md:p-6 flex flex-col items-center gap-5">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${planet.iconBg} flex items-center justify-center group-hover:scale-105 transition-all duration-300`}>
                      <planet.icon className={`h-8 w-8 md:h-9 md:w-9 ${planet.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                    </div>
                    <div>
                      <h3 className="font-display text-base md:text-lg font-bold mb-0.5 tracking-wide">{planet.title}</h3>
                      <p className={`text-xs font-medium uppercase tracking-widest ${planet.accentColor} mb-1`}>{planet.subtitle}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{planet.description}</p>
                    </div>
                    <ArrowRight className={`h-4 w-4 ${planet.accentColor} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0`} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* ===== WHY GEIMUR ===== */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-about pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Af hverju Geimur?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fagleg rafíþróttaþjálfun í öruggu og skipulögðu umhverfi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="glass-card border-border card-hover">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-display text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground text-sm">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PACKAGES ===== */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-training pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Æfingapakkar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Skipulagðar Fortnite-æfingar í gegnum netið. Engin binding.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground max-w-2xl mx-auto">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
                <Gamepad2 className="h-4 w-4 text-[hsl(var(--planet-training))]" /> Hámark 10 í hóp
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
                <Target className="h-4 w-4 text-[hsl(var(--planet-training))]" /> Eigin PS eða PC
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
                <Users className="h-4 w-4 text-[hsl(var(--planet-training))]" /> Fyrir 8–16 ára
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <Card key={index} className={`glass-card border-border card-hover relative ${pkg.featured ? "border-[hsl(var(--planet-training))] glow-green-sm" : ""}`}>
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold bg-[hsl(var(--planet-training))] text-primary-foreground">
                      Vinsælast
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="font-display text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-3xl font-bold text-foreground">
                        {formatPrice(pkg.monthlyPrice)} kr<span className="text-base font-normal text-muted-foreground">/mán</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ≈ {formatPrice(calculatePerSession(pkg.monthlyPrice, pkg.sessionsPerWeek))} kr á æfingu
                      </p>
                      <p className="text-xs text-[hsl(var(--planet-training))] mt-2">Engin binding.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-[hsl(var(--planet-training)/0.1)] flex items-center justify-center flex-shrink-0">
                          <span className="text-[hsl(var(--planet-training))] text-xs">✓</span>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className={`w-full ${pkg.featured ? "btn-arena-gradient" : ""}`} variant={pkg.featured ? "default" : "outline"}>
                    <Link to={`/aefingar?group=${pkg.value}#skraning`}>Skrá mig</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-bg-alt pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Algengar spurningar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Finndu svör við algengustu spurningum.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="glass-card border border-border rounded-xl px-6">
                  <AccordionTrigger className="text-left font-display font-medium hover:text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ===== CONVERSION CTA ===== */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-bg pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="glass-card-warm border-primary/15 max-w-4xl mx-auto overflow-hidden relative rounded-2xl">
            <div className="absolute inset-0 hero-glow opacity-40" />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Tilbúin/n að taka næsta skref?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Skráðu þig í æfingar eða mót og vertu hluti af Geimur samfélaginu.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="btn-primary-gradient text-lg px-8 font-bold glow-red-sm">
                  <Link to="/skraning">
                    Skrá mig núna
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/50">
                  <Link to="/hafa-samband" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    Hafa samband
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
