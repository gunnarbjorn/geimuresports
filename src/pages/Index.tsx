import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, Users, Heart, Trophy, Calendar, Gamepad2, ArrowRight } from "lucide-react";
import geimurLogo from "@/assets/geimur-logo.png";
const stats = [{
  label: "Æfingar í viku",
  value: "3x",
  icon: Calendar
}, {
  label: "Mót á tímabilinu",
  value: "6+",
  icon: Trophy
}, {
  label: "Félagsandi + hreyfing",
  value: "✓",
  icon: Heart
}];
const benefits = [{
  title: "Markviss Fortnite þjálfun",
  description: "Mechanics, game sense og strategy frá reyndum þjálfurum.",
  icon: Target
}, {
  title: "Liðsandi & samskipti",
  description: "Lærðu að vinna sem lið og byggðu upp traust með öðrum spilurum.",
  icon: Users
}, {
  title: "Heilbrigðar venjur",
  description: "Hreyfing, hvíld og jafnvægi eru hluti af okkar nálgun.",
  icon: Heart
}, {
  title: "Mót & markmið",
  description: "Kepptu í skipulögðum mótum og settu þér skýr markmið.",
  icon: Trophy
}];
const upcomingEvents = [{
  title: "Elko-deildin Vor 2026 – Duos",
  date: "11. feb – 4. mars",
  type: "Mót",
  link: "/mot"
}, {
  title: "Æfingakvöld – nýliðar velkomnir",
  date: "Hvern þriðjudag",
  type: "Æfing",
  link: "/aefingar"
}];
const packages = [{
  name: "Nýliðar",
  description: "Fyrir þá sem eru að byrja.",
  sessionsPerWeek: 1,
  monthlyPrice: 12900,
  features: ["1x æfing í viku", "Grunnatriði Fortnite", "Hámark 10 í hóp", "Aðgangur að Discord"],
}, {
  name: "Framhald",
  description: "Fyrir þá sem vilja þróast.",
  sessionsPerWeek: 2,
  monthlyPrice: 19900,
  features: ["2x æfingar í viku", "Ítarleg þjálfun", "Hámark 10 í hóp", "Mótþátttaka"],
  featured: true
}, {
  name: "Foreldri + barn",
  description: "Spilaðu saman.",
  sessionsPerWeek: 1,
  monthlyPrice: 16900,
  isFamily: true,
  features: ["1x æfing í viku", "Sérhópar fyrir fjölskyldur", "Hámark 10 í hóp", "Skemmtilegt og fræðandi"],
}];

