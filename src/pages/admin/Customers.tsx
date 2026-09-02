import { useState } from "react";
import { Search, Mail, Phone, MapPin, Star, ShoppingBag } from "lucide-react";
import { cn, formatInr } from "@/lib/utils";
import { customers as seedCustomers } from "@/data/customers";
import { products } from "@/data/products";
import { orders } from "@/data/orders";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Drawer } from "@/components/ui/Modal";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import type { Customer, MembershipTier } from "@/types";

const tierTone: Record<MembershipTier, string> = {
  Bean: "bg-amber-500/15 text-amber-400 border-amber-500/40",
  Brew: "bg-white/8 text-[var(--muted-foreground)] border-[var(--border)]",
  Reserve: "bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/40",
  Estate: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
};

export default function Customers() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = seedCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  const avgSpent = Math.round(seedCustomers.reduce((s, c) => s + c.spent, 0) / seedCustomers.length);
  const avgOrders = Math.round(seedCustomers.reduce((s, c) => s + c.orders, 0) / seedCustomers.length);

  const customerOrders = selected
    ? orders.filter((o) => o.customerId === selected.id).slice(0, 5)
    : [];

  const favoriteProducts = selected
    ? selected.favorites.map((fid) => products.find((p) => p.id === fid)).filter(Boolean)
    : [];

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
              Customer Management
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              View profiles, loyalty tiers, and purchase history
            </p>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="pl-9"
            />
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Total Customers" value={seedCustomers.length} />
            <StatCard label="Active" value={seedCustomers.filter((c) => c.orders > 0).length} hint="with orders" />
            <StatCard label="Avg Spending" value={formatInr(avgSpent)} hint="per customer" />
            <StatCard label="Avg Orders" value={avgOrders} hint="per customer" />
          </div>
        </EntranceItem>

        <EntranceItem>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-[var(--muted)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Tier</th>
                    <th className="px-4 py-3 font-medium">Points</th>
                    <th className="px-4 py-3 font-medium">Orders</th>
                    <th className="px-4 py-3 font-medium">Spent</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="border-t border-[var(--border)] transition hover:bg-white/4 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-[var(--foreground)]">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{c.email}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{c.phone}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-medium",
                            tierTone[c.tier],
                          )}
                        >
                          {c.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--foreground)]">{c.loyaltyPoints.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{c.orders}</td>
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">{formatInr(c.spent)}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{c.joinedAt}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-[var(--muted-foreground)]">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </EntranceItem>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Customer Profile">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={selected.avatar}
                alt={selected.name}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--border)]"
              />
              <div>
                <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
                  {selected.name}
                </h3>
                <span
                  className={cn(
                    "mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-medium",
                    tierTone[selected.tier],
                  )}
                >
                  {selected.tier}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Mail size={14} /> {selected.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Phone size={14} /> {selected.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <MapPin size={14} /> {selected.address}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Total Spent</p>
                <p className="mt-1 font-display text-2xl text-[var(--foreground)]">{formatInr(selected.spent)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Orders</p>
                <p className="mt-1 font-display text-2xl text-[var(--foreground)]">{selected.orders}</p>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Points</p>
                <p className="mt-1 font-display text-2xl text-[var(--foreground)]">{selected.loyaltyPoints.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Member Since</p>
                <p className="mt-1 font-display text-lg text-[var(--foreground)]">{selected.joinedAt}</p>
              </Card>
            </div>

            {customerOrders.length > 0 && (
              <div>
                <h4 className="mb-3 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Recent Orders
                </h4>
                <div className="space-y-2">
                  {customerOrders.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between border border-[var(--border)] bg-[var(--muted)]/20 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{o.number}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{formatInr(o.total)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {favoriteProducts.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  <Star size={12} /> Favorites
                </h4>
                <div className="flex flex-wrap gap-2">
                  {favoriteProducts.map(
                    (p) =>
                      p && (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--muted)]/30 px-3 py-1 text-xs text-[var(--foreground)]"
                        >
                          <ShoppingBag size={10} />
                          {p.name}
                        </span>
                      ),
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
