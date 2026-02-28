import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  TournamentState,
  TournamentAction,
  Team,
  GameResult,
  createInitialState,
  DEFAULT_PLACEMENT_POINTS,
} from '@/components/lan-manager/types';
import { toast } from 'sonner';

// ── Types ──

export interface TournamentRow {
  id: string;
  status: string;
  current_game: number;
  placement_config: number[];
  kill_points_per_kill: number;
  game_locked: boolean;
  raffle_winners: string[];
  created_at: string;
  updated_at: string;
}

export interface TournamentEvent {
  id: string;
  tournament_id: string;
  game_number: number;
  event_type: string;
  event_data: Record<string, any>;
  admin_user_id: string | null;
  admin_email: string;
  undone: boolean;
  created_at: string;
}

export interface ActivityLogEntry {
  id: string;
  admin_email: string;
  description: string;
  created_at: string;
}

interface ActiveAdmin {
  email: string;
  online_at: string;
}

type SyncStatus = 'synced' | 'syncing' | 'offline';

interface UseTournamentOptions {
  userEmail?: string;
  readOnly?: boolean;
}

// ── Pure computation functions ──

function computeStateFromDB(
  tournament: TournamentRow | null,
  events: TournamentEvent[],
  teams: Team[],
): TournamentState {
  if (!tournament) return createInitialState();

  const activeEvents = events.filter(e => !e.undone);
  const config = (tournament.placement_config || DEFAULT_PLACEMENT_POINTS) as number[];
  const kpp = tournament.kill_points_per_kill || 2;

  // Manual point adjustments (cumulative across all games)
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

  // Game history from game_end events
  const gameEndEvents = activeEvents
    .filter(e => e.event_type === 'game_end')
    .sort((a, b) => a.game_number - b.game_number);

  // Game score overrides (last override per team+game wins)
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

  const gameHistory: GameResult[] = gameEndEvents.map(e => {
    const gameNum = e.event_data.gameNumber || e.game_number;
    const placements = (e.event_data.placements || []).map((p: any) => {
      const key = `${p.teamId}_${gameNum}`;
      const ov = overrides[key];
      if (ov) return { ...p, kills: ov.kills, killPoints: ov.killPoints, placementPoints: ov.placementPoints };
      return p;
    });

    // Add override entries for teams NOT in the original placements (e.g. teams added after game was played)
    const existingTeamIds = new Set(placements.map((p: any) => p.teamId));
    for (const [key, ov] of Object.entries(overrides)) {
      const [teamId, gn] = key.split('_');
      if (parseInt(gn) === gameNum && !existingTeamIds.has(teamId)) {
        placements.push({
          teamId,
          placement: placements.length + 1,
          kills: ov.kills,
          killPoints: ov.killPoints,
          placementPoints: ov.placementPoints,
        });
      }
    }

    return { gameNumber: gameNum, placements };
  });

  // Cumulative points from completed games
  const cumKill: Record<string, number> = {};
  const cumPlace: Record<string, number> = {};
  for (const game of gameHistory) {
    for (const p of game.placements) {
      cumKill[p.teamId] = (cumKill[p.teamId] || 0) + p.killPoints;
      cumPlace[p.teamId] = (cumPlace[p.teamId] || 0) + p.placementPoints;
    }
  }

  // Current game events
  const cg = tournament.current_game;
  const cgEvents = activeEvents
    .filter(e => e.game_number === cg && !['game_end', 'team_remove'].includes(e.event_type))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const alive: Record<string, [boolean, boolean]> = {};
  const gKills: Record<string, number> = {};
  const gKillPts: Record<string, number> = {};
  const elimOrder: string[] = [];

  for (const t of teams) {
    alive[t.id] = [true, true];
    gKills[t.id] = 0;
    gKillPts[t.id] = 0;
  }

  if (tournament.status === 'active') {
    for (const ev of cgEvents) {
      const d = ev.event_data;
      switch (ev.event_type) {
        case 'player_eliminate': {
          if (alive[d.victim_team_id]) {
            alive[d.victim_team_id][d.victim_player_index] = false;
            if (!alive[d.victim_team_id].some(a => a) && !elimOrder.includes(d.victim_team_id)) {
              elimOrder.push(d.victim_team_id);
            }
          }
          if (d.killer_team_id && d.killer_team_id !== '__storm__') {
            gKills[d.killer_team_id] = (gKills[d.killer_team_id] || 0) + 1;
            gKillPts[d.killer_team_id] = (gKillPts[d.killer_team_id] || 0) + kpp;
          }
          break;
        }
        case 'team_revive': {
          if (alive[d.team_id]) alive[d.team_id] = [true, true];
          const idx = elimOrder.indexOf(d.team_id);
          if (idx !== -1) elimOrder.splice(idx, 1);
          break;
        }
        case 'player_revive': {
          if (alive[d.team_id]) alive[d.team_id][d.player_index] = true;
          const idx = elimOrder.indexOf(d.team_id);
          if (idx !== -1) elimOrder.splice(idx, 1);
          break;
        }
      }
    }
  }

  const processedTeams: Team[] = teams
    .filter(t => !removedTeamIds.has(t.id))
    .map(t => ({
      ...t,
      playersAlive:
        tournament.status === 'active'
          ? ((alive[t.id] || [true, true]) as [boolean, boolean])
          : ([true, true] as [boolean, boolean]),
      alive: tournament.status === 'active' ? (alive[t.id]?.some(a => a) ?? true) : true,
      gameKills: gKills[t.id] || 0,
      killPoints: (cumKill[t.id] || 0) + (gKillPts[t.id] || 0) + (adjKill[t.id] || 0),
      placementPoints: (cumPlace[t.id] || 0) + (adjPlace[t.id] || 0),
    }));

  return {
    status: tournament.status as 'lobby' | 'active' | 'finished',
    currentGame: tournament.current_game,
    teams: processedTeams,
    gameHistory,
    placementPointsConfig: config,
    killPointsPerKill: kpp,
    raffleWinners: (tournament.raffle_winners || []) as string[],
    eliminationOrder: elimOrder,
  };
}

