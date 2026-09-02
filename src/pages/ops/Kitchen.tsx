import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Flame,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const COLUMNS: { status: OrderStatus; label: string; color: string }[] = [
  { status: "new", label: "NEW", color: "#f4ead8" },
  { status: "confirmed", label: "CONFIRMED", color: "#6b9eff" },
  { status: "preparing", label: "PREPARING", color: "#d4a843" },
  { status: "ready", label: "READY", color: "#4caf50" },
  { status: "served", label: "SERVED", color: "#666" },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  new: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "served",
};

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  new: "Accept",
  confirmed: "Start",
  preparing: "Ready",
  ready: "Serve",
};

const FULFILLMENT_ICON = {
  "dine-in": UtensilsCrossed,
  takeaway: ShoppingBag,
  delivery: Truck,
};

function timeSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "<1m";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}h ${rem}m`;
}

function OrderCard({
  order,
  onAdvance,
}: {
  order: Order;
  onAdvance: (id: string, status: OrderStatus) => void;
}) {
  const next = NEXT_STATUS[order.status];
  const icon = FULFILLMENT_ICON[order.fulfillment];

  const locationText = useMemo(() => {
    if (order.fulfillment === "dine-in") return order.table || "Dine-in";
    return order.fulfillment === "takeaway" ? "Takeaway" : "Delivery";
  }, [order.fulfillment, order.table]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "rounded-lg border p-3 space-y-2 bg-white/[0.03]",
        order.priority === "high"
          ? "border-[#c25a3c] border-t-2"
          : order.status === "new"
            ? "border-[#f4ead8]/30"
            : order.status === "ready"
              ? "border-[#4caf50]/40 bg-[#4caf50]/[0.06]"
              : order.status === "preparing"
                ? "border-l-2 border-l-[#d4a843] border-white/10"
                : order.status === "served"
                  ? "border-white/5 opacity-60"
                  : "border-white/10",
        order.status === "new" && "border-[#f4ead8]/50"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <span className="text-lg font-bold tracking-wide">{order.number}</span>
        {order.priority === "high" && (
          <span className="flex items-center gap-1 rounded bg-[#c25a3c]/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#c25a3c]">
            <Flame size={10} /> Priority
          </span>
        )}
      </div>

      {/* Location + Time */}
      <div className="flex items-center justify-between text-xs text-white/50">
        <span className="flex items-center gap-1">
          {icon && <icon size={11} />}
          {locationText}
        </span>
        <span className="flex items-center gap-1">
          <RefreshCw size={9} />
          {timeSince(order.createdAt)}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-0.5">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="truncate">
              {item.quantity}× {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="rounded bg-[#d4a843]/10 px-2 py-1 text-xs text-[#d4a843]">
          {order.notes}
        </div>
      )}

      {/* Action */}
      {next && (
        <button
          onClick={() => onAdvance(order.id, next)}
          className={cn(
            "w-full rounded-md py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px]",
            next === "confirmed"
              ? "bg-[#f4ead8] text-[#0c0a08] hover:brightness-110"
              : next === "preparing"
                ? "bg-[#d4a843] text-[#0c0a08] hover:brightness-110"
                : next === "ready"
                  ? "bg-[#4caf50] text-[#0c0a08] hover:brightness-110"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
          )}
        >
          {ACTION_LABEL[order.status]}
        </button>
      )}
    </motion.div>
  );
}

export default function Kitchen() {
  const orders = useOrderStore((s) => s.orders);
  const setStatus = useOrderStore((s) => s.setStatus);
  const pushToast = useOrderStore((s) => s.pushToast);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 10000);
    return () => window.clearInterval(id);
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Order[]> = {};
    COLUMNS.forEach((c) => {
      map[c.status] = orders.filter(
        (o) => o.status === c.status && o.status !== "completed" && o.status !== "cancelled"
      );
    });
    return map;
  }, [orders]);

  const activeCount = useMemo(
    () =>
      orders.filter(
        (o) => !["completed", "cancelled", "served"].includes(o.status)
      ).length,
    [orders]
  );

  const handleAdvance = (id: string, next: OrderStatus) => {
    setStatus(id, next);
    pushToast("Order Updated", `Moved to ${next.toUpperCase()}`);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/50">
            {new Date(now).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
          <span className="text-sm">
            <span className="font-semibold">{activeCount}</span>{" "}
            <span className="text-white/50">active orders</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4caf50] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4caf50]" />
          </span>
          Auto-refresh
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex flex-1 overflow-hidden">
        {COLUMNS.map((col) => (
          <div
            key={col.status}
            className="flex flex-1 flex-col overflow-hidden border-r border-white/10 last:border-r-0"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <span
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: col.color }}
              >
                {col.label}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tabular-nums">
                {grouped[col.status]?.length ?? 0}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              <AnimatePresence mode="popLayout">
                {grouped[col.status]?.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAdvance={handleAdvance}
                  />
                ))}
              </AnimatePresence>

              {(!grouped[col.status] || grouped[col.status].length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-white/20">
                  <CheckCircle2 size={24} className="mb-2" />
                  <p className="text-xs">No orders</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
