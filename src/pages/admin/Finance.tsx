import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  FileText,
  Plus,
  CreditCard,
  Calculator,
  PieChart as PieChartIcon,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import { DataTable } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { expenses as initialExpenses } from "@/data/analytics";
import { useOrderStore } from "@/stores/orderStore";
import { formatInr, uid } from "@/lib/utils";

type Tab = "overview" | "revenue" | "expenses" | "payments" | "tax" | "pnl";

const monthlyData = [
  { month: "Jan", revenue: 420000, expense: 280000 },
  { month: "Feb", revenue: 380000, expense: 260000 },
  { month: "Mar", revenue: 510000, expense: 310000 },
  { month: "Apr", revenue: 475000, expense: 295000 },
  { month: "May", revenue: 530000, expense: 320000 },
  { month: "Jun", revenue: 590000, expense: 340000 },
];

const revenueData = [
  { date: "01 Aug", source: "Dine-in", amount: 18500 },
  { date: "02 Aug", source: "Takeaway", amount: 12300 },
  { date: "03 Aug", source: "Delivery", amount: 8900 },
  { date: "04 Aug", source: "Dine-in", amount: 21000 },
  { date: "05 Aug", source: "Catering", amount: 35000 },
  { date: "06 Aug", source: "Takeaway", amount: 11200 },
  { date: "07 Aug", source: "Dine-in", amount: 19800 },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 420000 },
  { month: "Feb", revenue: 380000 },
  { month: "Mar", revenue: 510000 },
  { month: "Apr", revenue: 475000 },
  { month: "May", revenue: 530000 },
  { month: "Jun", revenue: 590000 },
];

const expenseCategories = [
  { name: "Raw Materials", value: 120000, color: "#f59e0b" },
  { name: "Staff Salaries", value: 95000, color: "#3b82f6" },
  { name: "Rent & Utilities", value: 60000, color: "#10b981" },
  { name: "Marketing", value: 25000, color: "#8b5cf6" },
  { name: "Equipment", value: 18000, color: "#ef4444" },
  { name: "Other", value: 12000, color: "#6b7280" },
];

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <PieChartIcon className="w-4 h-4" /> },
  { key: "revenue", label: "Revenue", icon: <TrendingUp className="w-4 h-4" /> },
  { key: "expenses", label: "Expenses", icon: <Receipt className="w-4 h-4" /> },
  { key: "payments", label: "Payments", icon: <CreditCard className="w-4 h-4" /> },
  { key: "tax", label: "Tax", icon: <FileText className="w-4 h-4" /> },
  { key: "pnl", label: "P&L", icon: <Calculator className="w-4 h-4" /> },
];

const emptyExpense = { label: "", category: "Raw Materials", amount: 0, date: "" };

