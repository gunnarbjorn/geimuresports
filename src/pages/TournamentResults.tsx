import { useState, useEffect, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tournaments } from "@/data/tournaments";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import type { TournamentRow, TournamentEvent } from "@/hooks/useTournamentRealtime";
import {
  Team,
  GameResult,
  DEFAULT_PLACEMENT_POINTS,
  getRankedTeams,
  getTeamTotalPoints,
} from "@/components/lan-manager/types";

const tournamentSlugMap: Record<string, string> = {
  "elko-deild": "elko-deild-vor-2026",
  "arena-lan": "arena-lan-coming-soon",
  "allt-undir": "allt-undir",
};

// Same computation as useTournamentRealtime but simplified for read-only
function computeResults(
  tournament: TournamentRow,
  events: TournamentEvent[],
  teams: Team[],
) {
  const activeEvents = events.filter(e => !e.undone);
  const config = (tournament.placement_config || DEFAULT_PLACEMENT_POINTS) as number[];
  const kpp = tournament.kill_points_per_kill || 2;

  // Point adjustments
  const adjKill: Record<string, number> = {};
  const adjPlace: Record<string, number> = {};
  for (const ev of activeEvents) {
    if (ev.event_type === 'points_adjust') {
      const d = ev.event_data;
      adjKill[d.team_id] = (adjKill[d.team_id] || 0) + (d.kill_points_delta || 0);
      adjPlace[d.team_id] = (adjPlace[d.team_id] || 0) + (d.placement_points_delta || 0);
    }
  }

  // Removed teams
  const removedTeamIds = new Set(
    activeEvents.filter(e => e.event_type === 'team_remove').map(e => e.event_data.team_id),
  );

  // Game score overrides
  const overrides: Record<string, { kills: number; killPoints: number; placementPoints: number }> = {};
  for (const ev of activeEvents) {
    if (ev.event_type === 'game_score_override') {
      const d = ev.event_data;
      overrides[`${d.team_id}_${d.game_number}`] = {
        kills: d.kills,
        killPoints: d.kill_points,
        placementPoints: d.placement_points,
      };
    }
  }

  // Game history
  const gameEndEvents = activeEvents
    .filter(e => e.event_type === 'game_end')
    .sort((a, b) => a.game_number - b.game_number);

  const gameHistory: GameResult[] = gameEndEvents.map(e => {
    const gameNum = e.event_data.gameNumber || e.game_number;
    const placements = (e.event_data.placements || []).map((p: any) => {
      const key = `${p.teamId}_${gameNum}`;
      const ov = overrides[key];
      if (ov) return { ...p, kills: ov.kills, killPoints: ov.killPoints, placementPoints: ov.placementPoints };
      return p;
    });
    const existingTeamIds = new Set(placements.map((p: any) => p.teamId));
    for (const [key, ov] of Object.entries(overrides)) {
      const [teamId, gn] = key.split('_');
      if (parseInt(gn) === gameNum && !existingTeamIds.has(teamId)) {
        placements.push({ teamId, placement: placements.length + 1, kills: ov.kills, killPoints: ov.killPoints, placementPoints: ov.placementPoints });
      }
    }
    return { gameNumber: gameNum, placements };
  });

  // Cumulative points
  const cumKill: Record<string, number> = {};
  const cumPlace: Record<string, number> = {};
  for (const game of gameHistory) {
    for (const p of game.placements) {
      cumKill[p.teamId] = (cumKill[p.teamId] || 0) + p.killPoints;
      cumPlace[p.teamId] = (cumPlace[p.teamId] || 0) + p.placementPoints;
    }
  }

  const processedTeams: Team[] = teams
    .filter(t => !removedTeamIds.has(t.id))
    .map(t => ({
      ...t,
      killPoints: (cumKill[t.id] || 0) + (adjKill[t.id] || 0),
      placementPoints: (cumPlace[t.id] || 0) + (adjPlace[t.id] || 0),
    }));

  return { teams: processedTeams, gameHistory };
}

