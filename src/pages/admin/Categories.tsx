import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories as initialCategories } from "@/data/categories";
import { products } from "@/data/products";
import type { Category } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";

type CategoryForm = {
  name: string;
  description: string;
  image: string;
};

const emptyForm: CategoryForm = {
  name: "",
  description: "",
  image: "",
};

const categoryColors = [
  "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  "from-rose-500/20 to-red-500/20 border-rose-500/30",
  "from-cyan-500/20 to-sky-500/20 border-cyan-500/30",
];

export default function Categories() {
  const [cats, setCats] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const getProductCount = (categoryName: string) =>
    products.filter((p) => p.category === categoryName).length;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const cat = cats.find((c) => c.id === id);
    if (!cat) return;
    setEditingId(id);
    setForm({ name: cat.name, description: cat.description, image: cat.image });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return;

    if (editingId) {
      setCats((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, name: form.name as Category["name"], description: form.description, image: form.image } : c
        )
      );
    } else {
      const newCat: Category = {
        id: `cat_${Date.now()}`,
        name: form.name as Category["name"],
        description: form.description,
        image: form.image,
      };
      setCats((prev) => [...prev, newCat]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCats((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
                Categories
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Organize your menu into categories
              </p>
            </div>
            <Button variant="primary" onClick={openAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            <StatCard
              label="Total Categories"
              value={cats.length}
              hint="in system"
            />
            <StatCard
              label="Total Products"
              value={products.length}
              hint="across all"
            />
            <StatCard
              label="Avg Products / Category"
              value={cats.length > 0 ? (products.length / cats.length).toFixed(1) : "0"}
              hint="per category"
            />
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {cats.map((cat, i) => {
                const count = getProductCount(cat.name);
                return (
                  <motion.div
                    key={cat.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "overflow-hidden border bg-gradient-to-br transition-shadow hover:shadow-lg",
                        categoryColors[i % categoryColors.length]
                      )}
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="font-display text-lg font-bold text-white">
                            {cat.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">
                          {cat.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                            <Package className="h-3.5 w-3.5" />
                            <span className="font-medium text-[var(--foreground)]">{count}</span>
                            <span>products</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => openEdit(cat.id)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="danger"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(cat.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </EntranceItem>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[var(--foreground)]">
              {editingId ? "Edit Category" : "Add Category"}
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
                Category Name
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Beverages"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description..."
                rows={3}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--primary)]/30 resize-none"
              />
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

            {form.image && (
              <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-32 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingId ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </div>
      </Modal>
    </PageEntrance>
  );
}
