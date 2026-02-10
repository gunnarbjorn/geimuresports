import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Target, Users, Heart, Trophy, Calendar, Gamepad2, ArrowRight, ArrowDown,
  Swords, MapPin, ShieldCheck, ExternalLink, BookOpen, Zap, MessageCircle,
  Star, Rocket, Globe
} from "lucide-react";
import heroDesktop from "@/assets/hero-desktop.png";
import heroMobile from "@/assets/hero-mobile.jpeg";

/* ========== PLANET DATA ========== */
const planetCards = [
  {
    id: "tournaments",
    title: "MÓT & KEPPNIR",
    subtitle: "Keppa á Íslandi",
    description: "Fortnite mót, LAN-viðburðir og keppnir. Skráðu þig og mættu á völlinn.",
    href: "/mot",
    icon: Trophy,
    color: "var(--planet-tournament)",
    deepColor: "var(--planet-tournament-deep)",
    glowColor: "var(--planet-tournament-glow)",
    cta: "Sjá mót",
    cardClass: "planet-card-tournament",
  },
  {
    id: "training",
    title: "ÆFINGAR",
    subtitle: "Þróaðu leikni þína",
    description: "Skipulagðar æfingar, þjálfun og coaching fyrir alla aldurshópa.",
    href: "/aefingar",
    icon: Target,
    color: "var(--planet-training)",
    deepColor: "var(--planet-training-deep)",
    glowColor: "var(--planet-training-glow)",
    cta: "Sjá æfingar",
    cardClass: "planet-card-training",
  },
  {
    id: "fortnite",
    title: "FORTNITE MIÐSTÖÐ",
    subtitle: "Maps, tips & stillingar",
    description: "1v1 maps, aim training, edit courses, stillingar og ráðleggingar.",
    href: "/fortnite",
    icon: BookOpen,
    color: "var(--planet-knowledge)",
    deepColor: "var(--planet-knowledge-deep)",
    glowColor: "var(--planet-knowledge-glow)",
    cta: "Opna miðstöð",
    cardClass: "planet-card-knowledge",
  },
  {
    id: "community",
    title: "SAMFÉLAG",
    subtitle: "Clips, scrims & highlights",
    description: "Sendu inn klipp, fylgstu með highlights og tengdu við samfélagið.",
    href: "/fortnite/community",
    icon: MessageCircle,
    color: "var(--planet-community)",
    deepColor: "var(--planet-community-deep)",
    glowColor: "var(--planet-community-glow)",
    cta: "Sjá samfélag",
    cardClass: "planet-card-community",
  },
];

const benefits = [
  { title: "Markviss þjálfun", description: "Mechanics, game sense og strategy frá reyndum þjálfurum.", icon: Target },
  { title: "Liðsandi & samskipti", description: "Lærðu að vinna sem lið og byggðu upp traust.", icon: Users },
  { title: "Öruggt umhverfi", description: "Eftirlit, skipulag og jákvætt andrúmsloft.", icon: ShieldCheck },
  { title: "Mót & markmið", description: "Kepptu í skipulögðum mótum og settu þér markmið.", icon: Trophy },
];

const packages = [
  {
    name: "Nýliðar", value: "nylidar", description: "Fyrir þá sem eru að byrja.",
    sessionsPerWeek: 1, monthlyPrice: 12900,
    features: ["1x æfing í viku", "Grunnatriði Fortnite", "Hámark 10 í hóp", "Aðgangur að Discord"],
  },
  {
    name: "Framhald", value: "framhald", description: "Fyrir þá sem vilja þróast.",
    sessionsPerWeek: 2, monthlyPrice: 19900, featured: true,
    features: ["2x æfingar í viku", "Ítarleg þjálfun", "Hámark 10 í hóp", "Mótþátttaka"],
  },
  {
    name: "Foreldri + barn", value: "foreldri-barn", description: "Spilaðu saman.",
    sessionsPerWeek: 1, monthlyPrice: 16900, isFamily: true,
    features: ["1x æfing í viku", "Sérhópar fyrir fjölskyldur", "Hámark 10 í hóp", "Skemmtilegt og fræðandi"],
  },
];

const formatPrice = (price: number) => price.toLocaleString("is-IS");
const calculatePerSession = (monthlyPrice: number, sessionsPerWeek: number) =>
  Math.round(monthlyPrice / (sessionsPerWeek * 4));

