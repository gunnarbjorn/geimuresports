import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, TrendingUp, Target, AlertTriangle, Trophy } from "lucide-react";

const sections = [
  {
    icon: TrendingUp,
    title: "Hvað er Ranked?",
    content: "Ranked er keppnishamur Fortnite þar sem þú spilar á móti spilurum á svipuðu getustigi. Þú safnar stigum (Ranked Points) eftir frammistöðu og klifrar upp í gegnum deildir – frá Bronze upp í Unreal. Markmiðið er að sýna raunverulega leikni þína."
  },
  {
    icon: Target,
    title: "Hvernig virkar stigakerfið?",
    content: "Þú færð stig fyrir placement (hvar þú endar) og eliminations. Placement stig eru mun verðmætari en kills, sérstaklega í hærri deildum. Til að klífa þarftu að enda stöðugt í efri hluta – ekki bara fá mörg kills. Tapað leikur getur kostað stig, svo samkvæmni skiptir öllu."
  },
  {
    icon: AlertTriangle,
    title: "Algeng mistök",
    content: "Hot drops í ranked – þú missir of mörg stig á slæmum byrjunum. W-keying á hvern sem þú sérð í stað þess að velja bardaga skynsamlega. Léleg zone rotations – of seint á ferð og festist í storm. Ekki nóg mats eftir bardaga vegna þess að þú eyddir öllu í eitt fight."
  },
  {
    icon: Trophy,
    title: "Hvernig Geimur undirbýr spilara",
    content: "Hjá Geimi æfum við ranked strategy bæði í einstaklings- og liðskeppni. Þjálfarar fara yfir VOD reviews, landing spots, rotation paths og endgame aðstæður. Í æfingum spiluðum við custom scrims sem líkja eftir ranked aðstæðum til að þjálfa ákvarðanatöku undir þrýstingi."
  },
];

const Ranked = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <Layout>
      <section className="relative hero-section-lg overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="absolute inset-0 nebula-bg-alt pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Button asChild variant="ghost" size="sm" className="mb-6 text-muted-foreground">
              <Link to="/fortnite"><ArrowLeft className="mr-2 h-4 w-4" /> Fortnite</Link>
            </Button>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
              Ranked & Competitive
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Lærðu hvernig ranked kerfið virkar og hvernig þú klífur á skilvirkari hátt.
            </p>
          </div>
        </div>
      </section>

      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-bg pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            {sections.map((section, i) => (
              <Card key={i} className="glass-card-warm border-border/40 card-hover rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold mb-3">{section.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      <section className="section-spacing-lg relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Tilbúinn í keppni?</h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-lg mx-auto">
            Skráðu þig í næsta mót eða byrjaðu í æfingum.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="btn-primary-gradient">
              <Link to="/mot">
                <Trophy className="mr-2 h-5 w-5" />
                Skoða næsta mót
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border/60 hover:border-primary/40">
              <Link to="/aefingar">Skoða æfingar <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ranked;
