import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UtensilsCrossed, Wrench, CircleDot, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { tables as seedTables } from "@/data/tables";
import { orders } from "@/data/orders";
import { reservations as allReservations } from "@/data/reservations";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Drawer } from "@/components/ui/Modal";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import type { CafeTable, TableStatus } from "@/types";

const statusConfig: Record<TableStatus, { badge: string; label: string; icon: React.ReactNode }> = {
  available: { badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40", label: "Available", icon: <CircleDot size={12} /> },
  reserved: { badge: "bg-amber-500/15 text-amber-400 border-amber-500/40", label: "Reserved", icon: <Clock size={12} /> },
  occupied: { badge: "bg-red-500/15 text-red-400 border-red-500/40", label: "Occupied", icon: <UtensilsCrossed size={12} /> },
  cleaning: { badge: "bg-sky-500/15 text-sky-400 border-sky-500/40", label: "Cleaning", icon: <Wrench size={12} /> },
};

const floorColors: Record<TableStatus, { ring: string; bg: string }> = {
  available: { ring: "border-emerald-500/60", bg: "bg-emerald-500/8" },
  reserved: { ring: "border-amber-500/60", bg: "bg-amber-500/8" },
  occupied: { ring: "border-red-500/60", bg: "bg-red-500/8" },
  cleaning: { ring: "border-sky-500/60", bg: "bg-sky-500/8" },
};

export default function Tables() {
  const [tableData, setTableData] = useState<CafeTable[]>(seedTables);
  const [selected, setSelected] = useState<CafeTable | null>(null);

  const counts = {
    total: tableData.length,
    available: tableData.filter((t) => t.status === "available").length,
    reserved: tableData.filter((t) => t.status === "reserved").length,
    occupied: tableData.filter((t) => t.status === "occupied").length,
    cleaning: tableData.filter((t) => t.status === "cleaning").length,
  };

  const changeStatus = (id: string, status: TableStatus) => {
    setTableData((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  const linkedOrder = selected?.orderId ? orders.find((o) => o.id === selected.orderId) : null;
  const linkedReservation = selected?.reservationId ? allReservations.find((r) => r.id === selected.reservationId) : null;

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
              Table Management
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Interactive floor plan and table status
            </p>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            <StatCard label="Total Tables" value={counts.total} />
            <StatCard label="Available" value={counts.available} hint="ready for guests" />
            <StatCard label="Reserved" value={counts.reserved} hint="upcoming" />
            <StatCard label="Occupied" value={counts.occupied} hint="active now" />
            <StatCard label="Cleaning" value={counts.cleaning} hint="turnover" />
          </div>
        </EntranceItem>

        <EntranceItem>
          <Card className="p-5">
            <h2 className="mb-4 font-display text-lg font-semibold text-[var(--foreground)]">
              Floor Plan
            </h2>
            <div
              className="relative w-full overflow-hidden border border-[var(--border)] bg-[var(--muted)]/30"
              style={{ aspectRatio: "16/9" }}
            >
              {tableData.map((t) => {
                const fc = floorColors[t.status];
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => setSelected(t)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "absolute z-10 flex flex-col items-center justify-center rounded-full border-2 transition-shadow cursor-pointer shadow-lg",
                      "w-[7%] min-w-[52px] aspect-square",
                      fc.bg,
                      fc.ring,
                    )}
                    style={{ left: `${t.x}%`, top: `${t.y}%` }}
                  >
                    <span className="text-sm font-bold text-[var(--foreground)] leading-none">{t.number}</span>
                    <span className="flex items-center gap-0.5 text-[9px] text-[var(--muted-foreground)] leading-none mt-0.5">
                      <Users size={8} /> {t.capacity}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </EntranceItem>

        <EntranceItem>
          <Card className="p-5">
            <h2 className="mb-3 font-display text-lg font-semibold text-[var(--foreground)]">Status Legend</h2>
            <div className="flex flex-wrap gap-3">
              {(["available", "reserved", "occupied", "cleaning"] as TableStatus[]).map((s) => (
                <span
                  key={s}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                    statusConfig[s].badge,
                  )}
                >
                  {statusConfig[s].icon}
                  {statusConfig[s].label}
                </span>
              ))}
            </div>
          </Card>
        </EntranceItem>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={`Table ${selected?.number ?? ""}`}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                  statusConfig[selected.status].badge,
                )}
              >
                {statusConfig[selected.status].icon}
                {statusConfig[selected.status].label}
              </span>
              <span className="text-sm text-[var(--muted-foreground)]">Seats {selected.capacity}</span>
            </div>

            {selected.customer && (
              <div className="border border-[var(--border)] bg-[var(--muted)]/40 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Guest</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{selected.customer}</p>
              </div>
            )}

            {linkedOrder && (
              <div className="border border-[var(--border)] bg-[var(--muted)]/40 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Current Order</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {linkedOrder.number} &mdash; {linkedOrder.status}
                  </p>
                  {linkedOrder.items.map((item, i) => (
                    <p key={i} className="text-xs text-[var(--muted-foreground)]">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                  <p className="pt-1 text-sm font-semibold text-[var(--foreground)]">
                    Total: ₹{linkedOrder.total}
                  </p>
                </div>
              </div>
            )}

            {linkedReservation && (
              <div className="border border-[var(--border)] bg-[var(--muted)]/40 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Reservation</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">{linkedReservation.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {linkedReservation.date} at {linkedReservation.time} &mdash; {linkedReservation.guests} guests
                  </p>
                  {linkedReservation.request && (
                    <p className="text-xs italic text-[var(--muted-foreground)]">
                      &ldquo;{linkedReservation.request}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Change Status</p>
              <div className="flex flex-wrap gap-2">
                {(["available", "reserved", "occupied", "cleaning"] as TableStatus[]).map((s) => (
                  <Button
                    key={s}
                    variant={selected.status === s ? "primary" : "line"}
                    onClick={() => changeStatus(selected.id, s)}
                  >
                    {statusConfig[s].icon}
                    {statusConfig[s].label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </PageEntrance>
  );
}
