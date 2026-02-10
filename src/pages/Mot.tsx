import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tournaments, Tournament } from "@/data/tournaments";
import { ArenaLanDetails } from "@/components/tournaments/ArenaLanDetails";
import { ElkoDeildDetails } from "@/components/tournaments/ElkoDeildDetails";
import {
  Trophy,
  Calendar,
  MapPin,
  ArrowLeft,
  Globe,
  Gamepad2,
} from "lucide-react";

const tournamentComponents: Record<string, React.ComponentType> = {
  "elko-deild-vor-2026": ElkoDeildDetails,
  "arena-lan-coming-soon": ArenaLanDetails,
};

const Mot = () => {
  const location = useLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Handle hash-based deep linking (e.g. /mot#arena-lan-coming-soon)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      if (tournaments.find(t => t.id === id)) {
        setSelectedId(id);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  // Scroll to top when selecting/deselecting
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedId]);

  const selectedTournament = tournaments.find(t => t.id === selectedId);
  const SelectedComponent = selectedId ? tournamentComponents[selectedId] : null;

  return (
    <Layout>
      <section className="relative pt-24 pb-6 md:pt-28 md:pb-8 overflow-hidden">
        <div className="absolute inset-0 nebula-tournament pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-[hsl(var(--planet-tournament)/0.05)] blur-3xl animate-pulse-glow" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">

            {/* Back button when viewing a tournament */}
            {selectedId && (
              <FadeInView>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-4 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedId(null)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Öll mót
                </Button>
              </FadeInView>
            )}

            {/* Page header - only show when no tournament selected */}
            {!selectedId && (
              <FadeInView>
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] text-[hsl(var(--planet-tournament))] text-sm font-medium mb-4">
                    <Trophy className="h-4 w-4" />
                    Mót & Keppnir
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                    Fortnite mót á Íslandi
                  </h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Veldu mót til að sjá nánari upplýsingar, dagskrá og skráningu.
                  </p>
                </div>
              </FadeInView>
            )}

            {/* Tournament selector cards */}
            {!selectedId && (
              <div className="space-y-4">
                {tournaments.map((t, i) => (
                  <FadeInView key={t.id} delay={i * 80}>
                    <Card
                      className="planet-card-tournament rounded-2xl overflow-hidden cursor-pointer hover:border-[hsl(var(--planet-tournament)/0.5)] transition-all hover:shadow-lg hover:shadow-[hsl(var(--planet-tournament)/0.1)]"
                      onClick={() => setSelectedId(t.id)}
                    >
                      <CardContent className="p-5 md:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              {t.isComingSoon ? (
                                <Badge variant="outline" className="text-xs bg-muted/50">
                                  Bráðum
                                </Badge>
                              ) : (
                                <Badge className="text-xs bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))] border-[hsl(var(--arena-green)/0.3)] hover:bg-[hsl(var(--arena-green)/0.2)]">
                                  Skráning opin
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {t.category}
                              </Badge>
                            </div>

                            {/* Title */}
                            <h2 className="font-display text-xl md:text-2xl font-bold mb-1.5">{t.name}</h2>

                            {/* Info row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1.5">
                                {t.location === "Online" ? (
                                  <Globe className="h-3.5 w-3.5" />
                                ) : (
                                  <MapPin className="h-3.5 w-3.5" />
                                )}
                                {t.location}
                              </span>
                              {t.dates.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {t.dates[0]}{t.dates.length > 1 ? ` – ${t.dates[t.dates.length - 1]}` : ""}
                                </span>
                              )}
                              {t.entryFee && (
                                <span className="flex items-center gap-1.5">
                                  <Gamepad2 className="h-3.5 w-3.5" />
                                  {t.entryFee}
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                          </div>

                          {/* Arrow indicator */}
                          <div className="shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center mt-1">
                            <Trophy className="h-5 w-5 text-[hsl(var(--planet-tournament))]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeInView>
                ))}
              </div>
            )}

            {/* Selected tournament detail */}
            {selectedId && SelectedComponent && (
              <FadeInView>
                <SelectedComponent />
              </FadeInView>
            )}

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Mot;
