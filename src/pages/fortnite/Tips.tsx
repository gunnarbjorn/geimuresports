import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Crosshair, Gauge, Wifi, TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";

const categories = [
  {
    title: "Fortnite stillingar",
    description: "Bestu stillingar fyrir PS, PC og Xbox – skjár, hljóð, HUD og gameplay stillingar sérsniðnar að íslensku neti.",
    href: "/fortnite/tips/settings",
    icon: Settings,
  },
  {
    title: "Fortnite næmni (Sensitivity)",
    description: "Hvernig finnur þú réttu sensitivity? Ráð fyrir controller og mouse spilara til að bæta aim.",
    href: "/fortnite/tips/sensitivity",
    icon: Crosshair,
  },
  {
    title: "Performance mode",
    description: "Fáðu meiri FPS og jafnari leik. Ráð fyrir DirectX 11, Performance mode og bestu stillingar fyrir veikari vélar.",
    href: "/fortnite/tips/performance",
    icon: Gauge,
  },
  {
    title: "Fortnite laggar – Minnka ping og lag",
    description: "Ráð til að minnka lag á Íslandi – nettengingar, server val, og stillingar sem skipta máli.",
    href: "/fortnite/tips/lag",
    icon: Wifi,
  },
  {
    title: "Ranked tips",
    description: "Hvernig klífur þú upp ranked stigann? Strategy, rotations, landing spots og algeng mistök.",
    href: "/fortnite/tips/ranked",
    icon: TrendingUp,
  },
];

const Tips = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <Layout>
      <section className="relative hero-section overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Button asChild variant="ghost" size="sm" className="mb-6 text-muted-foreground">
              <Link to="/fortnite"><ArrowLeft className="mr-2 h-4 w-4" /> Fortnite</Link>
            </Button>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Fortnite Tips & Stillingar
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hagnýt ráð fyrir íslenska spilara – stillingar, performance og keppnisstrategy.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <Link key={cat.href} to={cat.href} className="group">
                <Card className="glass-card border-border card-hover h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <cat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-display text-xl">{cat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4">{cat.description}</CardDescription>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lesa meira <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-lg mb-6">
            Viltu persónulega ráðgjöf? Geimur þjálfarar fara yfir stillingar og strategy í æfingum.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="btn-primary-gradient">
              <Link to="/aefingar">Skoða æfingar</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/50">
              <Link to="/mot">Skoða mót</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tips;
