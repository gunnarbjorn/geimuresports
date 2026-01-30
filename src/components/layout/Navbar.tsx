import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import geimurLogo from "@/assets/geimur-logo.png";
const navLinks = [{
  href: "/",
  label: "Heim"
}, {
  href: "/aefingar",
  label: "Æfingar"
}, {
  href: "/mot",
  label: "Mót"
}, {
  href: "/um",
  label: "Um okkur"
}, {
  href: "/hafa-samband",
  label: "Hafðu samband"
}];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="mx-auto px-3 sm:px-4 lg:container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img alt="Geimur" className="h-10 w-auto lg:h-12 transition-transform group-hover:scale-105" src="/lovable-uploads/0bc8e031-7767-44c9-ace9-477801e8816c.png" />
            <span className="font-display font-bold text-lg lg:text-xl text-foreground">
              GEIMUR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => <Link key={link.href} to={link.href} className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.href ? "text-primary" : "text-muted-foreground"}`}>
                {link.label}
              </Link>)}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Button asChild className="btn-primary-gradient">
              <Link to="/skraning">Skrá mig</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-foreground" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map(link => <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)} className={`text-base font-medium transition-colors hover:text-primary px-2 py-2 ${location.pathname === link.href ? "text-primary" : "text-muted-foreground"}`}>
                  {link.label}
                </Link>)}
              <div className="pt-4 px-2">
                <Button asChild className="w-full btn-primary-gradient">
                  <Link to="/skraning" onClick={() => setIsOpen(false)}>
                    Skrá mig
                  </Link>
                </Button>
              </div>
            </div>
          </div>}
      </div>
    </nav>;
}