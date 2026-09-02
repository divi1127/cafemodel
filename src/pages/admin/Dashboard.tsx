import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Users,
  CalendarDays,
  Clock,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import { analytics } from "@/data/analytics";
import { orders } from "@/data/orders";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Card";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";

const COLORS = ["var(--primary)", "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-lg">
      <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-medium text-[var(--foreground)]">
          {entry.name}: {typeof entry.value === "number" && entry.value > 999 ? formatInr(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
};

function AnimatedCounter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = 0;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };

    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("en-IN")}
    </span>
  );
}

const statusColors: Record<string, string> = {
  new: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  confirmed: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  preparing: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  ready: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  completed: "bg-[var(--muted)]/40 text-[var(--muted-foreground)] border-[var(--border)]",
  cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
};

export default function Dashboard() {
  const { kpis, salesByDay, categories, peakHours } = analytics;
  const recentOrders = orders.slice(0, 5);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{today}</p>
            </div>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              label="Today's Sales"
              value={kpis.todaySales}
              delta={kpis.todaySalesDelta}
              hint="vs yesterday"
            />
            <StatCard
              label="Total Orders"
              value={kpis.totalOrders}
              delta={kpis.ordersDelta}
              hint="vs yesterday"
            />
            <StatCard
              label="Revenue"
              value={formatInr(kpis.revenue)}
              delta={kpis.revenueDelta}
              hint="this month"
            />
            <StatCard
              label="Customers"
              value={kpis.customers}
              delta={kpis.customersDelta}
              hint="this week"
            />
            <StatCard
              label="Reservations"
              value={kpis.reservations}
              hint="today"
            />
            <StatCard
              label="Pending Orders"
              value={kpis.pendingOrders}
              hint="awaiting"
            />
            <StatCard
              label="Low Stock Items"
              value={kpis.lowStock}
              hint="needs restock"
            />
          </div>
        </EntranceItem>

        <div className="grid gap-4 lg:grid-cols-3">
          <EntranceItem className="lg:col-span-2">
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Sales This Week
                </h2>
                <span className="text-xs text-[var(--muted-foreground)]">Last 7 days</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByDay} barCategoryGap="25%">
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.3 }} />
                    <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]} fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </EntranceItem>

          <EntranceItem>
            <Card className="p-5">
              <h2 className="mb-4 font-display text-lg font-semibold text-[var(--foreground)]">
                Categories
              </h2>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {categories.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categories.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-[var(--muted-foreground)]">{cat.name}</span>
                    <span className="ml-auto font-medium text-[var(--foreground)]">{cat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </EntranceItem>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <EntranceItem>
            <Card className="p-5">
              <h2 className="mb-4 font-display text-lg font-semibold text-[var(--foreground)]">
                Peak Hours
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={peakHours}>
                    <XAxis
                      dataKey="hour"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      name="Orders"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "var(--primary)" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </EntranceItem>

          <EntranceItem>
            <Card className="p-5">
              <h2 className="mb-4 font-display text-lg font-semibold text-[var(--foreground)]">
                Recent Orders
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="pb-2 font-medium text-[var(--muted-foreground)]">#</th>
                      <th className="pb-2 font-medium text-[var(--muted-foreground)]">Customer</th>
                      <th className="pb-2 font-medium text-[var(--muted-foreground)]">Total</th>
                      <th className="pb-2 font-medium text-[var(--muted-foreground)]">Status</th>
                      <th className="pb-2 font-medium text-[var(--muted-foreground)]">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]/50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-[var(--muted)]/30">
                        <td className="py-2.5 font-mono text-[var(--muted-foreground)]">
                          {order.number}
                        </td>
                        <td className="py-2.5 font-medium text-[var(--foreground)]">
                          {order.customerName}
                        </td>
                        <td className="py-2.5 font-medium text-[var(--foreground)]">
                          {formatInr(order.total)}
                        </td>
                        <td className="py-2.5">
                          <Badge
                            className={cn(
                              "capitalize",
                              statusColors[order.status] ?? statusColors.new
                            )}
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-[var(--muted-foreground)]">
                          {order.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </EntranceItem>
        </div>
      </div>
    </PageEntrance>
  );
}
