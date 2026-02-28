import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tournaments } from "@/data/tournaments";
import { ArenaLanDetails } from "@/components/tournaments/ArenaLanDetails";
import { ElkoDeildDetails } from "@/components/tournaments/ElkoDeildDetails";
import { AlltUndirDetails } from "@/components/tournaments/AlltUndirDetails";
import { useTournamentStatuses, type TournamentStatus } from "@/hooks/useTournamentStatuses";
import {
  Trophy, Calendar, MapPin, ArrowLeft, Globe, Gamepad2, ArrowRight,
  TrendingUp, Target, AlertTriangle,
} from "lucide-react";

const tournamentComponents: Record<string, React.ComponentType<{ onBack?: () => void }>> = {
  "elko-deild-vor-2026": ElkoDeildDetails,
  "arena-lan-coming-soon": ArenaLanDetails,
  "allt-undir": AlltUndirDetails,
};

const rankedSections = [
  { icon: TrendingUp, title: "Hvað er Ranked?", content: "Ranked er keppnishamur Fortnite þar sem þú spilar á móti spilurum á svipuðu getustigi. Þú safnar stigum og klifrar upp í gegnum deildir – frá Bronze upp í Unreal." },
  { icon: Target, title: "Hvernig virkar stigakerfið?", content: "Þú færð stig fyrir placement og eliminations. Placement stig eru mun verðmætari en kills, sérstaklega í hærri deildum. Samkvæmni skiptir öllu." },
  { icon: AlertTriangle, title: "Algeng mistök", content: "Hot drops í ranked, W-keying á hvern, léleg zone rotations og ekki nóg mats eftir bardaga." },
  { icon: Trophy, title: "Hvernig Geimur undirbýr spilara", content: "Við förum yfir VOD reviews, landing spots, rotation paths og endgame aðstæður. Í æfingum spiluðum við custom scrims sem líkja eftir ranked aðstæðum." },
];

const tournamentRoutes: Record<string, string> = {
  "elko-deild-vor-2026": "/keppa/elko-deild",
  "arena-lan-coming-soon": "/keppa/arena-lan",
  "allt-undir": "/keppa/allt-undir",
};

const StatusBadge = ({ status }: { status: TournamentStatus }) => {
  if (status === 'upcoming') {
    return (
      <Badge className="text-xs bg-yellow-500/15 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20">
        Væntanlegt
      </Badge>
    );
  }
  if (status === 'completed') {
    return (
      <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">
        Lokið
      </Badge>
    );
  }
  return (
    <Badge className="text-xs bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))] border-[hsl(var(--arena-green)/0.3)] hover:bg-[hsl(var(--arena-green)/0.2)]">
      Skráning opin
    </Badge>
  );
};

