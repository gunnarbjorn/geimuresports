import { useState } from "react";
import { Button } from "@/components/ui/button";
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

type RegType = "elko-tournament" | "training";

export function AdminAddRegistrationDialog({ onAdded }: AdminAddRegistrationDialogProps) {
  const [open, setOpen] = useState(false);
  const [regType, setRegType] = useState<RegType>("elko-tournament");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tournament fields
  const [teamName, setTeamName] = useState("");
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");

  // Training fields
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [group, setGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [trainingEmail, setTrainingEmail] = useState("");

  const resetForm = () => {
    setTeamName("");
    setPlayer1Name("");
    setPlayer2Name("");
    setEmail("");
    setOrderId("");
    setFullName("");
    setAge("");
    setGroup("");
    setPhone("");
    setTrainingEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let data: Record<string, unknown>;

      if (regType === "elko-tournament") {
        if (!teamName || !player1Name || !player2Name || !email) {
          toast.error("Fylltu út alla nauðsynlega reiti");
          setIsSubmitting(false);
          return;
        }
        data = { teamName, player1Name, player2Name, email, orderId: orderId || "Admin-skráning" };
      } else {
        if (!fullName || !trainingEmail || !group) {
          toast.error("Fylltu út alla nauðsynlega reiti");
          setIsSubmitting(false);
          return;
        }
        data = {
          fullName,
          age: age ? Number(age) : undefined,
          email: trainingEmail,
          phone,
          group,
        };
      }

      const { error } = await supabase.from("registrations").insert({
        type: regType,
        data: data as any,
      });

      if (error) {
        console.error("Insert error:", error);
        toast.error("Villa við skráningu");
        return;
      }

      toast.success("Skráning bætt við!");
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
                <SelectItem value="elko-tournament">Mót (Elko-deildin)</SelectItem>
                <SelectItem value="training">Æfingar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {regType === "elko-tournament" ? (
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
          ) : (
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
                <Input type="email" value={trainingEmail} onChange={(e) => setTrainingEmail(e.target.value)} placeholder="email@example.is" />
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
