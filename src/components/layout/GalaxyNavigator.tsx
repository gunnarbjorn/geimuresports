import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trophy, Target, BookOpen, MessageCircle, Swords } from "lucide-react";

interface Planet {
  id: string;
  label: string;
  href: string;
  color: string;
  glowColor: string;
  icon: React.ElementType;
}

const planets: Planet[] = [
  {
    id: "hero",
    label: "Heim",
    href: "/",
    color: "var(--geimur-red)",
    glowColor: "var(--geimur-red)",
    icon: Swords,
  },
  {
    id: "tournaments",
    label: "Mót",
    href: "/mot",
    color: "var(--planet-tournament)",
    glowColor: "var(--planet-tournament-glow)",
    icon: Trophy,
  },
  {
    id: "training",
    label: "Æfingar",
    href: "/aefingar",
    color: "var(--planet-training)",
    glowColor: "var(--planet-training-glow)",
    icon: Target,
  },
  {
    id: "fortnite",
    label: "Fortnite",
    href: "/fortnite",
    color: "var(--planet-knowledge)",
    glowColor: "var(--planet-knowledge-glow)",
    icon: BookOpen,
  },
  {
    id: "community",
    label: "Samfélag",
    href: "/fortnite/community",
    color: "var(--planet-community)",
    glowColor: "var(--planet-community-glow)",
    icon: MessageCircle,
  },
];

export function GalaxyNavigator() {
  const location = useLocation();
  const [activePlanet, setActivePlanet] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const isHomePage = location.pathname === "/";

  // On sub-pages, highlight the matching planet
  useEffect(() => {
    if (!isHomePage) {
      const match = planets.find((p) => p.href !== "/" && location.pathname.startsWith(p.href));
      if (match) setActivePlanet(match.id);
      else setActivePlanet("hero");
    }
  }, [location.pathname, isHomePage]);

  // On homepage, track scroll position to determine active planet
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = planets.map((p) => document.getElementById(`planet-${p.id}`)).filter(Boolean);
      const scrollY = window.scrollY + window.innerHeight / 3;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(window.scrollY / docHeight, 1));

      let current = "hero";
      for (const section of sections) {
        if (section && section.offsetTop <= scrollY) {
          current = section.id.replace("planet-", "");
        }
      }
      setActivePlanet(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const active = planets.find((p) => p.id === activePlanet) || planets[0];

  return (
    <div className="fixed top-16 lg:top-20 left-0 right-0 z-40 pointer-events-none">
      <div className="mx-auto px-4 lg:container">
        <div className="flex items-center justify-center gap-1 sm:gap-2 py-2 pointer-events-auto">
          {/* Orbit line background */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px mx-auto max-w-md opacity-20"
            style={{ background: `linear-gradient(90deg, transparent, hsl(${active.color}), transparent)` }}
          />
          
          {planets.map((planet, i) => {
            const isActive = activePlanet === planet.id;
            const Icon = planet.icon;
            
            return (
              <Link
                key={planet.id}
                to={isHomePage && document.getElementById(`planet-${planet.id}`) ? "#" : planet.href}
                onClick={(e) => {
                  if (isHomePage) {
                    const el = document.getElementById(`planet-${planet.id}`);
                    if (el) {
                      e.preventDefault();
                      const offset = el.getBoundingClientRect().top + window.scrollY - 120;
                      window.scrollTo({ top: offset, behavior: "smooth" });
                    }
                  }
                }}
                className="relative flex flex-col items-center gap-1 group"
              >
                {/* Planet dot/icon */}
                <div
                  className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
                    isActive
                      ? "w-10 h-10 sm:w-11 sm:h-11"
                      : "w-7 h-7 sm:w-8 sm:h-8 opacity-50 hover:opacity-80"
                  }`}
                  style={{
                    background: isActive
                      ? `radial-gradient(circle, hsl(${planet.color} / 0.25) 0%, transparent 70%)`
                      : undefined,
                  }}
                >
                  {/* Glow ring */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full animate-pulse-glow"
                      style={{
                        boxShadow: `0 0 20px hsl(${planet.glowColor} / 0.4), 0 0 40px hsl(${planet.glowColor} / 0.15)`,
                      }}
                    />
                  )}
                  <div
                    className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive ? "w-8 h-8 sm:w-9 sm:h-9" : "w-5 h-5 sm:w-6 sm:h-6"
                    }`}
                    style={{
                      background: `hsl(${planet.color} / ${isActive ? 0.2 : 0.1})`,
                      border: `1.5px solid hsl(${planet.color} / ${isActive ? 0.5 : 0.2})`,
                    }}
                  >
                    <Icon
                      className="transition-all duration-300"
                      style={{ color: `hsl(${planet.color})` }}
                      size={isActive ? 16 : 12}
                    />
                  </div>
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] sm:text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                  style={{ color: isActive ? `hsl(${planet.color})` : undefined }}
                >
                  {planet.label}
                </span>

                {/* Connector line to next */}
                {i < planets.length - 1 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-px hidden sm:block"
                    style={{
                      left: "100%",
                      width: "16px",
                      background: `hsl(${planet.color} / 0.15)`,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
