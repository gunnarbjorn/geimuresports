import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingForm } from "@/components/forms/TrainingForm";
import { TournamentForm } from "@/components/forms/TournamentForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Skraning = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Skráning
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Skráðu þig í æfingar eða mót. Veldu það sem hentar þér best hér að neðan.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card border-border card-hover group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display text-2xl">Skráning í æfingar</CardTitle>
                <CardDescription>
                  Skipulagðar æfingar fyrir alla aldurshópa. Lærðu af reyndum þjálfurum 
                  og þróaðu leikni þína.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  to="#aefingar-form"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('aefingar-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                >
                  Skrá mig í æfingar
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-border card-hover group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-display text-2xl">Skráning í mót</CardTitle>
                <CardDescription>
                  Taktu þátt í Fortnite mótum og keppu við aðra spilara. 
                  Solo, Duo og Squad flokkar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  to="#mot-form"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('mot-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                >
                  Skrá mig í mót
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible defaultValue="aefingar" className="space-y-6">
              {/* Training Form */}
              <AccordionItem 
                id="aefingar-form"
                value="aefingar" 
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
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

              {/* Tournament Form */}
              <AccordionItem 
                id="mot-form"
                value="mot" 
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 font-display text-xl font-bold hover:no-underline hover:text-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    Skráning í mót
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-6">
                    Fylltu út eyðublaðið hér að neðan til að skrá þig í Fortnite mót.
                  </p>
                  <TournamentForm />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Skraning;
