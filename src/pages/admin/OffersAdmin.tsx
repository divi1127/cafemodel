import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Tag,
  Percent,
  Gift,
  Clock,
  Search,
  Sparkles,
  ShoppingBag,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState } from "@/components/ui/Card";
import { Field, Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { offers as initialOffers } from "@/data/offers";
import type { Offer } from "@/types";
import { uid } from "@/lib/utils";

const typeBadgeVariant: Record<string, string> = {
  coupon: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  bogo: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "happy-hour": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  festival: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "first-order": "bg-gray-500/15 text-gray-400 border-gray-500/30",
  combo: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

const typeIcons: Record<string, React.ReactNode> = {
  coupon: <Tag className="w-4 h-4" />,
  bogo: <Gift className="w-4 h-4" />,
  "happy-hour": <Clock className="w-4 h-4" />,
  festival: <Sparkles className="w-4 h-4" />,
  "first-order": <ShoppingBag className="w-4 h-4" />,
  combo: <Percent className="w-4 h-4" />,
};

const typeLabels: Record<string, string> = {
  coupon: "Coupon",
  bogo: "Buy 1 Get 1",
  "happy-hour": "Happy Hour",
  festival: "Festival",
  "first-order": "First Order",
  combo: "Combo",
};

const emptyOffer: Omit<Offer, "id"> = {
  title: "",
  type: "coupon",
  code: "",
  description: "",
  value: "",
  image: "",
  active: true,
  validUntil: "",
};

export default function OffersAdmin() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [form, setForm] = useState(emptyOffer);

  const activeCount = offers.filter((o) => o.active).length;
  const totalCoupons = offers.filter(
    (o) => o.type === "coupon" || o.type === "combo"
  ).length;
  const avgDiscount =
    offers.length > 0
      ? offers.reduce((acc, o) => acc + (parseFloat(o.value) || 0), 0) / offers.length
      : 0;

  const filtered = offers.filter((o) => {
    if (filter === "active" && !o.active) return false;
    if (filter === "inactive" && o.active) return false;
    if (
      search &&
      !o.title.toLowerCase().includes(search.toLowerCase()) &&
      !(o.code ?? "").toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  function openCreate() {
    setEditingOffer(null);
    setForm(emptyOffer);
    setModalOpen(true);
  }

  function openEdit(offer: Offer) {
    setEditingOffer(offer);
    setForm({ ...offer });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.title || !form.code) return;
    if (editingOffer) {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === editingOffer.id ? { ...form, id: editingOffer.id } : o
        )
      );
    } else {
      setOffers((prev) => [...prev, { ...form, id: uid() }]);
    }
    setModalOpen(false);
  }

  function toggleActive(id: string) {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );
  }

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">
                Offers & Coupons
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Manage discounts, coupons, and promotional offers
              </p>
            </div>
            <Button onClick={openCreate} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Offer
            </Button>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Active Offers"
              value={activeCount}
              icon={<Tag className="w-5 h-5" />}
            />
            <StatCard
              label="Total Coupons"
              value={totalCoupons}
              icon={<Percent className="w-5 h-5" />}
            />
            <StatCard
              label="Avg Discount"
              value={`${avgDiscount.toFixed(0)}%`}
              icon={<Gift className="w-5 h-5" />}
            />
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Search offers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1 p-1 rounded-lg bg-[var(--card)] border border-[var(--border)]">
              {(["all", "active", "inactive"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md capitalize transition-colors",
                    filter === f
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </EntranceItem>

        {filtered.length === 0 ? (
          <EntranceItem>
            <Card className="p-12">
              <EmptyState
                icon={<Tag className="w-12 h-12" />}
                title="No offers found"
                description="Create your first offer to get started"
              />
            </Card>
          </EntranceItem>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((offer, i) => (
              <EntranceItem key={offer.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    className="overflow-hidden cursor-pointer hover:border-[var(--primary)]/50 transition-colors group"
                    onClick={() => openEdit(offer)}
                  >
                    {offer.image ? (
                      <div className="h-36 bg-[var(--muted)] overflow-hidden">
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-36 bg-[var(--muted)] flex items-center justify-center">
                        <Image className="w-10 h-10 text-[var(--muted-foreground)] opacity-40" />
                      </div>
                    )}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[var(--foreground)] truncate">
                            {offer.title}
                          </h3>
                          <p className="text-sm text-[var(--muted-foreground)] mt-0.5 line-clamp-2">
                            {offer.description}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border shrink-0",
                            typeBadgeVariant[offer.type] ||
                              typeBadgeVariant.coupon
                          )}
                        >
                          {typeIcons[offer.type]}
                          {typeLabels[offer.type]}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="px-2 py-1 rounded bg-[var(--muted)] text-[var(--foreground)] text-sm font-mono">
                          {offer.code}
                        </code>
                        <span className="text-sm font-semibold text-[var(--primary)]">
                          {offer.value}% OFF
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                        <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                          <Clock className="w-3 h-3" />
                          Valid until {offer.validUntil}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActive(offer.id);
                          }}
                          className={cn(
                            "relative w-10 h-5 rounded-full transition-colors",
                            offer.active ? "bg-[var(--success)]" : "bg-[var(--muted)]"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                              offer.active ? "left-5.5 translate-x-0" : "left-0.5"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </EntranceItem>
            ))}
          </div>
        )}

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingOffer ? "Edit Offer" : "Create Offer"}
        >
          <div className="space-y-4 p-1">
            <Field label="Title">
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Summer Special 20% Off"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Type">
                <Select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as Offer["type"] })
                  }
                >
                  <option value="coupon">Coupon</option>
                  <option value="bogo">Buy 1 Get 1</option>
                  <option value="happy-hour">Happy Hour</option>
                  <option value="festival">Festival</option>
                  <option value="first-order">First Order</option>
                  <option value="combo">Combo</option>
                </Select>
              </Field>
              <Field label="Discount Value (%)">
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) =>
                    setForm({ ...form, value: e.target.value })
                  }
                  placeholder="10"
                />
              </Field>
            </div>
            <Field label="Coupon Code">
              <Input
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g. SUMMER20"
                className="font-mono"
              />
            </Field>
            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe the offer..."
                rows={3}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Image URL">
                <Input
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </Field>
              <Field label="Valid Until">
                <Input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) =>
                    setForm({ ...form, validUntil: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setForm({ ...form, active: !form.active })}
                className={cn(
                  "relative w-10 h-5 rounded-full transition-colors",
                  form.active ? "bg-[var(--success)]" : "bg-[var(--muted)]"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                    form.active ? "left-5.5" : "left-0.5"
                  )}
                />
              </button>
              <span className="text-sm text-[var(--muted-foreground)]">
                {form.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingOffer ? "Save Changes" : "Create Offer"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageEntrance>
  );
}