const Keppa = ({ defaultTournament }: { defaultTournament?: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getStatus, isVisible } = useTournamentStatuses();
  const activeTournaments = tournaments.filter(t => isVisible(t.id) && getStatus(t.id) === 'active');
  const completedTournaments = tournaments.filter(t => isVisible(t.id) && getStatus(t.id) === 'completed');
  const effectiveDefault = defaultTournament || null;
  const [selectedId, setSelectedId] = useState<string | null>(effectiveDefault);

  // Sync state when prop changes (e.g. navigating between /keppa and /keppa/arena-lan)
  useEffect(() => {
    setSelectedId(effectiveDefault);
  }, [effectiveDefault]);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedId]);

  const SelectedComponent = selectedId ? tournamentComponents[selectedId] : null;

  return (
    <Layout>
      <section className="relative pt-24 pb-6 md:pt-28 md:pb-8 overflow-hidden">
        <div className="absolute inset-0 nebula-tournament pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-[hsl(var(--planet-tournament)/0.05)] blur-3xl animate-pulse-glow" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">

            {/* Header - only when no tournament selected */}
            {!selectedId && (
              <FadeInView>
                <div className="text-center mb-10">
                  <Button asChild variant="ghost" size="sm" className="mb-4 text-muted-foreground">
                    <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Til baka</Link>
                  </Button>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] text-[hsl(var(--planet-tournament))] text-sm font-medium mb-4">
                    <Trophy className="h-4 w-4" />
                    Keppa
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                    Mót & Keppni
                  </h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Veldu mót til að sjá nánari upplýsingar, dagskrá og skráningu.
                  </p>
                </div>
              </FadeInView>
            )}

            {/* Tournament selector cards */}
            {!selectedId && (
              <>
                {/* Active tournaments */}
                <div className="space-y-4 mb-12">
                  {activeTournaments.map((t, i) => (
                    <FadeInView key={t.id} delay={i * 80}>
                      <Card
                        className="planet-card-tournament rounded-2xl overflow-hidden cursor-pointer hover:border-[hsl(var(--planet-tournament)/0.5)] transition-all hover:shadow-lg hover:shadow-[hsl(var(--planet-tournament)/0.1)]"
                        onClick={() => {
                          const route = tournamentRoutes[t.id];
                          if (route) navigate(route);
                          else setSelectedId(t.id);
                        }}
                      >
                        <CardContent className="p-5 md:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <StatusBadge status={getStatus(t.id)} />
                                <Badge variant="outline" className="text-xs">{t.category}</Badge>
                              </div>
                              <h2 className="font-display text-xl md:text-2xl font-bold mb-1.5">{t.name}</h2>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1.5">
                                  {t.location === "Online" ? <Globe className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                                  {t.location}
                                </span>
                                {t.dates.length > 0 && (
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {t.dates[0]}{t.dates.length > 1 ? ` – ${t.dates[t.dates.length - 1]}` : ""}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                            </div>
                            <div className="shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center mt-1">
                              <Trophy className="h-5 w-5 text-[hsl(var(--planet-tournament))]" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </FadeInView>
                  ))}
                </div>

                {/* Completed tournaments */}
                {completedTournaments.length > 0 && (
                  <div className="mb-16">
                    <div className="section-divider max-w-3xl mx-auto mb-8" />
                    <h3 className="font-display text-lg font-bold text-muted-foreground mb-4 text-center">Fyrri mót</h3>
                    <div className="space-y-3">
                      {completedTournaments.map((t, i) => (
                        <FadeInView key={t.id} delay={i * 80}>
                          <Card
                            className="planet-card-tournament rounded-xl overflow-hidden cursor-pointer hover:border-muted-foreground/30 transition-all opacity-80 hover:opacity-100"
                            onClick={() => {
                              const route = tournamentRoutes[t.id];
                              if (route) navigate(`${route}/nidurstodur`);
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">Lokið</Badge>
                                    <Badge variant="outline" className="text-xs">{t.category}</Badge>
                                  </div>
                                  <h4 className="font-display text-base font-bold">{t.name}</h4>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      {t.location === "Online" ? <Globe className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                      {t.location}
                                    </span>
                                    {t.dates.length > 0 && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {t.dates[0]}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                              </div>
                            </CardContent>
                          </Card>
                        </FadeInView>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ranked & Competitive section */}
                <div className="section-divider max-w-3xl mx-auto mb-12" />

                <FadeInView>
                  <div className="text-center mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--planet-tournament))] mb-2 block">Keppni</span>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Ranked & Competitive</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Lærðu hvernig ranked kerfið virkar og hvernig þú klífur á skilvirkari hátt.
                    </p>
                  </div>
                </FadeInView>

                <div className="space-y-4 mb-10">
                  {rankedSections.map((section, i) => (
                    <FadeInView key={i} delay={i * 80}>
                      <Card className="planet-card-tournament rounded-xl">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--planet-tournament)/0.1)] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <section.icon className="h-5 w-5 text-[hsl(var(--planet-tournament))]" />
                            </div>
                            <div>
                              <h3 className="font-display text-lg font-bold mb-2">{section.title}</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </FadeInView>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Button asChild size="lg" className="bg-[hsl(var(--planet-training))] hover:bg-[hsl(var(--planet-training-deep))] text-primary-foreground font-bold">
                    <Link to="/aefingar">
                      <Target className="mr-2 h-5 w-5" /> Skoða æfingar
                    </Link>
                  </Button>
                </div>
              </>
            )}

            {/* Selected tournament detail */}
            {selectedId && SelectedComponent && (
              <FadeInView>
                <SelectedComponent onBack={() => {
                  navigate("/keppa");
                }} />
              </FadeInView>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Keppa;
