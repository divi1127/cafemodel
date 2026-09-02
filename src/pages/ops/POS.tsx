import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  X,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  Printer,
  CreditCard,
  Trash2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { useOrderStore } from "@/stores/orderStore";
import { cn, formatInr, uid } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import type { Fulfillment, OrderItem } from "@/types";

type PaymentMethod = "cash" | "card" | "upi" | "wallet";
type PosItem = OrderItem & { lineTotal: number };

const TAX_RATE = 0.05;

const fulfillmentIcons: Record<Fulfillment, typeof UtensilsCrossed> = {
  "dine-in": UtensilsCrossed,
  takeaway: ShoppingBag,
  delivery: Truck,
};

const paymentMethods: { key: PaymentMethod; label: string }[] = [
  { key: "cash", label: "Cash" },
  { key: "card", label: "Card" },
  { key: "upi", label: "UPI" },
  { key: "wallet", label: "Wallet" },
];

export default function POS() {
  const addOrder = useOrderStore((s) => s.addOrder);
  const pushToast = useOrderStore((s) => s.pushToast);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [items, setItems] = useState<PosItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cash");

  const filteredProducts = useMemo(() => {
    const list = selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);
    return list;
  }, [selectedCategory]);

  const addItem = useCallback((product: (typeof products)[0]) => {
    if (!product.available) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1, lineTotal: (i.quantity + 1) * i.unitPrice }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          quantity: 1,
          unitPrice: product.price,
          addons: [],
          notes: undefined,
          lineTotal: product.price,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? {
                ...i,
                quantity: Math.max(0, i.quantity + delta),
                lineTotal: Math.max(0, i.quantity + delta) * i.unitPrice,
              }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.lineTotal, 0),
    [items]
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = Math.max(0, subtotal + tax - discount);

  const clearOrder = useCallback(() => {
    setItems([]);
    setDiscount(0);
    setNotes("");
    setTableNumber("");
    setFulfillment("dine-in");
  }, []);

  const holdOrder = useCallback(() => {
    if (items.length === 0) return;
    pushToast("Order Held", `Order saved with ${items.length} item(s)`);
    clearOrder();
  }, [items.length, pushToast, clearOrder]);

  const processPayment = useCallback(() => {
    if (items.length === 0) return;

    const orderNum = `A-${1046 + Math.floor(Math.random() * 100)}`;
    const order = {
      id: uid("order"),
      number: orderNum,
      customerId: "walk-in",
      customerName: "Walk-in",
      status: "new" as const,
      fulfillment,
      table: fulfillment === "dine-in" && tableNumber ? `T${tableNumber}` : undefined,
      items: items.map(({ lineTotal, ...rest }) => rest),
      subtotal,
      tax,
      discount,
      total,
      createdAt: new Date().toISOString(),
      notes: notes || undefined,
      priority: "normal" as const,
      payment: selectedPayment,
    };

    addOrder(order);
    pushToast("Order Complete", `${orderNum} · ${formatInr(total)} · ${selectedPayment.toUpperCase()}`);
    clearOrder();
    setPaymentOpen(false);
  }, [items, fulfillment, tableNumber, subtotal, tax, discount, total, notes, selectedPayment, addOrder, pushToast, clearOrder]);

  const printReceipt = useCallback(() => {
    pushToast("Printing...", "Receipt sent to printer");
  }, [pushToast]);

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* LEFT — Categories */}
      <aside className="w-[25%] min-w-[160px] border-r border-white/10 overflow-y-auto">
        <button
          onClick={() => setSelectedCategory("All")}
          className={cn(
            "w-full text-left px-4 py-3 text-sm font-medium transition-colors min-h-[44px]",
            selectedCategory === "All"
              ? "bg-[#f4ead8]/10 text-[#f4ead8] border-l-2 border-[#f4ead8]"
              : "text-white/50 hover:bg-white/5 border-l-2 border-transparent"
          )}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={cn(
              "w-full text-left px-4 py-3 text-sm font-medium transition-colors min-h-[44px]",
              selectedCategory === cat.name
                ? "bg-[#f4ead8]/10 text-[#f4ead8] border-l-2 border-[#f4ead8]"
                : "text-white/50 hover:bg-white/5 border-l-2 border-transparent"
            )}
          >
            {cat.name}
          </button>
        ))}
      </aside>

      {/* MIDDLE — Product Grid */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <motion.button
              key={product.id}
              whileTap={product.available ? { scale: 0.96 } : undefined}
              onClick={() => addItem(product)}
              disabled={!product.available}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors min-h-[44px]",
                product.available
                  ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] cursor-pointer"
                  : "border-white/5 bg-white/[0.01] opacity-30 cursor-not-allowed"
              )}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <span className="text-sm font-medium leading-tight">{product.name}</span>
                {!product.available && (
                  <AlertTriangle size={12} className="text-[#c25a3c] shrink-0 mt-0.5" />
                )}
              </div>
              <span className="text-xs text-white/40">{product.category}</span>
              <span className="mt-auto text-sm font-semibold text-[#f4ead8]">{formatInr(product.price)}</span>
            </motion.button>
          ))}
        </div>
      </main>

      {/* RIGHT — Order Panel */}
      <aside className="w-[30%] min-w-[300px] border-l border-white/10 flex flex-col overflow-hidden">
        {/* Fulfillment Toggle */}
        <div className="flex gap-1 p-3 border-b border-white/10">
          {(["dine-in", "takeaway", "delivery"] as Fulfillment[]).map((f) => {
            const Icon = fulfillmentIcons[f];
            return (
              <button
                key={f}
                onClick={() => setFulfillment(f)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium uppercase tracking-wider transition-colors min-h-[44px]",
                  fulfillment === f
                    ? "bg-[#f4ead8] text-[#0c0a08]"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                )}
              >
                <Icon size={14} />
                {f === "dine-in" ? "Dine-in" : f === "takeaway" ? "Takeaway" : "Delivery"}
              </button>
            );
          })}
        </div>

        {/* Table Number (dine-in only) */}
        {fulfillment === "dine-in" && (
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
            <span className="text-xs text-white/40 uppercase tracking-wider">Table</span>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="#"
              className="w-16 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-[#f4ead8] placeholder:text-white/20 focus:outline-none focus:border-[#f4ead8]/40 min-h-[44px]"
            />
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-white/30">
              <ShoppingBag size={32} className="mb-2" />
              <p className="text-sm">Add items to start</p>
            </div>
          )}
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-2 rounded-md bg-white/[0.03] px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-white/40">
                  {formatInr(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold tabular-nums shrink-0">
                {formatInr(item.lineTotal)}
              </span>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => updateQty(item.productId, -1)}
                  className="rounded p-1 hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mx-2"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.productId, 1)}
                  className="rounded p-1 hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mx-2"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="rounded p-1 hover:bg-[#c25a3c]/20 text-[#c25a3c] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Remove item"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="px-3 py-2 border-t border-white/10">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special notes..."
            rows={2}
            className="w-full resize-none rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#f4ead8] placeholder:text-white/20 focus:outline-none focus:border-[#f4ead8]/40"
          />
        </div>

        {/* Totals */}
        <div className="px-3 py-2 border-t border-white/10 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Subtotal</span>
            <span className="tabular-nums">{formatInr(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Tax (5%)</span>
            <span className="tabular-nums">{formatInr(tax)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Discount</span>
            <input
              type="number"
              value={discount || ""}
              onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
              placeholder="0"
              className="w-20 rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-sm text-[#f4ead8] placeholder:text-white/20 focus:outline-none focus:border-[#f4ead8]/40"
            />
          </div>
          <div className="flex justify-between text-base font-bold border-t border-white/10 pt-1.5">
            <span>Total</span>
            <span className="tabular-nums">{formatInr(total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-1.5 p-3 border-t border-white/10">
          <button
            onClick={holdOrder}
            disabled={items.length === 0}
            className="flex flex-col items-center justify-center gap-1 rounded-md bg-white/5 py-2 text-[10px] uppercase tracking-wider text-white/50 hover:bg-white/10 transition-colors disabled:opacity-30 min-h-[44px]"
          >
            <Clock size={16} />
            Hold
          </button>
          <button
            onClick={clearOrder}
            disabled={items.length === 0}
            className="flex flex-col items-center justify-center gap-1 rounded-md bg-white/5 py-2 text-[10px] uppercase tracking-wider text-white/50 hover:bg-white/10 transition-colors disabled:opacity-30 min-h-[44px]"
          >
            <Trash2 size={16} />
            Cancel
          </button>
          <button
            onClick={() => setPaymentOpen(true)}
            disabled={items.length === 0}
            className="flex flex-col items-center justify-center gap-1 rounded-md bg-[#f4ead8] py-2 text-[10px] uppercase tracking-wider text-[#0c0a08] font-semibold hover:brightness-110 transition-colors disabled:opacity-30 min-h-[44px]"
          >
            <CreditCard size={16} />
            Pay
          </button>
          <button
            onClick={printReceipt}
            disabled={items.length === 0}
            className="flex flex-col items-center justify-center gap-1 rounded-md bg-white/5 py-2 text-[10px] uppercase tracking-wider text-white/50 hover:bg-white/10 transition-colors disabled:opacity-30 min-h-[44px]"
          >
            <Printer size={16} />
            Print
          </button>
        </div>
      </aside>

      {/* Payment Modal */}
      <Modal open={paymentOpen} onClose={() => setPaymentOpen(false)} title="Select Payment">
        <div className="grid grid-cols-2 gap-3 mt-2">
          {paymentMethods.map((pm) => (
            <button
              key={pm.key}
              onClick={() => setSelectedPayment(pm.key)}
              className={cn(
                "rounded-lg border py-6 text-sm font-medium uppercase tracking-wider transition-colors min-h-[44px]",
                selectedPayment === pm.key
                  ? "border-[#f4ead8] bg-[#f4ead8]/10 text-[#f4ead8]"
                  : "border-white/10 bg-white/[0.03] text-white/50 hover:bg-white/[0.07]"
              )}
            >
              {pm.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Items</span>
            <span>{items.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Subtotal</span>
            <span className="tabular-nums">{formatInr(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Tax</span>
            <span className="tabular-nums">{formatInr(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Discount</span>
              <span className="tabular-nums text-[#c25a3c]">-{formatInr(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-2">
            <span>Total</span>
            <span className="tabular-nums">{formatInr(total)}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentOpen(false)}
            className="rounded-lg border border-white/10 py-3 text-sm uppercase tracking-wider text-white/50 hover:bg-white/5 transition-colors min-h-[44px]"
          >
            Back
          </button>
          <button
            onClick={processPayment}
            className="rounded-lg bg-[#f4ead8] py-3 text-sm font-semibold uppercase tracking-wider text-[#0c0a08] hover:brightness-110 transition-colors min-h-[44px]"
          >
            Complete · {formatInr(total)}
          </button>
        </div>
      </Modal>
    </div>
  );
}
