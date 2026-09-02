import { motion } from "framer-motion";

export function AnimatedBackground({ variant = "page" }: { variant?: "page" | "hero" }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[var(--primary)]/12 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[var(--copper)]/10 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, -16, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {variant === "hero" &&
        Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-[var(--primary)]/40"
            style={{ left: `${8 + i * 6}%`, top: `${20 + (i % 5) * 12}%` }}
            animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 4 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
    </div>
  );
}
