import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useUiStore } from "@/stores/uiStore";
import { prefersReducedMotion } from "@/lib/utils";

export function MouseFollower() {
  const label = useUiStore((s) => s.cursorLabel);
  const [fine, setFine] = useState(false);
  const x = useSpring(0, { stiffness: 500, damping: 40, mass: 0.4 });
  const y = useSpring(0, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const on = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", on);
    return () => window.removeEventListener("mousemove", on);
  }, [x, y]);

  if (!fine || prefersReducedMotion()) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[90] mix-blend-difference"
      style={{ left: 0, top: 0, x, y, translateX: "-50%", translateY: "-50%" }}
    >
      <div
        className={`grid place-items-center rounded-full border border-white/70 bg-white/10 backdrop-blur-sm transition-all duration-300 ${
          label ? "h-16 w-16 text-[10px] font-semibold tracking-[0.2em]" : "h-3 w-3"
        }`}
      >
        {label}
      </div>
    </motion.div>
  );
}
