import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Card";
import { ProductCard } from "@/components/ui/ProductCard";
import { products } from "@/data/products";
import { useFavoritesStore } from "@/stores/favoritesStore";

export default function Favorites() {
  const favIds = useFavoritesStore((s) => s.ids);
  const favProducts = products.filter((p) => favIds.includes(p.id));

  return (
    <PageEntrance className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <EntranceItem>
          <div className="mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              Your Collection
            </p>
            <h1 className="mt-3 font-display text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
              <TextReveal text="Your Favorites" />
            </h1>
            {favProducts.length > 0 && (
              <p className="mt-3 text-[var(--muted-foreground)]">
                {favProducts.length} {favProducts.length === 1 ? "item" : "items"} saved
              </p>
            )}
          </div>
        </EntranceItem>

        {favProducts.length === 0 ? (
          <EntranceItem>
            <EmptyState
              title="No favorites yet"
              body="Tap the heart icon on any menu item to save it here for quick access."
              action={
                <Link to="/menu">
                  <Button variant="primary">
                    Explore Menu
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              }
            />
          </EntranceItem>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {favProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <ScrollReveal delay={i * 0.06}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageEntrance>
  );
}
