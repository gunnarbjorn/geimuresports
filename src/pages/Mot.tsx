import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TournamentForm } from "@/components/forms/TournamentForm";
import { tournaments, Tournament } from "@/data/tournaments";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Trophy,
  ArrowRight,
  Gamepad2
} from "lucide-react";

const registrationSteps = [
  {
    step: 1,
    title: "Veldu mót",
    description: "Skoðaðu komandi mót og veldu það sem hentar þér best.",
  },
  {
    step: 2,
    title: "Fylltu út skráningu",
    description: "Sendu okkur Epic nafnið þitt og veldu flokk (Solo/Duo/Squad).",
  },
  {
    step: 3,
    title: "Fáðu staðfestingu",
    description: "Þú færð tölvupóst með upplýsingum og leiðbeiningum.",
  },
];

const Mot = () => {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const scrollToForm = () => {
    document.getElementById('skraning')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Gamepad2 className="h-5 w-5" />
              <span className="font-medium">Fortnite</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Fortnite mót
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Taktu þátt í skipulögðum Fortnite mótum og mæt þig við aðra spilara. 
              Solo, Duo og Squad flokkar í boði.
            </p>
            <Button size="lg" className="btn-primary-gradient" onClick={scrollToForm}>
              Skrá mig í mót
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Komandi mót
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Veldu mót og skráðu þig. Við bætum reglulega við nýjum mótum.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-card border-border card-hover flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {tournament.category}
                    </span>
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                  <CardTitle className="font-display text-xl">{tournament.name}</CardTitle>
                  <CardDescription>{tournament.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{tournament.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{tournament.location}</span>
                    </div>
                    {tournament.ageLimit && (
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{tournament.ageLimit}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Skráningarfrestur: {tournament.deadline}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full btn-primary-gradient"
                    onClick={() => {
                      setSelectedTournament(tournament);
                      scrollToForm();
                    }}
                  >
                    Skrá mig í mót
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Registration Works */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Hvernig skráning virkar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Einföld skref til að taka þátt í móti.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {registrationSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <span className="font-display text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="skraning" className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Skráning í mót
              </h2>
              <p className="text-muted-foreground text-lg">
                Fylltu út eyðublaðið til að skrá þig í mót.
              </p>
            </div>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6 md:p-8">
                <TournamentForm preselectedTournament={selectedTournament || undefined} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Mot;
