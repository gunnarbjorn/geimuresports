import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { trainingGroups } from "@/data/tournaments";
import { supabase } from "@/integrations/supabase/client";

const trainingSchema = z.object({
  group: z.string().min(1, "Vinsamlegast veldu æfingahóp"),
  fullName: z.string().min(2, "Nafn verður að vera að minnsta kosti 2 stafir").max(100),
  age: z.number().min(6, "Lágmarks aldur er 6 ára").max(99),
  email: z.string().email("Ógilt netfang").max(255),
  phone: z.string().min(7, "Símanúmer verður að vera að minnsta kosti 7 tölustafir").max(20),
  parentName: z.string().max(100).optional(),
  parentAge: z.number().min(18).max(99).optional().or(z.literal("")),
  message: z.string().max(1000).optional(),
});

type TrainingFormData = z.infer<typeof trainingSchema>;

export function TrainingForm() {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [honeypot, setHoneypot] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema),
  });

  // Pre-select group from URL parameter
  useEffect(() => {
    const groupParam = searchParams.get("group");
    if (groupParam && trainingGroups.find(g => g.value === groupParam)) {
      setSelectedGroup(groupParam);
      setValue("group", groupParam);
    }
  }, [searchParams, setValue]);

  const isParentChild = selectedGroup === "foreldri-barn";

  const onSubmit = async (data: TrainingFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "training",
          data: {
            fullName: data.fullName,
            age: data.age,
            email: data.email,
            phone: data.phone,
            group: trainingGroups.find(g => g.value === data.group)?.label || data.group,
            parentName: data.parentName || "",
            parentAge: data.parentAge || "",
            message: data.message || "",
          },
          _hp: honeypot,
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Skráning tókst!", {
        description: "Við munum hafa samband við þig fljótlega.",
      });
      reset();
      setSelectedGroup("");
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
        <h3 className="font-display text-2xl font-bold mb-2">Takk fyrir skráninguna!</h3>
        <p className="text-muted-foreground mb-6">
          Við höfum móttekið skráninguna þína og munum hafa samband við þig fljótlega.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Skrá annan
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
      {/* Group Selection - First */}
      <div className="space-y-2">
        <Label htmlFor="group">Veldu æfingahóp *</Label>
        <Select 
          value={selectedGroup}
          onValueChange={(value) => {
            setValue("group", value);
            setSelectedGroup(value);
          }}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Veldu hóp">
              {selectedGroup && trainingGroups.find(g => g.value === selectedGroup)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            {trainingGroups.map((group) => (
              <SelectItem key={group.value} value={group.value} className="py-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{group.label}</span>
                    {group.featured && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">Vinsælast</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{group.sessionsPerWeek} · {group.price}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.group && (
          <p className="text-sm text-destructive">{errors.group.message}</p>
        )}
      </div>

      {/* Child Info */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">
          {isParentChild ? "Upplýsingar um barn" : "Upplýsingar um þátttakanda"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">{isParentChild ? "Nafn barns *" : "Fullt nafn *"}</Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder={isParentChild ? "Nafn barns" : "Jón Jónsson"}
              className="bg-secondary border-border"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">{isParentChild ? "Aldur barns *" : "Aldur *"}</Label>
            <Input
              id="age"
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder="12"
              className="bg-secondary border-border"
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Parent Info - Only shown for Foreldri + barn */}
      {isParentChild && (
        <div className="space-y-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="font-medium text-sm text-primary">Upplýsingar um foreldri</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="parentName">Nafn foreldris *</Label>
              <Input
                id="parentName"
                {...register("parentName")}
                placeholder="Nafn foreldris"
                className="bg-secondary border-border"
              />
              {errors.parentName && (
                <p className="text-sm text-destructive">{errors.parentName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentAge">Aldur foreldris</Label>
              <Input
                id="parentAge"
                type="number"
                {...register("parentAge", { valueAsNumber: true })}
                placeholder="35"
                className="bg-secondary border-border"
              />
              {errors.parentAge && (
                <p className="text-sm text-destructive">{errors.parentAge.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Info */}
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

      <div className="space-y-2">
        <Label htmlFor="message">Skilaboð (valfrjálst)</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Ef þú vilt láta okkur vita af einhverju..."
          className="bg-secondary border-border min-h-[100px]"
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

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
          "Skrá mig í æfingar"
        )}
      </Button>
    </form>
  );
}
