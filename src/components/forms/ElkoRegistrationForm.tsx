import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  Loader2, 
  CheckCircle, 
  CreditCard,
  ClipboardList,
  PartyPopper,
  ExternalLink,
  Users,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const TOURNAMENT_DATE = "28. febrúar 2026";
const TOURNAMENT_NAME = "Fortnite Duos LAN";

const elkoFormSchema = z.object({
  teamName: z.string().trim().min(2, "Nafn liðs verður að vera að minnsta kosti 2 stafir").max(50),
  player1Name: z.string().trim().min(2, "Fortnite nafn verður að vera að minnsta kosti 2 stafir").max(50),
  player2Name: z.string().trim().min(2, "Fortnite nafn verður að vera að minnsta kosti 2 stafir").max(50),
  player1EpicId: z.string().trim().min(5, "Epic ID verður að vera að minnsta kosti 5 stafir").max(100),
  player2EpicId: z.string().trim().min(5, "Epic ID verður að vera að minnsta kosti 5 stafir").max(100),
  player1DiscordId: z.string().trim().min(2, "Discord user ID verður að vera að minnsta kosti 2 stafir").max(100),
  player2DiscordId: z.string().trim().min(2, "Discord user ID verður að vera að minnsta kosti 2 stafir").max(100),
  email: z.string().trim().email("Ógilt netfang").max(255),
  orderId: z.string().trim().min(5, "Order ID verður að vera að minnsta kosti 5 stafir").max(50),
  rulesAccepted: z.literal(true, { errorMap: () => ({ message: "Þú verður að samþykkja reglurnar" }) }),
});

