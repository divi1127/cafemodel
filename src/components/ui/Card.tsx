import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-[0_1px_0_rgba(255,255,255,0.03)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "gold",
}: {
  children: ReactNode;
  tone?: "gold" | "muted" | "success" | "warn" | "danger";
}) {
  const map = {
    gold: "border-[var(--primary)]/40 text-[var(--primary)]",
    muted: "border-[var(--border)] text-[var(--muted-foreground)]",
    success: "border-[var(--success)]/40 text-[var(--success)]",
    warn: "border-[var(--warning)]/40 text-[var(--warning)]",
    danger: "border-[var(--danger)]/40 text-[var(--danger)]",
  };
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em]", map[tone])}>
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-white/8", className)} />;
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      <h3 className="font-display text-3xl">{title}</h3>
      <p className="mt-2 max-w-md text-[var(--muted-foreground)]">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
