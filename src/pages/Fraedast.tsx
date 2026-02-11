import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, ArrowRight, BookOpen, Crosshair, Swords, Gamepad2, Gauge,
  Settings, Wifi, TrendingUp, Globe,
} from "lucide-react";

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

const Fraedast = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative hero-section-lg overflow-hidden">
        <div className="absolute inset-0 hero-glow-fortnite opacity-60" />
        <div className="absolute inset-0 nebula-knowledge pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[hsl(var(--planet-knowledge)/0.06)] blur-3xl animate-pulse-glow" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Button asChild variant="ghost" size="sm" className="mb-6 text-muted-foreground">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Til baka</Link>
            </Button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--planet-knowledge)/0.1)] text-[hsl(var(--planet-knowledge))] text-xs font-bold uppercase tracking-widest mb-4">
              <BookOpen className="h-3.5 w-3.5" /> Fræðast
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Fræðsla & Leiðbeiningar</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">Maps, tips, stillingar og allt sem þú þarft til að bæta leikni þína.</p>
          </div>
        </div>
      </section>

      {/* Maps */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-training pointer-events-none opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--planet-training))] mb-1 block">Æfingar</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Fortnite Maps</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {mapCards.map((card) => (
              <Link key={card.href} to={card.href} className="group">
                <Card className="planet-card-training text-center py-6 rounded-xl">
                  <CardContent className="p-3 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--planet-training)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--planet-training)/0.2)] transition-colors">
                      <card.icon className="h-5 w-5 text-[hsl(var(--planet-training))]" />
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

      {/* Tips */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-knowledge pointer-events-none opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--planet-knowledge))] mb-1 block">Þekking</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold">Tips & Stillingar</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {tipsCards.map((card) => (
              <Link key={card.href} to={card.href} className="group">
                <Card className="planet-card-knowledge text-center py-6 rounded-xl">
                  <CardContent className="p-3 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--planet-knowledge)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--planet-knowledge)/0.2)] transition-colors">
                      <card.icon className="h-5 w-5 text-[hsl(var(--planet-knowledge))]" />
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

      {/* CTA */}
      <section className="section-spacing-lg relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Tilbúinn í keppni?</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-lg mx-auto">Skoðaðu næsta mót eða byrjaðu í æfingum.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-[hsl(var(--planet-tournament))] hover:bg-[hsl(var(--planet-tournament-deep))] text-primary-foreground font-bold">
              <Link to="/keppa"><Globe className="mr-2 h-5 w-5" /> Skoða mót</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border/60 hover:border-[hsl(var(--planet-training)/0.5)]">
              <Link to="/aefingar">Skoða æfingar <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Fraedast;
