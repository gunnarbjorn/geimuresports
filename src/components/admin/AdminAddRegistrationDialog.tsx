import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

interface AdminAddRegistrationDialogProps {
  onAdded: () => void;
}

type RegType = "elko-tournament" | "training" | "lan-tournament" | "allt-undir";

export function AdminAddRegistrationDialog({ onAdded }: AdminAddRegistrationDialogProps) {
  const [open, setOpen] = useState(false);
  const [regType, setRegType] = useState<RegType>("lan-tournament");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shared fields
  const [email, setEmail] = useState("");

  // Duo fields (LAN / Elko)
  const [teamName, setTeamName] = useState("");
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [orderId, setOrderId] = useState("");
  const [lanPizza, setLanPizza] = useState(false);

  // Solo fields (Allt Undir)
  const [fullName, setFullName] = useState("");
  const [fortniteName, setFortniteName] = useState("");
  const [alltUndirDate, setAlltUndirDate] = useState("2026-03-05");

  // Training fields
  const [age, setAge] = useState("");
  const [group, setGroup] = useState("");
  const [phone, setPhone] = useState("");

  const resetForm = () => {
    setEmail("");
    setTeamName("");
    setPlayer1Name("");
    setPlayer2Name("");
    setOrderId("");
    setLanPizza(false);
    setFullName("");
    setFortniteName("");
    setAlltUndirDate("2026-03-05");
    setAge("");
    setGroup("");
    setPhone("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (regType === "lan-tournament") {
        if (!teamName || !player1Name || !email) {
          toast.error("Fylltu út alla nauðsynlega reiti");
          setIsSubmitting(false);
          return;
        }
        const amount = 8880 + (lanPizza ? 2000 : 0);
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const adminOrderId = `LAN${Array.from({ length: 9 }, () =>
          chars.charAt(Math.floor(Math.random() * chars.length)),
        ).join("")}`;

        const { error } = await supabase.from("lan_tournament_orders").insert({
          team_name: teamName,
          player1: player1Name,
          player2: player2Name || player1Name,
          email,
          pizza: lanPizza,
          amount,
          order_id: adminOrderId,
          status: "PAID" as const,
          paid_at: new Date().toISOString(),
        });
        if (error) {
          console.error("Insert error:", error);
          toast.error("Villa við skráningu");
          setIsSubmitting(false);
          return;
        }
        toast.success("LAN skráning bætt við!");
      } else if (regType === "allt-undir") {
        if (!fortniteName || !email) {
          toast.error("Fylltu út Fortnite nafn og email");
          setIsSubmitting(false);
          return;
        }
        const { error } = await supabase.from("registrations").insert({
          type: `allt-undir-${alltUndirDate}`,
          data: {
            fullName: fullName || fortniteName,
            fortniteName,
            email,
          } as any,
          verified: true,
        });
        if (error) {
          console.error("Insert error:", error);
          toast.error("Villa við skráningu");
          setIsSubmitting(false);
          return;
        }
        toast.success("Allt Undir skráning bætt við!");
      } else if (regType === "elko-tournament") {
        if (!teamName || !player1Name || !player2Name || !email) {
          toast.error("Fylltu út alla nauðsynlega reiti");
          setIsSubmitting(false);
          return;
        }
        const { error } = await supabase.from("registrations").insert({
          type: "elko-tournament",
          data: { teamName, player1Name, player2Name, email, orderId: orderId || "Admin-skráning" } as any,
        });
        if (error) {
          console.error("Insert error:", error);
          toast.error("Villa við skráningu");
          setIsSubmitting(false);
          return;
        }
        toast.success("Elko skráning bætt við!");
      } else {
        // Training
        if (!fullName || !email || !group) {
          toast.error("Fylltu út alla nauðsynlega reiti");
          setIsSubmitting(false);
          return;
        }
        const { error } = await supabase.from("registrations").insert({
          type: "training",
          data: {
            fullName,
            age: age ? Number(age) : undefined,
            email,
            phone,
            group,
          } as any,
        });
        if (error) {
          console.error("Insert error:", error);
          toast.error("Villa við skráningu");
          setIsSubmitting(false);
          return;
        }
        toast.success("Æfingaskráning bætt við!");
      }

      resetForm();
      setOpen(false);
      onAdded();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Villa kom upp");
    } finally {
      setIsSubmitting(false);
    }
  };

  const alltUndirDates = [
    { value: "2026-03-05", label: "5. mars" },
    { value: "2026-03-12", label: "12. mars" },
    { value: "2026-03-19", label: "19. mars" },
    { value: "2026-03-26", label: "26. mars" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Bæta við skráningu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ný skráning</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tegund</Label>
            <Select value={regType} onValueChange={(v) => setRegType(v as RegType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lan-tournament">Fortnite DUO LAN</SelectItem>
                <SelectItem value="allt-undir">Allt Undir – Solo</SelectItem>
                <SelectItem value="elko-tournament">Elko-deildin – Duos</SelectItem>
                <SelectItem value="training">Æfingar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {regType === "lan-tournament" && (
            <>
              <div className="space-y-2">
                <Label>Nafn liðs *</Label>
                <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Geimur" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Spilari 1 *</Label>
                  <Input value={player1Name} onChange={(e) => setPlayer1Name(e.target.value)} placeholder="Fortnite nafn" />
                </div>
                <div className="space-y-2">
                  <Label>Spilari 2</Label>
                  <Input value={player2Name} onChange={(e) => setPlayer2Name(e.target.value)} placeholder="Autt ef einn" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.is" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lan-pizza" checked={lanPizza} onCheckedChange={(v) => setLanPizza(v === true)} />
                <Label htmlFor="lan-pizza">Pizza (+2.000 kr)</Label>
              </div>
            </>
          )}

          {regType === "allt-undir" && (
            <>
              <div className="space-y-2">
                <Label>Fortnite notandanafn *</Label>
                <Input value={fortniteName} onChange={(e) => setFortniteName(e.target.value)} placeholder="EpicGamer123" />
              </div>
              <div className="space-y-2">
                <Label>Fullt nafn</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jón Jónsson" />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.is" />
              </div>
              <div className="space-y-2">
                <Label>Dagsetning</Label>
                <Select value={alltUndirDate} onValueChange={setAlltUndirDate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alltUndirDates.map(d => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {regType === "elko-tournament" && (
            <>
              <div className="space-y-2">
                <Label>Nafn liðs *</Label>
                <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Geimur" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Spilari 1 *</Label>
                  <Input value={player1Name} onChange={(e) => setPlayer1Name(e.target.value)} placeholder="Fortnite nafn" />
                </div>
                <div className="space-y-2">
                  <Label>Spilari 2 *</Label>
                  <Input value={player2Name} onChange={(e) => setPlayer2Name(e.target.value)} placeholder="Fortnite nafn" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.is" />
              </div>
              <div className="space-y-2">
                <Label>Order ID</Label>
                <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Valfrjálst" />
              </div>
            </>
          )}

          {regType === "training" && (
            <>
              <div className="space-y-2">
                <Label>Fullt nafn *</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jón Jónsson" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Aldur</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="12" />
                </div>
                <div className="space-y-2">
                  <Label>Hópur *</Label>
                  <Select value={group} onValueChange={setGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Veldu hóp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nýliðar">Nýliðar</SelectItem>
                      <SelectItem value="Framhald">Framhald</SelectItem>
                      <SelectItem value="Foreldri + barn">Foreldri + barn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Netfang *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.is" />
              </div>
              <div className="space-y-2">
                <Label>Símanúmer</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555-1234" />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vista...
              </>
            ) : (
              "Vista skráningu"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
