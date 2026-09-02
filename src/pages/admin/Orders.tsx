import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Package,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import { orders as allOrders } from "@/data/orders";
import type { Order } from "@/data/orders";
import { useOrderStore } from "@/stores/orderStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/StatCard";
import { Drawer } from "@/components/ui/Modal";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";

const tabs = ["all", "new", "confirmed", "preparing", "ready", "completed", "cancelled"] as const;
type Tab = (typeof tabs)[number];

const tabLabels: Record<Tab, string> = {
  all: "All",
  new: "New",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<string, string> = {
  new: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  confirmed: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  preparing: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  ready: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  completed: "bg-[var(--muted)]/50 text-[var(--muted-foreground)] border-[var(--border)]",
  cancelled: "bg-red-500/15 text-red-600 border-red-500/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  new: <AlertCircle className="h-3.5 w-3.5" />,
  confirmed: <CheckCircle2 className="h-3.5 w-3.5" />,
  preparing: <ChefHat className="h-3.5 w-3.5" />,
  ready: <Package className="h-3.5 w-3.5" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5" />,
  cancelled: <XCircle className="h-3.5 w-3.5" />,
};

const nextStatusMap: Partial<Record<string, string>> = {
  new: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "completed",
};

export default function Orders() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const setStatus = useOrderStore((s) => s.setStatus);

  const filtered =
    activeTab === "all" ? allOrders : allOrders.filter((o) => o.status === activeTab);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setStatus(orderId, newStatus as Order["status"]);
    if (selected?.id === orderId) {
      setSelected((prev) => (prev ? { ...prev, status: newStatus as Order["status"] } : prev));
    }
  };

  const columns = [
    {
      key: "number",
      header: "#",
      render: (v: string) => <span className="font-mono text-[var(--muted-foreground)]">{v}</span>,
    },
    { key: "customerName", header: "Customer" },
    {
      key: "items",
      header: "Items",
      render: (_: any, row: Order) => (
        <span className="text-[var(--muted-foreground)]">{row.items.length} items</span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (v: number) => <span className="font-medium">{formatInr(v)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (v: string) => (
        <Badge className={cn("inline-flex items-center gap-1 capitalize", statusStyles[v] ?? statusStyles.new)}>
          {statusIcons[v]}
          {v}
        </Badge>
      ),
    },
    {
      key: "fulfillment",
      header: "Type",
      render: (v: string) => (
        <span className="capitalize text-[var(--muted-foreground)]">{v}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Time",
      render: (v: string) => <span className="text-[var(--muted-foreground)]">{v}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Order) => (
        <Button variant="ghost" className="h-8 px-2 text-xs" onClick={() => setSelected(row)}>
          View
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  const nextStatus = selected ? nextStatusMap[selected.status] : undefined;

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {allOrders.length} total orders &middot; {allOrders.filter((o) => o.status === "new").length} new
            </p>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 scrollbar-none">
            {tabs.map((tab) => {
              const count =
                tab === "all"
                  ? allOrders.length
                  : allOrders.filter((o) => o.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all",
                    activeTab === tab
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                  )}
                >
                  {tabLabels[tab]}
                  <span
                    className={cn(
                      "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                      activeTab === tab
                        ? "bg-white/20 text-[var(--primary-foreground)]"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </EntranceItem>

        <EntranceItem>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <DataTable rows={filtered} columns={columns} onRow={setSelected} />
            </div>
          </Card>
        </EntranceItem>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--foreground)]">
                  Order {selected.number}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                  Placed at {selected.createdAt}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
                <p className="text-xs text-[var(--muted-foreground)]">Customer</p>
                <p className="mt-0.5 font-medium text-[var(--foreground)]">{selected.customerName}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
                <p className="text-xs text-[var(--muted-foreground)]">Status</p>
                <Badge className={cn("mt-1 capitalize", statusStyles[selected.status])}>
                  {statusIcons[selected.status]}
                  {selected.status}
                </Badge>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
                <p className="text-xs text-[var(--muted-foreground)]">Type</p>
                <p className="mt-0.5 font-medium capitalize text-[var(--foreground)]">
                  {selected.fulfillment}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
                <p className="text-xs text-[var(--muted-foreground)]">Table</p>
                <p className="mt-0.5 font-medium text-[var(--foreground)]">
                  {selected.table ?? "Takeaway"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Items</h3>
              <div className="space-y-2">
                {selected.items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--muted)]/20 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{item.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {formatInr(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Subtotal</span>
                <span className="text-[var(--foreground)]">{formatInr(selected.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Tax</span>
                <span className="text-[var(--foreground)]">{formatInr(selected.tax)}</span>
              </div>
              {selected.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Discount</span>
                  <span className="text-[var(--success)]">-{formatInr(selected.discount)}</span>
                </div>
              )}
              <div className="border-t border-[var(--border)] pt-2 flex justify-between font-semibold">
                <span className="text-[var(--foreground)]">Total</span>
                <span className="text-[var(--foreground)]">{formatInr(selected.total)}</span>
              </div>
            </div>

            {selected.notes && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Notes</h3>
                <p className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-3 text-sm text-[var(--muted-foreground)]">
                  {selected.notes}
                </p>
              </div>
            )}

            {nextStatus && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
                  Change Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    onClick={() => handleStatusChange(selected.id, nextStatus)}
                    className="flex items-center gap-2"
                  >
                    {statusIcons[nextStatus]}
                    Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                  </Button>
                  {selected.status !== "cancelled" && selected.status !== "completed" && (
                    <Button
                      variant="danger"
                      onClick={() => handleStatusChange(selected.id, "cancelled")}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </PageEntrance>
  );
}
