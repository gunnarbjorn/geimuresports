import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminAddRegistrationDialog } from "@/components/admin/AdminAddRegistrationDialog";
import { TournamentStatusManager } from "@/components/admin/TournamentStatusManager";
import { useTournamentStatuses } from "@/hooks/useTournamentStatuses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Trash2,
  Users,
  RefreshCw,
  Shield,
  Mail,
  Hash,
  Calendar,
  Loader2,
  ShieldAlert,
  Trophy,
  GraduationCap,
  Phone,
  User,
  Gamepad2,
  CreditCard,
  Pencil,
  ChevronDown,
  ExternalLink,
  Copy,
} from "lucide-react";

interface RegistrationData {
  teamName?: string;
  player1Name?: string;
  player2Name?: string;
  email?: string;
  orderId?: string;
  fullName?: string;
  teammateName?: string;
  fortniteName?: string;
  phone?: string;
  group?: string;
  age?: number;
  parentName?: string;
}

interface Registration {
  id: string;
  created_at: string;
  type: string;
  data: RegistrationData;
  verified?: boolean;
}

interface LanOrder {
  id: string;
  order_id: string;
  team_name: string;
  player1: string;
  player2: string;
  email: string;
  amount: number;
  status: string;
  paid_at: string | null;
  authorization_code: string | null;
  masked_card: string | null;
  pizza: boolean;
  created_at: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAdminAuth();
  const { getStatus } = useTournamentStatuses();
  const [tournamentRegs, setTournamentRegs] = useState<Registration[]>([]);
  const [trainingRegs, setTrainingRegs] = useState<Registration[]>([]);
  const [lanOrders, setLanOrders] = useState<LanOrder[]>([]);
  const [alltUndirRegs, setAlltUndirRegs] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<LanOrder | null>(null);
  const [editForm, setEditForm] = useState({ team_name: "", player1: "", player2: "", email: "" });
  const [editingAlltUndir, setEditingAlltUndir] = useState<Registration | null>(null);
  const [editAlltUndirForm, setEditAlltUndirForm] = useState({ fullName: "", fortniteName: "", gmail: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [lanRegsOpen, setLanRegsOpen] = useState(false);
  const [elkoRegsOpen, setElkoRegsOpen] = useState(false);
  const [alltUndirRegsOpen, setAlltUndirRegsOpen] = useState(false);
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const [tournamentRes, trainingRes, lanRes, alltUndirRes] = await Promise.all([
        supabase
          .from("registrations")
          .select("*")
          .eq("type", "elko-tournament")
          .order("created_at", { ascending: false }),
        supabase
          .from("registrations")
          .select("*")
          .eq("type", "training")
          .order("created_at", { ascending: false }),
        supabase
          .from("lan_tournament_orders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("registrations")
          .select("*")
          .like("type", "allt-undir-%")
          .order("created_at", { ascending: false }),
      ]);

      if (tournamentRes.error) {
        console.error("Error fetching tournament registrations:", tournamentRes.error);
        toast.error("Villa við að sækja mótskráningar");
      } else {
        setTournamentRegs(
          (tournamentRes.data || []).map((item: any) => ({
            id: item.id,
            created_at: item.created_at,
            type: item.type,
            data: item.data as RegistrationData,
          }))
        );
      }

      if (trainingRes.error) {
        console.error("Error fetching training registrations:", trainingRes.error);
        toast.error("Villa við að sækja æfingaskráningar");
      } else {
        setTrainingRegs(
          (trainingRes.data || []).map((item: any) => ({
            id: item.id,
            created_at: item.created_at,
            type: item.type,
            data: item.data as RegistrationData,
          }))
        );
      }

      if (lanRes.error) {
        console.error("Error fetching LAN orders:", lanRes.error);
        toast.error("Villa við að sækja LAN skráningar");
      } else {
        setLanOrders(lanRes.data as LanOrder[] || []);
      }

      if (alltUndirRes.error) {
        console.error("Error fetching Allt Undir registrations:", alltUndirRes.error);
      } else {
        setAlltUndirRegs(
          (alltUndirRes.data || []).map((item: any) => ({
            id: item.id,
            created_at: item.created_at,
            type: item.type,
            verified: item.verified,
            data: item.data as RegistrationData,
          }))
        );
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Villa kom upp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        toast.error("Villa við eyðingu skráningar");
        return;
      }

      toast.success("Skráningu eytt!");
      fetchRegistrations();
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error("Villa við eyðingu");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteLanOrder = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("lan_tournament_orders")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        toast.error("Villa við eyðingu LAN skráningar");
        return;
      }

      toast.success("LAN skráningu eytt!");
      fetchRegistrations();
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error("Villa við eyðingu");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditLanOrder = (order: LanOrder) => {
    setEditForm({
      team_name: order.team_name,
      player1: order.player1,
      player2: order.player2,
      email: order.email,
    });
    setEditingOrder(order);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("lan_tournament_orders")
        .update({
          team_name: editForm.team_name.trim(),
          player1: editForm.player1.trim(),
          player2: editForm.player2.trim(),
          email: editForm.email.trim(),
        })
        .eq("id", editingOrder.id);

      if (error) {
        console.error("Update error:", error);
        toast.error("Villa við uppfærslu");
        return;
      }

      toast.success("Skráning uppfærð!");
      setEditingOrder(null);
      fetchRegistrations();
    } catch (err) {
      console.error("Error updating:", err);
      toast.error("Villa við uppfærslu");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAlltUndir = (reg: Registration) => {
    setEditAlltUndirForm({
      fullName: reg.data.fullName || "",
      fortniteName: reg.data.fortniteName || "",
      gmail: reg.data.email || (reg.data as any).gmail || "",
    });
    setEditingAlltUndir(reg);
  };

  const handleSaveAlltUndirEdit = async () => {
    if (!editingAlltUndir) return;
    setIsSaving(true);
    try {
      const currentData = editingAlltUndir.data as any;
      const { error } = await supabase
        .from("registrations")
        .update({
          data: {
            ...currentData,
            fullName: editAlltUndirForm.fullName.trim(),
            fortniteName: editAlltUndirForm.fortniteName.trim(),
            gmail: editAlltUndirForm.gmail.trim(),
          },
        })
        .eq("id", editingAlltUndir.id);

      if (error) {
        console.error("Update error:", error);
        toast.error("Villa við uppfærslu");
        return;
      }

      toast.success("Skráning uppfærð!");
      setEditingAlltUndir(null);
      fetchRegistrations();
    } catch (err) {
      console.error("Error updating:", err);
      toast.error("Villa við uppfærslu");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations();
    }
  }, [isAdmin]);

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (user && !isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <Card>
                <CardContent className="pt-8 pb-8">
                  <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <h2 className="font-display text-xl font-bold mb-2">
                    Aðgangur bannaður
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Þú hefur ekki admin réttindi. Hafðu samband við kerfisstjóra.
                  </p>
                  <Button variant="outline" onClick={signOut}>
                    Útskrá
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const DeleteButton = ({ reg }: { reg: Registration }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={deletingId === reg.id}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eyða skráningu?</AlertDialogTitle>
          <AlertDialogDescription>
            Ertu viss um að þú viljir eyða skráningu{" "}
            <strong>{reg.data.teamName || reg.data.fullName || "Óþekkt"}</strong>?
            Þetta er ekki hægt að afturkalla.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hætta við</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(reg.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Eyða
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  Skráningar stjórnborð
                </h1>
                <p className="text-sm text-muted-foreground">
                  {user.email} · Admin
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="default"
                  onClick={() => navigate("/admin/lan-manager")}
                >
                  🎮 LAN Mótstjóri
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate("/admin/allt-undir-manager")}
                  className="bg-[hsl(var(--arena-green))] hover:bg-[hsl(var(--arena-green))]/90"
                >
                  🏆 Allt Undir Mótstjóri
                </Button>
                <AdminAddRegistrationDialog onAdded={fetchRegistrations} />
                <Button
                  variant="outline"
                  onClick={fetchRegistrations}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Uppfæra
                </Button>
                <Button variant="ghost" onClick={signOut}>
                  Útskrá
                </Button>
              </div>
            </div>

            {/* Tournament Status Manager */}
            <div className="mb-6">
              <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Mótstöður
              </h2>
              <TournamentStatusManager />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="lan" className="space-y-6">
              <TabsList>
                <TabsTrigger value="lan" className="gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  LAN ({lanOrders.length})
                </TabsTrigger>
                <TabsTrigger value="allt-undir" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Allt Undir ({alltUndirRegs.length})
                </TabsTrigger>
                <TabsTrigger value="tournament" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Elko ({tournamentRegs.length})
                </TabsTrigger>
                <TabsTrigger value="training" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Æfingar ({trainingRegs.length})
                </TabsTrigger>
                <TabsTrigger value="postur" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Póstur
                </TabsTrigger>
              </TabsList>

              {/* LAN Tab */}
              <TabsContent value="lan" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center shrink-0">
                          <Users className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{lanOrders.filter(o => o.status === "PAID").length}</p>
                          <p className="text-xs text-muted-foreground">Greidd lið</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <CreditCard className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{lanOrders.filter(o => o.status === "PENDING_PAYMENT").length}</p>
                          <p className="text-xs text-muted-foreground">Ógreitt</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {getStatus('arena-lan-coming-soon') === 'completed' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gamepad2 className="h-5 w-5" />
                        Fortnite Duos LAN
                        <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground ml-1">Lokið</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate('/keppa/arena-lan/nidurstodur')}>
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Sýna niðurstöður
                        </Button>
                      </div>
                      <Collapsible open={lanRegsOpen} onOpenChange={setLanRegsOpen}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ChevronDown className={`h-4 w-4 mr-1.5 transition-transform ${lanRegsOpen ? 'rotate-180' : ''}`} />
                            Sýna skráningar ({lanOrders.length})
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-8">#</TableHead>
                                  <TableHead>Lið</TableHead>
                                  <TableHead className="hidden md:table-cell">Spilarar</TableHead>
                                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                                  <TableHead>Staða</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {lanOrders.map((order, index) => (
                                  <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell className="font-medium text-sm">{order.team_name}</TableCell>
                                    <TableCell className="hidden md:table-cell text-sm">{order.player1} & {order.player2}</TableCell>
                                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{order.email}</TableCell>
                                    <TableCell>
                                      <Badge className={`text-[10px] ${order.status === "PAID" ? "bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))] border-[hsl(var(--arena-green)/0.3)]" : "bg-accent/10 text-accent border-accent/30"}`}>
                                        {order.status === "PAID" ? "Greitt" : "Ógreitt"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5" />
                      Fortnite Duos LAN – Skráningar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Hleður...
                      </div>
                    ) : lanOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Engar LAN skráningar ennþá
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-8">#</TableHead>
                              <TableHead>Lið</TableHead>
                              <TableHead className="hidden md:table-cell">Spilarar</TableHead>
                              <TableHead className="hidden lg:table-cell">Email</TableHead>
                              <TableHead className="hidden lg:table-cell">Order</TableHead>
                              <TableHead>🍕</TableHead>
                              <TableHead>Staða</TableHead>
                              <TableHead className="w-16"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {lanOrders.map((order, index) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs text-muted-foreground">{index + 1}</TableCell>
                                <TableCell>
                                  <div className="font-medium text-sm">{order.team_name}</div>
                                  <div className="text-xs text-muted-foreground md:hidden">{order.player1} & {order.player2}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-sm">
                                  {order.player1} & {order.player2}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{order.email}</TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <Badge variant="outline" className="font-mono text-[10px]">{order.order_id}</Badge>
                                </TableCell>
                                <TableCell className="text-center text-xs">
                                  {order.pizza ? "✅" : "—"}
                                </TableCell>
                                <TableCell>
                                  <Badge className={`text-[10px] ${
                                    order.status === "PAID"
                                      ? "bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))] border-[hsl(var(--arena-green)/0.3)]"
                                      : order.status === "PENDING_PAYMENT"
                                      ? "bg-accent/10 text-accent border-accent/30"
                                      : "bg-destructive/10 text-destructive border-destructive/30"
                                  }`}>
                                    {order.status === "PAID" ? "Greitt" : order.status === "PENDING_PAYMENT" ? "Ógreitt" : order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-0">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleEditLanOrder(order)}>
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" disabled={deletingId === order.id}>
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Eyða LAN skráningu?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Ertu viss um að þú viljir eyða skráningu <strong>{order.team_name}</strong>? Þetta er ekki hægt að afturkalla.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Hætta við</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteLanOrder(order.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Eyða
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                )}
              </TabsContent>

              {/* Allt Undir Tab */}
              <TabsContent value="allt-undir" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center shrink-0">
                          <Users className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{alltUndirRegs.filter(r => r.verified).length}</p>
                          <p className="text-xs text-muted-foreground">Greiddir leikmenn</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                          <CreditCard className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{alltUndirRegs.filter(r => !r.verified).length}</p>
                          <p className="text-xs text-muted-foreground">Ógreitt</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {getStatus('allt-undir') === 'completed' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Allt Undir – Solo
                        <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground ml-1">Lokið</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate('/keppa/allt-undir/nidurstodur')}>
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Sýna niðurstöður
                        </Button>
                      </div>
                      <Collapsible open={alltUndirRegsOpen} onOpenChange={setAlltUndirRegsOpen}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ChevronDown className={`h-4 w-4 mr-1.5 transition-transform ${alltUndirRegsOpen ? 'rotate-180' : ''}`} />
                            Sýna skráningar ({alltUndirRegs.length})
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">#</TableHead>
                                  <TableHead>Nafn</TableHead>
                                  <TableHead>Fortnite nafn</TableHead>
                                  <TableHead>Dagsetning</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {alltUndirRegs.map((reg, index) => (
                                  <TableRow key={reg.id}>
                                    <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{reg.data.fullName || "—"}</TableCell>
                                    <TableCell>{reg.data.fortniteName || "—"}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="text-xs">{reg.type.replace("allt-undir-", "")}</Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Allt Undir – Solo – Skráningar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Hleður...
                      </div>
                    ) : alltUndirRegs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Engar Allt Undir skráningar ennþá
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">#</TableHead>
                              <TableHead>Nafn</TableHead>
                              <TableHead>Fortnite nafn</TableHead>
                              <TableHead className="hidden lg:table-cell">Gmail</TableHead>
                              <TableHead>Dagsetning</TableHead>
                              <TableHead>Staða</TableHead>
                              <TableHead className="w-20"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {alltUndirRegs.map((reg, index) => (
                              <TableRow key={reg.id}>
                                <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    {reg.data.fullName || "—"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Gamepad2 className="h-3 w-3 text-muted-foreground" />
                                    {reg.data.fortniteName || "—"}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <div className="flex items-center gap-1 text-sm">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    {reg.data.email || (reg.data as any).gmail || "—"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {reg.type.replace("allt-undir-", "")}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`text-[10px] ${
                                    reg.verified
                                      ? "bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))] border-[hsl(var(--arena-green)/0.3)]"
                                      : "bg-accent/10 text-accent border-accent/30"
                                  }`}>
                                    {reg.verified ? "Greitt" : "Ógreitt"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-0">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleEditAlltUndir(reg)}>
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <DeleteButton reg={reg} />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                )}
              </TabsContent>

              {/* Tournament Tab */}
              <TabsContent value="tournament" className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Users className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{tournamentRegs.length}</p>
                          <p className="text-xs text-muted-foreground">Skráð lið</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Hash className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{50 - tournamentRegs.length}</p>
                          <p className="text-xs text-muted-foreground">Laus pláss</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tournament Table */}
                {getStatus('elko-deild-vor-2026') === 'completed' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Elko-deildin
                        <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground ml-1">Lokið</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate('/keppa/elko-deild/nidurstodur')}>
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Sýna niðurstöður
                        </Button>
                      </div>
                      <Collapsible open={elkoRegsOpen} onOpenChange={setElkoRegsOpen}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ChevronDown className={`h-4 w-4 mr-1.5 transition-transform ${elkoRegsOpen ? 'rotate-180' : ''}`} />
                            Sýna skráningar ({tournamentRegs.length})
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">#</TableHead>
                                  <TableHead>Lið</TableHead>
                                  <TableHead>Spilari 1</TableHead>
                                  <TableHead>Spilari 2</TableHead>
                                  <TableHead>Email</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {tournamentRegs.map((reg, index) => (
                                  <TableRow key={reg.id}>
                                    <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell className="font-medium">{reg.data.teamName || "Óþekkt lið"}</TableCell>
                                    <TableCell>{reg.data.player1Name || reg.data.fullName || "—"}</TableCell>
                                    <TableCell>{reg.data.player2Name || reg.data.teammateName || "—"}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{reg.data.email || "—"}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Elko-deildin – Skráningar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Hleður skráningum...
                      </div>
                    ) : tournamentRegs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Engar skráningar ennþá
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">#</TableHead>
                              <TableHead>Lið</TableHead>
                              <TableHead>Spilari 1</TableHead>
                              <TableHead>Spilari 2</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Skráð</TableHead>
                              <TableHead className="w-20">Eyða</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tournamentRegs.map((reg, index) => (
                              <TableRow key={reg.id}>
                                <TableCell className="font-mono text-muted-foreground">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {reg.data.teamName || "Óþekkt lið"}
                                </TableCell>
                                <TableCell>
                                  {reg.data.player1Name || reg.data.fullName || reg.data.fortniteName || "—"}
                                </TableCell>
                                <TableCell>
                                  {reg.data.player2Name || reg.data.teammateName || "—"}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    {reg.data.email || "—"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {reg.data.orderId || "—"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(reg.created_at).toLocaleDateString("is-IS")}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <DeleteButton reg={reg} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                )}
              </TabsContent>

              {/* Training Tab */}
              <TabsContent value="training" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Users className="h-5 w-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{trainingRegs.length}</p>
                          <p className="text-xs text-muted-foreground">Skráðir í æfingar</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Æfingaskráningar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Hleður skráningum...
                      </div>
                    ) : trainingRegs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Engar æfingaskráningar ennþá
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">#</TableHead>
                              <TableHead>Nafn</TableHead>
                              <TableHead>Hópur</TableHead>
                              <TableHead>Aldur</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Sími</TableHead>
                              <TableHead>Skráð</TableHead>
                              <TableHead className="w-20">Eyða</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {trainingRegs.map((reg, index) => (
                              <TableRow key={reg.id}>
                                <TableCell className="font-mono text-muted-foreground">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    {reg.data.fullName || "—"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">
                                    {reg.data.group || "—"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{reg.data.age || "—"}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    {reg.data.email || "—"}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    {reg.data.phone || "—"}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(reg.created_at).toLocaleDateString("is-IS")}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <DeleteButton reg={reg} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Póstur Tab */}
              <TabsContent value="postur" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Allir skráðir — Netfangalisti
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Aggregate all unique email entries
                      const entries: { name: string; email: string; tournament: string; date: string }[] = [];
                      const seen = new Set<string>();

                      lanOrders.forEach(o => {
                        const key = `${o.email.toLowerCase()}-lan`;
                        if (!seen.has(key)) {
                          seen.add(key);
                          entries.push({
                            name: o.team_name,
                            email: o.email,
                            tournament: "Fortnite DUO LAN",
                            date: new Date(o.created_at).toLocaleDateString("is-IS"),
                          });
                        }
                      });

                      alltUndirRegs.forEach(r => {
                        const em = r.data.email || (r.data as any).gmail || "";
                        const key = `${em.toLowerCase()}-allt-undir`;
                        if (em && !seen.has(key)) {
                          seen.add(key);
                          entries.push({
                            name: r.data.fullName || r.data.fortniteName || "—",
                            email: em,
                            tournament: "Allt Undir – Solo",
                            date: new Date(r.created_at).toLocaleDateString("is-IS"),
                          });
                        }
                      });

                      tournamentRegs.forEach(r => {
                        const em = r.data.email || "";
                        const key = `${em.toLowerCase()}-elko`;
                        if (em && !seen.has(key)) {
                          seen.add(key);
                          entries.push({
                            name: r.data.teamName || r.data.fullName || "—",
                            email: em,
                            tournament: "Elko-deildin",
                            date: new Date(r.created_at).toLocaleDateString("is-IS"),
                          });
                        }
                      });

                      trainingRegs.forEach(r => {
                        const em = r.data.email || "";
                        const key = `${em.toLowerCase()}-training`;
                        if (em && !seen.has(key)) {
                          seen.add(key);
                          entries.push({
                            name: r.data.fullName || "—",
                            email: em,
                            tournament: "Æfingar",
                            date: new Date(r.created_at).toLocaleDateString("is-IS"),
                          });
                        }
                      });

                      const uniqueEmails = [...new Set(entries.map(e => e.email.toLowerCase()))];

                      const handleCopyEmails = () => {
                        navigator.clipboard.writeText(uniqueEmails.join(", "));
                        toast.success(`${uniqueEmails.length} netföng afrituð!`);
                      };

                      return (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground">
                              {uniqueEmails.length} einstök netföng · {entries.length} skráningar
                            </p>
                            <Button variant="outline" size="sm" onClick={handleCopyEmails}>
                              <Copy className="h-3.5 w-3.5 mr-1.5" />
                              Afrita öll netföng
                            </Button>
                          </div>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-8">#</TableHead>
                                  <TableHead>Nafn</TableHead>
                                  <TableHead>Netfang</TableHead>
                                  <TableHead>Mót</TableHead>
                                  <TableHead>Dagsetning</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {entries.map((entry, i) => (
                                  <TableRow key={`${entry.email}-${i}`}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                                    <TableCell className="font-medium text-sm">{entry.name}</TableCell>
                                    <TableCell className="text-sm">{entry.email}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="text-xs">{entry.tournament}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{entry.date}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit LAN Order Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={(open) => !open && setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Breyta skráningu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-team">Liðsheiti</Label>
              <Input id="edit-team" value={editForm.team_name} onChange={(e) => setEditForm(f => ({ ...f, team_name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-p1">Spilari 1</Label>
                <Input id="edit-p1" value={editForm.player1} onChange={(e) => setEditForm(f => ({ ...f, player1: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="edit-p2">Spilari 2</Label>
                <Input id="edit-p2" value={editForm.player2} onChange={(e) => setEditForm(f => ({ ...f, player2: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-email">Netfang</Label>
              <Input id="edit-email" type="email" value={editForm.email} onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingOrder(null)}>Hætta við</Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Vista...</> : "Vista breytingar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Allt Undir Dialog */}
      <Dialog open={!!editingAlltUndir} onOpenChange={(open) => !open && setEditingAlltUndir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Breyta Allt Undir skráningu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-au-name">Fullt nafn</Label>
              <Input id="edit-au-name" value={editAlltUndirForm.fullName} onChange={(e) => setEditAlltUndirForm(f => ({ ...f, fullName: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="edit-au-fortnite">Fortnite nafn</Label>
              <Input id="edit-au-fortnite" value={editAlltUndirForm.fortniteName} onChange={(e) => setEditAlltUndirForm(f => ({ ...f, fortniteName: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="edit-au-gmail">Gmail</Label>
              <Input id="edit-au-gmail" type="email" value={editAlltUndirForm.gmail} onChange={(e) => setEditAlltUndirForm(f => ({ ...f, gmail: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAlltUndir(null)}>Hætta við</Button>
            <Button onClick={handleSaveAlltUndirEdit} disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Vista...</> : "Vista breytingar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminPage;
