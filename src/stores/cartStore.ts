import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";
import { uid } from "@/lib/utils";
import type { CartLine } from "@/types";

function lineTotal(line: CartLine) {
  const product = products.find((p) => p.id === line.productId);
  if (!product) return 0;
  const variant = product.variants.find((v) => v.id === line.variantId);
  const addons = product.addons.filter((a) => line.addonIds.includes(a.id));
  const unit = product.price + (variant?.priceDelta ?? 0) + addons.reduce((s, a) => s + a.price, 0);
  const discounted = product.discount ? unit - product.discount : unit;
  return discounted * line.quantity;
}

interface CartState {
  lines: CartLine[];
  coupon: string;
  add: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  setCoupon: (code: string) => void;
  clear: () => void;
  count: () => number;
  totals: () => { subtotal: number; tax: number; discount: number; total: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      coupon: "",
      add: (line) =>
        set((s) => {
          const existing = s.lines.find(
            (l) =>
              l.productId === line.productId &&
              l.variantId === line.variantId &&
              l.addonIds.join() === line.addonIds.join() &&
              l.notes === line.notes,
          );
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.key === existing.key ? { ...l, quantity: l.quantity + line.quantity } : l,
              ),
            };
          }
          return { lines: [...s.lines, { ...line, key: uid("line") }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? { ...l, quantity: qty } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      setCoupon: (coupon) => set({ coupon }),
      clear: () => set({ lines: [], coupon: "" }),
      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      totals: () => {
        const subtotal = get().lines.reduce((n, l) => n + lineTotal(l), 0);
        const coupon = get().coupon.toUpperCase();
        let discount = 0;
        if (coupon === "AURELIA10") discount = Math.round(subtotal * 0.1);
        if (coupon === "RAIN20") discount = Math.round(subtotal * 0.2);
        if (coupon === "WEEKDAY15") discount = Math.round(subtotal * 0.15);
        const taxed = subtotal - discount;
        const tax = Math.round(taxed * 0.05);
        return { subtotal, tax, discount, total: taxed + tax };
      },
    }),
    { name: "aurelia-cart" },
  ),
);
