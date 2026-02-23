import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { Button } from "@/components/ui/button";
import { Cookie, ShieldCheck, Info, RefreshCw } from "lucide-react";

const COOKIEBOT_CBID = "01026538-24d5-4bed-a08d-a227f9d4f69b";

function handleRenewConsent() {
  if (typeof window !== "undefined" && (window as any).Cookiebot) {
    (window as any).Cookiebot.renew();
  } else {
    alert("Cookie stillingar eru ekki tilbúnar enn – reyndu að endurhlaða síðuna.");
  }
}

export default function Vefkokur() {
  useEffect(() => {
    // Load Cookiebot declaration script
    const container = document.getElementById("CookieDeclaration");
    if (container && !container.querySelector("script")) {
      const script = document.createElement("script");
      script.id = "CookieDeclaration";
      script.src = `https://consent.cookiebot.com/${COOKIEBOT_CBID}/cd.js`;
      script.type = "text/javascript";
      script.async = true;
      container.appendChild(script);
    }
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 lg:py-24 max-w-3xl">
        {/* Header */}
        <FadeInView>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                Vefkökur og virkni þeirra
              </h1>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Hér má sjá upplýsingar um þær vefkökur sem þessi vefur notar.
            </p>
          </div>
        </FadeInView>

        {/* A) Kynning */}
        <FadeInView delay={0.05}>
          <section className="mb-10">
            <p className="text-muted-foreground leading-relaxed">
              Þessi vefsíða styðst við vefkökur. Við notum vefkökur til að tryggja mikilvæga virkni, greina umferð um síðuna, sérsníða innihald og til markaðssetningar. Við gætum einnig deilt upplýsingum um notkun á síðunni með þjónustuaðilum (t.d. mælingar/markaðssetning) í samræmi við samþykki þitt.
            </p>
          </section>
        </FadeInView>

        {/* B) Hvað eru vefkökur */}
        <FadeInView delay={0.1}>
          <section className="mb-10 p-6 rounded-2xl bg-card border border-border/60">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold text-foreground">Hvað eru vefkökur?</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Vefkökur eru litlar textaskrár sem vefsíður setja í vafrann þinn til að bæta virkni og upplifun.
            </p>
          </section>
        </FadeInView>

        {/* C) Samþykki */}
        <FadeInView delay={0.15}>
          <section className="mb-10 p-6 rounded-2xl bg-card border border-border/60">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold text-foreground">Samþykki</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Lög og reglur heimila okkur einungis að vista nauðsynlegar vefkökur án samþykkis. Fyrir aðrar vefkökur (t.d. tölfræði og markaðssetningu) biðjum við um samþykki. Þú getur hvenær sem er breytt eða afturkallað samþykki þitt.
            </p>
          </section>
        </FadeInView>

        {/* D) Uppfæra samþykki */}
        <FadeInView delay={0.2}>
          <div className="mb-14 flex justify-center">
            <Button
              size="lg"
              className="btn-primary-gradient text-base px-8 py-6 gap-2"
              onClick={handleRenewConsent}
            >
              <RefreshCw className="h-5 w-5" />
              Uppfæra samþykki
            </Button>
          </div>
        </FadeInView>

        {/* E) Cookie Declaration */}
        <FadeInView delay={0.25}>
          <section className="mb-10">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Vefkökuyfirlýsing</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Hér birtist sjálfvirk vefkökuyfirlýsing frá Cookiebot.
            </p>
            {/* Cookiebot declaration embed – script injected via useEffect */}
            <div
              id="CookieDeclaration"
              className="rounded-2xl bg-card border border-border/60 p-6 min-h-[120px] [&_table]:w-full [&_table]:text-sm [&_table]:text-muted-foreground [&_th]:text-left [&_th]:text-foreground [&_th]:font-semibold [&_th]:pb-2 [&_td]:py-1 [&_a]:text-primary [&_a]:underline"
            />
          </section>
        </FadeInView>

        {/* F) Tenglar */}
        <FadeInView delay={0.3}>
          <section className="pt-6 border-t border-border/40 space-y-2 text-sm text-muted-foreground">
            <p>
              Sjá einnig{" "}
              <Link to="/personuvernd" className="text-primary hover:underline">
                Persónuverndarstefnu
              </Link>
            </p>
            <p>
              Hafðu samband:{" "}
              <a href="mailto:rafgeimur@gmail.com" className="text-primary hover:underline">
                rafgeimur@gmail.com
              </a>
            </p>
          </section>
        </FadeInView>
      </div>
    </Layout>
  );
}
