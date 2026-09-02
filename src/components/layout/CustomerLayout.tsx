import Lenis from "lenis";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MouseFollower } from "@/components/animations/MouseFollower";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ToastViewport } from "@/components/ui/Toast";
import { prefersReducedMotion } from "@/lib/utils";
import { useUiStore } from "@/stores/uiStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CustomerLayout() {
  const theme = useUiStore((s) => s.theme);
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add("custom-cursor-on", "grain");
    const lenis = new Lenis({ duration: 1.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
      document.body.classList.remove("custom-cursor-on", "grain");
    };
  }, []);

  return (
    <div className="min-h-svh bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <MouseFollower />
      <ToastViewport />
      <main className="pt-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
