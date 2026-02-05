import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
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
  CheckCircle,
  XCircle,
  Loader2,
  ShieldAlert,
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
}

interface Registration {
  id: string;
  created_at: string;
  type: string;
  data: RegistrationData;
  verified: boolean;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAdminAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      // RLS policy ensures only admins can SELECT from registrations
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("type", "elko-tournament")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching registrations:", error);
        toast.error("Villa við að sækja skráningar");
        return;
      }

      const typedData: Registration[] = (data || []).map((item: any) => ({
        id: item.id,
        created_at: item.created_at,
        type: item.type,
        data: item.data as RegistrationData,
        verified: item.verified ?? false,
      }));
      setRegistrations(typedData);
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
      // Direct delete via Supabase client — RLS policy authorizes admin
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

  const handleToggleVerified = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      // Direct update via Supabase client — RLS policy authorizes admin
      const { error } = await supabase
        .from("registrations")
        .update({ verified: !currentStatus } as any)
        .eq("id", id);

      if (error) {
        console.error("Update error:", error);
        toast.error("Villa við uppfærslu");
        return;
      }

      toast.success(
        currentStatus ? "Staðfesting afturkölluð" : "Skráning staðfest!"
      );
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, verified: !currentStatus } : r
        )
      );
    } catch (err) {
      console.error("Error:", err);
      toast.error("Villa kom upp");
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations();
    }
  }, [isAdmin]);

  // Loading state
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  // Authenticated but not admin
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

  // Not logged in (redirect effect should handle this)
  if (!user) return null;

  const verifiedCount = registrations.filter((r) => r.verified).length;

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

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {registrations.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Heildar</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center shrink-0">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{verifiedCount}</p>
                      <p className="text-xs text-muted-foreground">Staðfest</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <XCircle className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {registrations.length - verifiedCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Óstaðfest</p>
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
                      <p className="text-2xl font-bold">
                        {50 - verifiedCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Laus pláss</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registrations Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Allar skráningar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Hleður skráningum...
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Engar skráningar ennþá
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead className="w-16">Staða</TableHead>
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
                        {registrations.map((reg, index) => (
                          <TableRow
                            key={reg.id}
                            className={!reg.verified ? "opacity-60" : ""}
                          >
                            <TableCell className="font-mono text-muted-foreground">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={
                                  reg.verified
                                    ? "text-[hsl(var(--arena-green))] hover:text-[hsl(var(--arena-green))]"
                                    : "text-muted-foreground"
                                }
                                disabled={togglingId === reg.id}
                                onClick={() =>
                                  handleToggleVerified(reg.id, reg.verified)
                                }
                                title={
                                  reg.verified
                                    ? "Afturkalla staðfestingu"
                                    : "Staðfesta skráningu"
                                }
                              >
                                {togglingId === reg.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : reg.verified ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="font-medium">
                              {reg.data.teamName || "Óþekkt lið"}
                            </TableCell>
                            <TableCell>
                              {reg.data.player1Name ||
                                reg.data.fullName ||
                                reg.data.fortniteName ||
                                "—"}
                            </TableCell>
                            <TableCell>
                              {reg.data.player2Name ||
                                reg.data.teammateName ||
                                "—"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                {reg.data.email || "—"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="font-mono text-xs"
                              >
                                {reg.data.orderId || "—"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(reg.created_at).toLocaleDateString(
                                  "is-IS"
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
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
                                    <AlertDialogTitle>
                                      Eyða skráningu?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Ertu viss um að þú viljir eyða skráningu
                                      liðsins{" "}
                                      <strong>
                                        {reg.data.teamName || "Óþekkt"}
                                      </strong>
                                      ? Þetta er ekki hægt að afturkalla.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Hætta við
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(reg.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
