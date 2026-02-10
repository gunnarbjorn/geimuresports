import { Link } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Crosshair, Swords, Gamepad2, Trophy, Users, ArrowRight, ArrowDown,
  Settings, Gauge, Wifi, TrendingUp, Video, Send
} from "lucide-react";

const userPaths = [
  {
    title: "ÆFA ÞIG",
    description: "Maps, warm-up og aim",
    href: "/fortnite/maps",
    icon: Crosshair,
  },
  {
    title: "LÆRA",
    description: "Tips og stillingar",
    href: "/fortnite/tips",
    icon: Settings,
  },
  {
    title: "KEPPA",
    description: "Ranked og mót",
    href: "/fortnite/ranked",
    icon: Trophy,
  },
  {
    title: "COMMUNITY",
    description: "Clips og samfélag",
    href: "/fortnite/community",
    icon: Users,
  },
];

const mapCards = [
  { title: "1v1 Maps", href: "/fortnite/maps/1v1", icon: Swords },
  { title: "Aim æfingar", href: "/fortnite/maps/aim", icon: Crosshair },
  { title: "Edit æfingar", href: "/fortnite/maps/edit", icon: Gamepad2 },
  { title: "Warm-up", href: "/fortnite/maps/warmup", icon: Gauge },
  { title: "Boxfight", href: "/fortnite/maps/boxfight", icon: Swords },
];

const tipsCards = [
  { title: "Stillingar", href: "/fortnite/tips/settings", icon: Settings },
  { title: "Næmni", href: "/fortnite/tips/sensitivity", icon: Crosshair },
  { title: "Performance", href: "/fortnite/tips/performance", icon: Gauge },
  { title: "Laggar & ping", href: "/fortnite/tips/lag", icon: Wifi },
  { title: "Ranked tips", href: "/fortnite/tips/ranked", icon: TrendingUp },
];

const Fortnite = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const scrollToContent = useCallback(() => {
    const el = document.getElementById("fortnite-paths");
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);

  return (
    <Layout>
      {/* Hero – immersive, warm nebula */}
      <section className="relative min-h-[88vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-glow-fortnite" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/50" />
        
        {/* Floating orbs for depth */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/5 w-48 h-48 rounded-full bg-primary/3 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-5 tracking-tight animate-fade-in">
              <span className="text-glow">FORTNITE</span>{" "}
              <span className="block md:inline text-primary">Á ÍSLANDI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.15s" }}>
              Æfingar • Keppni • Community
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button
                size="lg"
                className="btn-primary-gradient text-lg px-10 py-7 font-bold glow-red-sm"
                onClick={scrollToContent}
              >
                Byrja hér
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border/60 hover:border-primary/40">
                <Link to="/aefingar">Æfingar</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border/60 hover:border-primary/40">
                <Link to="/mot">
                  <Trophy className="mr-2 h-4 w-4" />
                  Mót
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Paths – clear destinations */}
      <section id="fortnite-paths" className="section-spacing-lg scroll-mt-20 relative">
        <div className="absolute inset-0 nebula-bg pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Hvað viltu gera?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Veldu leið og kanna Fortnite-alheiminn
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {userPaths.map((path, i) => (
              <Link key={path.href} to={path.href} className="group">
                <Card className="path-card rounded-2xl h-full text-center py-8 md:py-12">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center gap-5">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-300 group-hover:scale-105">
                      <path.icon className="h-8 w-8 md:h-9 md:w-9 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className="font-display text-base md:text-lg font-bold mb-1 tracking-wide">{path.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{path.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* Maps – Æfingar label */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-bg-alt pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between max-w-4xl mx-auto mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">Æfingar</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Fortnite Maps</h2>
            </div>
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/fortnite/maps">Sjá öll <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {mapCards.map((card) => (
              <Link key={card.href} to={card.href} className="group">
                <Card className="glass-card border-border card-hover text-center py-6 rounded-xl">
                  <CardContent className="p-3 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <card.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-display text-sm font-bold">{card.title}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* Tips – Þekking label */}
      <section className="section-spacing-lg relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between max-w-4xl mx-auto mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">Þekking</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Tips & Stillingar</h2>
            </div>
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/fortnite/tips">Sjá öll <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {tipsCards.map((card) => (
              <Link key={card.href} to={card.href} className="group">
                <Card className="glass-card border-border card-hover text-center py-6 rounded-xl">
                  <CardContent className="p-3 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <card.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-display text-sm font-bold">{card.title}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* Community – warm, alive */}
      <section className="section-spacing-lg relative overflow-hidden">
        <div className="absolute inset-0 nebula-bg pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">Samfélag</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Community</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Klipp, highlights og tenging við íslenska Fortnite spilara
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link to="/fortnite/community" className="group">
                <Card className="glass-card-warm path-card rounded-2xl h-full">
                  <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Video className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold mb-1">Clip vikunnar</h3>
                      <p className="text-sm text-muted-foreground">Bestu klippin úr íslensku community-inu</p>
                    </div>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Sjá clips <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/fortnite/community#senda-clip" className="group">
                <Card className="glass-card-warm path-card rounded-2xl h-full">
                  <CardContent className="p-6 md:p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Send className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold mb-1">Senda klipp</h3>
                      <p className="text-sm text-muted-foreground">Deildu þínum besta augnabliki</p>
                    </div>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Senda inn <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* Ranked – Keppni label */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-bg-alt pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-20 h-20 rounded-2xl bg-primary/8 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center md:text-left flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">Keppni</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Ranked & Competitive</h2>
              <p className="text-muted-foreground mb-5">
                Lærðu hvernig ranked kerfið virkar og hvernig Geimur undirbýr þig fyrir keppni.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button asChild className="btn-primary-gradient">
                  <Link to="/fortnite/ranked">Lesa meira <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="border-border/60 hover:border-primary/40">
                  <Link to="/mot">Næsta mót</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion CTA – warm */}
      <section className="section-spacing-lg relative overflow-hidden">
        <div className="absolute inset-0 nebula-bg pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="glass-card-warm border-primary/15 max-w-4xl mx-auto overflow-hidden relative rounded-2xl">
            <div className="absolute inset-0 hero-glow opacity-40" />
            <CardContent className="p-8 md:p-14 text-center relative z-10">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Tilbúinn í næsta skref?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Skráðu þig í æfingar eða taktu þátt í næsta Fortnite-móti á Íslandi.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="btn-primary-gradient text-lg px-8 font-bold glow-red-sm">
                  <Link to="/aefingar">
                    Skráning í æfingar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/30 hover:border-primary/50">
                  <Link to="/mot">
                    <Trophy className="mr-2 h-5 w-5" />
                    Næsta mót
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

export default Fortnite;
