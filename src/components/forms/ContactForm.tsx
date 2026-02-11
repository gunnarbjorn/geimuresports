import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z.string().min(2, "Nafn verður að vera að minnsta kosti 2 stafir").max(100),
  email: z.string().email("Ógilt netfang").max(255),
  subject: z.string().min(3, "Efni verður að vera að minnsta kosti 3 stafir").max(200),
  message: z.string().min(10, "Skilaboð verða að vera að minnsta kosti 10 stafir").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [honeypot, setHoneypot] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "contact",
          data: {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
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
      toast.success("Skilaboð send!", {
        description: "Við munum svara þér eins fljótt og auðið er.",
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
        <h3 className="font-display text-2xl font-bold mb-2">Takk fyrir skilaboðin!</h3>
        <p className="text-muted-foreground mb-6">
          Við höfum móttekið fyrirspurn þína og munum svara eins fljótt og auðið er.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Senda önnur skilaboð
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
          <Label htmlFor="name">Nafn *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Jón Jónsson"
            className="bg-secondary border-border"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

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
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Efni *</Label>
        <Input
          id="subject"
          {...register("subject")}
          placeholder="Spurning um æfingar..."
          className="bg-secondary border-border"
        />
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Skilaboð *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Skrifaðu skilaboðin þín hér..."
          className="bg-secondary border-border min-h-[150px]"
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
          "Senda skilaboð"
        )}
      </Button>
    </form>
  );
}
