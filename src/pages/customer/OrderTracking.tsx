import { motion } from "framer-motion";
import { Package, Clock, ArrowRight, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState, Badge } from "@/components/ui/Card";
import { useOrderStore } from "@/stores/orderStore";
import { cn, formatInr } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusFlow: OrderStatus[] = ["new", "confirmed", "preparing", "ready", "served"];

const statusLabels: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusColors: Record<OrderStatus, string> = {
  new: "bg-sky-500",
  confirmed: "bg-[var(--primary)]",
  preparing: "bg-[var(--warning)]",
  ready: "bg-[var(--success)]",
  served: "bg-[var(--success)]",
  completed: "bg-[var(--success)]",
  cancelled: "bg-[var(--danger)]",
};

function ProgressTracker({ status }: { status: OrderStatus }) {
  const activeIdx = statusFlow.indexOf(status);
  const isTerminal = status === "completed" || status === "cancelled";
  const isCancelled = status === "cancelled";

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex gap-1.5">
        {statusFlow.map((s, i) => {
          const reached = !isTerminal && activeIdx >= i;
          const current = !isTerminal && activeIdx === i;
          return (
            <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--border)]">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  isCancelled ? "bg-[var(--danger)]" : reached ? statusColors[s] : "",
                )}
                initial={{ width: 0 }}
                animate={{ width: reached ? "100%" : "0%" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {statusFlow.map((s, i) => {
          const reached = !isTerminal && activeIdx >= i;
          const current = !isTerminal && activeIdx === i;
          return (
            <span
              key={s}
              className={cn(
                "font-sans text-[10px] uppercase tracking-wider transition-colors",
                current
                  ? "text-[var(--primary)] font-semibold"
                  : reached
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)]/50",
              )}
            >
              {statusLabels[s]}
            </span>
          );
        })}
      </div>

      {isCancelled && (
        <Badge tone="danger" className="mt-2">
          Cancelled
        </Badge>
      )}
    </div>
  );
}

export default function OrderTracking() {
  const orders = useOrderStore((s) => s.orders);

  const activeOrders = orders.filter(
    (o) => !["completed", "cancelled"].includes(o.status),
  );

  return (
    <PageEntrance>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] flex items-center overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
          <EntranceItem>
            <div className="space-y-6 mx-auto max-w-3xl">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Real-Time Updates
              </p>
              <h1>
                <TextReveal
                  text="Track Your Order"
                  className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)]"
                />
              </h1>
              <p className="font-sans text-lg text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed">
                Follow every step — from confirmation to your table.
              </p>
            </div>
          </EntranceItem>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {activeOrders.length === 0 ? (
            <ScrollReveal>
              <EmptyState
                title="No active orders"
                body="When you place an order, you'll be able to track it here in real time."
                action={
                  <MagneticButton strength={0.3}>
                    <Button asChild variant="primary" className="px-8">
                      <Link to="/menu">
                        Order Something
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </MagneticButton>
                }
              />
            </ScrollReveal>
          ) : (
            <div className="space-y-6">
              {activeOrders.map((order, i) => (
                <ScrollReveal key={order.id} delay={i * 0.1}>
                  <Card className="p-6 sm:p-8 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <Hash className="h-4 w-4 text-[var(--primary)]" />
                          <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                            {order.number}
                          </h3>
                          <Badge
                            tone={
                              order.status === "cancelled"
                                ? "danger"
                                : order.status === "ready" || order.status === "served"
                                  ? "success"
                                  : "gold"
                            }
                          >
                            {statusLabels[order.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(order.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="capitalize">{order.fulfillment}</span>
                          {order.table && <span>Table {order.table}</span>}
                          <span className="font-medium text-[var(--foreground)] tabular-nums">
                            {formatInr(order.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <ProgressTracker status={order.status} />

                    {/* Items */}
                    <div className="pt-2 border-t border-[var(--border)]">
                      <p className="font-sans text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
                        Items
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.05 }}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-[var(--foreground)]">
                              {item.name}
                              {item.notes && (
                                <span className="text-[var(--muted-foreground)] ml-1">
                                  ({item.notes})
                                </span>
                              )}
                            </span>
                            <span className="text-[var(--muted-foreground)] tabular-nums">
                              ×{item.quantity}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageEntrance>
  );
}
