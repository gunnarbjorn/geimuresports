import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tournaments, Tournament } from "@/data/tournaments";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  ArrowRight,
  Gamepad2,
  Lock,
  Coins,
  Gift,
  Monitor,
  Tv,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const registrationSteps = [
  {
    step: 1,
    title: "Veldu mót",
    description: "Skoðaðu komandi mót og veldu það sem hentar þér best.",
  },
  {
    step: 2,
    title: "Greiðsla & skráning",
    description: "Smelltu á takkan og fylgdu leiðbeiningum til að skrá þig.",
  },
  {
    step: 3,
    title: "Discord & undirbúningur",
    description: "Gakktu úr skugga um að þú sért skráður á Discord og tilbúin/n.",
  },
];

const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
  const isComingSoon = tournament.isComingSoon;
  
  return (
    <Card className={`bg-card border-border flex flex-col ${isComingSoon ? 'opacity-80' : 'card-hover'}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            {tournament.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-0">
                {tag}
              </Badge>
            ))}
          </div>
          {isComingSoon ? (
            <Lock className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Trophy className="h-5 w-5 text-accent" />
          )}
        </div>
        <CardTitle className="font-display text-xl">{tournament.name}</CardTitle>
        <CardDescription className="text-base">{tournament.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3 mb-6">
          {/* Dates */}
          {tournament.dates.length > 0 && (
            <div className="flex items-start gap-3 text-sm">
              <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <span className="font-medium">Tímabil:</span>
                <p className="text-muted-foreground">{tournament.dates.join(' · ')}</p>
              </div>
            </div>
          )}
          
          {/* Format */}
          {tournament.format && (
            <div className="flex items-center gap-3 text-sm">
              <Gamepad2 className="h-4 w-4 text-primary shrink-0" />
              <span><span className="font-medium">Format:</span> {tournament.format}</span>
            </div>
          )}
          
          {/* Location */}
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span><span className="font-medium">Staðsetning:</span> {tournament.location}</span>
          </div>
          
          {/* Age limit */}
          {tournament.ageLimit && (
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 text-primary shrink-0" />
              <span><span className="font-medium">Aldur:</span> {tournament.ageLimit}</span>
            </div>
          )}
          
          {/* Entry fee */}
          {tournament.entryFee && (
            <div className="flex items-center gap-3 text-sm">
              <Coins className="h-4 w-4 text-primary shrink-0" />
              <span><span className="font-medium">Þátttökugjald:</span> {tournament.entryFee}</span>
            </div>
          )}
          
          {/* Prize pool */}
          {tournament.prizePool && (
            <div className="flex items-center gap-3 text-sm">
              <Gift className="h-4 w-4 text-primary shrink-0" />
              <span><span className="font-medium">Verðlaunafé:</span> {tournament.prizePool}</span>
            </div>
          )}
          
          {/* Coming soon specific details */}
          {isComingSoon && (
            <>
              <div className="flex items-center gap-3 text-sm">
                <Monitor className="h-4 w-4 text-primary shrink-0" />
                <span>100 manna lobby</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Tv className="h-4 w-4 text-primary shrink-0" />
                <span>Livestream & stemning</span>
              </div>
            </>
          )}
        </div>
        
        {/* CTA Button */}
        {isComingSoon ? (
          <Button 
            className="w-full" 
            variant="outline"
            disabled
          >
            <Lock className="mr-2 h-4 w-4" />
            {tournament.ctaText || "Tilkynnt síðar"}
          </Button>
        ) : (
          <Button 
            className="w-full btn-primary-gradient"
            asChild
          >
            <a href={tournament.ctaUrl} target="_blank" rel="noopener noreferrer">
              {tournament.ctaText || "Skrá mig í mót"}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
        
        {/* Note */}
        {tournament.note && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {tournament.discordUrl ? (
              <>
                {tournament.note.split('Discord').map((part, i) => 
                  i === 0 ? part : (
                    <span key={i}>
                      <a 
                        href={tournament.discordUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Discord
                      </a>
                      {part}
                    </span>
                  )
                )}
              </>
            ) : tournament.note}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const Mot = () => {
  // Filter active and coming soon tournaments
  const activeTournaments = tournaments.filter(t => !t.isComingSoon);
  const comingSoonTournaments = tournaments.filter(t => t.isComingSoon);
  
  // If there's only one active tournament, hide the coming soon section
  const showComingSoon = activeTournaments.length === 0 || comingSoonTournaments.length > 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative hero-section-lg overflow-hidden">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {activeTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
            {showComingSoon && comingSoonTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
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
    </Layout>
  );
};

export default Mot;