function buildActivityLog(events: TournamentEvent[], teams: Team[]): ActivityLogEntry[] {
  return events
    .filter(e => !e.undone)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50)
    .map(e => {
      let desc = '';
      const d = e.event_data;
      switch (e.event_type) {
        case 'tournament_start':
          desc = 'Byrjaði mót';
          break;
        case 'game_end':
          desc = `Kláraði leik ${e.game_number}`;
          break;
        case 'player_eliminate': {
          const vt = teams.find(t => t.id === d.victim_team_id);
          const vn = vt?.players[d.victim_player_index] || '?';
          const kn =
            d.killer_team_id === '__storm__'
              ? 'Storm'
              : (teams.find(t => t.id === d.killer_team_id)?.name || '?');
          desc = `${vn} fell af ${kn}`;
          break;
        }
        case 'team_revive': {
          desc = `Revived ${teams.find(t => t.id === d.team_id)?.name || '?'}`;
          break;
        }
        case 'player_revive': {
          const pt = teams.find(t => t.id === d.team_id);
          desc = `Revived ${pt?.players[d.player_index] || '?'}`;
          break;
        }
        case 'team_remove':
          desc = 'Fjarlægði lið';
          break;
        case 'points_adjust': {
          const at = teams.find(t => t.id === d.team_id);
          const parts: string[] = [];
          if (d.kill_points_delta) parts.push(`${d.kill_points_delta > 0 ? '+' : ''}${d.kill_points_delta} kill`);
          if (d.placement_points_delta) parts.push(`${d.placement_points_delta > 0 ? '+' : ''}${d.placement_points_delta} placement`);
          desc = `Leiðrétti stig ${at?.name || '?'}: ${parts.join(', ')}`;
          break;
        }
        default:
          desc = e.event_type;
      }
      return { id: e.id, admin_email: e.admin_email, description: desc, created_at: e.created_at };
    });
}

// ── Hook ──

