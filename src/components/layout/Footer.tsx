import { Link, useNavigate } from "react-router-dom";
import { Facebook, Mail } from "lucide-react";
import geimurLogo from "@/assets/geimur-logo.png";

const footerLinks = {
  navigation: [
    { href: "/", label: "Heim" },
    { href: "/aefingar", label: "Æfingar" },
    { href: "/mot", label: "Mót" },
    { href: "/um", label: "Um Geimur" },
    { href: "/hafa-samband", label: "Hafðu samband" },
  ],
  legal: [
    { href: "/skraning", label: "Skráning" },
  ],
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border/40">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={geimurLogo} alt="Geimur" className="h-12 w-auto" />
              <div>
                <span className="font-display font-bold text-xl text-foreground block">
                  GEIMUR
                </span>
                <span className="text-sm text-muted-foreground">Rafíþróttafélag</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              Við sameinum tölvuleiki, hreyfingu og liðsanda til að efla bæði leikni og persónulegan þroska.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com/rafgeimur"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="mailto:rafgeimur@gmail.com"
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-foreground hover:text-primary"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Valmynd</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={scrollToTop}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Hafa samband</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:rafgeimur@gmail.com" className="hover:text-primary transition-colors">
                  rafgeimur@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/rafgeimur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  /rafgeimur
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Geimur – Rafíþróttafélag. Öll réttindi áskilin.
          </p>
        </div>
      </div>
    </footer>
  );
}
