import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TipSection {
  heading: string;
  content: string;
}

interface TipData {
  title: string;
  intro: string;
  sections: TipSection[];
}

const tipsData: Record<string, TipData> = {
  settings: {
    title: "Fortnite stillingar",
    intro: "Réttar stillingar geta skipt sköpum í Fortnite. Hér er yfirlit yfir bestu stillingar fyrir PS, PC og Xbox, sérsniðnar að íslensku neti og aðstæðum.",
    sections: [
      { heading: "Skjástillingar", content: "Á PC: Notaðu Fullscreen (ekki Windowed), slökktu á V-Sync og settu Frame Rate Limit á gildi sem tölvan þín ræður við stöðugt. Á PS/Xbox: Kveiktu á 120Hz ef skjárinn styður það." },
      { heading: "Hljóðstillingar", content: "Notaðu Visual Sound Effects til að sjá hljóð á skjánum – þetta hjálpar mjög í keppni. Stilltu 3D Headphones á ON ef þú notar heyrnartól." },
      { heading: "HUD stillingar", content: "Fjarlægðu allt sem þú þarft ekki af skjánum. Minnkaðu Net Debug Stats og haltu bara FPS og Ping sýnilegu." },
      { heading: "Gameplay stillingar", content: "Kveiktu á Confirm Edit on Release, Auto Material Change og Sprint by Default. Þetta sparar þér aðgerðir og eykur hraða." },
    ],
  },
  sensitivity: {
    title: "Fortnite næmni (Sensitivity)",
    intro: "Sensitivity stillingar eru einstaklingsbundnar en hér eru ráð til að finna réttu gildin fyrir þig.",
    sections: [
      { heading: "Controller næmni", content: "Byrjaðu á lágri næmni (4-5 X og Y) og hækkaðu smátt og smátt. Notaðu Advanced Settings og stilltu Build og Edit sensitivity sérstaklega – þau mega vera hærri en combat sensitivity." },
      { heading: "Mouse næmni", content: "Flestir pro-spilarar nota 400-800 DPI á músinni. In-game sensitivity er venjulega á milli 5-10%. Aim er betri á lágri næmni – builds og edits á hærri." },
      { heading: "Deadzone stillingar", content: "Á controller: Stilltu Left og Right Stick Deadzone eins lágt og þú getur án þess að stafur hreyfist sjálfkrafa (0.05-0.10 er algengt)." },
      { heading: "Hvernig æfa ég?", content: "Notaðu aim training kort (sjá Maps hlutann) og æfðu 10-15 mín á dag. Breyttu ekki sensitivity of oft – gefðu þér 3-5 daga til að venjast nýjum stillingum." },
    ],
  },
  performance: {
    title: "Performance mode – Meiri FPS",
    intro: "FPS skiptir miklu máli í Fortnite. Hér er hvernig þú færð mest út úr vélinni þinni.",
    sections: [
      { heading: "Performance mode vs DirectX 11", content: "Á veikari tölvum: Notaðu Performance mode (beta) til að fá miklu hærri FPS. Þetta breytir útliti leiksins en eykur mjög leikgæðin. Á sterkari tölvum: DirectX 11 lítur betur út og virkar vel." },
      { heading: "Grafíkstillingar", content: "Settu allar grafíkstillingar á Low nema View Distance (Medium eða Epic). Shadows OFF, Anti-Aliasing OFF, Effects LOW." },
      { heading: "Windows ráð", content: "Lokaðu öllum óþarfa forritum. Slökktu á Xbox Game Bar, Hardware-accelerated GPU scheduling og Game Mode ef þú finnur stutter." },
      { heading: "Mesh quality", content: "Í Performance mode: Stilltu Meshes á High til að fá betri sýnileika á spilurum og byggingum." },
    ],
  },
  lag: {
    title: "Fortnite laggar – Minnka ping á Íslandi",
    intro: "Lag og hár ping eru algeng vandamál á Íslandi vegna fjarlægðar frá servers. Hér eru bestu ráðin.",
    sections: [
      { heading: "Nettengingar ráð", content: "Notaðu Ethernet snúru í stað WiFi ef hægt er. Ef þú ert á WiFi, vertu eins nálægt routernum og mögulegt er. 5GHz WiFi er betra en 2.4GHz." },
      { heading: "Server val", content: "Veldu EU servers (sjálfgefið). Ping frá Íslandi er venjulega 50-80ms á EU servers sem er ásættanlegt. NA-East gefur yfirleitt 100ms+." },
      { heading: "DNS stillingar", content: "Prófaðu Google DNS (8.8.8.8 / 8.8.4.4) eða Cloudflare DNS (1.1.1.1) í stað sjálfgefins DNS frá þjónustuaðila. Þetta getur minnkað lag lítillega." },
      { heading: "Forðastu VPN", content: "VPN eykur næstum alltaf lag í leikjum. Slökktu á VPN meðan þú spilar nema þú hafir sérstaka ástæðu." },
    ],
  },
  ranked: {
    title: "Ranked tips – Klífðu stigann",
    intro: "Ranked í Fortnite er krefjandi. Hér eru ráð til að klífa á skilvirkari hátt.",
    sections: [
      { heading: "Placement yfir kills", content: "Í ranked skipta placement stig mun meira en kills (sérstaklega í byrjun). Forðastu óþarfa bardaga snemma í leik og einbeittu þér að lifa lengi." },
      { heading: "Landing spots", content: "Veldu fasta landing spot sem þú þekkir vel. Forðastu hot drops nema þú sért mjög örugg/ur í early-game bardögum." },
      { heading: "Rotations", content: "Lærðu zone rotations – hvenær á að fara, hvaða leið og hvernig á að nýta terrain. Vertu snemma í zone í stað þess að keyra á brúninni." },
      { heading: "Algeng mistök", content: "Over-peeking: Ekki sýna þig of mikið úr cover. W-keying: Ekki elta alla bardaga. Ekki eyða öllum mats í einn bardaga – hafðu alltaf nóg eftir." },
    ],
  },
};

const TipArticle = () => {
  const { topic } = useParams<{ topic: string }>();
  const data = tipsData[topic || ""];

  if (!data) {
    return (
      <Layout>
        <section className="hero-section">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl font-bold mb-4">Grein fannst ekki</h1>
            <Button asChild variant="outline"><Link to="/fortnite/tips">Til baka</Link></Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative hero-section overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Button asChild variant="ghost" size="sm" className="mb-6 text-muted-foreground">
              <Link to="/fortnite/tips"><ArrowLeft className="mr-2 h-4 w-4" /> Tips & Stillingar</Link>
            </Button>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
            <p className="text-muted-foreground text-lg">{data.intro}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {data.sections.map((section, i) => (
              <Card key={i} className="glass-card border-border">
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-bold mb-3">{section.heading}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-lg mb-6">
            Viltu persónulega ráðgjöf frá þjálfara? Geimur fer yfir stillingar og strategy í æfingum.
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

export default TipArticle;
