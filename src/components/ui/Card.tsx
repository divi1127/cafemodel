import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-[0_1px_0_rgba(255,255,255,0.03)]",
        onClick ? "cursor-pointer" : "",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone,
  variant,
  className,
  onClick,
}: {
  children: ReactNode;
  tone?: "gold" | "muted" | "success" | "warn" | "danger";
  variant?: string;
  className?: string;
  onClick?: () => void;
}) {
  const active = (tone ?? variant ?? "gold") as
    | "gold"
    | "muted"
    | "success"
    | "warn"
    | "danger";
  const map = {
    gold: "border-[var(--primary)]/40 text-[var(--primary)]",
    muted: "border-[var(--border)] text-[var(--muted-foreground)]",
    success: "border-[var(--success)]/40 text-[var(--success)]",
    warn: "border-[var(--warning)]/40 text-[var(--warning)]",
    danger: "border-[var(--danger)]/40 text-[var(--danger)]",
  };
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em]",
        onClick ? "cursor-pointer" : "",
        map[active] ?? map.gold,
        className,
      )}
    >
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
  description,
  icon,
  action,
}: {
  title: string;
  body?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  const copy = body ?? description;
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      {icon ? <div className="mb-4 text-[var(--muted-foreground)]">{icon}</div> : null}
      <h3 className="font-display text-3xl">{title}</h3>
      {copy ? <p className="mt-2 max-w-md text-[var(--muted-foreground)]">{copy}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
