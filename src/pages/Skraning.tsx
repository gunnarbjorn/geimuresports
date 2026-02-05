import { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { TrainingForm } from "@/components/forms/TrainingForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  Trophy, 
  ArrowRight, 
  MapPin, 
  Users,
  Gamepad2,
  ChevronRight,
} from "lucide-react";

// Active tournament config
const ACTIVE_TOURNAMENT = {
  name: "Fortnite Duos LAN",
  location: "Arena",
  date: "Lau 28. feb",
  time: "11:00",
  format: "Duo",
  maxTeams: 50,
  entryFeePerTeam: 8880,
};

const Skraning = () => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string>("aefingar");
  const [registeredTeamsCount, setRegisteredTeamsCount] = useState(0);
  
  const remainingSpots = ACTIVE_TOURNAMENT.maxTeams - registeredTeamsCount;
  const progressPercentage = (registeredTeamsCount / ACTIVE_TOURNAMENT.maxTeams) * 100;

  // Fetch registered teams count
  useEffect(() => {
    const fetchTeamsCount = async () => {
      const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'elko-tournament');
      
      if (!error && count !== null) {
        setRegisteredTeamsCount(count);
      }
    };
    fetchTeamsCount();
  }, []);

  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  const scrollToSection = useCallback((sectionId: string, accordionValue: string) => {
    // First open the accordion section
    setOpenSection(accordionValue);
    
    // Wait for accordion animation to fully complete (close + open), then scroll
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80;
        const additionalOffset = 24;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight - additionalOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 350);
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 pb-6 md:pt-28 md:pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Skráning
            </h1>
            <p className="text-muted-foreground">
              Skráðu þig í æfingar eða mót. Veldu það sem hentar þér best.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links as Cards */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* Training Card */}
            <Card 
              className="bg-card border-border card-hover group cursor-pointer"
              onClick={() => scrollToSection('aefingar-form', 'aefingar')}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg mb-1">Æfingar</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Skipulagðar æfingar fyrir alla aldurshópa
                    </p>
                    <span className="inline-flex items-center text-sm text-primary font-medium">
                      Skrá mig
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tournament Card - Highlight Active Tournament */}
            <Link to="/mot" className="block">
              <Card className="bg-card border-[hsl(var(--arena-green)/0.3)] card-hover-arena group cursor-pointer h-full glow-green-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center shrink-0">
                      <Trophy className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-lg">{ACTIVE_TOURNAMENT.name}</h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-card">
                          <MapPin className="h-3 w-3 mr-1" />
                          {ACTIVE_TOURNAMENT.location}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-card">
                          <Calendar className="h-3 w-3 mr-1" />
                          {ACTIVE_TOURNAMENT.date}
                        </Badge>
                      </div>
                      
                      {/* Mini progress */}
                      <div className="mb-3">
                        <Progress value={progressPercentage} className="h-1.5 mb-1" />
                        <p className="text-xs text-[hsl(var(--arena-green))]">
                          {registeredTeamsCount}/{ACTIVE_TOURNAMENT.maxTeams} lið · {remainingSpots} laus
                        </p>
                      </div>
                      
                      <span className="inline-flex items-center text-sm text-[hsl(var(--arena-green))] font-medium">
                        Skráð lið
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Forms Section - Training Only (Tournament has dedicated page) */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Accordion 
              type="single" 
              collapsible 
              value={openSection} 
              onValueChange={setOpenSection}
              className="space-y-4"
            >
              {/* Training Form */}
              <AccordionItem 
                id="aefingar-form"
                value="aefingar" 
                className="bg-card border border-border rounded-xl overflow-hidden scroll-mt-28"
              >
                <AccordionTrigger className="px-5 py-4 font-display text-lg font-bold hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    Skráning í æfingar
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground mb-5">
                    Fylltu út eyðublaðið til að skrá þig í æfingar.
                  </p>
                  <TrainingForm />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Tournament CTA Card */}
            <Card className="mt-6 bg-gradient-to-r from-[hsl(var(--arena-green)/0.1)] to-transparent border-[hsl(var(--arena-green)/0.3)]">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="h-5 w-5 text-[hsl(var(--arena-green))]" />
                    <div>
                      <p className="font-semibold">Viltu keppa í móti?</p>
                      <p className="text-sm text-muted-foreground">
                        {ACTIVE_TOURNAMENT.name} – {ACTIVE_TOURNAMENT.date}
                      </p>
                    </div>
                  </div>
                  <Button asChild className="btn-arena-gradient sm:w-auto">
                    <Link to="/mot">
                      Skráning
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Skraning;
