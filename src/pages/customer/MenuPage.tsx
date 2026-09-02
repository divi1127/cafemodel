import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { ProductCard } from "@/components/ui/ProductCard";
import { Tabs } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCategory, search]);

  return (
    <PageEntrance>
      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-14 sm:py-32 px-6 lg:px-8 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 mx-auto max-w-7xl text-center space-y-6">
          <EntranceItem>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              Curated Selection
            </p>
          </EntranceItem>
          <EntranceItem>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-[var(--foreground)]">
              Our <span className="text-[var(--primary)]">Menu</span>
            </h1>
          </EntranceItem>
          <EntranceItem>
            <p className="font-sans text-base sm:text-lg text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed">
              From single-origin pour-overs to indulgent pastries — explore our
              complete selection of handcrafted offerings.
            </p>
          </EntranceItem>
        </div>
      </section>

      {/* ─── Filters ─── */}
      <section className="sticky top-[64px] z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 space-y-4">
          {/* Search + results */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Search coffee, pastries, drinks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search menu"
                className="rounded-full pl-11! pr-11! border-[var(--border)] bg-[var(--muted)]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-[var(--muted-foreground)] transition hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <span className="font-sans text-xs sm:text-sm text-[var(--muted-foreground)] whitespace-nowrap">
              {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Category Tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={(v) => {
              if (v !== undefined) setActiveCategory(v);
            }}
            className="overflow-x-auto scrollbar-hide"
          >
            <div className="flex gap-2 min-w-max pb-1">
              <Tabs.List>
                <Tabs.Trigger
                  value="all"
                  className={cn(
                    "px-4 py-2 rounded-full font-sans text-sm whitespace-nowrap transition-all",
                    activeCategory === "all"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  )}
                >
                  All Items ({products.length})
                </Tabs.Trigger>
                {categories.map((cat) => {
                  const count = products.filter(
                    (p) => p.category === cat.id
                  ).length;
                  if (count === 0) return null;
                  return (
                    <Tabs.Trigger
                      key={cat.id}
                      value={cat.id}
                      className={cn(
                        "px-4 py-2 rounded-full font-sans text-sm whitespace-nowrap transition-all",
                        activeCategory === cat.id
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      )}
                    >
                      {cat.name} ({count})
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>
            </div>
          </Tabs>
        </div>
      </section>

      {/* ─── Products Grid ─── */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="font-display text-2xl text-[var(--foreground)]">
                No items found
              </p>
              <p className="font-sans text-[var(--muted-foreground)]">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </PageEntrance>
  );
}
