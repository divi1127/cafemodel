import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  Boxes,
  Truck,
  Receipt,
  UserCog,
  FileText,
  Calculator,
  Calendar,
  Download,
  Filter,
  FileBarChart,
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
import { StatCard } from "@/components/ui/StatCard";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { useOrderStore } from "@/stores/orderStore";
import { formatInr } from "@/lib/utils";
import { products } from "@/data/products";
import { customers } from "@/data/customers";
import { staff } from "@/data/staff";

type ReportType = "sales" | "product" | "category" | "customer" | "inventory" | "purchase" | "expense" | "staff" | "tax" | "pnl";

const reportTypes: { key: ReportType; label: string; icon: React.ReactNode }[] = [
  { key: "sales", label: "Sales", icon: <ShoppingCart className="w-5 h-5" /> },
  { key: "product", label: "Product", icon: <Package className="w-5 h-5" /> },
  { key: "category", label: "Category", icon: <BarChart3 className="w-5 h-5" /> },
  { key: "customer", label: "Customer", icon: <Users className="w-5 h-5" /> },
  { key: "inventory", label: "Inventory", icon: <Boxes className="w-5 h-5" /> },
  { key: "purchase", label: "Purchase", icon: <Truck className="w-5 h-5" /> },
  { key: "expense", label: "Expense", icon: <Receipt className="w-5 h-5" /> },
  { key: "staff", label: "Staff", icon: <UserCog className="w-5 h-5" /> },
  { key: "tax", label: "Tax", icon: <FileText className="w-5 h-5" /> },
  { key: "pnl", label: "P&L", icon: <Calculator className="w-5 h-5" /> },
];

const salesData = [
  { label: "Espresso", sold: 342, revenue: 102600 },
  { label: "Cappuccino", sold: 289, revenue: 115600 },
  { label: "Latte", sold: 256, revenue: 102400 },
  { label: "Cold Brew", sold: 198, revenue: 79200 },
  { label: "Sandwich", sold: 167, revenue: 66800 },
];

const categoryData = [
  { name: "Coffee", value: 45 },
  { name: "Tea", value: 20 },
  { name: "Snacks", value: 20 },
  { name: "Beverages", value: 10 },
  { name: "Others", value: 5 },
];

const categoryColors = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#6b7280"];

const inventoryData = [
  { item: "Coffee Beans (kg)", stock: 45, reorder: 20, status: "ok" },
  { item: "Milk (liters)", stock: 12, reorder: 15, status: "low" },
  { item: "Sugar (kg)", stock: 28, reorder: 10, status: "ok" },
  { item: "Cups (disposable)", stock: 150, reorder: 100, status: "ok" },
  { item: "Syrups (bottles)", stock: 5, reorder: 8, status: "low" },
];

const taxData = [
  { period: "Q1", collected: 126000, paid: 42000, net: 84000 },
  { period: "Q2", collected: 153000, paid: 51000, net: 102000 },
];

