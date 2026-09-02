import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Crown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatInr } from "@/lib/utils";
import { products as initialProducts } from "@/data/products";
import { categories } from "@/data/categories";
import type { Product } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";

type SortKey = "name" | "price" | "rating";
type SortDir = "asc" | "desc";

type ProductForm = {
  name: string;
  category: string;
  price: string;
  image: string;
  available: boolean;
  bestseller: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  category: "",
  price: "",
  image: "",
  available: true,
  bestseller: false,
};

export default function Products() {
  const [localProducts, setLocalProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const filtered = useMemo(() => {
    let result = [...localProducts];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      if (sortKey === "price") return (a.price - b.price) * dir;
      return (a.rating - b.rating) * dir;
    });

    return result;
  }, [localProducts, search, categoryFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3 text-[var(--primary)]" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-[var(--primary)]" />
    );
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const p = localProducts.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      image: p.image,
      available: p.available,
      bestseller: p.bestseller,
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
        description: "",
        longDescription: "",
        addons: [],
        variants: [],
        tags: [],
      };
      setLocalProducts((prev) => [newProduct, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setLocalProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setLocalProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  const toggleBestseller = (id: string) => {
    setLocalProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, bestseller: !p.bestseller } : p))
    );
  };

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
                Products
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {filtered.length} of {localProducts.length} products
              </p>
            </div>
            <Button variant="primary" onClick={openAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </EntranceItem>

        <EntranceItem>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Product</th>
                    <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Category</th>
                    <th className="px-4 py-3">
                      <button
                        onClick={() => toggleSort("price")}
                        className="flex items-center font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                      >
                        Price
                        <SortIcon col="price" />
                      </button>
                    </th>
                    <th className="px-4 py-3">
                      <button
                        onClick={() => toggleSort("rating")}
                        className="flex items-center font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                      >
                        Rating
                        <SortIcon col="rating" />
                      </button>
                    </th>
                    <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Reviews</th>
                    <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Available</th>
                    <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Best</th>
                    <th className="px-4 py-3 font-medium text-[var(--muted-foreground)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/50">
                  <AnimatePresence>
                    {filtered.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="transition-colors hover:bg-[var(--muted)]/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--muted)]">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23333' width='40' height='40'/%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                            <div>
                              <span className="font-medium text-[var(--foreground)]">
                                {product.name}
                              </span>
                              {(product.discount ?? 0) > 0 && (
                                <Badge className="ml-2 bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20 text-[10px]">
                                  {product.discount}% off
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--muted-foreground)]">
                          {product.category}
                        </td>
                        <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                          {formatInr(product.price)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                            <span className="text-[var(--foreground)]">{product.rating}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--muted-foreground)]">
                          {product.reviews}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleAvailability(product.id)}
                            className="transition-colors hover:opacity-80"
                          >
                            {product.available ? (
                              <ToggleRight className="h-6 w-6 text-[var(--success)]" />
                            ) : (
                              <ToggleLeft className="h-6 w-6 text-[var(--muted-foreground)]" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleBestseller(product.id)}
                            className="transition-colors hover:opacity-80"
                          >
                            <Crown
                              className={cn(
                                "h-4 w-4",
                                product.bestseller
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-[var(--muted-foreground)] opacity-40"
                              )}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
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
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="mb-3 h-10 w-10 text-[var(--muted-foreground)] opacity-40" />
                <p className="text-sm font-medium text-[var(--muted-foreground)]">
                  No products found
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Try adjusting your search or filter
                </p>
              </div>
            )}
          </Card>
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
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Product Name
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Cappuccino"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                >
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                  Price (₹)
                </label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Image URL
              </label>
              <Input
                value={form.image}
                onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))}
                  className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
                />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  checked={form.bestseller}
                  onChange={(e) => setForm((p) => ({ ...p, bestseller: e.target.checked }))}
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
