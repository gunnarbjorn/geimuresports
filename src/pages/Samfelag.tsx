import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Video, Send, Users, MessageSquare, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";

const communityCards = [
  { title: "Discord", desc: "Tengdu við aðra Fortnite spilara á Íslandi. Spjall, LFG og tilkynningar.", icon: MessageSquare, href: DISCORD_INVITE_URL, external: true },
  { title: "Bestu klippurnar", desc: "Skoðaðu bestu klippurnar frá íslensku Fortnite community-inu.", icon: Video, href: "#bestu-klippin", external: false },
];

const communityClips = [
  { player: "Marri G", src: "/clips/marri-g.mp4" },
  { player: "Domi70", src: "/clips/domi70.mov" },
];

const Samfelag = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", epic_username: "", clip_link: "", consent: false });
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          const offset = el.getBoundingClientRect().top + window.scrollY - 104;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!formData.consent) {
      toast({ title: "Vinsamlegast samþykktu skilmálana", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-notification", {
        body: { type: "clip-submission", data: { name: formData.name, epic_username: formData.epic_username, clip_link: formData.clip_link }, _hp: honeypot },
      });
      if (error) throw error;
      toast({ title: "Klipp móttekið!", description: "Við skoðum klippið þitt og höfum samband." });
      setFormData({ name: "", epic_username: "", clip_link: "", consent: false });
    } catch {
      toast({ title: "Villa kom upp", description: "Reyndu aftur síðar.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative hero-section-lg overflow-hidden">
        <div className="absolute inset-0 hero-glow-community opacity-50" />
        <div className="absolute inset-0 nebula-community pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-[hsl(var(--planet-community)/0.06)] blur-3xl animate-pulse-glow" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Button asChild variant="ghost" size="sm" className="mb-6 text-muted-foreground">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Til baka</Link>
            </Button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--planet-community)/0.1)] text-[hsl(var(--planet-community))] text-xs font-bold uppercase tracking-widest mb-4">
              <Users className="h-3.5 w-3.5" /> Samfélag
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Samfélagið</h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">Íslenska Fortnite samfélagið – Discord, klipp, scrims og tenging.</p>
          </div>
        </div>
      </section>

      {/* Community cards */}
      <section className="section-spacing-lg relative">
        <div className="absolute inset-0 nebula-community pointer-events-none opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {communityCards.map((item, i) => (
              <FadeInView key={i} delay={i * 80}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                    <Card className="planet-card-community rounded-xl text-center py-6 hover:border-[hsl(var(--planet-community)/0.4)] transition-colors cursor-pointer">
                      <CardContent className="p-3 flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--planet-community)/0.12)] flex items-center justify-center">
                          <item.icon className="h-7 w-7 text-[hsl(var(--planet-community))]" />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold mb-1 inline-flex items-center gap-1.5">{item.title} <ExternalLink className="h-3.5 w-3.5" /></h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <a href={item.href} className="block">
                    <Card className="planet-card-community rounded-xl text-center py-6 hover:border-[hsl(var(--planet-community)/0.4)] transition-colors cursor-pointer">
                      <CardContent className="p-3 flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--planet-community)/0.12)] flex items-center justify-center">
                          <item.icon className="h-7 w-7 text-[hsl(var(--planet-community))]" />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                )}
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* Bestu klippin */}
      <section id="bestu-klippin" className="section-spacing-lg scroll-mt-28 relative">
        <div className="absolute inset-0 nebula-community pointer-events-none opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center section-heading-spacing">
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--planet-community))] mb-2 block">Highlights</span>
            <h2 className="font-display text-3xl font-bold mb-3">Bestu klippurnar</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Bestu klippurnar frá íslensku Fortnite samfélaginu.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {communityClips.map((clip, i) => (
              <Card key={i} className="planet-card-community rounded-xl">
                <CardContent className="p-6">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted/20 border border-border/40 mb-4">
                    <video src={clip.src} controls className="w-full h-full object-cover" preload="metadata" />
                  </div>
                  <h3 className="font-display font-bold">{clip.player}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-3xl mx-auto" />

      {/* Submit clip form */}
      <section id="senda-clip" className="section-spacing-lg scroll-mt-28 relative">
        <div className="absolute inset-0 nebula-community pointer-events-none opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--planet-community))] mb-2 block">Deildu</span>
              <h2 className="font-display text-3xl font-bold mb-2">Sendu inn klippu</h2>
              <p className="text-muted-foreground">Ertu með klippu sem á skilið spotlight?</p>
            </div>
            <Card className="planet-card-community rounded-xl">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="absolute opacity-0 pointer-events-none" style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                    <input type="text" name="website_url" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clip-name">Nafn</Label>
                    <Input id="clip-name" placeholder="Þitt nafn" required value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clip-epic">Epic username</Label>
                    <Input id="clip-epic" placeholder="Epic Games notendanafn" required value={formData.epic_username} onChange={(e) => setFormData(p => ({ ...p, epic_username: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clip-link">Clip tengill</Label>
                    <Input id="clip-link" type="url" placeholder="https://youtube.com/... eða https://clips.twitch.tv/..." required value={formData.clip_link} onChange={(e) => setFormData(p => ({ ...p, clip_link: e.target.value }))} />
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="clip-consent" checked={formData.consent} onCheckedChange={(checked) => setFormData(p => ({ ...p, consent: checked === true }))} />
                    <Label htmlFor="clip-consent" className="text-sm text-muted-foreground leading-relaxed">Ég samþykki að Geimur Esports megi birta klippuna mína á síðunni og á samfélagsmiðlum.</Label>
                  </div>
                  <Button type="submit" className="w-full bg-[hsl(var(--planet-community))] hover:bg-[hsl(var(--planet-community-deep))] text-primary-foreground" disabled={isSubmitting}>
                    {isSubmitting ? "Sendi..." : "Senda inn klipp"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Samfelag;