const faqs = [
  { question: "Hvernig virka æfingarnar í gegnum netið?", answer: "Æfingarnar fara fram í gegnum Discord. Þjálfarinn tengist við hópinn og fer yfir mechanics, strategy og game sense í beinni útsendingu. Þátttakendur spila saman og fá endurgjöf í rauntíma." },
  { question: "Hvaða aldurshópar eru hjá ykkur?", answer: "Við tökum við spilurum frá 8 ára og upp í 16 ára. Hópum er skipt eftir aldri og leikni til að tryggja að allir fái viðeigandi áskoranir." },
  { question: "Þarf ég að eiga eigin PlayStation eða PC?", answer: "Já, þátttakendur þurfa að hafa aðgang að eigin PlayStation eða PC með Fortnite uppsett. Þar sem æfingarnar fara fram í gegnum netið þarftu einnig stöðuga nettengingu og Discord." },
  { question: "Er ég of léleg/ur til að taka þátt?", answer: "Alls ekki! Við tökum á móti öllum, óháð leikni. Markmið okkar er að hjálpa þér að þróast á þínum hraða í litlum hópum með hámark 10 þátttakendum." },
  { question: "Hvernig virkar greiðslan?", answer: "Greitt er mánaðarlega án skuldbindinga. Þú getur sagt upp hvenær sem er og engin binding er á áskriftinni." },
  { question: "Hvað með foreldra – mega þeir vera með?", answer: "Já! Við bjóðum upp á sérstakan 'Foreldri + barn' pakka þar sem foreldri og barn spila og læra saman í æfingum í gegnum netið." },
];

