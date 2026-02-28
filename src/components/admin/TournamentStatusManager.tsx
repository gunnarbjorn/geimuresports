import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tournaments } from "@/data/tournaments";
import { useTournamentStatuses, type TournamentStatus } from "@/hooks/useTournamentStatuses";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trophy, Loader2, Lock, Unlock, Eye, EyeOff } from "lucide-react";

const StatusBadge = ({ status }: { status: TournamentStatus }) => {
  if (status === 'upcoming') return <Badge className="text-xs bg-yellow-500/15 text-yellow-500 border-yellow-500/30">Væntanlegt</Badge>;
  if (status === 'completed') return <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">Lokið</Badge>;
  return <Badge className="text-xs bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))] border-[hsl(var(--arena-green)/0.3)]">Virkt</Badge>;
};

export function TournamentStatusManager() {
  const { statuses, isLoading, getStatus, updateStatus } = useTournamentStatuses();
  const [updating, setUpdating] = useState<string | null>(null);
  const allTournaments = tournaments;

  const handleStatusChange = async (id: string, newStatus: TournamentStatus) => {
    setUpdating(id);
    await updateStatus(id, newStatus);
    setUpdating(null);
  };

  const byStatus = (s: TournamentStatus) => allTournaments.filter(t => getStatus(t.id) === s);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        Hleður mótstöðu...
      </div>
    );
  }

  const TournamentCard = ({ t }: { t: typeof allTournaments[0] }) => {
    const status = getStatus(t.id);
    const isUpdating = updating === t.id;

    return (
      <Card key={t.id}>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display text-base font-bold truncate">{t.name}</h3>
                <StatusBadge status={status} />
                {t.hidden && <Badge variant="outline" className="text-[10px]">Falið</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{t.category} · {t.location}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {status === 'upcoming' && (
                <Button
                  size="sm"
                  className="bg-[hsl(var(--arena-green))] hover:bg-[hsl(var(--arena-green))]/90 text-primary-foreground"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(t.id, 'active')}
                >
                  {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3 mr-1" />}
                  Birta mót
                </Button>
              )}
              {status === 'active' && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(t.id, 'upcoming')}
                  >
                    {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    Taka af lofti
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Lock className="h-3 w-3 mr-1" />}
                        Loka móti
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Loka móti?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Ertu viss? Þetta lokar skráningu og móti <strong>{t.name}</strong>. Mótið færist í „Lokið" flipa.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hætta við</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleStatusChange(t.id, 'completed')}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Já, loka móti
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
              {status === 'completed' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(t.id, 'active')}
                >
                  {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                  Endurvirkja
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Mótstöður
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Virk ({byStatus('active').length})</TabsTrigger>
            <TabsTrigger value="upcoming">Væntanleg ({byStatus('upcoming').length})</TabsTrigger>
            <TabsTrigger value="completed">Lokið ({byStatus('completed').length})</TabsTrigger>
          </TabsList>

          {(['active', 'upcoming', 'completed'] as TournamentStatus[]).map(s => (
            <TabsContent key={s} value={s} className="space-y-3">
              {byStatus(s).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Engin mót með þessa stöðu.
                </p>
              ) : (
                byStatus(s).map(t => <TournamentCard key={t.id} t={t} />)
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
