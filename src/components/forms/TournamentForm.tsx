import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { tournaments, Tournament } from "@/data/tournaments";
import { supabase } from "@/integrations/supabase/client";

const tournamentSchema = z.object({
  fullName: z.string().min(2, "Nafn verður að vera að minnsta kosti 2 stafir").max(100),
  epicName: z.string().min(3, "Epic nafn verður að vera að minnsta kosti 3 stafir").max(50),
  email: z.string().email("Ógilt netfang").max(255),
  phone: z.string().min(7, "Símanúmer verður að vera að minnsta kosti 7 tölustafir").max(20),
  tournamentId: z.string().min(1, "Vinsamlegast veldu mót"),
  category: z.enum(["Solo", "Duo", "Squad", "LAN"]),
  teammates: z.string().max(200).optional(),
});

type TournamentFormData = z.infer<typeof tournamentSchema>;

interface TournamentFormProps {
  preselectedTournament?: Tournament;
}

export function TournamentForm({ preselectedTournament }: TournamentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    preselectedTournament?.category || ""
  );

  // Filter out coming soon tournaments for the form
  const availableTournaments = tournaments.filter(t => !t.isComingSoon);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      tournamentId: preselectedTournament?.id || "",
      category: preselectedTournament?.category,
    },
  });

  const watchCategory = watch("category");

  const onSubmit = async (data: TournamentFormData) => {
    setIsSubmitting(true);
    try {
      const tournament = tournaments.find(t => t.id === data.tournamentId);
      
      const { error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "tournament",
          data: {
            fullName: data.fullName,
            epicName: data.epicName,
            email: data.email,
            phone: data.phone,
            tournament: tournament?.name || data.tournamentId,
            tournamentDate: tournament?.dates.join(', ') || "",
            category: data.category,
            teammates: data.teammates || "",
          },
          _hp: honeypot,
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      // Google Ads conversion event
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-17945729107/bT1DCTTfhcEnOmw01C',
        });
      }
      toast.success("Skráning tókst!", {
        description: "Þú ert nú skráð/ur í mótið.",
      });
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Villa kom upp", {
        description: "Vinsamlegast reyndu aftur síðar.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold mb-2">Skráning staðfest!</h3>
        <p className="text-muted-foreground mb-6">
          Þú færð staðfestingu í tölvupósti. Gangi þér vel í mótinu!
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Skrá annan keppanda
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot - hidden from humans */}
      <div className="absolute opacity-0 -z-10" aria-hidden="true" tabIndex={-1}>
        <input
          type="text"
          name="website_url"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Fullt nafn *</Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="Jón Jónsson"
            className="bg-secondary border-border"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="epicName">Epic / Fortnite notendanafn *</Label>
          <Input
            id="epicName"
            {...register("epicName")}
            placeholder="EpicGamer123"
            className="bg-secondary border-border"
          />
          {errors.epicName && (
            <p className="text-sm text-destructive">{errors.epicName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Netfang *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="jon@example.is"
            className="bg-secondary border-border"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Símanúmer *</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="555-1234"
            className="bg-secondary border-border"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tournamentId">Veldu mót *</Label>
          <Select 
            defaultValue={preselectedTournament?.id}
            onValueChange={(value) => {
              setValue("tournamentId", value);
              const tournament = availableTournaments.find(t => t.id === value);
              if (tournament) {
                setValue("category", tournament.category);
                setSelectedCategory(tournament.category);
              }
            }}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Veldu mót" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {availableTournaments.map((tournament) => (
                <SelectItem key={tournament.id} value={tournament.id}>
                  {tournament.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tournamentId && (
            <p className="text-sm text-destructive">{errors.tournamentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Flokkur *</Label>
          <Select 
            value={selectedCategory}
            onValueChange={(value) => {
              setValue("category", value as "Solo" | "Duo" | "Squad" | "LAN");
              setSelectedCategory(value);
            }}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Veldu flokk" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="Solo">Solo</SelectItem>
              <SelectItem value="Duo">Duo</SelectItem>
              <SelectItem value="Squad">Squad</SelectItem>
              <SelectItem value="LAN">LAN</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>
      </div>

      {(watchCategory === "Duo" || watchCategory === "Squad") && (
        <div className="space-y-2">
          <Label htmlFor="teammates">
            Liðsfélagar (Epic nöfn, aðskilin með kommu)
          </Label>
          <Input
            id="teammates"
            {...register("teammates")}
            placeholder="Player2, Player3, Player4"
            className="bg-secondary border-border"
          />
          <p className="text-xs text-muted-foreground">
            {watchCategory === "Duo" 
              ? "Sláðu inn Epic nafn liðsfélaga þíns" 
              : "Sláðu inn Epic nöfn liðsfélaga (allt að 3)"}
          </p>
          {errors.teammates && (
            <p className="text-sm text-destructive">{errors.teammates.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full btn-primary-gradient"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sendi...
          </>
        ) : (
          "Staðfesta skráningu"
        )}
      </Button>
    </form>
  );
}
