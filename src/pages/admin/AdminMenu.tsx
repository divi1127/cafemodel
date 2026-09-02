import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  ToggleLeft,
  ToggleRight,
  Crown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import type { Product } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";

type ProductForm = {
  name: string;
  slug: string;
  category: string;
  price: string;
  description: string;
  image: string;
  available: boolean;
  bestseller: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  category: "",
  price: "",
  description: "",
  image: "",
  available: true,
  bestseller: false,
};

export default function AdminMenu() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [localProducts, setLocalProducts] = useState(products);

  const catTabs = ["all", ...categories.map((c) => c.name)];

  const filtered =
    activeCategory === "all"
      ? localProducts
      : localProducts.filter((p) => p.category === activeCategory);

  const totalActive = localProducts.filter((p) => p.available).length;
  const avgRating =
    localProducts.reduce((s, p) => s + p.rating, 0) / localProducts.length;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (productId: string) => {
    const product = localProducts.find((p) => p.id === productId);
    if (!product) return;
    setEditingId(productId);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: String(product.price),
      description: "",
      image: product.image,
      available: product.available,
      bestseller: product.bestseller,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const price = parseFloat(form.price);

    if (editingId) {
      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name: form.name, category: form.category as Product["category"], price, available: form.available, bestseller: form.bestseller }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, "-"),
        category: form.category as Product["category"],
        price,
        rating: 0,
        reviews: 0,
        image: form.image || "/placeholder.jpg",
        gallery: [],
        bestseller: form.bestseller,
        available: form.available,
        discount: 0,
        description: form.description,
        longDescription: "",
        addons: [],
        variants: [],
        tags: [],
      };
      setLocalProducts((prev) => [newProduct, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (productId: string) => {
    setLocalProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleAvailability = (productId: string) => {
    setLocalProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, available: !p.available } : p))
    );
  };

  const toggleBestseller = (productId: string) => {
    setLocalProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, bestseller: !p.bestseller } : p))
    );
  };

  const updateForm = (key: keyof ProductForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
                Menu Management
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {localProducts.length} products &middot; {categories.length} categories
              </p>
            </div>
            <Button variant="primary" onClick={openAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Total Products" value={localProducts.length} hint="in menu" />
            <StatCard label="Active" value={totalActive} hint="available now" />
            <StatCard label="Categories" value={categories.length} hint="in system" />
            <StatCard
              label="Avg Rating"
              value={avgRating.toFixed(1)}
              hint="out of 5"
            />
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 scrollbar-none">
            {catTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all",
                  activeCategory === cat
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                )}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative h-40 overflow-hidden bg-[var(--muted)]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23333' width='200' height='200'/%3E%3Ctext fill='%23666' x='50' y='105' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {product.bestseller && (
                        <div className="absolute top-2 left-2">
                          <Badge className="flex items-center gap-1 bg-yellow-500/90 text-black border-0">
                            <Crown className="h-3 w-3" />
                            Bestseller
                          </Badge>
                        </div>
                      )}
                      {!product.available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <span className="rounded-lg bg-red-500/90 px-3 py-1 text-xs font-bold text-white">
                            UNAVAILABLE
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-[var(--foreground)]">
                            {product.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                            {product.category}
                          </p>
                        </div>
                        <span className="ml-2 text-lg font-bold text-[var(--primary)]">
                          {formatInr(product.price)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          {product.rating}
                        </span>
                        <span>{product.reviews} reviews</span>
                      </div>

                      <div className="mt-3 flex items-center gap-3 border-t border-[var(--border)] pt-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleAvailability(product.id)}
                            className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                            title={product.available ? "Mark unavailable" : "Mark available"}
                          >
                            {product.available ? (
                              <ToggleRight className="h-5 w-5 text-[var(--success)]" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-[var(--muted-foreground)]" />
                            )}
                          </button>
                          <span className="text-[10px] text-[var(--muted-foreground)]">
                            {product.available ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleBestseller(product.id)}
                            className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                            title={product.bestseller ? "Remove bestseller" : "Mark bestseller"}
                          >
                            {product.bestseller ? (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <Crown className="h-4 w-4 text-[var(--muted-foreground)] opacity-40" />
                            )}
                          </button>
                          <span className="text-[10px] text-[var(--muted-foreground)]">
                            {product.bestseller ? "Featured" : "Feature"}
                          </span>
                        </div>

                        <div className="ml-auto flex items-center gap-1">
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => openEdit(product.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="danger"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </EntranceItem>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[var(--foreground)]">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Name</label>
              <Input
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="Product name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Price (₹)</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">Image URL</label>
              <Input
                value={form.image}
                onChange={(e) => updateForm("image", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => updateForm("available", e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
                />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  checked={form.bestseller}
                  onChange={(e) => updateForm("bestseller", e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
                />
                Bestseller
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingId ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageEntrance>
  );
}
