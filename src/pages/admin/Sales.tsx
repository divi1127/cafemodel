import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Calendar, TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import { analytics } from "@/data/analytics";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";

const COLORS = ["var(--primary)", "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

const ranges = ["Today", "This Week", "This Month", "This Quarter", "This Year"] as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-[var(--muted-foreground)]">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm text-[var(--foreground)]">
          <span className="inline-block h-2 w-2 rounded-full mr-1.5" style={{ background: entry.color }} />
          {entry.name}:{" "}
          <span className="font-semibold">
            {typeof entry.value === "number" && entry.value > 999
              ? formatInr(entry.value)
              : entry.value?.toLocaleString("en-IN")}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function Sales() {
  const [range, setRange] = useState<(typeof ranges)[number]>("This Week");
  const { kpis, salesByDay, categories, peakHours, customersTrend } = analytics;

  const revenueData = salesByDay.map((d) => ({
    ...d,
    revenue: Math.round(d.sales * 0.85),
  }));

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
                Sales Analytics
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Track performance and revenue insights
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    range === r
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  )}
                >
                  {r}
                </button>
              ))}
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
          </div>
        </EntranceItem>

        <EntranceItem>
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Sales by Day
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">Daily order revenue breakdown</p>
              </div>
              <Badge className="bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20">
                {range}
              </Badge>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByDay} barCategoryGap="20%">
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
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                  />
                  <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]} fill="var(--primary)" />
                  <Bar dataKey="orders" name="Orders" radius={[6, 6, 0, 0]} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </EntranceItem>

        <div className="grid gap-4 lg:grid-cols-2">
          <EntranceItem>
            <Card className="p-5">
              <div className="mb-4">
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Revenue Trend
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">Revenue over time</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#revenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </EntranceItem>

          <EntranceItem>
            <Card className="p-5">
              <div className="mb-4">
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Category Breakdown
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">Sales distribution by category</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-56 w-56 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
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
                <div className="flex-1 space-y-2.5">
                  {categories.map((cat, i) => {
                    const total = categories.reduce((s, c) => s + c.value, 0);
                    const pct = ((cat.value / total) * 100).toFixed(1);
                    return (
                      <div key={cat.name}>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ background: COLORS[i % COLORS.length] }}
                            />
                            <span className="text-[var(--foreground)]">{cat.name}</span>
                          </div>
                          <span className="font-medium text-[var(--foreground)]">{pct}%</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-[var(--muted)]">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: COLORS[i % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </EntranceItem>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <EntranceItem>
            <Card className="p-5">
              <div className="mb-4">
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Peak Hours
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">Order volume throughout the day</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHours} barCategoryGap="15%">
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
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.2 }} />
                    <Bar dataKey="orders" name="Orders" radius={[4, 4, 0, 0]} fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </EntranceItem>

          <EntranceItem>
            <Card className="p-5">
              <div className="mb-4">
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Customer Trend
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">Monthly unique customers</p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customersTrend}>
                    <XAxis
                      dataKey="month"
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
                      dataKey="customers"
                      name="Customers"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                      activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "var(--card)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </EntranceItem>
        </div>
      </div>
    </PageEntrance>
  );
}
