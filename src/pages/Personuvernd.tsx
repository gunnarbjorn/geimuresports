import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FadeInView } from "@/components/layout/FadeInView";
import { ShieldCheck } from "lucide-react";

export default function Personuvernd() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 lg:py-24 max-w-3xl">
        <FadeInView>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                Persónuverndarstefna
              </h1>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Hér má finna upplýsingar um hvernig Geimur – Rafíþróttafélag meðhöndlar persónuupplýsingar.
            </p>
          </div>
        </FadeInView>

        <FadeInView delay={0.05}>
          <section className="mb-10 p-6 rounded-2xl bg-card border border-border/60 space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="font-display text-xl font-semibold text-foreground">Ábyrgðaraðili</h2>
            <p>
              Geimur – Rafíþróttafélag ber ábyrgð á meðferð persónuupplýsinga sem safnað er á þessari vefsíðu. Netfang:{" "}
              <a href="mailto:rafgeimur@gmail.com" className="text-primary hover:underline">rafgeimur@gmail.com</a>
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground pt-4">Hvaða upplýsingum er safnað?</h2>
            <p>
              Við söfnum upplýsingum sem notendur veita sjálfviljugir, t.d. nafn og netfang við skráningu í æfingar eða mót. Einnig söfnum við tölfræðiupplýsingum um heimsóknir á vefsíðuna í gegnum vefkökur.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground pt-4">Tilgangur</h2>
            <p>
              Upplýsingum er safnað til þess að veita þjónustu, senda tilkynningar tengdar viðburðum og bæta upplifun á vefsíðunni.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground pt-4">Vefkökur</h2>
            <p>
              Vefsíðan notar vefkökur til mælinga og markaðssetningar. Sjá nánari upplýsingar á{" "}
              <Link to="/vefkokur" className="text-primary hover:underline">vefkökusíðunni</Link>.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground pt-4">Réttindi þín</h2>
            <p>
              Þú átt rétt á aðgangi að persónuupplýsingum þínum, leiðréttingu, eyðingu og takmörkun vinnslu. Hafðu samband á{" "}
              <a href="mailto:rafgeimur@gmail.com" className="text-primary hover:underline">rafgeimur@gmail.com</a>{" "}
              ef þú hefur spurningar eða vilt nýta réttindi þín.
            </p>
          </section>
        </FadeInView>
      </div>
    </Layout>
  );
}
