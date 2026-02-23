import { Link } from "react-router-dom";
import { Facebook, Mail, Trophy, Target, Users, BookOpen, ArrowUpRight } from "lucide-react";
import geimurLogo from "@/assets/geimur-logo.png";

const journeyLinks = [
  { href: "/keppa", label: "Keppa", icon: Trophy, color: "text-[hsl(var(--planet-tournament))]" },
  { href: "/aefingar", label: "Æfa", icon: Target, color: "text-[hsl(var(--planet-training))]" },
  { href: "/samfelag", label: "Samfélag", icon: Users, color: "text-[hsl(var(--planet-community))]" },
  { href: "/fraedast", label: "Fræðast", icon: BookOpen, color: "text-[hsl(var(--planet-knowledge))]" },
];

const moreLinks = [
  { href: "/um", label: "Um Geimur" },
  { href: "/hafa-samband", label: "Hafðu samband" },
  { href: "/vefkokur", label: "Vefkökur" },
  { href: "/personuvernd", label: "Persónuvernd" },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 overflow-hidden">
      {/* Subtle nebula glow */}
      <div className="absolute inset-0 nebula-bg pointer-events-none opacity-60" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[hsl(var(--geimur-red)/0.03)] blur-3xl" />
      <div className="absolute top-0 right-1/3 w-56 h-56 rounded-full bg-[hsl(var(--planet-knowledge)/0.02)] blur-3xl" />

      <div className="container mx-auto px-4 py-14 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-3 mb-5 group">
              <img src={geimurLogo} alt="Geimur" className="h-11 w-auto transition-transform group-hover:scale-105" />
              <div>
                <span className="font-display font-bold text-xl text-foreground block tracking-wide">
                  GEIMUR
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Rafíþróttafélag</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
              Við sameinum tölvuleiki, hreyfingu og liðsanda til að efla bæði leikni og persónulegan þroska.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/rafgeimur"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-secondary/80 hover:bg-[hsl(var(--geimur-red)/0.15)] border border-border/50 hover:border-primary/30 flex items-center justify-center transition-all text-muted-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="mailto:rafgeimur@gmail.com"
                className="w-10 h-10 rounded-xl bg-secondary/80 hover:bg-[hsl(var(--geimur-red)/0.15)] border border-border/50 hover:border-primary/30 flex items-center justify-center transition-all text-muted-foreground hover:text-primary"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Journey links */}
          <div className="lg:col-span-4">
            <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-5">Ferðalagið</h3>
            <ul className="space-y-3">
              {journeyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={scrollToTop}
                    className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-secondary/60 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <link.icon className={`h-3.5 w-3.5 ${link.color}`} />
                    </div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More + Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-5">Meira</h3>
            <ul className="space-y-2.5 mb-8">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={scrollToTop}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-display font-semibold text-xs uppercase tracking-widest text-muted-foreground mb-3">Samband</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:rafgeimur@gmail.com" className="hover:text-primary transition-colors">
                  rafgeimur@gmail.com
                </a>
              </li>
              <li>
                <a href="https://facebook.com/rafgeimur" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  facebook.com/rafgeimur
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground/70">
              © {new Date().getFullYear()} Geimur – Rafíþróttafélag. Öll réttindi áskilin.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { if ((window as any).Cookiebot) (window as any).Cookiebot.renew(); }}
                className="text-xs text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer"
              >
                Cookie stillingar
              </button>
              <p className="text-xs text-muted-foreground/50">
                Hannað á Íslandi 🇮🇸
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
