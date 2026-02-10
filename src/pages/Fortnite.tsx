import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Crosshair, Swords, Gamepad2, Trophy, Users, ArrowRight, 
  Settings, Gauge, Wifi, TrendingUp, Video, Send, Map
} from "lucide-react";

const mapCards = [
  { title: "Bestu 1v1 Maps", description: "Æfðu þig í einvígi og bættu close-combat leikni.", href: "/fortnite/maps/1v1", icon: Swords },
  { title: "Aim æfingar", description: "Skerptu skotfimi þína með sérhönnuðum aim-kortum.", href: "/fortnite/maps/aim", icon: Crosshair },
  { title: "Edit æfingar", description: "Lærðu hraðar og nákvæmari edits til að ná yfirhöndinni.", href: "/fortnite/maps/edit", icon: Gamepad2 },
  { title: "Warm-up Maps", description: "Hituðu upp rétt áður en þú ferð í ranked eða mót.", href: "/fortnite/maps/warmup", icon: Gauge },
  { title: "Boxfight Maps", description: "Harðneskjulegar boxfight æfingar til að þjálfa pressure-play.", href: "/fortnite/maps/boxfight", icon: Swords },
];

const tipsCards = [
  { title: "Fortnite stillingar", description: "Bestu stillingar fyrir PS, PC og Xbox á Íslandi.", href: "/fortnite/tips/settings", icon: Settings },
  { title: "Fortnite næmni", description: "Finndu sensitivity sem hentar þér – controller og mouse.", href: "/fortnite/tips/sensitivity", icon: Crosshair },
  { title: "Performance mode", description: "Fáðu meiri FPS og betri upplifun á veikari tölvum.", href: "/fortnite/tips/performance", icon: Gauge },
  { title: "Fortnite laggar", description: "Ráð til að minnka lag og ping á Íslandi.", href: "/fortnite/tips/lag", icon: Wifi },
  { title: "Ranked tips", description: "Hvernig klífur þú upp ranked stigann á skilvirkan hátt.", href: "/fortnite/tips/ranked", icon: TrendingUp },
];

const Fortnite = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative hero-section-lg overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              <span className="text-glow">Fortnite á Íslandi</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-3 font-medium">
              Æfingar • Kort • Tips • Mót • Community
            </p>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8">
              Geimur Esports er miðstöð Fortnite á Íslandi – hér finnur þú bestu æfingakortin,
              ráð fyrir keppni, íslenskt community og leiðina í mót og þjálfun.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="btn-primary-gradient">
                <Link to="/fortnite/maps">
                  <Map className="mr-2 h-5 w-5" />
                  Skoða Maps
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/aefingar">Skoða Æfingar</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/mot">
                  <Trophy className="mr-2 h-5 w-5" />
                  Skoða Mót
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Fortnite Maps</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handvalin æfingakort til að bæta hvern þátt leiksins.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {mapCards.map((card) => (
              <Link key={card.href} to={card.href} className="group">
                <Card className="glass-card border-border card-hover h-full">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <card.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="font-display text-lg">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col justify-between">
                    <CardDescription className="text-muted-foreground text-sm mb-4">{card.description}</CardDescription>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Skoða <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-primary/50">
              <Link to="/fortnite/maps">Öll kort <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="text-center section-heading-spacing">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Tips & Stillingar</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hagnýt ráð fyrir íslenska Fortnite-spilara – ping, stillingar og performance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {tipsCards.map((card) => (
              <Link key={card.href} to={card.href} className="group">
                <Card className="glass-card border-border card-hover h-full">
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <card.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="font-display text-lg">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col justify-between">
                    <CardDescription className="text-muted-foreground text-sm mb-4">{card.description}</CardDescription>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Skoða <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-primary/50">
              <Link to="/fortnite/tips">Öll ráð <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ranked Section */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ranked & Competitive</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Lærðu hvernig ranked kerfið virkar, hvað þarf til að klífa og hvernig Geimur undirbýr 
              spilara fyrir keppni á Íslandi og erlendis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="btn-primary-gradient">
                <Link to="/fortnite/ranked">
                  Lesa meira <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/mot">Skoða næsta mót hjá Geimi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Video className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Community</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Vertu hluti af íslenska Fortnite samfélaginu. Sendu inn klipp, fylgdu vikulegum highlights 
              og tengdu við aðra spilara.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="btn-primary-gradient">
                <Link to="/fortnite/community">
                  <Video className="mr-2 h-5 w-5" />
                  Clip vikunnar
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/50">
                <Link to="/fortnite/community#senda-clip">
                  <Send className="mr-2 h-5 w-5" />
                  Senda inn klipp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4">
          <Card className="glass-card border-primary/20 max-w-4xl mx-auto overflow-hidden relative">
            <div className="absolute inset-0 hero-glow opacity-50" />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Taktu næsta skref
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Skráðu þig í æfingar hjá Geimi eða taka þátt í næsta Fortnite-móti á Íslandi.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="btn-primary-gradient text-lg px-8">
                  <Link to="/aefingar">
                    Skoða æfingar
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/50">
                  <Link to="/mot">Skoða mót</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Fortnite;
