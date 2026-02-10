import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar,
  Users,
  Trophy,
  ChevronDown,
  ChevronUp,
  Globe,
  Swords,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { tournaments } from "@/data/tournaments";

const elkoTournament = tournaments.find(t => t.id === "elko-deild-vor-2026")!;

interface RegisteredTeam {
  id: string;
  teamName: string;
  player1Name: string;
  player2Name: string;
}

export function ElkoDeildDetails() {
  const [registeredTeams, setRegisteredTeams] = useState<RegisteredTeam[]>([]);
  const [isTeamsListOpen, setIsTeamsListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRegisteredTeams = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_public_registrations');
        if (error) { console.error('Error:', error); return; }
        if (data) {
          const teams: RegisteredTeam[] = (data as any[])
            .filter((r: any) => r.type === 'elko-tournament')
            .map((r: any) => ({
              id: r.id,
              teamName: r.team_name || r.full_name || 'Óþekkt lið',
              player1Name: r.player1_name || r.full_name || 'Óþekkt',
              player2Name: r.player2_name || r.teammate_name || 'Óþekkt',
            }));
          setRegisteredTeams(teams);
        }
      } catch (err) { console.error('Error:', err); }
      finally { setIsLoading(false); }
    };
    fetchRegisteredTeams();
  }, []);

  const registeredTeamsCount = registeredTeams.length;

  return (
    <div className="space-y-6">
      {/* Tournament info */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Badge variant="outline" className="text-xs px-3 py-1.5 bg-card border-primary/50">
            <Globe className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {elkoTournament.location}
          </Badge>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{elkoTournament.name}</h2>
        <p className="text-muted-foreground mb-4">
          {elkoTournament.format} · {elkoTournament.ageLimit}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {elkoTournament.dates.map((d) => (
            <Badge key={d} variant="secondary" className="text-sm px-3 py-1.5">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--planet-tournament))]" />
              {d}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
          {elkoTournament.description}
        </p>
      </div>

      {/* Entry fee */}
      {elkoTournament.entryFee && (
        <Card className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Swords className="h-5 w-5 text-[hsl(var(--planet-tournament))]" />
                <div>
                  <p className="font-medium">Þátttökugjald</p>
                  <p className="text-xs text-muted-foreground">á einstakling</p>
                </div>
              </div>
              <p className="text-xl font-bold text-[hsl(var(--arena-green))]">{elkoTournament.entryFee}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registered teams */}
      <Card className="bg-card border-[hsl(var(--arena-green)/0.3)] glow-green-sm">
        <Collapsible open={isTeamsListOpen} onOpenChange={setIsTeamsListOpen}>
          <CollapsibleTrigger asChild>
            <CardContent className="p-5 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                  <span className="font-semibold">Skráð lið</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{registeredTeamsCount} lið</span>
                  {isTeamsListOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-5 pb-5 border-t border-border">
              <div className="pt-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-[hsl(var(--arena-green))]" />
                  Skráð lið
                </h3>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Hleður...</p>
                ) : registeredTeams.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Engin lið skráð ennþá</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {registeredTeams.map((team, index) => (
                      <div key={team.id} className="flex items-center gap-3 py-2 px-3 bg-muted/30 rounded-lg">
                        <span className="text-xs font-mono text-muted-foreground w-6">#{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{team.teamName}</p>
                          <p className="text-xs text-muted-foreground truncate">{team.player1Name} & {team.player2Name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        {elkoTournament.ctaUrl && (
          <a
            href={elkoTournament.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-arena-gradient flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 px-8"
          >
            {elkoTournament.ctaText || "Skrá mig"}
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {elkoTournament.discordUrl && (
          <a
            href={elkoTournament.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-6"
          >
            <MessageCircle className="h-4 w-4" />
            Discord
          </a>
        )}
      </div>

      {elkoTournament.note && (
        <p className="text-xs text-muted-foreground text-center">{elkoTournament.note}</p>
      )}
    </div>
  );
}
