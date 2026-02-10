import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GalaxyNavigator } from "./GalaxyNavigator";
import { ParallaxStars } from "./ParallaxStars";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const showNavigator = location.pathname === "/" || ["/mot", "/aefingar", "/fortnite", "/fortnite/community"].some(p => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-starfield bg-grid flex flex-col relative">
      <ParallaxStars />
      <Navbar />
      {showNavigator && <GalaxyNavigator />}
      <main className={`flex-1 relative z-10 ${showNavigator ? "pt-28 lg:pt-32" : "pt-16 lg:pt-20"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