/* ========== SECTION TRANSITION COMPONENT ========== */
function SectionTransition({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  return (
    <div className="relative h-32 md:h-48 overflow-hidden">
      {/* Gradient blend */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            hsl(${fromColor} / 0.08) 0%, 
            transparent 30%,
            transparent 70%,
            hsl(${toColor} / 0.08) 100%)`,
        }}
      />
      {/* Center flare */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-1 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(${toColor} / 0.3), transparent)`,
          boxShadow: `0 0 40px hsl(${toColor} / 0.15)`,
        }}
      />
      {/* Floating particles */}
      <div
        className="absolute top-1/4 left-1/3 w-1 h-1 rounded-full animate-float"
        style={{ background: `hsl(${fromColor} / 0.4)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 rounded-full animate-float"
        style={{ background: `hsl(${toColor} / 0.3)`, animationDelay: "2s" }}
      />
    </div>
  );
}

/* ========== PLANET SECTION WRAPPER ========== */
function PlanetSection({
  id,
  color,
  children,
}: {
  id: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section id={`planet-${id}`} className="relative scroll-mt-32">
      {/* Ambient nebula glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 50% 20%, hsl(${color} / 0.06) 0%, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ========== MAIN PAGE ========== */
const Index = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const scrollToGalaxy = () => {
    const el = document.getElementById("planet-tournaments");
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <Layout>
      {/* ===== HERO PLANET ===== */}
      <section id="planet-hero" className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block" style={{ backgroundImage: `url(${heroDesktop})` }} />
        <div className="absolute inset-0 bg-cover bg-no-repeat md:hidden" style={{ backgroundImage: `url(${heroMobile})`, backgroundPosition: "center 38%" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 hero-glow-tournament" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-[15%] w-48 h-48 rounded-full bg-[hsl(var(--planet-tournament)/0.06)] blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[hsl(var(--arena-green)/0.04)] blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-[10%] w-32 h-32 rounded-full bg-[hsl(var(--planet-knowledge)/0.04)] blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Active event badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-[hsl(var(--arena-green)/0.4)] backdrop-blur-sm mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--arena-green))] animate-pulse" />
              <span className="text-sm font-medium">Elko-deildin Vor 2026 – Skráning opin</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-5 tracking-tight animate-fade-in">
              <span className="text-glow">FORTNITE</span>{" "}
              <span className="text-[hsl(var(--arena-green))] text-glow-green">Á ÍSLANDI</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.15s" }}>
              Keppnir, æfingar, maps og samfélag — allt á einum stað.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="btn-arena-gradient text-lg px-10 py-7 glow-green-sm font-bold">
                <Link to="/mot">
                  <Rocket className="mr-2.5 h-5 w-5" />
                  Skrá mig í mót
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/40" onClick={scrollToGalaxy}>
                Byrja ferðalagið
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom fade into journey */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===== TRANSITION: Hero → Tournaments ===== */}
      <SectionTransition fromColor="var(--geimur-red)" toColor="var(--planet-tournament)" />

      {/* ===== PLANET: TOURNAMENTS (RED/ORANGE) ===== */}
      <PlanetSection id="tournaments" color="var(--planet-tournament)">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--planet-tournament))", boxShadow: "0 0 12px hsl(var(--planet-tournament) / 0.5)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "hsl(var(--planet-tournament))" }}>
                Pláneta 1
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Mót & Keppnir
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
              Fortnite mót á Íslandi — frá netmótum til LAN-viðburða. Skráðu lið þitt og kepptu við bestu.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Featured tournament card */}
              <Card className="planet-card-tournament rounded-2xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[hsl(var(--planet-tournament)/0.15)] text-[hsl(var(--planet-tournament))]">
                      Virkt mót
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))]">
                      Skráning opin
                    </span>
                  </div>
                  <CardTitle className="font-display text-2xl">Elko-deildin Vor 2026</CardTitle>
                  <CardDescription>Duos Build – 4 mótakvöld yfir febrúar & mars</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[hsl(var(--planet-tournament))]" /> 11. feb – 4. mars 2026</li>
                    <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[hsl(var(--planet-tournament))]" /> Online</li>
                    <li className="flex items-center gap-2"><Swords className="h-4 w-4 text-[hsl(var(--planet-tournament))]" /> 2.000 kr á einstakling</li>
                  </ul>
                  <Button asChild className="btn-primary-gradient w-full font-bold">
                    <Link to="/mot">
                      Skrá mitt lið <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Coming soon LAN */}
              <Card className="planet-card-tournament rounded-2xl overflow-hidden relative">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[hsl(var(--planet-tournament)/0.1)] text-muted-foreground border border-border">
                    Bráðum
                  </span>
                </div>
                <CardHeader>
                  <CardTitle className="font-display text-2xl">LAN í Arena Gaming</CardTitle>
                  <CardDescription>100 manna lobby – á staðnum</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6">
                    Stórt Fortnite staðarmót í Arena Gaming. 100 keppendur í sama lobby, 5 leikir, streymi og verðlaun. Dagsetning tilkynnt fljótlega.
                  </p>
                  <Button variant="outline" className="w-full border-[hsl(var(--planet-tournament)/0.3)] hover:border-[hsl(var(--planet-tournament)/0.6)]" disabled>
                    Tilkynnt síðar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Next planet CTA */}
            <div className="text-center pt-4">
              <Button variant="ghost" className="text-muted-foreground hover:text-[hsl(var(--planet-training))]" onClick={() => {
                const el = document.getElementById("planet-training");
                if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
              }}>
                Næsta pláneta: Æfingar <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PlanetSection>

      {/* ===== TRANSITION: Tournaments → Training ===== */}
      <SectionTransition fromColor="var(--planet-tournament)" toColor="var(--planet-training)" />

      {/* ===== PLANET: TRAINING (GREEN) ===== */}
      <PlanetSection id="training" color="var(--planet-training)">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--planet-training))", boxShadow: "0 0 12px hsl(var(--planet-training) / 0.5)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "hsl(var(--planet-training))" }}>
                Pláneta 2
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Æfingar & Þjálfun
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
              Skipulagðar Fortnite-æfingar í gegnum netið. Engin binding.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {benefits.map((b, i) => (
                <Card key={i} className="glass-card border-border card-hover text-center py-6">
                  <CardContent className="p-4 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--planet-training)/0.1)] flex items-center justify-center">
                      <b.icon className="h-5 w-5 text-[hsl(var(--planet-training))]" />
                    </div>
                    <h3 className="font-display text-sm font-bold">{b.title}</h3>
                    <p className="text-xs text-muted-foreground">{b.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Packages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                      {pkg.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-3 text-sm">
                          <div className="w-5 h-5 rounded-full bg-[hsl(var(--planet-training)/0.1)] flex items-center justify-center flex-shrink-0">
                            <span className="text-[hsl(var(--planet-training))] text-xs">✓</span>
                          </div>
                          {f}
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

            <div className="text-center pt-4">
              <Button variant="ghost" className="text-muted-foreground hover:text-[hsl(var(--planet-knowledge))]" onClick={() => {
                const el = document.getElementById("planet-fortnite");
                if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
              }}>
                Næsta pláneta: Fortnite Miðstöð <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PlanetSection>

      {/* ===== TRANSITION: Training → Fortnite ===== */}
      <SectionTransition fromColor="var(--planet-training)" toColor="var(--planet-knowledge)" />

      {/* ===== PLANET: FORTNITE HUB (PURPLE) ===== */}
      <PlanetSection id="fortnite" color="var(--planet-knowledge)">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--planet-knowledge))", boxShadow: "0 0 12px hsl(var(--planet-knowledge) / 0.5)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "hsl(var(--planet-knowledge))" }}>
                Pláneta 3
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Fortnite Miðstöð
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
              Allt sem þú þarft til að bæta leikni þína — maps, tips, stillingar og leiðbeiningar.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { title: "Maps", desc: "1v1, aim, edit courses", href: "/fortnite/maps", icon: Globe },
                { title: "Tips & ráð", desc: "Stillingar, strategy", href: "/fortnite/tips", icon: Zap },
                { title: "Ranked", desc: "Ranked leiðbeiningar", href: "/fortnite/ranked", icon: Star },
                { title: "Samfélag", desc: "Clips & highlights", href: "/fortnite/community", icon: MessageCircle },
              ].map((item) => (
                <Link key={item.href} to={item.href} className="group">
                  <Card className="planet-card-knowledge rounded-2xl h-full text-center py-8">
                    <CardContent className="p-4 flex flex-col items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--planet-knowledge)/0.12)] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <item.icon className="h-7 w-7 text-[hsl(var(--planet-knowledge))]" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[hsl(var(--planet-knowledge))] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Button asChild variant="outline" className="border-[hsl(var(--planet-knowledge)/0.3)] hover:border-[hsl(var(--planet-knowledge)/0.6)]">
                <Link to="/fortnite">
                  Opna Fortnite Miðstöð <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="text-center pt-8">
              <Button variant="ghost" className="text-muted-foreground hover:text-[hsl(var(--planet-community))]" onClick={() => {
                const el = document.getElementById("planet-community");
                if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
              }}>
                Næsta pláneta: Samfélag <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PlanetSection>

      {/* ===== TRANSITION: Fortnite → Community ===== */}
      <SectionTransition fromColor="var(--planet-knowledge)" toColor="var(--planet-community)" />

      {/* ===== PLANET: COMMUNITY (ORANGE/YELLOW) ===== */}
      <PlanetSection id="community" color="var(--planet-community)">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--planet-community))", boxShadow: "0 0 12px hsl(var(--planet-community) / 0.5)" }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "hsl(var(--planet-community))" }}>
                Pláneta 4
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Samfélagið
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
              Vertu hluti af íslenska Fortnite samfélaginu. Sendu inn klipp, deildu highlights og tengdu.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="planet-card-community rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full mx-auto mb-4 bg-[hsl(var(--planet-community)/0.12)] flex items-center justify-center">
                    <Zap className="h-7 w-7 text-[hsl(var(--planet-community))]" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">Klipp vikunnar</h3>
                  <p className="text-sm text-muted-foreground">Sendu inn bestu klippen þín og líttu á highlight reel vikunnar.</p>
                </CardContent>
              </Card>
              <Card className="planet-card-community rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full mx-auto mb-4 bg-[hsl(var(--planet-community)/0.12)] flex items-center justify-center">
                    <Users className="h-7 w-7 text-[hsl(var(--planet-community))]" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">Discord</h3>
                  <p className="text-sm text-muted-foreground">Tengdu við aðra Fortnite spilara á Íslandi á Discord.</p>
                </CardContent>
              </Card>
              <Card className="planet-card-community rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full mx-auto mb-4 bg-[hsl(var(--planet-community)/0.12)] flex items-center justify-center">
                    <Swords className="h-7 w-7 text-[hsl(var(--planet-community))]" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">Scrims</h3>
                  <p className="text-sm text-muted-foreground">Skipulagðir æfingaleikir í hálfopnum lobbíum.</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button asChild className="bg-[hsl(var(--planet-community))] hover:bg-[hsl(var(--planet-community-deep))] text-background font-bold">
                <Link to="/fortnite/community">
                  Sjá samfélagið <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </PlanetSection>

      {/* ===== TRANSITION: Community → FAQ ===== */}
      <SectionTransition fromColor="var(--planet-community)" toColor="var(--geimur-red)" />

      {/* ===== FAQ ===== */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 nebula-bg-alt pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
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

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-16 lg:py-24">
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