const TournamentResults = () => {
  const { slug } = useParams<{ slug: string }>();
  const tournamentId = slug ? tournamentSlugMap[slug] : undefined;
  const tournament = tournaments.find(t => t.id === tournamentId);

  const [isLoading, setIsLoading] = useState(true);
  const [lanTournament, setLanTournament] = useState<TournamentRow | null>(null);
  const [events, setEvents] = useState<TournamentEvent[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (!tournament) return;
    async function fetch() {
      try {
        const [{ data: rows }, { data: teamData }] = await Promise.all([
          (supabase as any).from('lan_tournaments').select('*').order('created_at', { ascending: false }).limit(1),
          (supabase as any).rpc('get_lan_registered_teams'),
        ]);

        const t = rows?.[0] || null;
        setLanTournament(t);

        if (teamData) {
          setTeams(teamData.map((r: any) => ({
            id: r.id,
            name: r.team_name,
            players: [r.player1, r.player2 || ''] as [string, string],
            playersAlive: [true, true] as [boolean, boolean],
            killPoints: 0,
            placementPoints: 0,
            alive: true,
            gameKills: 0,
          })));
        }

        if (t) {
          const { data: evts } = await (supabase as any)
            .from('lan_tournament_events')
            .select('*')
            .eq('tournament_id', t.id)
            .order('created_at', { ascending: true });
          setEvents((evts || []) as TournamentEvent[]);
        }
      } catch (err) {
        console.error('Error fetching results:', err);
      }
      setIsLoading(false);
    }
    fetch();
  }, [tournament]);

  const results = useMemo(() => {
    if (!lanTournament) return null;
    return computeResults(lanTournament, events, teams);
  }, [lanTournament, events, teams]);

  if (!tournament) {
    return <Navigate to="/keppa" replace />;
  }

  const ranked = results ? getRankedTeams(results.teams) : [];
  const gameHistory = results?.gameHistory || [];

  return (
    <Layout>
      <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 nebula-tournament pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
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

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : ranked.length === 0 ? (
              <FadeInView delay={100}>
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Engar niðurstöður fundust.</p>
                </div>
              </FadeInView>
            ) : (
              <>
                {/* Podium */}
                <FadeInView delay={100}>
                  <div className="flex items-end justify-center gap-3 md:gap-4 w-full max-w-2xl mx-auto mb-10">
                    {[1, 0, 2].map(idx => {
                      const team = ranked[idx];
                      if (!team) return null;
                      const medal = idx === 0 ? { emoji: '🥇', color: 'hsl(45 100% 50%)', height: '180px' }
                        : idx === 1 ? { emoji: '🥈', color: 'hsl(0 0% 75%)', height: '140px' }
                        : { emoji: '🥉', color: 'hsl(30 60% 50%)', height: '110px' };
                      return (
                        <div key={team.id} className="flex flex-col items-center flex-1">
                          <span className={idx === 0 ? "text-4xl mb-2" : "text-3xl mb-2"}>{medal.emoji}</span>
                          <div
                            className="w-full rounded-t-xl p-3 md:p-4 text-center border border-border/30"
                            style={{
                              background: `linear-gradient(180deg, ${medal.color}15, ${medal.color}05)`,
                              borderColor: `${medal.color}30`,
                              height: medal.height,
                            }}
                          >
                            <h3 className="font-display font-bold text-sm md:text-lg">{team.name}</h3>
                            <p className="text-xs text-muted-foreground">{team.players.join(' & ')}</p>
                            <p className="text-xl md:text-3xl font-black mt-2" style={{ color: medal.color }}>
                              {getTeamTotalPoints(team)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </FadeInView>

                {/* Full leaderboard */}
                <FadeInView delay={200}>
                  <h2 className="font-display text-xl font-bold mb-4 text-center">Stigatafla</h2>
                  <div className="rounded-xl overflow-hidden overflow-x-auto border border-border/50 mb-10">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="text-left px-3 py-2.5 text-muted-foreground font-bold text-xs">#</th>
                          <th className="text-left px-2 py-2.5 text-muted-foreground font-bold text-xs">LIÐ</th>
                          {gameHistory.map(g => (
                            <th key={g.gameNumber} className="text-center px-2 py-2.5 text-muted-foreground font-bold text-xs">L{g.gameNumber}</th>
                          ))}
                          <th className="text-center px-2 py-2.5 text-muted-foreground font-bold text-xs">Kills</th>
                          <th className="text-center px-2 py-2.5 text-muted-foreground font-bold text-xs">Place</th>
                          <th className="text-right px-3 py-2.5 text-muted-foreground font-bold text-xs">SAMTALS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ranked.map((team, i) => {
                          const medalColor = i === 0 ? 'hsl(45 100% 50%)' : i === 1 ? 'hsl(0 0% 75%)' : i === 2 ? 'hsl(30 60% 50%)' : undefined;
                          return (
                            <tr key={team.id} className="border-b border-border/30 last:border-0" style={{ borderLeft: medalColor ? `3px solid ${medalColor}` : '3px solid transparent' }}>
                              <td className="px-3 py-2.5 font-bold" style={{ color: medalColor || 'hsl(var(--muted-foreground))' }}>{i + 1}</td>
                              <td className="px-2 py-2.5">
                                <span className="font-bold">{team.name}</span>
                                <p className="text-xs text-muted-foreground">{team.players.filter(Boolean).join(' & ')}</p>
                              </td>
                              {gameHistory.map(g => {
                                const p = g.placements.find(pl => pl.teamId === team.id);
                                return (
                                  <td key={g.gameNumber} className="text-center px-2 py-2.5 text-muted-foreground">
                                    {p ? p.killPoints + p.placementPoints : '-'}
                                  </td>
                                );
                              })}
                              <td className="text-center px-2 py-2.5 text-muted-foreground">{team.killPoints}</td>
                              <td className="text-center px-2 py-2.5 text-muted-foreground">{team.placementPoints}</td>
                              <td className="text-right px-3 py-2.5 text-xl font-black text-primary">{getTeamTotalPoints(team)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </FadeInView>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TournamentResults;