type ElkoFormData = z.infer<typeof elkoFormSchema>;

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  const steps = [
    { num: 1, label: "Greiðsla", icon: CreditCard },
    { num: 2, label: "Skráning", icon: ClipboardList },
    { num: 3, label: "Staðfesting", icon: PartyPopper },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
      {steps.slice(0, totalSteps).map((step, index) => {
        const Icon = step.icon;
        const isActive = step.num === currentStep;
        const isCompleted = step.num < currentStep;

        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/30",
                  isCompleted && "bg-primary/20 text-primary",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 font-medium hidden sm:block",
                  isActive && "text-primary",
                  !isActive && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-8 md:w-16 h-0.5 mx-2",
                  step.num < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

function FieldHelp({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        <span>Hvernig finn ég þetta?</span>
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1.5">
          {children}
        </div>
      )}
    </div>
  );
}

export function ElkoRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ElkoFormData>({
    resolver: zodResolver(elkoFormSchema),
    defaultValues: {
      rulesAccepted: undefined as any,
    },
  });

  const rulesAccepted = watch("rulesAccepted");

  const onSubmit = async (data: ElkoFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "elko-tournament",
          data: {
            teamName: data.teamName,
            player1Name: data.player1Name,
            player2Name: data.player2Name,
            player1EpicId: data.player1EpicId,
            player2EpicId: data.player2EpicId,
            player1DiscordId: data.player1DiscordId,
            player2DiscordId: data.player2DiscordId,
            email: data.email,
            orderId: data.orderId,
            tournamentDate: TOURNAMENT_DATE,
            tournamentName: TOURNAMENT_NAME,
          },
          _hp: honeypot,
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      setCurrentStep(3);
      toast.success("Skráning tókst!", {
        description: "Þú færð staðfestingu í tölvupósti.",
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

  // Step 3: Confirmation
  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <StepIndicator currentStep={3} totalSteps={3} />
        
        <div className="text-center py-8 md:py-12">
          <div className="w-20 h-20 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[hsl(var(--arena-green))]" />
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Liðið þitt er skráð!
          </h3>
          <p className="text-muted-foreground mb-2">
            {TOURNAMENT_NAME} · {TOURNAMENT_DATE}
          </p>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Þú færð email með nánari upplýsingum. Liðið þitt birtist nú í listanum yfir skráð lið.
          </p>
          <Button 
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
            }} 
            variant="outline"
            className="mt-6"
          >
            Skrá annað lið
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={currentStep} totalSteps={3} />

      {/* Step 1: Payment */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-[hsl(var(--arena-green)/0.05)] border border-[hsl(var(--arena-green)/0.2)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[hsl(var(--arena-green))]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Greiðsla – Skref 1 af 3</h3>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Greiddu þátttökugjaldið fyrst. Eftir greiðslu færðu <strong className="text-foreground">Order ID</strong> til að ljúka skráningu.
            </p>
            
            <div className="bg-card/50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-[hsl(var(--arena-green))]">
                💰 Þátttökugjald: 2.000 kr á keppanda (4.000 kr á lið)
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://bit.ly/Elko-deildin-Greidsla" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-arena-gradient flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 px-8"
              >
                <CreditCard className="h-5 w-5" />
                Greiða þátttökugjald
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Hefur þú þegar greitt og fengið Order ID?
            </p>
            <Button 
              onClick={() => setCurrentStep(2)} 
              className="btn-primary-gradient"
              size="lg"
            >
              Halda áfram í skráningu
              <ClipboardList className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--arena-green)/0.1)] text-[hsl(var(--arena-green))] text-sm font-medium mb-3">
              <Users className="h-4 w-4" />
              Liðsskráning
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
              {TOURNAMENT_NAME}
            </h3>
            <p className="text-muted-foreground">
              {TOURNAMENT_DATE} · Skráning fyrir 2 manna lið
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Honeypot */}
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

            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="teamName">Nafn á liði *</Label>
              <Input
                id="teamName"
                {...register("teamName")}
                placeholder="t.d. Team Geimur"
                className="bg-secondary border-border"
              />
              {errors.teamName && (
                <p className="text-sm text-destructive">{errors.teamName.message}</p>
              )}
            </div>

            {/* Player 1 */}
            <div className="space-y-4 p-4 bg-muted/20 rounded-xl border border-border">
              <h4 className="text-sm font-semibold">Spilari 1</h4>
              
              <div className="space-y-2">
                <Label htmlFor="player1Name">Fortnite nafn *</Label>
                <Input
                  id="player1Name"
                  {...register("player1Name")}
                  placeholder="Fortnite nafn"
                  className="bg-secondary border-border"
                />
                {errors.player1Name && (
                  <p className="text-sm text-destructive">{errors.player1Name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="player1EpicId">Epic ID *</Label>
                <Input
                  id="player1EpicId"
                  {...register("player1EpicId")}
                  placeholder="Epic Account ID"
                  className="bg-secondary border-border"
                />
                <FieldHelp>
                  <p>Til þess að fá aðgang í mótið þurfum við Epic ID hjá þér.</p>
                  <p>Þú getur fundið það hér: <a href="https://epicgames.com/account/personal" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--arena-green))] underline hover:no-underline">epicgames.com/account/personal</a></p>
                  <p className="mt-1">Nánari aðstoð: <a href="https://www.epicgames.com/help/en-US/c-Category_EpicAccount/c-AccountSecurity/what-is-an-epic-account-id-and-where-can-i-find-it-a000084674" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--arena-green))] underline hover:no-underline">Epic hjálparsíða</a></p>
                </FieldHelp>
                {errors.player1EpicId && (
                  <p className="text-sm text-destructive">{errors.player1EpicId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="player1DiscordId">Discord notandanafn *</Label>
                <Input
                  id="player1DiscordId"
                  {...register("player1DiscordId")}
                  placeholder="t.d. gunnzib"
                  className="bg-secondary border-border"
                />
                <FieldHelp>
                  <p>Hægri click á nafn inn á server og copy user ID.</p>
                  <p>Eða skrifaðu Discord notandanafnið þitt (t.d. <span className="text-foreground font-medium">gunnzib</span>).</p>
                </FieldHelp>
                {errors.player1DiscordId && (
                  <p className="text-sm text-destructive">{errors.player1DiscordId.message}</p>
                )}
              </div>
            </div>

            {/* Player 2 */}
            <div className="space-y-4 p-4 bg-muted/20 rounded-xl border border-border">
              <h4 className="text-sm font-semibold">Spilari 2</h4>
              
              <div className="space-y-2">
                <Label htmlFor="player2Name">Fortnite nafn *</Label>
                <Input
                  id="player2Name"
                  {...register("player2Name")}
                  placeholder="Fortnite nafn"
                  className="bg-secondary border-border"
                />
                {errors.player2Name && (
                  <p className="text-sm text-destructive">{errors.player2Name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="player2EpicId">Epic ID *</Label>
                <Input
                  id="player2EpicId"
                  {...register("player2EpicId")}
                  placeholder="Epic Account ID"
                  className="bg-secondary border-border"
                />
                <FieldHelp>
                  <p>Til þess að fá aðgang í mótið þurfum við Epic ID hjá þér.</p>
                  <p>Þú getur fundið það hér: <a href="https://epicgames.com/account/personal" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--arena-green))] underline hover:no-underline">epicgames.com/account/personal</a></p>
                </FieldHelp>
                {errors.player2EpicId && (
                  <p className="text-sm text-destructive">{errors.player2EpicId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="player2DiscordId">Discord notandanafn *</Label>
                <Input
                  id="player2DiscordId"
                  {...register("player2DiscordId")}
                  placeholder="t.d. username123"
                  className="bg-secondary border-border"
                />
                <FieldHelp>
                  <p>Hægri click á nafn inn á server og copy user ID.</p>
                  <p>Eða skrifaðu Discord notandanafnið þitt.</p>
                </FieldHelp>
                {errors.player2DiscordId && (
                  <p className="text-sm text-destructive">{errors.player2DiscordId.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Netfang tengiliðs *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="email@example.is"
                className="bg-secondary border-border"
              />
              <p className="text-xs text-muted-foreground">
                Staðfesting og upplýsingar verða sendar á þetta netfang
              </p>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Order ID */}
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID (frá greiðslu) *</Label>
              <Input
                id="orderId"
                {...register("orderId")}
                placeholder='t.d. "Order #30906571"'
                className="bg-secondary border-border"
              />
              {errors.orderId && (
                <p className="text-sm text-destructive">{errors.orderId.message}</p>
              )}
            </div>

            {/* Rules checkbox */}
            <div className="space-y-2 p-4 bg-muted/20 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Ekki er leyfilegt að skipta um nafn í Fortnite á meðan mótið er í gangi. <span className="text-destructive">*</span>
              </p>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="rulesAccepted"
                  checked={rulesAccepted === true}
                  onCheckedChange={(checked) => {
                    setValue("rulesAccepted", checked === true ? true : undefined as any, { shouldValidate: true });
                  }}
                />
                <Label htmlFor="rulesAccepted" className="text-sm font-medium cursor-pointer">
                  Ég skil
                </Label>
              </div>
              {errors.rulesAccepted && (
                <p className="text-sm text-destructive">{errors.rulesAccepted.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="sm:flex-1"
              >
                Til baka
              </Button>
              <Button
                type="submit"
                className="btn-arena-gradient sm:flex-[2]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sendi skráningu...
                  </>
                ) : (
                  <>
                    Skrá liðið
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}