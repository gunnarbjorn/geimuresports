import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Target, Users, Trophy, Calendar, ArrowRight, ArrowDown,
  MapPin, ShieldCheck, BookOpen, Zap, Star, Globe, Gamepad2, Clock
} from "lucide-react";
import heroDesktop from "@/assets/hero-desktop.png";
import heroMobile from "@/assets/hero-mobile.jpeg";
import { tournaments } from "@/data/tournaments";

const lanTournament = tournaments.find(t => t.id === "arena-lan-coming-soon")!;

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

const Index = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <Layout>
      {/* ===== HERO: LAN DUO TOURNAMENT ===== */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block" style={{ backgroundImage: `url(${heroDesktop})` }} />
        <div className="absolute inset-0 bg-cover bg-no-repeat md:hidden" style={{ backgroundImage: `url(${heroMobile})`, backgroundPosition: "center 38%" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 hero-glow-tournament" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-[hsl(var(--arena-green)/0.4)] backdrop-blur-sm mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--arena-green))] animate-pulse" />
              <span className="text-sm font-medium">Fortnite Duos LAN – Arena Gaming</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-5 tracking-tight animate-fade-in">
              <span className="text-glow">FORTNITE</span>{" "}
              <span className="text-[hsl(var(--arena-green))] text-glow-green">DUOS LAN</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.15s" }}>
              100 keppendur · 5 leikir · Verðlaun · Streymi á staðnum
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-[hsl(var(--arena-green))]" /> Arena Gaming
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-[hsl(var(--planet-tournament))]" /> Lau 28. feb
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-[hsl(var(--planet-tournament))]" /> 11:00 – 14:00
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="btn-arena-gradient text-lg px-10 py-7 glow-green-sm font-bold">
                <Link to="/mot#arena-lan-coming-soon">
                  <Trophy className="mr-2.5 h-5 w-5" />
                  Sjá mótið & skrá lið
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border/60 hover:border-[hsl(var(--planet-tournament)/0.4)]" onClick={() => {
                const el = document.getElementById("section-tournaments");
                if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
              }}>
                Skoða öll mót
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===== ALL TOURNAMENTS ===== */}
      <section id="section-tournaments" className="relative py-16 lg:py-24 scroll-mt-20">
        <div className="absolute inset-0 nebula-tournament pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <FadeInView>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Mót & Keppnir
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                Fortnite mót á Íslandi — frá netmótum til LAN-viðburða.
              </p>
            </FadeInView>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {tournaments.map((t, i) => (
                <FadeInView key={t.id} delay={100 + i * 100}>
                  <Card className="planet-card-tournament rounded-2xl overflow-hidden h-full flex flex-col">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {t.isComingSoon ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border">
                            Bráðum
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))]">
                            Skráning opin
                          </span>
                        )}
                        {t.tags?.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <CardTitle className="font-display text-2xl">{t.name}</CardTitle>
                      <CardDescription>{t.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                        {t.dates.length > 0 && (
                          <li className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
                            {t.dates[0]}{t.dates.length > 1 ? ` – ${t.dates[t.dates.length - 1]}` : ""}
                          </li>
                        )}
                        <li className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
                          {t.location}
                        </li>
                        {t.entryFee && (
                          <li className="flex items-center gap-2">
                            <Gamepad2 className="h-4 w-4 text-[hsl(var(--planet-tournament))]" />
                            {t.entryFee}
                          </li>
                        )}
                      </ul>
                      <div className="mt-auto">
                        <Button asChild className="w-full font-bold bg-[hsl(var(--planet-tournament))] hover:bg-[hsl(var(--planet-tournament-deep))] text-primary-foreground">
                          <Link to={`/mot#${t.id}`}>
                            {t.isComingSoon ? "Sjá nánar" : (t.ctaText || "Sjá mót")} <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </FadeInView>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRAINING ===== */}
      <section id="section-training" className="relative py-16 lg:py-24 scroll-mt-20">
        <div className="absolute inset-0 nebula-training pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <FadeInView>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Æfingar & Þjálfun
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                Skipulagðar Fortnite-æfingar í gegnum netið. Engin binding.
              </p>
            </FadeInView>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {benefits.map((b, i) => (
                <FadeInView key={i} delay={i * 80}>
                  <Card className="glass-card border-border card-hover text-center py-6">
                    <CardContent className="p-4 flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--planet-training)/0.1)] flex items-center justify-center">
                        <b.icon className="h-5 w-5 text-[hsl(var(--planet-training))]" />
                      </div>
                      <h3 className="font-display text-sm font-bold">{b.title}</h3>
                      <p className="text-xs text-muted-foreground">{b.description}</p>
                    </CardContent>
                  </Card>
                </FadeInView>
              ))}
            </div>

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
                    <Button asChild className={`w-full ${pkg.featured ? "bg-[hsl(var(--planet-training))] hover:bg-[hsl(var(--planet-training-deep))] text-primary-foreground" : ""}`} variant={pkg.featured ? "default" : "outline"}>
                      <Link to={`/aefingar?group=${pkg.value}#skraning`}>Skrá mig</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FORTNITE HUB ===== */}
      <section id="section-fortnite" className="relative py-16 lg:py-24 scroll-mt-20">
        <div className="absolute inset-0 nebula-knowledge pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <FadeInView>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Fortnite Miðstöð
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                Allt sem þú þarft til að bæta leikni þína — maps, tips, stillingar og samfélag.
              </p>
            </FadeInView>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { title: "Maps", desc: "1v1, aim, edit courses", href: "/fortnite/maps", icon: Globe },
                { title: "Tips & ráð", desc: "Stillingar, strategy", href: "/fortnite/tips", icon: Zap },
                { title: "Ranked", desc: "Ranked leiðbeiningar", href: "/fortnite/ranked", icon: Star },
                { title: "Samfélag", desc: "Clips & highlights", href: "/fortnite/community", icon: Users },
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
              <Button asChild className="bg-[hsl(var(--planet-knowledge))] hover:bg-[hsl(var(--planet-knowledge-deep))] text-primary-foreground font-bold">
                <Link to="/fortnite">
                  Opna Fortnite Miðstöð <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SAMFÉLAG ===== */}
      <section id="section-community" className="relative py-16 lg:py-24 scroll-mt-20">
        <div className="absolute inset-0 nebula-community pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <FadeInView>
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Samfélag
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl">
                Íslenska Fortnite samfélagið — klipp, highlights og streymi.
              </p>
            </FadeInView>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { player: "ÍslandGamer99", title: "Insane clutch í ranked", week: "Vika 6" },
                { player: "FortniteFreyr", title: "No-scope sniper elimination", week: "Vika 5" },
                { player: "ArcticAim", title: "1v4 endgame squad wipe", week: "Vika 4" },
              ].map((clip, i) => (
                <FadeInView key={i} delay={i * 100}>
                  <Card className="planet-card-community rounded-xl">
                    <CardContent className="p-6">
                      <div className="aspect-video rounded-lg bg-muted/20 border border-border/40 flex items-center justify-center mb-4">
                        <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                      <span className="text-xs text-[hsl(var(--planet-community))] font-medium">{clip.week}</span>
                      <h3 className="font-display font-bold mt-1">{clip.title}</h3>
                      <p className="text-sm text-muted-foreground">{clip.player}</p>
                    </CardContent>
                  </Card>
                </FadeInView>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-[hsl(var(--planet-community))] hover:bg-[hsl(var(--planet-community-deep))] text-primary-foreground font-bold">
                <Link to="/fortnite/community#senda-clip">
                  Sendu inn klipp <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-[hsl(var(--planet-community)/0.4)] hover:border-[hsl(var(--planet-community)/0.7)]">
                <Link to="/fortnite/community">
                  Skoða samfélagið
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
                  <Link to="/mot">
                    Sjá mót
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
