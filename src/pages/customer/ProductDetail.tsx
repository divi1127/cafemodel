import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  Share2,
  Check,
  ShoppingCart,
} from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { MicroInteraction } from "@/components/animations/MicroInteraction";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { ProductCard } from "@/components/ui/ProductCard";
import { Textarea } from "@/components/ui/Input";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { cn, formatInr } from "@/lib/utils";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);

  const add = useCartStore((s) => s.add);
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const isFav = useFavoritesStore((s) => s.has);

  const [selectedVariant, setSelectedVariant] = useState<string>(
    product?.variants?.[0]?.id ?? ""
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <PageEntrance>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="font-display text-3xl text-[var(--foreground)]">
              Product Not Found
            </h1>
            <p className="font-sans text-[var(--muted-foreground)]">
              The product you're looking for doesn't exist.
            </p>
            <Link to="/menu">
              <Button variant="primary">Back to Menu</Button>
            </Link>
          </div>
        </div>
      </PageEntrance>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const variantPrice =
    product.price + (product.variants?.find((v) => v.id === selectedVariant)?.priceDelta ?? 0);

  const addonTotal = selectedAddons.reduce((sum, id) => {
    const addon = product.addons?.find((a) => a.id === id);
    return sum + (addon?.price ?? 0);
  }, 0);

  const totalPrice = (variantPrice + addonTotal) * qty;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    add({
      productId: product.id,
      quantity: qty,
      variantId: selectedVariant || undefined,
      addonIds: selectedAddons,
      notes: instructions || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <PageEntrance>
      {/* ─── Breadcrumb ─── */}
      <div className="px-6 lg:px-8 pt-8">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 font-sans text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </Link>
        </div>
      </div>

      {/* ─── Product Hero ─── */}
      <section className="py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <EntranceItem>
            <div className="relative rounded-2xl overflow-hidden aspect-square sticky top-24">
              <ParallaxImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                speed={0.1}
              />
              {product.bestseller && (
                <div className="absolute top-4 left-4">
                  <Badge>
                    Bestseller
                  </Badge>
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  onClick={() => toggleFav(product.id)}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors",
                    isFav(product.id)
                      ? "bg-red-500/90 text-white"
                      : "bg-black/30 text-white hover:bg-black/50"
                  )}
                >
                  <Heart
                    className={cn("h-5 w-5", isFav(product.id) && "fill-current")}
                  />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </EntranceItem>

          {/* Details */}
          <EntranceItem className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge tone="muted">
                  {categories.find((c) => c.id === product.category)?.name ?? product.category}
                </Badge>
                {!product.available && (
                  <Badge tone="danger">
                    Unavailable
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
                {product.name}
              </h1>
              <p className="font-sans text-lg text-[var(--muted-foreground)] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.round(product.rating)
                        ? "fill-[var(--primary)] text-[var(--primary)]"
                        : "fill-none text-[var(--border)]"
                    )}
                  />
                ))}
              </div>
              <span className="font-sans text-sm text-[var(--muted-foreground)]">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div>
              <p className="font-display text-4xl font-bold text-[var(--primary)]">
                <MicroInteraction>{formatInr(variantPrice)}</MicroInteraction>
              </p>
              {addonTotal > 0 && (
                <p className="font-sans text-sm text-[var(--muted-foreground)]">
                  + {formatInr(addonTotal)} in add-ons
                </p>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-sans font-semibold text-[var(--foreground)]">
                  Size / Variant
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <motion.button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "px-5 py-3 rounded-xl border font-sans text-sm transition-all",
                        selectedVariant === variant.id
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]"
                      )}
                    >
                      <span>{variant.name}</span>
                      <span className="ml-2 text-xs opacity-70">
                        {formatInr(product.price + variant.priceDelta)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {product.addons && product.addons.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-sans font-semibold text-[var(--foreground)]">
                  Add-ons
                </h3>
                <div className="space-y-2">
                  {product.addons.map((addon) => (
                    <motion.button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all",
                        selectedAddons.includes(addon.id)
                          ? "border-[var(--primary)] bg-[var(--primary)]/10"
                          : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                            selectedAddons.includes(addon.id)
                              ? "bg-[var(--primary)] border-[var(--primary)]"
                              : "border-[var(--border)]"
                          )}
                        >
                          {selectedAddons.includes(addon.id) && (
                            <Check className="h-3 w-3 text-[var(--primary-foreground)]" />
                          )}
                        </div>
                        <span className="font-sans text-sm text-[var(--foreground)]">
                          {addon.name}
                        </span>
                      </div>
                      <span className="font-sans text-sm text-[var(--muted-foreground)]">
                        +{formatInr(addon.price)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-sans font-semibold text-[var(--foreground)]">Quantity</h3>
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <span className="font-sans text-xl font-semibold w-8 text-center text-[var(--foreground)]">
                  <MicroInteraction>{qty}</MicroInteraction>
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="font-sans font-semibold text-[var(--foreground)]">
                Special Instructions
              </h3>
              <Textarea
                placeholder="Any special requests or notes for your order..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="bg-[var(--muted)] border-[var(--border)] min-h-[80px]"
              />
            </div>

            {/* Add to Cart */}
            <div className="space-y-4 pt-4">
              <MagneticButton strength={0.2}>
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  variant="primary"
                  className="w-full py-6 text-base"
                >
                  {added ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart — {formatInr(totalPrice)}
                    </>
                  )}
                </Button>
              </MagneticButton>
              {!product.available && (
                <p className="font-sans text-sm text-center text-[var(--danger)]">
                  This item is currently unavailable
                </p>
              )}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {product.tags.map((tag) => (
                  <Badge key={tag} tone="muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </EntranceItem>
        </div>
      </section>

      {/* ─── Long Description ─── */}
      {product.longDescription && (
        <section className="py-16 px-6 lg:px-8 border-t border-[var(--border)]">
          <div className="mx-auto max-w-3xl space-y-6">
            <ScrollReveal>
              <TextReveal
                text="About This Item"
                className="font-display text-3xl font-bold text-[var(--foreground)]"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="font-sans text-lg text-[var(--muted-foreground)] leading-relaxed">
                {product.longDescription}
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ─── Related Products ─── */}
      {relatedProducts.length > 0 && (
        <section className="py-24 px-6 lg:px-8" style={{ background: "var(--card)" }}>
          <div className="mx-auto max-w-7xl">
            <ScrollReveal>
              <div className="space-y-4 mb-12">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                  You May Also Like
                </p>
                <TextReveal
                  text="Related Items"
                  className="font-display text-3xl font-bold text-[var(--foreground)]"
                />
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((rp, i) => (
                <ScrollReveal key={rp.id} delay={i * 0.1}>
                  <ProductCard product={rp} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageEntrance>
  );
}
