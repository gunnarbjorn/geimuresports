import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingForm } from "@/components/forms/TrainingForm";
import { 
  Clock, 
  Users, 
  Target, 
  MessageSquare,
  Calendar,
  ArrowRight
} from "lucide-react";

const schedule = [
  { day: "Þriðjudagar", time: "17:00 - 18:30", group: "Nýliðar" },
  { day: "Miðvikudagar", time: "17:00 - 18:30", group: "Framhald" },
  { day: "Fimmtudagar", time: "17:00 - 18:30", group: "Framhald" },
  { day: "Laugardagar", time: "10:00 - 11:30", group: "Foreldri + barn" },
];

const sessionSteps = [
  {
    step: 1,
    title: "Upphitun",
    description: "Stutt upphitun og markmið dagsins. Hreyfing og stretching.",
    icon: Clock,
    duration: "10-15 mín",
  },
  {
    step: 2,
    title: "Drills / Mechanics",
    description: "Æfum sérstakar mechanics - aim, building, editing og fleira.",
    icon: Target,
    duration: "30-40 mín",
  },
  {
    step: 3,
    title: "Scrims / Leikæfingar",
    description: "Spiluð æfingar í hópum - Zone Wars, Box Fights eða custom games.",
    icon: Users,
    duration: "40-60 mín",
  },
  {
    step: 4,
    title: "Endurgjöf + markmið",
    description: "Ræðum hvað gekk vel og hvað má bæta. Setjum markmið fyrir næstu æfingu.",
    icon: MessageSquare,
    duration: "10-15 mín",
  },
];

const Aefingar = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative hero-section-lg overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Æfingar
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Skipulagðar Fortnite-æfingar í gegnum netið fyrir alla aldurshópa og getustig. 
              Lærðu af reyndum þjálfurum í jákvæðu umhverfi þar sem allir fá tækifæri til að þróast.
            </p>
            <Button asChild size="lg" className="btn-primary-gradient">
              <a href="#skraning">
                Skrá mig í æfingar
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Vikuleg stundaskrá
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Veldu æfingartíma sem hentar þér best.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {schedule.map((slot, index) => (
              <Card key={index} className="bg-card border-border card-hover text-center">
                <CardHeader>
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="font-display text-lg">{slot.day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground mb-2">{slot.time}</p>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {slot.group}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How a Session Works */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Hvernig æfing fer fram
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Sérhver æfing fylgir skipulögðu ferli til að hámarka þróun.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {sessionSteps.map((item, index) => (
                <Card key={index} className="bg-card border-border card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section id="skraning" className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Skráning í æfingar
              </h2>
              <p className="text-muted-foreground text-lg">
                Fylltu út eyðublaðið og við höfum samband við þig.
              </p>
            </div>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6 md:p-8">
                <TrainingForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-card to-secondary border-primary/20 max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute inset-0 hero-glow opacity-50" />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Hefur þú spurningar?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Ekki hika við að hafa samband ef þú vilt fá meiri upplýsingar.
              </p>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/hafa-samband">Hafa samband</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Aefingar;
