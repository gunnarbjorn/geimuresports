import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Users, BookOpen, ArrowRight } from "lucide-react";

const paths = [
  {
    title: "KEPPA",
    description: "Mót & keppni",
    href: "/keppa",
    icon: Trophy,
    cardClass: "planet-card-tournament",
    iconBg: "bg-[hsl(var(--planet-tournament)/0.12)]",
    iconColor: "text-[hsl(var(--planet-tournament))]",
    accentColor: "text-[hsl(var(--planet-tournament))]",
  },
  {
    title: "ÆFA",
    description: "Þjálfun & æfingar",
    href: "/aefingar",
    icon: Target,
    cardClass: "planet-card-training",
    iconBg: "bg-[hsl(var(--planet-training)/0.12)]",
    iconColor: "text-[hsl(var(--planet-training))]",
    accentColor: "text-[hsl(var(--planet-training))]",
  },
  {
    title: "SAMFÉLAG",
    description: "Discord & klipp",
    href: "/samfelag",
    icon: Users,
    cardClass: "planet-card-community",
    iconBg: "bg-[hsl(var(--planet-community)/0.12)]",
    iconColor: "text-[hsl(var(--planet-community))]",
    accentColor: "text-[hsl(var(--planet-community))]",
  },
  {
    title: "FRÆÐAST",
    description: "Ranked & tips",
    href: "/fraedast",
    icon: BookOpen,
    cardClass: "planet-card-knowledge",
    iconBg: "bg-[hsl(var(--planet-knowledge)/0.12)]",
    iconColor: "text-[hsl(var(--planet-knowledge))]",
    accentColor: "text-[hsl(var(--planet-knowledge))]",
  },
];

const Index = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <Layout>
      <section className="relative min-h-[88vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/50" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[hsl(var(--geimur-red)/0.06)] blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/5 w-48 h-48 rounded-full bg-[hsl(var(--planet-knowledge)/0.04)] blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--geimur-red)/0.1)] text-primary text-xs font-bold uppercase tracking-widest mb-5 animate-fade-in">
              Geimur Esports
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-5 tracking-tight animate-fade-in">
              <span className="text-glow">HVAÐ VILTU</span>{" "}
              <span className="block md:inline text-primary">GERA?</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-16 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.15s" }}>
              Veldu leið og byrjaðu ferðalagið
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {paths.map((path, i) => (
                <FadeInView key={path.href} delay={i * 80}>
                  <Link to={path.href} className="group">
                    <Card className={`${path.cardClass} rounded-2xl h-full text-center py-8 md:py-12`}>
                      <CardContent className="p-4 md:p-6 flex flex-col items-center gap-5">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${path.iconBg} flex items-center justify-center group-hover:scale-105 transition-all duration-300`}>
                          <path.icon className={`h-8 w-8 md:h-9 md:w-9 ${path.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                        </div>
                        <div>
                          <h2 className="font-display text-base md:text-lg font-bold mb-1 tracking-wide">{path.title}</h2>
                          <p className="text-xs md:text-sm text-muted-foreground">{path.description}</p>
                        </div>
                        <ArrowRight className={`h-4 w-4 ${path.accentColor} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0`} />
                      </CardContent>
                    </Card>
                  </Link>
                </FadeInView>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
