import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ParallaxStars } from "./ParallaxStars";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-starfield bg-grid flex flex-col relative">
      <ParallaxStars />
      <Navbar />
      <main className="flex-1 relative z-10 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
