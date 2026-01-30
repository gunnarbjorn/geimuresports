import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Loader2, 
  CheckCircle, 
  CreditCard,
  ClipboardList,
  PartyPopper,
  ExternalLink,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const elkoFormSchema = z.object({
  email: z.string().trim().email("Ógilt netfang").max(255),
  fullName: z.string().trim().min(2, "Nafn verður að vera að minnsta kosti 2 stafir").max(100),
  phone: z.string().trim().min(7, "Símanúmer verður að vera að minnsta kosti 7 tölustafir").max(20),
  kennitala: z.string().trim().regex(/^\d{6}-?\d{4}$/, "Kennitala verður að vera á réttu formi (t.d. 010199-2389)"),
  discordUserId: z.string().trim().min(17, "Discord User ID þarf að vera tölur (minnst 17 stafir).").max(20).regex(/^\d+$/, "Discord User ID þarf að vera tölur (minnst 17 stafir)."),
  epicId: z.string().trim().min(3, "Epic ID verður að vera að minnsta kosti 3 stafir").max(100),
  fortniteName: z.string().trim().min(3, "Fortnite nafn verður að vera að minnsta kosti 3 stafir").max(50),
  teammateName: z.string().trim().min(3, "Nafn liðsfélaga verður að vera að minnsta kosti 3 stafir").max(50),
  orderId: z.string().trim().min(5, "Order ID verður að vera að minnsta kosti 5 stafir").max(50),
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

export function ElkoRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ElkoFormData>({
    resolver: zodResolver(elkoFormSchema),
  });

  

  const onSubmit = async (data: ElkoFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "elko-tournament",
          data: {
            email: data.email,
            fullName: data.fullName,
            phone: data.phone,
            kennitala: data.kennitala,
            
            discordUserId: data.discordUserId,
            epicId: data.epicId,
            fortniteName: data.fortniteName,
            teammateName: data.teammateName,
            orderId: data.orderId,
          },
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
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Skráning móttekin!
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Þú færð email með nánari upplýsingum um þátttöku og næstu skref.
          </p>
          <div className="bg-card/50 border border-border rounded-xl p-6 max-w-md mx-auto">
            <h4 className="font-semibold mb-3">Næstu skref:</h4>
            <ul className="text-left text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                Athugaðu email inboxið þitt fyrir staðfestingu
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Gakktu úr skugga um að þú sért á Discord serverinum
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Lestu reglur og undirbúðu þig fyrir mótið
              </li>
            </ul>
          </div>
          <Button 
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
            }} 
            variant="outline"
            className="mt-6"
          >
            Skrá annan keppanda
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
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Greiðsla – Skref 1 af 3</h3>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Til þess að taka þátt þarftu fyrst að greiða þátttökugjaldið.
              Eftir greiðslu færðu <strong className="text-foreground">Order ID</strong>, sem þú þarft til að ljúka skráningu.
            </p>
            
            <div className="bg-card/50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-primary">
                💰 Þátttökugjald: 2.000 kr á einstakling
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://bit.ly/Elko-deildin-Greidsla" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary-gradient flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 px-8"
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
              variant="outline"
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
            <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
              Skráning í Elko-deildina Vor 2026 – Duos
            </h3>
            <p className="text-muted-foreground">
              Fylltu út alla reiti til að ljúka skráningu
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email & Full Name */}
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
            </div>

            {/* Phone & Kennitala */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="space-y-2">
                <Label htmlFor="kennitala">Kennitala *</Label>
                <Input
                  id="kennitala"
                  {...register("kennitala")}
                  placeholder="010199-2389"
                  className="bg-secondary border-border"
                />
                {errors.kennitala && (
                  <p className="text-sm text-destructive">{errors.kennitala.message}</p>
                )}
              </div>
            </div>

            {/* Discord ID & Epic ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="discordUserId">Discord User ID *</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm p-4" side="top">
                        <div className="space-y-2 text-sm">
                          <p className="font-semibold">Hvernig finn ég Discord User ID?</p>
                          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            <li>Opnaðu Discord</li>
                            <li>Smelltu á ⚙️ Stillingar</li>
                            <li>Veldu <span className="font-medium text-foreground">Advanced</span></li>
                            <li>Kveiktu á <span className="font-medium text-foreground">Developer Mode</span></li>
                          </ol>
                          <p className="text-muted-foreground pt-1">Þú getur nú afritað User ID á tvo vegu:</p>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Smellt á prófílmyndina þína og valið <span className="font-medium text-foreground">Copy User ID</span></li>
                            <li>EÐA hægri-smellt á nafnið þitt og valið <span className="font-medium text-foreground">Copy User ID</span></li>
                          </ul>
                          <p className="text-xs text-primary pt-2">Ath: Discord User ID eru eingöngu tölur.</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="discordUserId"
                  {...register("discordUserId")}
                  placeholder="12345678901234567"
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Þetta er aðeins notað til að tengja skráningu þína við Discord.
                </p>
                {errors.discordUserId && (
                  <p className="text-sm text-destructive">{errors.discordUserId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="epicId">Epic ID *</Label>
                  <a 
                    href="https://epicgames.com/account/personal" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Finna Epic ID
                  </a>
                </div>
                <Input
                  id="epicId"
                  {...register("epicId")}
                  placeholder="Epic Games ID"
                  className="bg-secondary border-border"
                />
                {errors.epicId && (
                  <p className="text-sm text-destructive">{errors.epicId.message}</p>
                )}
              </div>
            </div>

            {/* Fortnite Name & Teammate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fortniteName">Hvað heitir þú í Fortnite? *</Label>
                <Input
                  id="fortniteName"
                  {...register("fortniteName")}
                  placeholder="Fortnite nafnið þitt"
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Ekki er leyfilegt að breyta nafni á meðan mót stendur
                </p>
                {errors.fortniteName && (
                  <p className="text-sm text-destructive">{errors.fortniteName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teammateName">Hvað heitir liðsfélagi þinn í Fortnite? *</Label>
                <Input
                  id="teammateName"
                  {...register("teammateName")}
                  placeholder="Fortnite nafn liðsfélaga"
                  className="bg-secondary border-border"
                />
                {errors.teammateName && (
                  <p className="text-sm text-destructive">{errors.teammateName.message}</p>
                )}
              </div>
            </div>

            {/* Order ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID (frá greiðslu) *</Label>
                <Input
                  id="orderId"
                  {...register("orderId")}
                  placeholder='t.d. "Order #30906571"'
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Þú færð Order ID eftir greiðslu
                </p>
                {errors.orderId && (
                  <p className="text-sm text-destructive">{errors.orderId.message}</p>
                )}
              </div>
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
                className="btn-primary-gradient sm:flex-[2]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sendi skráningu...
                  </>
                ) : (
                  <>
                    Staðfesta skráningu
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
