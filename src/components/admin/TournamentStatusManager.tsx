import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Loader2, Lock, Eye, EyeOff, ExternalLink, Gamepad2 } from "lucide-react";

const StatusBadge = ({ status }: { status: TournamentStatus }) => {
  if (status === 'upcoming') return <Badge className="text-xs bg-yellow-500/15 text-yellow-500 border-yellow-500/30">Væntanlegt</Badge>;
  if (status === 'completed') return <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">Lokið</Badge>;
  return <Badge className="text-xs bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))] border-[hsl(var(--arena-green)/0.3)]">Virkt</Badge>;
};

const MANAGER_ROUTES: Record<string, string> = {
  'arena-lan-coming-soon': '/admin/lan-manager',
  'allt-undir': '/admin/allt-undir-manager',
};

export function TournamentStatusManager() {
  const navigate = useNavigate();
  const { statuses, isLoading, getStatus, updateStatus, updateVisibility, isVisible } = useTournamentStatuses();
  const [updating, setUpdating] = useState<string | null>(null);
  const allTournaments = tournaments;

  const handleStatusChange = async (id: string, newStatus: TournamentStatus) => {
    setUpdating(id);
    await updateStatus(id, newStatus);
    setUpdating(null);
  };

  const handleVisibilityChange = async (id: string, visible: boolean) => {
    setUpdating(id);
    await updateVisibility(id, visible);
    setUpdating(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        Hleður mótstöðu...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allTournaments.map(t => {
        const status = getStatus(t.id);
        const visible = isVisible(t.id);
        const isUpdating = updating === t.id;
        const managerRoute = MANAGER_ROUTES[t.id];

        return (
          <Card key={t.id}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-display text-base font-bold">{t.name}</h3>
                    <StatusBadge status={status} />
                    <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                    {!visible && <Badge variant="outline" className="text-[10px]">Falið</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{t.location} · {t.dates.join(", ")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  {managerRoute && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(managerRoute)}
                    >
                      <Gamepad2 className="h-3 w-3 mr-1" />
                      Fara í stjórnun
                    </Button>
                  )}
                  {status === 'upcoming' && (
                    <Button
                      size="sm"
                      className="bg-[hsl(var(--arena-green))] hover:bg-[hsl(var(--arena-green))]/90 text-primary-foreground"
                      disabled={isUpdating}
                      onClick={async () => {
                        await handleVisibilityChange(t.id, true);
                        await handleStatusChange(t.id, 'active');
                      }}
                    >
                      {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3 mr-1" />}
                      Birta mót
                    </Button>
                  )}
                  {status === 'active' && (
                    <>
                      {!visible && (
                        <Button
                          size="sm"
                          className="bg-[hsl(var(--arena-green))] hover:bg-[hsl(var(--arena-green))]/90 text-primary-foreground"
                          disabled={isUpdating}
                          onClick={() => handleVisibilityChange(t.id, true)}
                        >
                          {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3 mr-1" />}
                          Birta mót
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => {
                          handleVisibilityChange(t.id, false);
                          handleStatusChange(t.id, 'upcoming');
                        }}
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
                    </>
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
      })}
    </div>
  );
}
