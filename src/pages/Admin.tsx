import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminAddRegistrationDialog } from "@/components/admin/AdminAddRegistrationDialog";
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
  created_at: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAdminAuth();
  const [tournamentRegs, setTournamentRegs] = useState<Registration[]>([]);
  const [trainingRegs, setTrainingRegs] = useState<Registration[]>([]);
  const [lanOrders, setLanOrders] = useState<LanOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const [tournamentRes, trainingRes, lanRes] = await Promise.all([
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
              <div className="flex gap-2">
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

            {/* Tabs */}
            <Tabs defaultValue="lan" className="space-y-6">
              <TabsList>
                <TabsTrigger value="lan" className="gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  LAN ({lanOrders.length})
                </TabsTrigger>
                <TabsTrigger value="tournament" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Elko ({tournamentRegs.length})
                </TabsTrigger>
                <TabsTrigger value="training" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Æfingar ({trainingRegs.length})
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
                              <TableHead className="w-12">#</TableHead>
                              <TableHead>Lið</TableHead>
                              <TableHead>Spilari 1</TableHead>
                              <TableHead>Spilari 2</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Staða</TableHead>
                              <TableHead>Skráð</TableHead>
                              <TableHead className="w-20">Eyða</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {lanOrders.map((order, index) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                                <TableCell className="font-medium">{order.team_name}</TableCell>
                                <TableCell>{order.player1}</TableCell>
                                <TableCell>{order.player2}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    {order.email}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-mono text-xs">{order.order_id}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={
                                    order.status === "PAID"
                                      ? "bg-[hsl(var(--arena-green)/0.15)] text-[hsl(var(--arena-green))] border-[hsl(var(--arena-green)/0.3)]"
                                      : order.status === "PENDING_PAYMENT"
                                      ? "bg-accent/10 text-accent border-accent/30"
                                      : "bg-destructive/10 text-destructive border-destructive/30"
                                  }>
                                    {order.status === "PAID" ? "Greitt" : order.status === "PENDING_PAYMENT" ? "Ógreitt" : order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(order.created_at).toLocaleDateString("is-IS")}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={deletingId === order.id}>
                                        <Trash2 className="h-4 w-4" />
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
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
