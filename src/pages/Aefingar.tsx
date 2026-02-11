import { useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingForm } from "@/components/forms/TrainingForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Clock, Users, Target, MessageSquare, Calendar, ArrowRight, ArrowLeft, Trophy
} from "lucide-react";

const schedule = [
  { day: "Þriðjudagar", time: "17:00 - 18:30", group: "Nýliðar" },
  { day: "Miðvikudagar", time: "17:00 - 18:30", group: "Framhald" },
  { day: "Fimmtudagar", time: "17:00 - 18:30", group: "Framhald" },
  { day: "Sunnudagar", time: "10:00 - 12:00", group: "Foreldri + barn" },
];

const sessionSteps = [
  { step: 1, title: "Upphitun", description: "Stutt upphitun og markmið dagsins. Hreyfing og stretching.", icon: Clock, duration: "10-15 mín" },
  { step: 2, title: "Drills / Mechanics", description: "Æfum sérstakar mechanics - aim, building, editing og fleira.", icon: Target, duration: "30-40 mín" },
  { step: 3, title: "Scrims / Leikæfingar", description: "Spiluð æfingar í hópum - Zone Wars, Box Fights eða custom games.", icon: Users, duration: "40-60 mín" },
  { step: 4, title: "Endurgjöf + markmið", description: "Ræðum hvað gekk vel og hvað má bæta. Setjum markmið fyrir næstu æfingu.", icon: MessageSquare, duration: "10-15 mín" },
];

const Aefingar = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          const navbarHeight = 80;
          const additionalOffset = 24;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navbarHeight - additionalOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location]);

  const scrollToSection = useCallback(() => {
    const element = document.getElementById('skraning');
    if (element) {
      const navbarHeight = 80;
      const additionalOffset = 24;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight - additionalOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, []);

  return (
    <Layout>
      {/* Hero – Training planet green atmosphere */}
      <section className="relative hero-section-lg overflow-hidden">
        <div className="absolute inset-0 hero-glow-training opacity-60" />
        <div className="absolute inset-0 nebula-training pointer-events-none" />
        {/* Floating orb */}
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-[hsl(var(--planet-training)/0.06)] blur-3xl animate-pulse-glow" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Button asChild variant="ghost" size="sm" className="mb-4 text-muted-foreground">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Til baka</Link>
            </Button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--planet-training)/0.1)] text-[hsl(var(--planet-training))] text-xs font-bold uppercase tracking-widest mb-5">
              <Target className="h-3.5 w-3.5" /> Æfa
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Æfingar
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Skipulagðar Fortnite-æfingar í gegnum netið fyrir alla aldurshópa og getustig.
            </p>
            <Button 
              size="lg" 
              className="btn-arena-gradient font-bold"
              onClick={scrollToSection}
            >
              Skrá mig í æfingar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-training pointer-events-none opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl font-bold mb-4">Vikuleg stundaskrá</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Veldu æfingartíma sem hentar þér best.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {schedule.map((slot, index) => (
              <FadeInView key={index} delay={index * 80}>
                <Card className="planet-card-training rounded-xl text-center">
                  <CardHeader className="pb-3">
                    <Calendar className="h-8 w-8 text-[hsl(var(--planet-training))] mx-auto mb-2" />
                    <CardTitle className="font-display text-lg">{slot.day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-foreground mb-2">{slot.time}</p>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[hsl(var(--planet-training)/0.1)] text-[hsl(var(--planet-training))]">
                      {slot.group}
                    </span>
                  </CardContent>
                </Card>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* How a Session Works */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-bg-alt pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl font-bold mb-4">Hvernig æfing fer fram</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Sérhver æfing fylgir skipulögðu ferli til að hámarka þróun.</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {sessionSteps.map((item, index) => (
              <FadeInView key={index} delay={index * 100}>
                <Card className="glass-card border-border card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-[hsl(var(--planet-training)/0.1)] flex items-center justify-center">
                          <item.icon className="h-6 w-6 text-[hsl(var(--planet-training))]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[hsl(var(--planet-training))] text-primary-foreground">
                            Skref {item.step}
                          </span>
                          <span className="text-sm text-muted-foreground">{item.duration}</span>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-training pointer-events-none opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible defaultValue="aefingar" className="space-y-6">
              <AccordionItem 
                id="skraning"
                value="aefingar" 
                className="bg-card border border-[hsl(var(--planet-training)/0.3)] rounded-xl overflow-hidden scroll-mt-28 md:scroll-mt-24"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-[hsl(var(--planet-training))]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--planet-training)/0.1)] flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-[hsl(var(--planet-training))]" />
                    </div>
                    Skráning í æfingar
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-6">
                    Fylltu út eyðublaðið hér að neðan til að skrá þig í æfingar.
                  </p>
                  <TrainingForm />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Next planet pointer */}
      <section className="next-planet">
        <div className="container mx-auto px-4">
          <Card className="glass-card-warm border-primary/15 max-w-4xl mx-auto overflow-hidden relative rounded-2xl">
            <div className="absolute inset-0 hero-glow opacity-30" />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Tilbúin/n að keppa?
              </h2>
              <p className="text-muted-foreground mb-6">
                Skoðaðu næsta Fortnite-mót eða kannaðu Fortnite-alheiminn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" className="btn-primary-gradient">
                  <Link to="/keppa">
                    <Trophy className="mr-2 h-5 w-5" /> Næsta mót
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-border/60 hover:border-primary/40">
                  <Link to="/fraedast">Fræðast</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Aefingar;