export function useTournamentRealtime(options?: UseTournamentOptions) {
  const readOnly = options?.readOnly || false;
  const userEmail = options?.userEmail;

  const [tournament, setTournament] = useState<TournamentRow | null>(null);
  const [events, setEvents] = useState<TournamentEvent[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('syncing');
  const [activeAdmins, setActiveAdmins] = useState<ActiveAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for stable dispatch
  const tournamentRef = useRef<TournamentRow | null>(null);
  const eventsRef = useRef<TournamentEvent[]>([]);
  const teamsRef = useRef<Team[]>([]);
  useEffect(() => { tournamentRef.current = tournament; }, [tournament]);
  useEffect(() => { eventsRef.current = events; }, [events]);
  useEffect(() => { teamsRef.current = teams; }, [teams]);

  // ── Init ──
  useEffect(() => {
    let cancelled = false;
    async function init() {
      setSyncStatus('syncing');
      try {
        const { data: rows } = await (supabase as any)
          .from('lan_tournaments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        let t: TournamentRow | null = null;
        if (rows && rows.length > 0) {
          t = rows[0];
        } else if (!readOnly) {
          const { data: newT, error } = await (supabase as any)
            .from('lan_tournaments')
            .insert({})
            .select()
            .single();
          if (error) throw error;
          t = newT;
        }
        if (cancelled) return;
        setTournament(t);

        if (t) {
          const { data: evts } = await (supabase as any)
            .from('lan_tournament_events')
            .select('*')
            .eq('tournament_id', t.id)
            .order('created_at', { ascending: true });
          if (!cancelled) setEvents((evts || []) as TournamentEvent[]);
        }

        const { data: teamData } = await (supabase as any).rpc('get_lan_registered_teams');
        if (!cancelled && teamData) {
          setTeams(
            teamData.map((r: any) => ({
              id: r.id,
              name: r.team_name,
              players: [r.player1, r.player2 || ''] as [string, string],
              playersAlive: [true, r.player2 ? true : false] as [boolean, boolean],
              killPoints: 0,
              placementPoints: 0,
              alive: true,
              gameKills: 0,
            })),
          );
        }

        if (!cancelled) {
          setSyncStatus('synced');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Tournament init error:', err);
        if (!cancelled) {
          setSyncStatus('offline');
          setIsLoading(false);
        }
      }
    }
    init();
    return () => { cancelled = true; };
  }, [readOnly]);

  // ── Realtime: tournament meta ──
  useEffect(() => {
    const ch = supabase
      .channel('lan-tournament-meta')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lan_tournaments' }, payload => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setTournament(payload.new as TournamentRow);
        }
      })
      .subscribe(status => {
        if (status === 'SUBSCRIBED') setSyncStatus('synced');
        else if (status === 'CHANNEL_ERROR') setSyncStatus('offline');
      });
    return () => { supabase.removeChannel(ch); };
  }, []);

  // ── Realtime: events ──
  useEffect(() => {
    if (!tournament?.id) return;
    const ch = supabase
      .channel(`lan-events-${tournament.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lan_tournament_events', filter: `tournament_id=eq.${tournament.id}` },
        payload => {
          if (payload.eventType === 'INSERT') {
            setEvents(prev =>
              prev.some(e => e.id === (payload.new as any).id)
                ? prev
                : [...prev, payload.new as TournamentEvent],
            );
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prev => prev.map(e => (e.id === (payload.new as any).id ? (payload.new as TournamentEvent) : e)));
          } else if (payload.eventType === 'DELETE') {
            setEvents(prev => prev.filter(e => e.id !== (payload.old as any).id));
          }
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [tournament?.id]);

  // ── Realtime: teams (lan_tournament_orders) ──
  useEffect(() => {
    const ch = supabase
      .channel('lan-orders-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lan_tournament_orders' }, async () => {
        const { data: teamData } = await (supabase as any).rpc('get_lan_registered_teams');
        if (teamData) {
          setTeams(prev => {
            const prevMap = new Map(prev.map(t => [t.id, t]));
            return teamData.map((r: any) => {
              const existing = prevMap.get(r.id);
              if (existing) {
                // Only update name/players, preserve game state
                return { ...existing, name: r.team_name, players: [r.player1, r.player2 || ''] as [string, string] };
              }
              return {
                id: r.id,
                name: r.team_name,
                players: [r.player1, r.player2 || ''] as [string, string],
                playersAlive: [true, r.player2 ? true : false] as [boolean, boolean],
                killPoints: 0,
                placementPoints: 0,
                alive: true,
                gameKills: 0,
              };
            });
          });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // ── Presence ──
  useEffect(() => {
    if (!tournament?.id || !userEmail || readOnly) return;
    const ch = supabase.channel(`lan-presence-${tournament.id}`);
    ch.on('presence', { event: 'sync' }, () => {
      const s = ch.presenceState();
      const list: ActiveAdmin[] = [];
      Object.values(s).forEach((arr: any) => {
        arr.forEach((p: any) => {
          if (!list.find(a => a.email === p.email)) list.push({ email: p.email, online_at: p.online_at });
        });
      });
      setActiveAdmins(list);
    }).subscribe(async status => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ email: userEmail, online_at: new Date().toISOString() });
      }
    });
    return () => { supabase.removeChannel(ch); };
  }, [tournament?.id, userEmail, readOnly]);

  // ── Computed state ──
  const state = useMemo(() => computeStateFromDB(tournament, events, teams), [tournament, events, teams]);

  // Sync to localStorage (backward compat for any remaining consumers)
  useEffect(() => {
    try { localStorage.setItem('lan-tournament-state', JSON.stringify(state)); } catch {}
  }, [state]);

  // ── Dispatch ──
  const dispatch = useCallback(
    (action: TournamentAction) => {
      if (readOnly) return;
      const run = async () => {
        const t = tournamentRef.current;
        if (!t) return;
        setSyncStatus('syncing');
        try {
          const { data: { user } } = await supabase.auth.getUser();
          const email = user?.email || 'unknown';
          const uid = user?.id || null;

          const insertEv = async (type: string, gn: number, data: Record<string, any>) => {
            const { error } = await (supabase as any).from('lan_tournament_events').insert({
              tournament_id: t.id,
              game_number: gn,
              event_type: type,
              event_data: data,
              admin_user_id: uid,
              admin_email: email,
            });
            if (error) throw error;
          };

          const updateT = async (u: Record<string, any>) => {
            const { error } = await (supabase as any).from('lan_tournaments').update(u).eq('id', t.id);
            if (error) throw error;
          };

          switch (action.type) {
            case 'START_TOURNAMENT': {
              if (t.status === 'active') { toast.error('Mót er nú þegar byrjað'); return; }
              await updateT({ status: 'active', current_game: 1, game_locked: false });
              await insertEv('tournament_start', 1, {});
              break;
            }
            case 'RESET_TOURNAMENT': {
              setEvents([]);
              await (supabase as any).from('lan_tournament_events').delete().eq('tournament_id', t.id);
              await updateT({ status: 'lobby', current_game: 0, game_locked: false, raffle_winners: [] });
              break;
            }
            case 'ELIMINATE_PLAYER': {
              if (t.game_locked) { toast.error('Leikur er læstur'); return; }
              await insertEv('player_eliminate', t.current_game, {
                victim_team_id: action.teamId,
                victim_player_index: action.playerIndex,
                killer_team_id: action.killerTeamId,
              });
              break;
            }
            case 'ELIMINATE_TEAM': {
              if (t.game_locked) { toast.error('Leikur er læstur'); return; }
              const team = teamsRef.current.find(tm => tm.id === action.teamId);
              await insertEv('player_eliminate', t.current_game, {
                victim_team_id: action.teamId,
                victim_player_index: 0,
                killer_team_id: action.killerTeamId,
              });
              // Only eliminate player 2 if they exist (not solo)
              if (team && team.players[1]) {
                await insertEv('player_eliminate', t.current_game, {
                  victim_team_id: action.teamId,
                  victim_player_index: 1,
                  killer_team_id: '__storm__',
                });
              }
              break;
            }
            case 'REVIVE_TEAM': {
              if (t.game_locked) { toast.error('Leikur er læstur'); return; }
              await insertEv('team_revive', t.current_game, { team_id: action.teamId });
              break;
            }
            case 'REVIVE_PLAYER': {
              if (t.game_locked) { toast.error('Leikur er læstur'); return; }
              await insertEv('player_revive', t.current_game, {
                team_id: action.teamId,
                player_index: action.playerIndex,
              });
              break;
            }
            case 'END_GAME': {
              if (t.status === 'finished') { toast.error('Mót er nú þegar lokið'); return; }
              const cs = computeStateFromDB(t, eventsRef.current, teamsRef.current);
              const aliveT = cs.teams.filter(x => x.alive);
              const elimT = cs.eliminationOrder.map(id => cs.teams.find(x => x.id === id)!).filter(Boolean);
              const ordered = [...aliveT, ...elimT.reverse()];
              const placements = ordered.map((team, i) => ({
                teamId: team.id,
                placement: i + 1,
                kills: team.gameKills,
                killPoints: team.gameKills * cs.killPointsPerKill,
                placementPoints: cs.placementPointsConfig[i] || 0,
              }));
              await insertEv('game_end', t.current_game, { gameNumber: t.current_game, placements });
              const fin = t.current_game >= 5;
              await updateT({
                status: fin ? 'finished' : 'active',
                current_game: fin ? t.current_game : t.current_game + 1,
                game_locked: false,
              });
              break;
            }
            case 'FINISH_TOURNAMENT': {
              await updateT({ status: 'finished' });
              break;
            }
            case 'UPDATE_PLACEMENT_CONFIG':
              await updateT({ placement_config: action.config });
              break;
            case 'UPDATE_KILL_POINTS':
              await updateT({ kill_points_per_kill: action.killPointsPerKill });
              break;
            case 'SET_RAFFLE_WINNERS':
              await updateT({ raffle_winners: action.winners });
              break;
            case 'SET_TEAMS':
              setTeams(action.teams);
              break;
            case 'REMOVE_TEAM':
              await insertEv('team_remove', 0, { team_id: action.teamId });
              break;
            case 'ADJUST_POINTS':
              await insertEv('points_adjust', t.current_game, {
                team_id: action.teamId,
                kill_points_delta: action.killPointsDelta,
                placement_points_delta: action.placementPointsDelta,
              });
              break;
            case 'OVERRIDE_GAME_SCORE':
              await insertEv('game_score_override', action.gameNumber, {
                team_id: action.teamId,
                game_number: action.gameNumber,
                kills: action.kills,
                kill_points: action.killPoints,
                placement_points: action.placementPoints,
              });
              break;
          }
          setSyncStatus('synced');
        } catch (err) {
          console.error('Dispatch error:', err);
          toast.error('Villa við aðgerð');
          setSyncStatus('offline');
          setTimeout(() => setSyncStatus('synced'), 3000);
        }
      };
      run();
    },
    [readOnly],
  );

  // ── Activity log ──
  const activityLog = useMemo(() => buildActivityLog(events, teams), [events, teams]);

  // ── Undo ──
  const canUndo = useMemo(
    () =>
      events.some(
        e => !e.undone && !['tournament_start', 'tournament_reset', 'game_end'].includes(e.event_type),
      ),
    [events],
  );

  const undoLastAction = useCallback(async () => {
    const evts = eventsRef.current;
    const last = [...evts]
      .filter(e => !e.undone && !['tournament_start', 'tournament_reset', 'game_end'].includes(e.event_type))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    if (!last) return;
    setSyncStatus('syncing');
    try {
      await (supabase as any).from('lan_tournament_events').update({ undone: true }).eq('id', last.id);
      setSyncStatus('synced');
      toast.success('Aðgerð afturkölluð');
    } catch {
      setSyncStatus('offline');
      toast.error('Villa við að afturkalla');
    }
  }, []);

  // ── Game lock ──
  const toggleGameLock = useCallback(async () => {
    const t = tournamentRef.current;
    if (!t) return;
    setSyncStatus('syncing');
    try {
      await (supabase as any).from('lan_tournaments').update({ game_locked: !t.game_locked }).eq('id', t.id);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('offline');
    }
  }, []);

  return {
    state,
    dispatch,
    syncStatus,
    activeAdmins,
    activityLog,
    undoLastAction,
    canUndo,
    gameLocked: tournament?.game_locked || false,
    toggleGameLock,
    tournamentId: tournament?.id || null,
    isLoading,
  };
}
