import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  Lock, 
  Trash2, 
  Users, 
  RefreshCw,
  Shield,
  Mail,
  Hash,
  Calendar,
} from "lucide-react";

// Simple password protection - change this to a secure password
const ADMIN_PASSWORD = "geimur2026";

interface RegistrationData {
  teamName?: string;
  player1Name?: string;
  player2Name?: string;
  email?: string;
  orderId?: string;
  // Legacy fields
  fullName?: string;
  teammateName?: string;
  fortniteName?: string;
  phone?: string;
  discordUserId?: string;
  epicId?: string;
  kennitala?: string;
}

interface Registration {
  id: string;
  created_at: string;
  type: string;
  data: RegistrationData;
}

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Check if already authenticated in session
  useEffect(() => {
    const stored = sessionStorage.getItem("admin-auth");
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin-auth", "true");
      toast.success("Innskráning tókst!");
    } else {
      toast.error("Rangt lykilorð");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin-auth");
    setPassword("");
  };

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
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

      // Cast the data to our Registration type
      const typedData: Registration[] = (data || []).map((item) => ({
        id: item.id,
        created_at: item.created_at,
        type: item.type,
        data: item.data as RegistrationData,
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
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "admin-delete-registration",
          data: { registrationId: id },
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Villa við eyðingu skráningar");
        return;
      }

      if (data?.error) {
        console.error("Delete error:", data.error);
        toast.error("Villa við eyðingu", { description: data.error });
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  // Login screen
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Admin aðgangur</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Lykilorð</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sláðu inn lykilorð"
                        className="bg-secondary"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Skrá inn
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Admin dashboard
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
                <p className="text-muted-foreground">
                  Skoða og stjórna skráningum á Elko deildina
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={fetchRegistrations}
                  disabled={isLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Uppfæra
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Útskrá
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                      <Users className="h-6 w-6 text-[hsl(var(--arena-green))]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{registrations.length}</p>
                      <p className="text-sm text-muted-foreground">Skráð lið</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{registrations.length * 2}</p>
                      <p className="text-sm text-muted-foreground">Keppendur</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Hash className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{50 - registrations.length}</p>
                      <p className="text-sm text-muted-foreground">Laus pláss</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registrations Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Allar skráningar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
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
                          <TableHead>Lið</TableHead>
                          <TableHead>Spilari 1</TableHead>
                          <TableHead>Spilari 2</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Skráð</TableHead>
                          <TableHead className="w-20">Aðgerðir</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrations.map((reg, index) => (
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
                                      Ertu viss um að þú viljir eyða skráningu liðsins{" "}
                                      <strong>{reg.data.teamName || "Óþekkt"}</strong>?
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
