import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Armchair,
  ShoppingBag,
  Truck,
  Banknote,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { useSessionStore } from "@/stores/sessionStore";
import { products } from "@/data/products";
import { tables } from "@/data/tables";
import { cn, formatInr, uid } from "@/lib/utils";
import type { Fulfillment } from "@/types";

type Payment = "cash" | "card" | "upi" | "wallet";

type Step = 1 | 2 | 3 | 4;

const steps: { num: Step; label: string }[] = [
  { num: 1, label: "Details" },
  { num: 2, label: "Delivery" },
  { num: 3, label: "Payment" },
  { num: 4, label: "Confirm" },
];

const paymentMethods: { id: Payment; label: string; icon: typeof Banknote }[] = [
  { id: "cash", label: "Cash on Delivery", icon: Banknote },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI Payment", icon: Smartphone },
  { id: "wallet", label: "Digital Wallet", icon: Wallet },
];

const fulfillmentOptions: { id: Fulfillment; label: string; desc: string; icon: typeof Armchair }[] = [
  { id: "dine-in", label: "Dine In", desc: "Enjoy at our café", icon: Armchair },
  { id: "takeaway", label: "Takeaway", desc: "Pick up and go", icon: ShoppingBag },
  { id: "delivery", label: "Delivery", desc: "We come to you", icon: Truck },
];

