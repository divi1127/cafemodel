import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "line" | "danger";

const sizes: Record<string, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function Button({
  children,
  className,
  variant = "primary",
  magnetic = false,
  size,
  asChild: _asChild,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  magnetic?: boolean;
  size?: string;
  asChild?: boolean;
}) {
  const styles: Record<Variant, string> = {
    primary:
      "bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110",
    ghost: "bg-transparent text-[var(--foreground)] hover:bg-white/5",
    line: "border border-[var(--border)] bg-transparent hover:border-[var(--primary)]",
    danger: "bg-[var(--danger)] text-white",
  };
  const btn = (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition disabled:opacity-40",
        styles[variant],
        size ? (sizes[size] ?? size) : "",
        className,
      )}
      {...(rest as ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
  return magnetic ? <MagneticButton>{btn}</MagneticButton> : btn;
}