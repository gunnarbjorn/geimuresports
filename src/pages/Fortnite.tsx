import { Link } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Crosshair, Swords, Gamepad2, Trophy, Users, ArrowRight, ArrowDown,
  Settings, Gauge, Wifi, TrendingUp, Video, Send, Map
} from "lucide-react";

const userPaths = [
  {
    title: "ÆFA ÞIG",
    description: "Maps, warm-up og aim æfingar",
    href: "/fortnite/maps",
    icon: Crosshair,
  },
  {
    title: "KEPPA",
    description: "Ranked, mót og keppni",
    href: "/fortnite/ranked",
    icon: Trophy,
  },
  {
    title: "LÆRA",
    description: "Tips, stillingar og strategy",
    href: "/fortnite/tips",
    icon: Settings,
  },
  {
    title: "COMMUNITY",
    description: "Clips, highlights og samfélag",
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
      {/* Hero – full height, emotional */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-glow-tournament" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
              <span className="text-glow">FORTNITE</span>{" "}
              <span className="block md:inline text-primary">Á ÍSLANDI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Miðstöð æfinga, keppna og community
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Button
                size="lg"
                className="btn-primary-gradient text-lg px-10 py-7 font-bold"
                onClick={scrollToContent}
              >
                Byrja hér
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border">
                <Link to="/aefingar">Æfingar</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border">
                <Link to="/mot">
                  <Trophy className="mr-2 h-4 w-4" />
                  Mót
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Paths */}
      <section id="fortnite-paths" className="section-spacing-lg scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
            Hvað viltu gera í Fortnite?
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {userPaths.map((path) => (
              <Link key={path.href} to={path.href} className="group">
                <Card className="glass-card border-border card-hover h-full text-center py-8 md:py-10">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <path.icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-base md:text-lg font-bold mb-1">{path.title}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{path.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Maps – compact grid */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Fortnite Maps</h2>
              <p className="text-muted-foreground text-sm mt-1">Handvalin æfingakort</p>
            </div>
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/fortnite/maps">Sjá öll <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {mapCards.map((card) => (
              <Link key={card.href} to={card.href} className="group">
                <Card className="glass-card border-border card-hover text-center py-6">
                  <CardContent className="p-3 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
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

      {/* Tips – problem-based */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Tips & Stillingar</h2>
              <p className="text-muted-foreground text-sm mt-1">Hagnýt ráð fyrir íslenska spilara</p>
            </div>
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/fortnite/tips">Sjá öll <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {tipsCards.map((card) => (
              <Link key={card.href} to={card.href} className="group">
                <Card className="glass-card border-border card-hover text-center py-6">
                  <CardContent className="p-3 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
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

      {/* Ranked – tight block */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Ranked & Competitive</h2>
              <p className="text-muted-foreground mb-4">
                Lærðu hvernig ranked kerfið virkar og hvernig Geimur undirbýr spilara fyrir keppni.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button asChild className="btn-primary-gradient">
                  <Link to="/fortnite/ranked">Lesa meira <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="border-border">
                  <Link to="/mot">Næsta mót</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community – higher on page */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Video className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Community</h2>
              <p className="text-muted-foreground mb-4">
                Clip vikunnar, highlights og tenging við íslenska Fortnite spilara.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button asChild className="btn-primary-gradient">
                  <Link to="/fortnite/community">
                    <Video className="mr-2 h-4 w-4" />
                    Sjá clips
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-border">
                  <Link to="/fortnite/community#senda-clip">
                    <Send className="mr-2 h-4 w-4" />
                    Senda klipp
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion CTA */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <Card className="glass-card border-primary/20 max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute inset-0 hero-glow opacity-50" />
            <CardContent className="p-8 md:p-14 text-center relative z-10">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Viltu taka næsta skref í Fortnite?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Skráðu þig í æfingar eða taktu þátt í næsta Fortnite-móti á Íslandi.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="btn-primary-gradient text-lg px-8 font-bold">
                  <Link to="/aefingar">
                    Skráning í æfingar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/50">
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
