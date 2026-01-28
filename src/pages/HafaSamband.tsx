import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/forms/ContactForm";
import { Facebook, Mail, MapPin } from "lucide-react";
const HafaSamband = () => {
  return <Layout>
      {/* Hero */}
      <section className="relative hero-section overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
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
      <section className="section-spacing">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-card border-border card-hover">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold mb-1">Netfang</h3>
                    <a href="mailto:geimur@geimur.is" className="text-muted-foreground hover:text-primary transition-colors">rafgeimur@gmail.com</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border card-hover">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Facebook className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold mb-1">Facebook</h3>
                    <a href="https://facebook.com/rafgeimur" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      /rafgeimur
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border card-hover">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold mb-1">Staðsetning</h3>
                    <p className="text-muted-foreground">
                      Reykjavík, Ísland
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-display text-2xl font-bold mb-6">
                    Sendu okkur skilaboð
                  </h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default HafaSamband;