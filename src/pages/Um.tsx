import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Users, Heart, ArrowRight, Gamepad2, Target, Trophy } from "lucide-react";
import geimurLogo from "@/assets/geimur-logo.png";

const values = [
  { title: "Fagmennska", description: "Við nálgumst rafíþróttir á fagmannlegan hátt með skipulögðum æfingum og markmiðssetningu.", icon: Award },
  { title: "Liðsandi", description: "Samvinna og stuðningur er í öndvegi. Við lærum saman og styðjum hvort annað.", icon: Users },
  { title: "Heilbrigðar venjur", description: "Gaming er frábært – en heilsa er fyrst. Hreyfing, hvíld og jafnvægi eru hluti af leiknum.", icon: Heart },
];

const team = [
  { name: "Gunnar Björn", role: "Mótstjóri & yfirumsjón", description: "Sér um skipulag móta, streymi og heildarupplifun keppenda. Leggur áherslu á faglegt, öruggt og skemmtilegt umhverfi fyrir alla aldurshópa." },
  { name: "Bjarki Þór", role: "Fortnite þjálfari", description: "Sérhæfir sig í Fortnite þjálfun, liðssamvinnu og keppnisundirbúningi. Hefur reynslu af að vinna með unglingum og leggja áherslu á jákvæða keppnisstemningu." },
];

const Um = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <Layout>
      {/* Hero – About/Mission planet atmosphere */}
      <section className="relative hero-section-lg overflow-hidden">
        <div className="absolute inset-0 hero-glow-about opacity-60" />
        <div className="absolute inset-0 nebula-about pointer-events-none" />
        <div className="absolute top-1/4 right-1/3 w-56 h-56 rounded-full bg-[hsl(var(--planet-about)/0.05)] blur-3xl animate-pulse-glow" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/3 flex justify-center">
                <img src={geimurLogo} alt="Geimur" className="h-40 md:h-56 w-auto opacity-90" />
              </div>
              <div className="lg:w-2/3 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--planet-about)/0.1)] text-[hsl(var(--planet-about-glow))] text-xs font-bold uppercase tracking-widest mb-5">
                  <Gamepad2 className="h-3.5 w-3.5" /> Hlutverk
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-glow">
                  Hvað er Geimur?
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Geimur er rafíþróttafélag stofnað til að efla íslenska leikara á fagmannlegan og 
                  heilbrigðan hátt. Við trúum að tölvuleikir geti verið vettvangur fyrir persónulegan 
                  þroska, liðsanda og markvissa þjálfun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-about pointer-events-none opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Að byggja upp næstu kynslóð keppnisleikara
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Hjá Geimi trúum við að rafíþróttir geti verið jafn verðmætar og hefðbundnar íþróttir – 
              ef þær eru stundaðar á réttan hátt.
            </p>
            <ul className="text-left space-y-3 max-w-md mx-auto text-muted-foreground">
              {[
                "Skipulögð þjálfun með mælanlegum markmiðum",
                "Jákvætt og hvetjandi umhverfi",
                "Heilbrigð viðhorf til gaming og screen time",
                "Tengsl við foreldra og upplýst samfélag",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[hsl(var(--planet-about-glow))] font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* Values */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-bg-alt pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Okkar gildi</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Þetta eru grunnstólparnir sem við byggjum á.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="planet-card-about rounded-xl text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-xl bg-[hsl(var(--planet-about)/0.1)] flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-[hsl(var(--planet-about-glow))]" />
                  </div>
                  <CardTitle className="font-display text-2xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-about pointer-events-none opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Teymið</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Fólkið á bak við mótin og æfingarnar.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="glass-card border-border card-hover">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--planet-about)/0.2)] to-secondary flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-2xl font-bold text-[hsl(var(--planet-about-glow))]">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <CardTitle className="font-display text-xl">{member.name}</CardTitle>
                  <span className="text-sm text-[hsl(var(--planet-about-glow))] font-semibold">{member.role}</span>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">{member.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Next planet pointer */}
      <section className="next-planet">
        <div className="container mx-auto px-4">
          <Card className="glass-card-warm border-primary/15 max-w-4xl mx-auto overflow-hidden relative rounded-2xl">
            <div className="absolute inset-0 hero-glow opacity-30" />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Komdu í Geim!
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Vertu hluti af okkar samfélag og byrjaðu þína rafíþrótta-ferð.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="btn-primary-gradient text-lg px-8">
                  <Link to="/aefingar#skraning">
                    Skrá mig <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-border/60 hover:border-primary/40">
                  <Link to="/hafa-samband">Hafa samband</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Um;