export default function Checkout() {
  const session = useSessionStore();
  const lines = useCartStore((s) => s.lines);
  const totals = useCartStore((s) => s.totals);
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useOrderStore((s) => s.addOrder);
  const pushToast = useOrderStore((s) => s.pushToast);

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState(session.name || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(session.email || "");
  const [fulfillment, setFulfillment] = useState<Fulfillment>("dine-in");
  const [tableId, setTableId] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<Payment>("cash");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const { subtotal, tax, discount, total } = totals();

  function next() {
    setStep((s) => Math.min(s + 1, 4) as Step);
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 1) as Step);
  }

  function confirm() {
    const num = `AUR-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    setOrderNumber(num);

    addOrder({
      id: uid("order"),
      number: num,
      customerId: uid("cust"),
      customerName: name || "Guest",
      status: "new",
      fulfillment,
      table: fulfillment === "dine-in" ? tableId : undefined,
      items: lines.map((l) => {
        const p = products.find((pr) => pr.id === l.productId);
        return {
          productId: l.productId,
          name: p?.name ?? "Item",
          quantity: l.quantity,
          unitPrice: p?.price ?? 0,
          addons: l.addonIds,
          notes: l.notes,
        };
      }),
      subtotal,
      tax,
      discount,
      total,
      createdAt: new Date().toISOString(),
      notes,
      priority: "normal",
      payment,
    });

    clearCart();
    pushToast("Order placed!", `Order ${num} has been received.`);
    setDone(true);
  }

  const availableTables = tables.filter((t) => t.status === "available");

  const canProceed = (() => {
    if (step === 1) return name.trim() && phone.trim();
    if (step === 2) {
      if (fulfillment === "dine-in") return !!tableId;
      if (fulfillment === "delivery") return address.trim().length > 5;
      return true;
    }
    return true;
  })();

  if (done) {
    return (
      <PageEntrance>
        <section className="min-h-[80vh] flex items-center justify-center px-6 lg:px-8">
          <EntranceItem>
            <div className="text-center space-y-8 max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="h-24 w-24 text-[var(--success)] mx-auto" />
              </motion.div>
              <div className="space-y-3">
                <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">
                  Order Confirmed
                </h1>
                <p className="font-sans text-[var(--muted-foreground)]">
                  Thank you, <span className="text-[var(--foreground)] font-medium">{name}</span>!
                  Your order is being prepared.
                </p>
              </div>
              <Card className="p-6 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Order Number</span>
                  <span className="font-mono font-bold text-[var(--primary)]">{orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Fulfillment</span>
                  <span className="text-[var(--foreground)] capitalize">{fulfillment}</span>
                </div>
                {fulfillment === "dine-in" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Table</span>
                    <span className="text-[var(--foreground)]">
                      {tables.find((t) => t.id === tableId)?.number ?? tableId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Payment</span>
                  <span className="text-[var(--foreground)] capitalize">{payment}</span>
                </div>
                <div className="h-px bg-[var(--border)]" />
                <div className="flex justify-between">
                  <span className="font-semibold text-[var(--foreground)]">Total</span>
                  <span className="font-display text-lg font-bold text-[var(--primary)]">
                    {formatInr(total)}
                  </span>
                </div>
              </Card>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <MagneticButton strength={0.3}>
                  <Button asChild variant="primary" className="px-8">
                    <Link to={`/tracking`}>
                      Track Order
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </MagneticButton>
                <Button asChild variant="ghost" className="px-8">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          </EntranceItem>
        </section>
      </PageEntrance>
    );
  }

  return (
    <PageEntrance>
      {/* Header */}
      <section className="relative pt-24 pb-8 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <EntranceItem>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-8">
              Checkout
            </h1>
          </EntranceItem>

          {/* Step indicator */}
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-2">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-full grid place-items-center text-xs font-bold transition-all duration-500 shrink-0",
                        step >= s.num
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]",
                      )}
                    >
                      {step > s.num ? "✓" : s.num}
                    </div>
                    <span
                      className={cn(
                        "font-sans text-xs uppercase tracking-widest hidden sm:block transition-colors duration-300",
                        step >= s.num ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-px flex-1 transition-colors duration-500",
                        step > s.num ? "bg-[var(--primary)]" : "bg-[var(--border)]",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Step Content */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-5 sm:p-8 space-y-6">
                  <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                    Your Details
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Full Name">
                      <div className="relative">
                        <Input
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                    </Field>
                    <Field label="Phone Number">
                      <div className="relative">
                        <Input
                          placeholder="+91 90000 00000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                    </Field>
                  </div>
                  <Field label="Email (Optional)">
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="you@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                  </Field>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Fulfillment */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="p-5 sm:p-8 space-y-6">
                  <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                    How Would You Like Your Order?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {fulfillmentOptions.map((opt) => {
                      const Icon = opt.icon;
                      const active = fulfillment === opt.id;
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          onClick={() => setFulfillment(opt.id)}
                          className={cn(
                            "flex flex-col items-center gap-3 p-6 rounded-xl border-2 text-center transition-all duration-300",
                            active
                              ? "border-[var(--primary)] bg-[var(--primary)]/10"
                              : "border-[var(--border)] hover:border-[var(--primary)]/30",
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className={cn(
                              "h-12 w-12 rounded-full grid place-items-center transition-colors",
                              active ? "bg-[var(--primary)]/20" : "bg-[var(--muted)]",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]",
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-sans font-semibold text-sm text-[var(--foreground)]">
                              {opt.label}
                            </p>
                            <p className="font-sans text-xs text-[var(--muted-foreground)]">
                              {opt.desc}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </Card>

                {/* Dine-in: table selector */}
                <AnimatePresence>
                  {fulfillment === "dine-in" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card className="p-5 sm:p-8 space-y-6">
                        <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                          Select Your Table
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {availableTables.map((t) => (
                            <motion.button
                              key={t.id}
                              type="button"
                              onClick={() => setTableId(t.id)}
                              className={cn(
                                "flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all",
                                tableId === t.id
                                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                                  : "border-[var(--border)] hover:border-[var(--primary)]/30",
                              )}
                              whileTap={{ scale: 0.97 }}
                            >
                              <span className="font-display text-lg font-bold text-[var(--foreground)]">
                                {t.number}
                              </span>
                              <span className="font-sans text-xs text-[var(--muted-foreground)]">
                                {t.capacity} seats
                              </span>
                            </motion.button>
                          ))}
                          {availableTables.length === 0 && (
                            <p className="col-span-full text-center font-sans text-sm text-[var(--muted-foreground)] py-4">
                              No tables available right now. Try takeaway or delivery.
                            </p>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Delivery: address */}
                <AnimatePresence>
                  {fulfillment === "delivery" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card className="p-5 sm:p-8 space-y-6">
                        <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                          Delivery Address
                        </h3>
                        <Field label="Full Address">
                          <div className="relative">
                            <Textarea
                              placeholder="House/Flat no., Street, Area, City"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="pl-10 min-h-24"
                            />
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
                          </div>
                        </Field>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Notes */}
                <Card className="p-5 sm:p-8 space-y-4">
                  <Field label="Order Notes (Optional)">
                    <Textarea
                      placeholder="Any special instructions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-16"
                    />
                  </Field>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-5 sm:p-8 space-y-6">
                  <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                    Payment Method
                  </h2>
                  <p className="font-sans text-sm text-[var(--muted-foreground)]">
                    This is a demo — no real payment will be processed.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {paymentMethods.map((pm) => {
                      const Icon = pm.icon;
                      const active = payment === pm.id;
                      return (
                        <motion.button
                          key={pm.id}
                          type="button"
                          onClick={() => setPayment(pm.id)}
                          className={cn(
                            "flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-300",
                            active
                              ? "border-[var(--primary)] bg-[var(--primary)]/10"
                              : "border-[var(--border)] hover:border-[var(--primary)]/30",
                          )}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className={cn(
                              "h-11 w-11 rounded-full grid place-items-center shrink-0 transition-colors",
                              active ? "bg-[var(--primary)]/20" : "bg-[var(--muted)]",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]",
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-sans font-semibold text-sm text-[var(--foreground)]">
                              {pm.label}
                            </p>
                          </div>
                          {active && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto h-5 w-5 rounded-full bg-[var(--primary)] grid place-items-center"
                            >
                              <CheckCircle2 className="h-3 w-3 text-[var(--primary-foreground)]" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="p-5 sm:p-8 space-y-6">
                  <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                    Order Summary
                  </h2>

                  {/* Items */}
                  <div className="space-y-3">
                    {lines.map((line) => {
                      const p = products.find((pr) => pr.id === line.productId);
                      if (!p) return null;
                      return (
                        <div key={line.key} className="flex items-center gap-3 text-sm">
                          <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-[var(--border)]">
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          </div>
                          <span className="flex-1 text-[var(--foreground)]">{p.name}</span>
                          <span className="text-[var(--muted-foreground)] tabular-nums">×{line.quantity}</span>
                          <span className="font-medium text-[var(--foreground)] tabular-nums w-20 text-right">
                            {formatInr(p.price * line.quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="h-px bg-[var(--border)]" />

                  {/* Details */}
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="text-[var(--muted-foreground)]">
                        <span className="text-[var(--foreground)] font-medium">{name}</span>
                        {phone && ` · ${phone}`}
                      </p>
                      <p className="text-[var(--muted-foreground)] capitalize">
                        {fulfillment}
                        {fulfillment === "dine-in" &&
                          tableId &&
                          ` — ${tables.find((t) => t.id === tableId)?.number}`}
                      </p>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Subtotal</span>
                        <span className="text-[var(--foreground)] tabular-nums">{formatInr(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-[var(--success)]">Discount</span>
                          <span className="text-[var(--success)] tabular-nums">−{formatInr(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Tax</span>
                        <span className="text-[var(--foreground)] tabular-nums">{formatInr(tax)}</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold">
                        <span className="text-[var(--foreground)]">Total</span>
                        <span className="text-[var(--primary)]">{formatInr(total)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <Button variant="ghost" onClick={prev}>
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < 4 ? (
              <MagneticButton strength={0.3}>
                <Button
                  variant="primary"
                  className="px-8"
                  disabled={!canProceed}
                  onClick={next}
                >
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </MagneticButton>
            ) : (
              <MagneticButton strength={0.3}>
                <Button variant="primary" className="px-8" onClick={confirm}>
                  Place Order — {formatInr(total)}
                </Button>
              </MagneticButton>
            )}
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
