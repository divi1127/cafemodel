import { motion, type HTMLMotionProps } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";
import type { ReactNode } from "react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)", scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function PageEntrance({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  if (prefersReducedMotion()) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={stagger} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function EntranceItem(props: HTMLMotionProps<"div">) {
  if (prefersReducedMotion()) return <div {...(props as object)} />;
  return <motion.div variants={item} {...props} />;
}
