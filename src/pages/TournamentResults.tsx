import { Link, useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tournaments } from "@/data/tournaments";
import { ArrowLeft, Trophy } from "lucide-react";

const tournamentSlugMap: Record<string, string> = {
  "elko-deild": "elko-deild-vor-2026",
  "arena-lan": "arena-lan-coming-soon",
  "allt-undir": "allt-undir",
};

const TournamentResults = () => {
  const { slug } = useParams<{ slug: string }>();
  const tournamentId = slug ? tournamentSlugMap[slug] : undefined;
  const tournament = tournaments.find(t => t.id === tournamentId);

  if (!tournament) {
    return <Navigate to="/keppa" replace />;
  }

  return (
    <Layout>
      <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 nebula-tournament pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
            <FadeInView>
              <div className="text-center mb-10">
                <Button asChild variant="ghost" size="sm" className="mb-4 text-muted-foreground">
                  <Link to="/keppa"><ArrowLeft className="mr-2 h-4 w-4" /> Til baka</Link>
                </Button>
                <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground mb-4">
                  Lokið
                </Badge>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  {tournament.name}
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Niðurstöður og stigatafla
                </p>
              </div>
            </FadeInView>

            <FadeInView delay={100}>
              <Card className="planet-card-tournament rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[hsl(var(--planet-tournament))]" />
                    Niðurstöður
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">
                      Niðurstöður verða birtar hér þegar þær liggja fyrir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeInView>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TournamentResults;
