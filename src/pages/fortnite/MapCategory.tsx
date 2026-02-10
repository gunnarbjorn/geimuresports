import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MapEntry {
  name: string;
  code: string;
  description: string;
}

interface CategoryData {
  title: string;
  description: string;
  maps: MapEntry[];
}

const categoriesData: Record<string, CategoryData> = {
  "1v1": {
    title: "1v1 Maps",
    description: "Bestu 1v1 kortin til að æfa einvígi, piece control og close-combat leikni.",
    maps: [
      { name: "Raider's 1v1", code: "7562-1598-0199", description: "Vinsælasta 1v1 æfingakortið. Byggt til að æfa alla þætti einvígja." },
      { name: "BHE 1v1 Build Fights", code: "8064-7152-2934", description: "Frábært til að æfa builds og fight mechanics á flatri plöttu." },
      { name: "Pandvil's 1v1 Zero Delay", code: "6446-2604-0893", description: "Hentar vel til að æfa edits og piece control á hraðri leik." },
    ],
  },
  aim: {
    title: "Aim æfingar",
    description: "Skerptu skotfimi þína – tracking, flick shots og target switching.",
    maps: [
      { name: "Skaavok Aim Trainer", code: "8022-6842-4965", description: "Ítarlegt aim æfingakort með mörgum stillingum og aðstæðum." },
      { name: "Aim Training by Donwozi", code: "7634-2821-0171", description: "Einfalt og skilvirkt – hentar bæði byrjendum og lengra komnum." },
      { name: "Piece Control & Aim", code: "6531-5731-1207", description: "Sameinar aim og piece control æfingar í einum pakka." },
    ],
  },
  edit: {
    title: "Edit æfingar",
    description: "Hraðar og nákvæmar edits skipta sköpum í keppni. Æfðu allar helstu gerðirnar.",
    maps: [
      { name: "Raider's Edit Course", code: "1634-3532-1862", description: "Klassískt edit course sem nær yfir allar grunngerðir edita." },
      { name: "Mongraal's Edit Course", code: "0225-0764-2838", description: "Krefjandi course sem hjálpar þér að ná hraða og nákvæmni." },
      { name: "Edit Pump Wars", code: "9124-5509-6523", description: "Æfðu edits í bardaga-aðstæðum, ekki bara í tómi." },
    ],
  },
  warmup: {
    title: "Warm-up Maps",
    description: "Hituðu upp rétt áður en þið farið í ranked, mót eða scrims.",
    maps: [
      { name: "Flea's All-In-One Warmup", code: "8303-2401-2524", description: "Aim, edits og builds í einni æfingu. Hentar sem dagleg upphitun." },
      { name: "Quick Warmup Course", code: "2085-6867-8284", description: "Stutt og skipulögð upphitun sem tekur 5–10 mín." },
      { name: "Pro Warmup Routine", code: "6570-5231-1418", description: "Upphitun sem líkir eftir raunverulegum keppnisaðstæðum." },
    ],
  },
  boxfight: {
    title: "Boxfight Maps",
    description: "Boxfights eru kjarninn í Fortnite keppni. Þjálfaðu pressure-play og reads.",
    maps: [
      { name: "Pandvil's Box PVP", code: "0522-9765-8553", description: "Klassískt boxfight kort – einfalt og skemmtilegt." },
      { name: "Clix Box Fights", code: "7620-0771-9529", description: "Hraðtempað boxfight kort vinsælt meðal pro-spilara." },
      { name: "Zone Wars + Box Fight", code: "9586-8537-8075", description: "Sameinar zone wars og boxfight í einu korti." },
    ],
  },
};

const MapCategory = () => {
  const { category } = useParams<{ category: string }>();
  const { toast } = useToast();
  const data = categoriesData[category || ""];

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [category]);

  if (!data) {
    return (
      <Layout>
        <section className="hero-section">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl font-bold mb-4">Kort fannst ekki</h1>
            <Button asChild variant="outline"><Link to="/fortnite/maps">Til baka</Link></Button>
          </div>
        </section>
      </Layout>
    );
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Kóði afritaður!", description: code });
  };

  return (
    <Layout>
      <section className="relative hero-section overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Button asChild variant="ghost" size="sm" className="mb-6 text-muted-foreground">
              <Link to="/fortnite/maps"><ArrowLeft className="mr-2 h-4 w-4" /> Fortnite Maps</Link>
            </Button>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{data.title}</h1>
            <p className="text-muted-foreground text-lg">{data.description}</p>
          </div>
        </div>
      </section>

      <section className="section-spacing-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {data.maps.map((map, i) => (
              <Card key={i} className="glass-card border-border card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-xl">{map.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{map.description}</p>
                  <button
                    onClick={() => copyCode(map.code)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-mono text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    {map.code}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing-lg bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-lg mb-6">
            Viltu fá markvissa þjálfun á þessum kortum? Geimur þjálfarar nota þessi kort í æfingum.
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

export default MapCategory;
