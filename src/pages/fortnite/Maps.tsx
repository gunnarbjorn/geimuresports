import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crosshair, Swords, Gamepad2, Gauge, ArrowRight, ArrowLeft } from "lucide-react";

const categories = [
  {
    title: "1v1 Maps",
    description: "Æfðu einvígi, lærðu piece control og bættu close-combat leikni með bestu 1v1 kortum Fortnite.",
    href: "/fortnite/maps/1v1",
    icon: Swords,
  },
  {
    title: "Aim æfingar",
    description: "Skerptu skotfimi þína með kortum sem einblína á tracking, flick shots og target switching.",
    href: "/fortnite/maps/aim",
    icon: Crosshair,
  },
  {
    title: "Edit æfingar",
    description: "Hraðar og nákvæmar edits skipta öllu máli í keppni. Æfðu allar helstu edit-gerðirnar.",
    href: "/fortnite/maps/edit",
    icon: Gamepad2,
  },
  {
    title: "Warm-up Maps",
    description: "Byrjaðu á réttan hátt. Þessi kort hita upp aim, builds og edits á stuttum tíma.",
    href: "/fortnite/maps/warmup",
    icon: Gauge,
  },
  {
    title: "Boxfight Maps",
    description: "Boxfights eru kjarninn í Fortnite keppni. Þjálfaðu pressure-play og reads á mótstöðumann.",
    href: "/fortnite/maps/boxfight",
    icon: Swords,
  },
];

const Maps = () => {
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
              Fortnite Maps
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handvalin æfingakort til að bæta alla þætti leiksins – aim, builds, edits og boxfights.
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
                      Skoða kort <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-lg mb-6">
            Viltu fá markvissa þjálfun í Fortnite? Geimur býður skipulagðar æfingar með þjálfara.
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

export default Maps;