const formatPrice = (price: number) => price.toLocaleString('is-IS');
const calculatePerSession = (monthlyPrice: number, sessionsPerWeek: number) => {
  const sessionsPerMonth = sessionsPerWeek * 4;
  return Math.round(monthlyPrice / sessionsPerMonth);
};
const faqs = [{
  question: "Hvernig virka online æfingarnar?",
  answer: "Æfingarnar fara fram 100% online í gegnum Discord. Þjálfarinn tengist við hópinn og fer yfir mechanics, strategy og game sense í beinni útsendingu. Þátttakendur spila saman og fá endurgjöf í rauntíma."
}, {
  question: "Hvaða aldurshópar eru hjá ykkur?",
  answer: "Við tökum við spilurum frá 8 ára og upp í 16 ára. Hópum er skipt eftir aldri og leikni til að tryggja að allir fái viðeigandi áskoranir."
}, {
  question: "Þarf ég að eiga eigin PlayStation eða PC?",
  answer: "Já, þátttakendur þurfa að hafa aðgang að eigin PlayStation eða PC með Fortnite uppsett. Þar sem æfingarnar eru online þarftu einnig stöðuga nettengingu og Discord."
}, {
  question: "Er ég of léleg/ur til að taka þátt?",
  answer: "Alls ekki! Við tökum á móti öllum, óháð leikni. Markmið okkar er að hjálpa þér að þróast á þínum hraða í litlum hópum með hámark 10 þátttakendum."
}, {
  question: "Hvernig virkar greiðslan?",
  answer: "Greitt er mánaðarlega án skuldbindinga. Þú getur sagt upp hvenær sem er og engin binding er á áskriftinni."
}, {
  question: "Hvað með foreldra – mega þeir vera með?",
  answer: "Já! Við bjóðum upp á sérstakan 'Foreldri + barn' pakka þar sem foreldri og barn spila og læra saman í online æfingum."
}];
const Index = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[75vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Hero Glow Background */}
        <div className="absolute inset-0 hero-glow" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            
            
            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 text-glow">
              GEIMUR
            </h1>
            <p className="font-display text-xl md:text-2xl text-primary mb-6">
              Rafíþróttafélag
            </p>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Við sameinum tölvuleiki, hreyfingu og liðsanda til að efla bæði leikni og persónulegan þroska.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button asChild size="lg" className="btn-primary-gradient text-lg px-8">
                <Link to="/aefingar">
                  Skrá mig í æfingar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50 hover:border-primary text-lg px-8">
                <Link to="/mot">
                  Skoða mót
                  <Gamepad2 className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => <Card key={index} className="bg-card/50 border-border card-hover backdrop-blur-sm">
                  <CardContent className="flex items-center justify-start sm:justify-center gap-4 px-5 py-5 sm:p-6">
                    <stat.icon className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Hvað færðu út úr Geimi?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Meira en bara gaming – við byggjum upp heildstæða leikara.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => <Card key={index} className="bg-card border-border card-hover">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-display text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Næstu viðburðir
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Vertu með í næsta viðburði hjá okkur.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {upcomingEvents.map((event, index) => <Card key={index} className="bg-card border-border card-hover">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {event.type}
                    </span>
                  </div>
                  <CardTitle className="font-display text-xl">{event.title}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full btn-primary-gradient">
                    <Link to={event.link}>
                      Skrá mig
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Æfingapakkar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              100% online Fortnite þjálfun fyrir börn og unglinga um allt land.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground max-w-2xl mx-auto">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
                <Gamepad2 className="h-4 w-4 text-primary" /> Hámark 10 í hóp
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
                <Target className="h-4 w-4 text-primary" /> Eigin PS eða PC
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
                <Users className="h-4 w-4 text-primary" /> Fyrir 8–16 ára
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <Card key={index} className={`bg-card border-border card-hover relative ${pkg.featured ? 'border-primary glow-red-sm' : ''}`}>
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                      Vinsælast
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="font-display text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                  
                  {/* Pricing */}
                  <div className="mt-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-3xl font-bold text-foreground">{formatPrice(pkg.monthlyPrice)} kr<span className="text-base font-normal text-muted-foreground">/mán</span></p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ≈ {formatPrice(calculatePerSession(pkg.monthlyPrice, pkg.sessionsPerWeek))} kr á æfingu
                      </p>
                      <p className="text-xs text-primary mt-2">Greitt mánaðarlega. Engin binding.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-xs">✓</span>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className={`w-full ${pkg.featured ? 'btn-primary-gradient' : ''}`} variant={pkg.featured ? 'default' : 'outline'}>
                    <Link to="/aefingar#skraning">Skrá mig – {pkg.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Algengar spurningar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Finndu svör við algengustu spurningum.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-xl px-6">
                  <AccordionTrigger className="text-left font-display font-medium hover:text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-card to-secondary border-primary/20 max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute inset-0 hero-glow opacity-50" />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Tilbúin/n að taka næsta skref?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Skráðu þig í æfingar hjá Geimi og vertu hluti af samfélaginu okkar.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="btn-primary-gradient text-lg px-8">
                  <Link to="/skraning">
                    Skrá mig núna
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/50">
                  <Link to="/hafa-samband">Hafa samband</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>;
};
export default Index;