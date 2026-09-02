import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxImage({
  src,
  alt,
  className,
  speed = 18,
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      if (!img.current || prefersReducedMotion()) return;
      gsap.fromTo(
        img.current,
        { yPercent: -speed / 2, scale: 1.12 },
        {
          yPercent: speed / 2,
          ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={`overflow-hidden ${className ?? ""}`}>
      <img ref={img} src={src} alt={alt} className="h-full w-full object-cover will-change-transform" />
    </div>
  );
}
