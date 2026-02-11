import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/ContactForm";
import { Facebook, Mail, MapPin, ArrowRight } from "lucide-react";

const HafaSamband = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative hero-section overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-40" />
        <div className="absolute inset-0 nebula-bg pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full bg-[hsl(var(--geimur-red)/0.04)] blur-3xl animate-pulse-glow" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Hafðu samband
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Hefur þú spurningar eða vilt fá frekari upplýsingar? 
              Við erum hér til að hjálpa.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-spacing relative">
        <div className="absolute inset-0 nebula-bg-alt pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Contact Form */}
            <Card className="glass-card border-border max-w-3xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold mb-6">Sendu okkur skilaboð</h2>
                <ContactForm />
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Card className="glass-card border-border card-hover">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold mb-1">Netfang</h3>
                    <a href="mailto:rafgeimur@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">rafgeimur@gmail.com</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border card-hover">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Facebook className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold mb-1">Facebook</h3>
                    <a href="https://facebook.com/rafgeimur" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">/rafgeimur</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border card-hover">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold mb-1">Staðsetning</h3>
                    <p className="text-muted-foreground">Reykjavík, Ísland</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Next planet pointer */}
      <section className="next-planet">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">Viltu fræðast meira um okkur?</p>
          <Button asChild variant="outline" className="border-border/60 hover:border-primary/40">
            <Link to="/um">
              Um Geimur <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default HafaSamband;
