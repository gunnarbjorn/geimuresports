import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Video, Send, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const placeholderClips = [
  { player: "ÍslandGamer99", title: "Insane clutch í ranked", week: "Vika 6" },
  { player: "FortniteFreyr", title: "No-scope sniper elimination", week: "Vika 5" },
  { player: "ArcticAim", title: "1v4 endgame squad wipe", week: "Vika 4" },
];

const Community = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    epic_username: "",
    clip_link: "",
    consent: false,
  });
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
        body: {
          type: "clip-submission",
          data: {
            name: formData.name,
            epic_username: formData.epic_username,
            clip_link: formData.clip_link,
          },
          _hp: honeypot,
        },
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
      <section className="relative hero-section overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Button asChild variant="ghost" size="sm" className="mb-6 text-muted-foreground">
              <Link to="/fortnite"><ArrowLeft className="mr-2 h-4 w-4" /> Fortnite</Link>
            </Button>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Community</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Íslenska Fortnite samfélagið – klipp, highlights og tengsl við aðra spilara.
            </p>
          </div>
        </div>
      </section>

      {/* Clip vikunnar */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Video className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-4">Clip vikunnar</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Bestu klippin úr íslensku Fortnite community-inu í hverri viku.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {placeholderClips.map((clip, i) => (
              <Card key={i} className="glass-card border-border card-hover">
                <CardContent className="p-6">
                  <div className="aspect-video rounded-lg bg-muted/30 border border-border flex items-center justify-center mb-4">
                    <Video className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <span className="text-xs text-primary font-medium">{clip.week}</span>
                  <h3 className="font-display font-bold mt-1">{clip.title}</h3>
                  <p className="text-sm text-muted-foreground">{clip.player}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Submit clip form */}
      <section id="senda-clip" className="section-spacing-lg bg-card/30 scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Send className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-2">Sendu inn klipp</h2>
              <p className="text-muted-foreground">Ertu með klipp sem á skilið spotlight? Sendu það inn!</p>
            </div>
            <Card className="glass-card border-border">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot */}
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
                    <Checkbox
                      id="clip-consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => setFormData(p => ({ ...p, consent: checked === true }))}
                    />
                    <Label htmlFor="clip-consent" className="text-sm text-muted-foreground leading-relaxed">
                      Ég samþykki að Geimur Esports megi birta klippið mitt á síðu og á samfélagsmiðlum.
                    </Label>
                  </div>
                  <Button type="submit" className="w-full btn-primary-gradient" disabled={isSubmitting}>
                    {isSubmitting ? "Sendi..." : "Senda inn klipp"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-lg mb-6">
            Viltu verða betri? Skoðaðu æfingar eða taka þátt í næsta móti.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="btn-primary-gradient">
              <Link to="/aefingar">Skoða æfingar <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/50">
              <Link to="/mot">Skoða mót</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Community;