export default function Finance() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [expenses, setExpenses] = useState(initialExpenses);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyExpense);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { pushToast } = useOrderStore();

  const totalRevenue = monthlyData.reduce((a, d) => a + d.revenue, 0);
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const taxRate = 0.18;
  const taxCollected = Math.round(totalRevenue * taxRate);
  const taxPaid = Math.round(totalExpenses * taxRate * 0.6);
  const netTaxLiability = taxCollected - taxPaid;

  function handleAddExpense() {
    if (!form.label || !form.amount) return;
    setExpenses((prev) => [...prev, { ...form, id: uid() }]);
    setModalOpen(false);
    setForm(emptyExpense);
    pushToast("Expense added successfully");
  }

  function handleDeleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    pushToast("Expense deleted");
  }

  const filteredExpenses =
    categoryFilter === "all"
      ? expenses
      : expenses.filter((e) => e.category === categoryFilter);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-sm" style={{ color: p.color }}>
            {p.dataKey}: {formatInr(p.value)}
          </p>
        ))}
      </div>
    );
  };

  const pnlData = {
    revenue: totalRevenue,
    cogs: Math.round(totalRevenue * 0.35),
    grossProfit: Math.round(totalRevenue * 0.65),
    operatingExpenses: totalExpenses,
    netProfit: Math.round(totalRevenue * 0.65) - totalExpenses,
  };

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Finance</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Track revenue, expenses, and financial health
            </p>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="flex gap-1 p-1 rounded-lg bg-[var(--card)] border border-[var(--border)] overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors font-medium whitespace-nowrap",
                  activeTab === tab.key
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </EntranceItem>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <EntranceItem>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Revenue"
                  value={formatInr(totalRevenue)}
                  icon={<TrendingUp className="w-5 h-5" />}
                />
                <StatCard
                  label="Expenses"
                  value={formatInr(totalExpenses)}
                  icon={<TrendingDown className="w-5 h-5" />}
                />
                <StatCard
                  label="Profit"
                  value={formatInr(profit)}
                  icon={<DollarSign className="w-5 h-5" />}
                />
                <StatCard
                  label="Tax"
                  value={formatInr(netTaxLiability)}
                  icon={<Receipt className="w-5 h-5" />}
                />
              </div>
            </EntranceItem>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <EntranceItem>
                <Card className="p-5 lg:col-span-2">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">
                    Revenue vs Expenses
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} barGap={4}>
                        <XAxis
                          dataKey="month"
                          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                          axisLine={{ stroke: "var(--border)" }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="revenue"
                          fill="var(--primary)"
                          radius={[4, 4, 0, 0]}
                          name="Revenue"
                        />
                        <Bar
                          dataKey="expense"
                          fill="var(--danger)"
                          radius={[4, 4, 0, 0]}
                          opacity={0.7}
                          name="Expenses"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </EntranceItem>

              <EntranceItem>
                <Card className="p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">
                    Expense Breakdown
                  </h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategories}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {expenseCategories.map((entry, idx) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0].payload;
                            return (
                              <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 shadow-xl">
                                <p className="text-sm font-medium">{d.name}</p>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  {formatInr(d.value)}
                                </p>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {expenseCategories.map((cat) => (
                      <div key={cat.name} className="flex items-center gap-2 text-sm">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-[var(--muted-foreground)] flex-1">
                          {cat.name}
                        </span>
                        <span className="font-medium text-[var(--foreground)]">
                          {formatInr(cat.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </EntranceItem>
            </div>
          </div>
        )}

        {activeTab === "revenue" && (
          <div className="space-y-6">
            <EntranceItem>
              <Card className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">
                  Monthly Revenue Trend
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRevenue}>
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        axisLine={{ stroke: "var(--border)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        dot={{ fill: "var(--primary)", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </EntranceItem>

            <EntranceItem>
              <Card className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">
                  Revenue Details
                </h3>
                <DataTable
                  columns={[
                    { key: "date", label: "Date" },
                    { key: "source", label: "Source" },
                    { key: "amount", label: "Amount", render: (r: any) => formatInr(r.amount) },
                  ]}
                  data={revenueData}
                />
              </Card>
            </EntranceItem>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="space-y-4">
            <EntranceItem>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-48"
                  >
                    <option value="all">All Categories</option>
                    {expenseCategories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Expense
                </Button>
              </div>
            </EntranceItem>

            <EntranceItem>
              <Card className="p-5">
                <DataTable
                  columns={[
                    { key: "label", label: "Label" },
                    { key: "category", label: "Category" },
                    { key: "amount", label: "Amount", render: (r: any) => formatInr(r.amount) },
                    { key: "date", label: "Date" },
                    {
                      key: "actions",
                      label: "",
                      render: (r: any) => (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(r.id)}
                          className="text-[var(--danger)] hover:text-[var(--danger)]"
                        >
                          Delete
                        </Button>
                      ),
                    },
                  ]}
                  data={filteredExpenses}
                />
              </Card>
            </EntranceItem>

            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Add Expense"
            >
              <div className="space-y-4 p-1">
                <Field label="Label">
                  <Input
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="e.g. Coffee beans purchase"
                  />
                </Field>
                <Field label="Category">
                  <Select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {expenseCategories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Amount (₹)">
                    <Input
                      type="number"
                      value={form.amount || ""}
                      onChange={(e) =>
                        setForm({ ...form, amount: Number(e.target.value) })
                      }
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Date">
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddExpense}>Add Expense</Button>
                </div>
              </div>
            </Modal>
          </div>
        )}

        {activeTab === "payments" && (
          <EntranceItem>
            <Card className="p-8">
              <EmptyState
                icon={<CreditCard className="w-12 h-12" />}
                title="Payment Methods"
                description="Manage payment gateways and methods (coming soon)"
              />
            </Card>
          </EntranceItem>
        )}

        {activeTab === "tax" && (
          <div className="space-y-6">
            <EntranceItem>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  label="Tax Collected (GST)"
                  value={formatInr(taxCollected)}
                  icon={<Receipt className="w-5 h-5" />}
                />
                <StatCard
                  label="Tax Paid (Input)"
                  value={formatInr(taxPaid)}
                  icon={<FileText className="w-5 h-5" />}
                />
                <StatCard
                  label="Net Tax Liability"
                  value={formatInr(netTaxLiability)}
                  icon={<Calculator className="w-5 h-5" />}
                />
              </div>
            </EntranceItem>
            <EntranceItem>
              <Card className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">
                  GST Summary
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "CGST (9%)", collected: Math.round(taxCollected / 2), paid: Math.round(taxPaid / 2) },
                    { label: "SGST (9%)", collected: Math.round(taxCollected / 2), paid: Math.round(taxPaid / 2) },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)]"
                    >
                      <span className="font-medium text-[var(--foreground)]">{row.label}</span>
                      <div className="flex gap-6 text-sm">
                        <span className="text-[var(--muted-foreground)]">
                          Collected: <span className="font-medium text-[var(--foreground)]">{formatInr(row.collected)}</span>
                        </span>
                        <span className="text-[var(--muted-foreground)]">
                          Paid: <span className="font-medium text-[var(--foreground)]">{formatInr(row.paid)}</span>
                        </span>
                        <span className="text-[var(--muted-foreground)]">
                          Net: <span className="font-medium text-[var(--primary)]">{formatInr(row.collected - row.paid)}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </EntranceItem>
          </div>
        )}

        {activeTab === "pnl" && (
          <EntranceItem>
            <Card className="p-6 max-w-2xl">
              <h3 className="font-semibold text-[var(--foreground)] text-lg mb-6">
                Profit & Loss Statement
              </h3>
              <div className="space-y-0">
                {[
                  { label: "Revenue", value: pnlData.revenue, bold: true },
                  { label: "Cost of Goods Sold (COGS)", value: -pnlData.cogs },
                  { label: "Gross Profit", value: pnlData.grossProfit, bold: true, accent: true },
                  { label: "Operating Expenses", value: -pnlData.operatingExpenses },
                  { label: "Net Profit", value: pnlData.netProfit, bold: true, accent: true },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    className={cn(
                      "flex items-center justify-between py-3",
                      i < 4 && "border-b border-[var(--border)]"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[var(--foreground)]",
                        row.bold ? "font-semibold" : "text-[var(--muted-foreground)]"
                      )}
                    >
                      {row.label}
                    </span>
                    <span
                      className={cn(
                        "font-mono font-semibold",
                        row.value >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"
                      )}
                    >
                      {row.value >= 0 ? "" : "-"}{formatInr(Math.abs(row.value))}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </EntranceItem>
        )}
      </div>
    </PageEntrance>
  );
}
