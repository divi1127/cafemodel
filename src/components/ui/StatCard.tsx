import { useEffect, useRef, useState } from "react";
import { formatInr } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: number | string;
  delta?: number;
  hint?: string;
}) {
  const [shown, setShown] = useState(0);
  const numeric = typeof value === "number";
  const target = numeric ? value : 0;
  const raf = useRef(0);

  useEffect(() => {
    if (!numeric) return;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (target - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [numeric, target]);

  return (
    <article className="border border-[var(--border)] bg-[var(--card)] p-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-3 font-display text-4xl">{numeric ? formatInr(shown) : value}</p>
      {delta != null ? (
        <p className={`mt-2 text-sm ${delta >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
          {delta >= 0 ? "+" : ""}
          {delta}%
        </p>
      ) : null}
      {hint ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{hint}</p> : null}
    </article>
  );
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  onRow,
}: {
  rows: T[];
  columns: { key: string; label: string; render?: (row: T) => unknown }[];
  onRow?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto border border-[var(--border)]">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-[var(--muted)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRow?.(row)}
              className="border-t border-[var(--border)] transition hover:bg-white/4"
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3">
                  {String(c.render ? c.render(row) : (row as Record<string, unknown>)[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
