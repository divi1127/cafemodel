import { useState } from "react";
import { AlertTriangle, Package, Truck, ArrowDownToLine, ArrowUpFromLine, Trash2, ShoppingCart, CircleAlert } from "lucide-react";
import { cn, formatInr } from "@/lib/utils";
import {
  inventory as seedInventory,
  suppliers as seedSuppliers,
  purchases as seedPurchases,
  wastage as seedWastage,
} from "@/data/inventory";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Field, Select } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Toast";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { useOrderStore } from "@/stores/orderStore";
import type { InventoryItem } from "@/types";

const subTabs = ["Overview", "Ingredients", "Stock In", "Stock Out", "Suppliers", "Purchases", "Wastage"];

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [items, setItems] = useState<InventoryItem[]>(seedInventory);
  const pushToast = useOrderStore((s) => s.pushToast);

  const [stockForm, setStockForm] = useState({ itemId: items[0]?.id ?? "", quantity: "", reason: "" });

  const lowStock = items.filter((i) => i.stock <= i.reorderAt);
  const expiringSoon = items.filter((i) => {
    if (!i.expiry) return false;
    const diff = new Date(i.expiry).getTime() - Date.now();
    return diff > 0 && diff < 7 * 86400000;
  });
  const totalValue = items.reduce((sum, i) => sum + i.stock * 100, 0);

  const stockPercent = (i: InventoryItem) => Math.round((i.stock / i.capacity) * 100);
  const stockColor = (pct: number) =>
    pct > 50 ? "bg-emerald-500" : pct > 25 ? "bg-amber-500" : "bg-red-500";

  const handleStockIn = () => {
    if (!stockForm.itemId || !stockForm.quantity) return;
    const qty = Number(stockForm.quantity);
    setItems((prev) =>
      prev.map((i) =>
        i.id === stockForm.itemId ? { ...i, stock: Math.min(i.capacity, i.stock + qty) } : i,
      ),
    );
    pushToast("Stock updated", `Added ${qty} units`);
    setStockForm({ itemId: items[0]?.id ?? "", quantity: "", reason: "" });
  };

  const handleStockOut = () => {
    if (!stockForm.itemId || !stockForm.quantity) return;
    const qty = Number(stockForm.quantity);
    setItems((prev) =>
      prev.map((i) =>
        i.id === stockForm.itemId ? { ...i, stock: Math.max(0, i.stock - qty) } : i,
      ),
    );
    pushToast("Stock updated", `Removed ${qty} units`);
    setStockForm({ itemId: items[0]?.id ?? "", quantity: "", reason: "" });
  };

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
              Inventory Management
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Track stock levels, suppliers, and purchases
            </p>
          </div>
        </EntranceItem>

        <EntranceItem>
          <Tabs tabs={subTabs} value={activeTab} onChange={setActiveTab} />
        </EntranceItem>

        {activeTab === "Overview" && (
          <>
            <EntranceItem>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <StatCard label="Total Items" value={items.length} />
                <StatCard label="Low Stock" value={lowStock.length} hint="needs restock" />
                <StatCard label="Expiring Soon" value={expiringSoon.length} hint="within 7 days" />
                <StatCard label="Total Value" value={formatInr(totalValue)} hint="estimated" />
              </div>
            </EntranceItem>

            <EntranceItem>
              <Card className="p-5">
                <h2 className="mb-4 font-display text-lg font-semibold text-[var(--foreground)]">Stock Levels</h2>
                <div className="space-y-4">
                  {items.map((item) => {
                    const pct = stockPercent(item);
                    const isLow = item.stock <= item.reorderAt;
                    return (
                      <div key={item.id} className="border border-[var(--border)] bg-[var(--muted)]/20 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-[var(--foreground)]">{item.name}</p>
                                {isLow && (
                                  <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[var(--muted-foreground)]">{item.sku}</p>
                            </div>
                          </div>
                          <p className="text-sm text-[var(--foreground)]">
                            <span className="font-semibold">{item.stock}</span>
                            <span className="text-[var(--muted-foreground)]"> / {item.capacity} {item.unit}</span>
                          </p>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden bg-white/8">
                          <div
                            className={cn("h-full transition-all", stockColor(pct))}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        {item.expiry && (
                          <p className="mt-2 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                            <AlertTriangle size={12} /> Expires {item.expiry}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </EntranceItem>
          </>
        )}

        {activeTab === "Ingredients" && (
          <EntranceItem>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-[var(--muted)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">SKU</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                      <th className="px-4 py-3 font-medium">Capacity</th>
                      <th className="px-4 py-3 font-medium">Unit</th>
                      <th className="px-4 py-3 font-medium">Reorder At</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const pct = stockPercent(item);
                      const isLow = item.stock <= item.reorderAt;
                      return (
                        <tr key={item.id} className="border-t border-[var(--border)] transition hover:bg-white/4">
                          <td className="px-4 py-3 font-medium text-[var(--foreground)]">{item.name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-[var(--muted-foreground)]">{item.sku}</td>
                          <td className="px-4 py-3 text-[var(--foreground)]">{item.stock}</td>
                          <td className="px-4 py-3 text-[var(--muted-foreground)]">{item.capacity}</td>
                          <td className="px-4 py-3 text-[var(--muted-foreground)]">{item.unit}</td>
                          <td className="px-4 py-3 text-[var(--muted-foreground)]">{item.reorderAt}</td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-medium",
                                isLow
                                  ? "border-red-500/40 text-red-400 bg-red-500/15"
                                  : "border-emerald-500/40 text-emerald-400 bg-emerald-500/15",
                              )}
                            >
                              {isLow ? <CircleAlert size={10} /> : null}
                              {isLow ? "Low" : "OK"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </EntranceItem>
        )}

        {(activeTab === "Stock In" || activeTab === "Stock Out") && (
          <EntranceItem>
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                {activeTab === "Stock In" ? (
                  <ArrowDownToLine size={18} className="text-emerald-400" />
                ) : (
                  <ArrowUpFromLine size={18} className="text-amber-400" />
                )}
                <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
                  {activeTab === "Stock In" ? "Add Stock" : "Remove Stock"}
                </h2>
              </div>
              <div className="max-w-md space-y-4">
                <Field label="Item">
                  <Select
                    value={stockForm.itemId}
                    onChange={(e) => setStockForm((f) => ({ ...f, itemId: e.target.value }))}
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.stock} {i.unit} in stock)
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Quantity">
                  <Input
                    type="number"
                    min={1}
                    value={stockForm.quantity}
                    onChange={(e) => setStockForm((f) => ({ ...f, quantity: e.target.value }))}
                    placeholder="Enter quantity"
                  />
                </Field>
                <Field label="Reason">
                  <Input
                    value={stockForm.reason}
                    onChange={(e) => setStockForm((f) => ({ ...f, reason: e.target.value }))}
                    placeholder="e.g. Weekly delivery, Spoilage"
                  />
                </Field>
                <Button
                  variant={activeTab === "Stock In" ? "primary" : "danger"}
                  onClick={activeTab === "Stock In" ? handleStockIn : handleStockOut}
                >
                  {activeTab === "Stock In" ? <ArrowDownToLine size={16} /> : <ArrowUpFromLine size={16} />}
                  {activeTab === "Stock In" ? "Add Stock" : "Remove Stock"}
                </Button>
              </div>
            </Card>
          </EntranceItem>
        )}

        {activeTab === "Suppliers" && (
          <EntranceItem>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead className="bg-[var(--muted)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Contact</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seedSuppliers.map((s) => (
                      <tr key={s.id} className="border-t border-[var(--border)] transition hover:bg-white/4">
                        <td className="px-4 py-3 font-medium text-[var(--foreground)]">{s.name}</td>
                        <td className="px-4 py-3 text-[var(--muted-foreground)]">{s.contact}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                            {s.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </EntranceItem>
        )}

        {activeTab === "Purchases" && (
          <EntranceItem>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-[var(--muted)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Supplier</th>
                      <th className="px-4 py-3 font-medium">Items</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seedPurchases.map((p) => {
                      const supplierName = seedSuppliers.find((s) => s.id === p.supplierId)?.name ?? "—";
                      const statusStyle =
                        p.status === "received"
                          ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/15"
                          : p.status === "sent"
                            ? "border-sky-500/40 text-sky-400 bg-sky-500/15"
                            : "border-[var(--border)] text-[var(--muted-foreground)] bg-white/8";
                      return (
                        <tr key={p.id} className="border-t border-[var(--border)] transition hover:bg-white/4">
                          <td className="px-4 py-3 font-mono text-[var(--muted-foreground)]">{p.id.toUpperCase()}</td>
                          <td className="px-4 py-3 font-medium text-[var(--foreground)]">{supplierName}</td>
                          <td className="px-4 py-3 text-[var(--muted-foreground)]">{p.items}</td>
                          <td className="px-4 py-3 font-medium text-[var(--foreground)]">{formatInr(p.amount)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-medium",
                                statusStyle,
                              )}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[var(--muted-foreground)]">{p.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </EntranceItem>
        )}

        {activeTab === "Wastage" && (
          <EntranceItem>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[550px] text-left text-sm">
                  <thead className="bg-[var(--muted)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Item</th>
                      <th className="px-4 py-3 font-medium">Quantity</th>
                      <th className="px-4 py-3 font-medium">Reason</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seedWastage.map((w) => (
                      <tr key={w.id} className="border-t border-[var(--border)] transition hover:bg-white/4">
                        <td className="px-4 py-3 font-medium text-[var(--foreground)]">{w.item}</td>
                        <td className="px-4 py-3 text-[var(--muted-foreground)]">{w.qty}</td>
                        <td className="px-4 py-3 text-[var(--muted-foreground)]">{w.reason}</td>
                        <td className="px-4 py-3 text-[var(--muted-foreground)]">{w.date}</td>
                        <td className="px-4 py-3 font-medium text-[var(--danger)]">{formatInr(w.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </EntranceItem>
        )}
      </div>
    </PageEntrance>
  );
}
