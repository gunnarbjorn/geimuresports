import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

export function ParallaxStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const scrollRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    const createStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        const isBright = Math.random() > 0.92;
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isBright ? 1.2 + Math.random() * 1.2 : 0.4 + Math.random() * 0.8,
          opacity: isBright ? 0.5 + Math.random() * 0.5 : 0.1 + Math.random() * 0.3,
          speed: 0.02 + Math.random() * 0.08,
          color: isBright && Math.random() > 0.6
            ? `hsla(${[5, 145, 265, 35][Math.floor(Math.random() * 4)]}, 60%, 70%`
            : "hsla(220, 20%, 90%",
        });
      }
      starsRef.current = stars;
    };

    resize();
    createStars();

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scrollY = scrollRef.current;

      for (const star of starsRef.current) {
        const parallaxY = star.y - scrollY * star.speed;
        // Wrap around
        const wrappedY = ((parallaxY % canvas.height) + canvas.height) % canvas.height;

        // Twinkle
        const twinkle = 0.7 + 0.3 * Math.sin(Date.now() * 0.001 * star.speed * 10 + star.x);

        ctx.beginPath();
        ctx.arc(star.x, wrappedY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}, ${star.opacity * twinkle})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      resize();
      createStars();
    });

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
