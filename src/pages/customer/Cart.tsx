import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { AnimatedNumber } from "@/components/animations/MicroInteraction";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { useCartStore } from "@/stores/cartStore";
import { products } from "@/data/products";
import { cn, formatInr } from "@/lib/utils";

export default function Cart() {
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const coupon = useCartStore((s) => s.coupon);
  const setCoupon = useCartStore((s) => s.setCoupon);
  const totals = useCartStore((s) => s.totals);
  const count = useCartStore((s) => s.count);

  const { subtotal, tax, discount, total } = totals();
  const itemCount = count();

  if (lines.length === 0) {
    return (
      <PageEntrance>
        <section className="relative min-h-[80vh] flex items-center justify-center px-6 lg:px-8">
          <EntranceItem>
            <EmptyState
              title="Your cart is empty"
              body="Looks like you haven't added anything yet. Explore our menu and find something you'll love."
              action={
                <MagneticButton strength={0.3}>
                  <Button asChild variant="primary" className="px-8">
                    <Link to="/menu">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Explore Menu
                    </Link>
                  </Button>
                </MagneticButton>
              }
            />
          </EntranceItem>
        </section>
      </PageEntrance>
    );
  }

  return (
    <PageEntrance>
      {/* Hero */}
      <section className="relative pt-24 pb-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <EntranceItem>
            <div className="space-y-4">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
              </p>
              <h1>
                <TextReveal
                  text="Your Cart"
                  className="font-display text-5xl sm:text-6xl font-bold text-[var(--foreground)]"
                />
              </h1>
            </div>
          </EntranceItem>
        </div>
      </section>

      {/* Cart Content */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {lines.map((line) => {
                const product = products.find((p) => p.id === line.productId);
                if (!product) return null;

                const variant = product.variants.find((v) => v.id === line.variantId);
                const addonList = product.addons.filter((a) => line.addonIds.includes(a.id));
                const unitPrice =
                  product.price +
                  (variant?.priceDelta ?? 0) +
                  addonList.reduce((s, a) => s + a.price, 0);
                const discountedPrice = product.discount
                  ? unitPrice - product.discount
                  : unitPrice;
                const lineTotal = discountedPrice * line.quantity;

                return (
                  <motion.div
                    key={line.key}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-4 sm:p-6">
                      <div className="flex gap-4 sm:gap-6">
                        {/* Thumbnail */}
                        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-lg overflow-hidden border border-[var(--border)]">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-display text-lg font-bold text-[var(--foreground)] truncate">
                                {product.name}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {variant && (
                                  <span className="font-sans text-xs text-[var(--muted-foreground)]">
                                    {variant.name}
                                  </span>
                                )}
                                {addonList.map((a) => (
                                  <span
                                    key={a.id}
                                    className="font-sans text-xs text-[var(--primary)]"
                                  >
                                    +{a.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--danger)] p-1.5"
                              onClick={() => remove(line.key)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-3 rounded-full border border-[var(--border)] px-1">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                className="h-8 w-8 grid place-items-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                onClick={() => setQty(line.key, line.quantity - 1)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </motion.button>
                              <span className="w-6 text-center font-sans text-sm font-medium tabular-nums">
                                <AnimatedNumber value={line.quantity} />
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                className="h-8 w-8 grid place-items-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                onClick={() => setQty(line.key, line.quantity + 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </motion.button>
                            </div>

                            {/* Line total */}
                            <motion.p
                              key={lineTotal}
                              initial={{ y: -4, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="font-sans text-sm font-semibold text-[var(--foreground)] tabular-nums"
                            >
                              {formatInr(lineTotal)}
                            </motion.p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={0.1}>
              <div className="sticky top-24">
                <Card className="p-8 space-y-6">
                  <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                    Order Summary
                  </h2>

                  {/* Coupon */}
                  <div className="space-y-2">
                    <Field label="Coupon Code">
                      <div className="relative">
                        <Input
                          placeholder="e.g. AURELIA10"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          className="pl-10 uppercase tracking-wider"
                        />
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                    </Field>
                    {discount > 0 && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-sans text-xs text-[var(--success)]"
                      >
                        Coupon applied! You save {formatInr(discount)}
                      </motion.p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">Subtotal</span>
                      <span className="font-sans font-medium text-[var(--foreground)] tabular-nums">
                        {formatInr(subtotal)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--success)]">Discount</span>
                        <span className="font-sans font-medium text-[var(--success)] tabular-nums">
                          −{formatInr(discount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">GST (5%)</span>
                      <span className="font-sans font-medium text-[var(--foreground)] tabular-nums">
                        {formatInr(tax)}
                      </span>
                    </div>
                    <div className="h-px bg-[var(--border)]" />
                    <div className="flex justify-between">
                      <span className="font-sans font-semibold text-[var(--foreground)]">Total</span>
                      <span className="font-display text-xl font-bold text-[var(--primary)] tabular-nums">
                        {formatInr(total)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout */}
                  <MagneticButton strength={0.3} className="w-full">
                    <Button asChild variant="primary" className="w-full py-3 text-base">
                      <Link to="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </MagneticButton>

                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-center text-[var(--muted-foreground)]"
                  >
                    <Link to="/menu">Continue Shopping</Link>
                  </Button>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