const chartColors = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-sm" style={{ color: p.color || "var(--foreground)" }}>
          {p.dataKey}: {typeof p.value === "number" && p.value > 1000 ? formatInr(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("sales");
  const [dateFrom, setDateFrom] = useState("2026-08-01");
  const [dateTo, setDateTo] = useState("2026-08-26");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [generated, setGenerated] = useState(false);
  const { pushToast } = useOrderStore();

  function generateReport() {
    setGenerated(true);
  }

  function exportReport() {
    pushToast("Report exported successfully");
  }

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Reports</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Generate and export business reports
            </p>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {reportTypes.map((rt) => (
              <button
                key={rt.key}
                onClick={() => {
                  setSelectedReport(rt.key);
                  setGenerated(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center",
                  selectedReport === rt.key
                    ? "bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]"
                    : "bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50 hover:text-[var(--foreground)]"
                )}
              >
                {rt.icon}
                <span className="text-sm font-medium">{rt.label}</span>
              </button>
            ))}
          </div>
        </EntranceItem>

        <EntranceItem>
          <Card className="p-5">
            <div className="flex items-end gap-4 flex-wrap">
              <Field label="From">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </Field>
              <Field label="To">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </Field>
              <Field label="Category">
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-44"
                >
                  <option value="all">All Categories</option>
                  <option value="coffee">Coffee</option>
                  <option value="tea">Tea</option>
                  <option value="snacks">Snacks</option>
                  <option value="beverages">Beverages</option>
                </Select>
              </Field>
              <Button onClick={generateReport} className="flex items-center gap-2">
                <FileBarChart className="w-4 h-4" /> Generate Report
              </Button>
              {generated && (
                <Button
                  variant="ghost"
                  onClick={exportReport}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Export
                </Button>
              )}
            </div>
          </Card>
        </EntranceItem>

        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {selectedReport === "sales" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard label="Total Sales" value={formatInr(466600)} icon={<ShoppingCart className="w-5 h-5" />} />
                  <StatCard label="Items Sold" value={1252} icon={<Package className="w-5 h-5" />} />
                  <StatCard label="Avg Order" value={formatInr(373)} icon={<BarChart3 className="w-5 h-5" />} />
                </div>
                <Card className="p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">Top Products by Sales</h3>
                  <DataTable
                    columns={[
                      { key: "label", label: "Product" },
                      { key: "sold", label: "Qty Sold" },
                      { key: "revenue", label: "Revenue", render: (r: any) => formatInr(r.revenue) },
                    ]}
                    data={salesData}
                  />
                </Card>
                <Card className="p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">Sales Chart</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="sold" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Quantity" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </>
            )}

            {selectedReport === "product" && (
              <>
                <Card className="p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">Product Performance</h3>
                  <DataTable
                    columns={[
                      { key: "name", label: "Product" },
                      { key: "category", label: "Category" },
                      { key: "price", label: "Price", render: (r: any) => formatInr(r.price) },
                    ]}
                    data={products.slice(0, 10)}
                  />
                </Card>
                <Card className="p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">Sales by Product</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </>
            )}

            {selectedReport === "category" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card className="p-5">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Sales by Category</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                            {categoryData.map((_, idx) => (
                              <Cell key={idx} fill={categoryColors[idx % categoryColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4 justify-center">
                      {categoryData.map((cat, i) => (
                        <div key={cat.name} className="flex items-center gap-1.5 text-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[i] }} />
                          <span className="text-[var(--muted-foreground)]">{cat.name} ({cat.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-5">
                    <h3 className="font-semibold text-[var(--foreground)] mb-4">Category Details</h3>
                    <DataTable
                      columns={[
                        { key: "name", label: "Category" },
                        { key: "value", label: "Share %", render: (r: any) => `${r.value}%` },
                      ]}
                      data={categoryData}
                    />
                  </Card>
                </div>
              </>
            )}

            {selectedReport === "customer" && (
              <Card className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">Customer Report</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <StatCard label="Total Customers" value={customers.length} icon={<Users className="w-5 h-5" />} />
                  <StatCard label="Avg Spend" value={formatInr(2450)} icon={<BarChart3 className="w-5 h-5" />} />
                  <StatCard label="Repeat Rate" value="68%" icon={<ShoppingCart className="w-5 h-5" />} />
                </div>
                <DataTable
                  columns={[
                    { key: "name", label: "Customer" },
                    { key: "email", label: "Email" },
                    { key: "phone", label: "Phone" },
                  ]}
                  data={customers.slice(0, 10)}
                />
              </Card>
            )}

            {selectedReport === "inventory" && (
              <Card className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">Inventory Status</h3>
                <DataTable
                  columns={[
                    { key: "item", label: "Item" },
                    { key: "stock", label: "Current Stock" },
                    { key: "reorder", label: "Reorder Level" },
                    {
                      key: "status",
                      label: "Status",
                      render: (r: any) => (
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full",
                          r.status === "ok"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        )}>
                          {r.status === "ok" ? "In Stock" : "Low Stock"}
                        </span>
                      ),
                    },
                  ]}
                  data={inventoryData}
                />
              </Card>
            )}

            {selectedReport === "purchase" && (
              <Card className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">Purchase Report</h3>
                <DataTable
                  columns={[
                    { key: "label", label: "Item" },
                    { key: "category", label: "Category" },
                    { key: "amount", label: "Amount", render: (r: any) => formatInr(r.amount) },
                  ]}
                  data={[
                    { label: "Arabica Beans 5kg", category: "Raw Materials", amount: 4500 },
                    { label: "Oat Milk 20L", category: "Raw Materials", amount: 2800 },
                    { label: "Paper Cups 500pcs", category: "Supplies", amount: 1500 },
                  ]}
                />
              </Card>
            )}

            {selectedReport === "expense" && (
              <Card className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">Expense Report</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { category: "Raw Materials", amount: 120000 },
                      { category: "Salaries", amount: 95000 },
                      { category: "Rent", amount: 60000 },
                      { category: "Marketing", amount: 25000 },
                      { category: "Equipment", amount: 18000 },
                    ]}>
                      <XAxis dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                      <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {selectedReport === "staff" && (
              <Card className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">Staff Report</h3>
                <DataTable
                  columns={[
                    { key: "name", label: "Name" },
                    { key: "role", label: "Role" },
                    { key: "phone", label: "Phone" },
                  ]}
                  data={staff.slice(0, 10)}
                />
              </Card>
            )}

            {selectedReport === "tax" && (
              <Card className="p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">Tax Report (GST)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <StatCard label="Tax Collected" value={formatInr(279000)} icon={<FileText className="w-5 h-5" />} />
                  <StatCard label="Tax Paid" value={formatInr(93000)} icon={<Receipt className="w-5 h-5" />} />
                  <StatCard label="Net Payable" value={formatInr(186000)} icon={<Calculator className="w-5 h-5" />} />
                </div>
                <DataTable
                  columns={[
                    { key: "period", label: "Period" },
                    { key: "collected", label: "Collected", render: (r: any) => formatInr(r.collected) },
                    { key: "paid", label: "Paid", render: (r: any) => formatInr(r.paid) },
                    { key: "net", label: "Net", render: (r: any) => formatInr(r.net) },
                  ]}
                  data={taxData}
                />
              </Card>
            )}

            {selectedReport === "pnl" && (
              <Card className="p-6 max-w-2xl">
                <h3 className="font-semibold text-[var(--foreground)] text-lg mb-6">P&L Statement</h3>
                {[
                  { label: "Total Revenue", value: 2905000 },
                  { label: "Cost of Goods Sold", value: -1016750 },
                  { label: "Gross Profit", value: 1888250, bold: true },
                  { label: "Staff Salaries", value: -570000 },
                  { label: "Rent & Utilities", value: -360000 },
                  { label: "Marketing", value: -150000 },
                  { label: "Other Expenses", value: -100000 },
                  { label: "Total Operating Expenses", value: -1180000 },
                  { label: "Net Profit", value: 708250, bold: true },
                ].map((row, i, arr) => (
                  <div
                    key={row.label}
                    className={cn(
                      "flex items-center justify-between py-3",
                      i < arr.length - 1 && "border-b border-[var(--border)]"
                    )}
                  >
                    <span className={cn("text-[var(--foreground)]", row.bold ? "font-semibold text-base" : "text-[var(--muted-foreground)]")}>
                      {row.label}
                    </span>
                    <span className={cn("font-mono font-semibold", row.value >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]")}>
                      {row.value >= 0 ? "" : "-"}{formatInr(Math.abs(row.value))}
                    </span>
                  </div>
                ))}
              </Card>
            )}
          </motion.div>
        )}

        {!generated && (
          <EntranceItem>
            <Card className="p-12">
              <EmptyState
                icon={<FileBarChart className="w-12 h-12" />}
                title="Select a report type"
                description="Choose a report above and click Generate Report to view data"
              />
            </Card>
          </EntranceItem>
        )}
      </div>
    </PageEntrance>
  );
}
