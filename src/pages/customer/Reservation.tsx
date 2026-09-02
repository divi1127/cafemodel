import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Users,
  User,
  Phone,
  MessageSquare,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { tables } from "@/data/tables";
import { cn, uid } from "@/lib/utils";
import type { CafeTable, TableStatus } from "@/types";

const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const h = 8 + i;
  return `${String(h).padStart(2, "0")}:00`;
});

const guestOptions = Array.from({ length: 12 }, (_, i) => i + 1);

const statusColor: Record<TableStatus, string> = {
  available: "bg-[var(--success)]",
  reserved: "bg-[var(--warning)]",
  occupied: "bg-[var(--danger)]",
  cleaning: "bg-sky-500",
};

const statusLabel: Record<TableStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  occupied: "Occupied",
  cleaning: "Cleaning",
};

interface FormState {
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  request: string;
  tableId: string;
}

const emptyForm: FormState = {
  date: new Date().toISOString().slice(0, 10),
  time: "19:00",
  guests: 2,
  name: "",
  phone: "",
  request: "",
  tableId: "",
};

export default function Reservation() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedTable = tables.find((t) => t.id === form.tableId);

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function selectTable(table: CafeTable) {
    if (table.status !== "available") return;
    update("tableId", table.id);
  }

  function handleSubmit() {
    if (!form.name || !form.phone || !form.tableId) return;
    setSubmitted(true);
    setTimeout(() => setSuccess(true), 600);
  }

  const valid = form.name.trim() && form.phone.trim() && form.tableId;

  return (
    <PageEntrance>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
          <EntranceItem>
            <div className="space-y-6 mx-auto max-w-3xl">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Your Table Awaits
              </p>
              <h1>
                <TextReveal
                  text="Reserve Your Table"
                  className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)]"
                />
              </h1>
              <p className="font-sans text-lg text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed">
                Choose your preferred date, time, and seat. We'll have everything ready
                for your arrival.
              </p>
            </div>
          </EntranceItem>
        </div>
      </section>

      {/* Reservation Form + Table Layout */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-5 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-8">
            <ScrollReveal>
              <Card className="p-5 sm:p-8 space-y-6">
                <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                  Reservation Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Date">
                    <div className="relative">
                      <Input
                        type="date"
                        value={form.date}
                        onChange={(e) => update("date", e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                        className="pl-10"
                      />
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                  </Field>

                  <Field label="Time">
                    <div className="relative">
                      <Select
                        value={form.time}
                        onChange={(e) => update("time", e.target.value)}
                        className="pl-10"
                      >
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </Select>
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
                    </div>
                  </Field>
                </div>

                <Field label="Number of Guests">
                  <div className="relative">
                    <Select
                      value={form.guests}
                      onChange={(e) => update("guests", Number(e.target.value))}
                      className="pl-10"
                    >
                      {guestOptions.map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </Select>
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
                  </div>
                </Field>

                <Field label="Your Name">
                  <div className="relative">
                    <Input
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                </Field>

                <Field label="Phone Number">
                  <div className="relative">
                    <Input
                      placeholder="+91 90000 00000"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="pl-10"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                </Field>

                <Field label="Special Request (Optional)">
                  <div className="relative">
                    <Textarea
                      placeholder="Birthday setup, window seat, dietary notes..."
                      value={form.request}
                      onChange={(e) => update("request", e.target.value)}
                      className="pl-10 min-h-20"
                    />
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                </Field>
              </Card>
            </ScrollReveal>

            {/* Selected table info */}
            <AnimatePresence>
              {selectedTable && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                >
                  <Card className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[var(--primary)]/20 grid place-items-center">
                        <MapPin className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                          Table {selectedTable.number}
                        </h3>
                        <p className="font-sans text-xs text-[var(--muted-foreground)]">
                          Seats {selectedTable.capacity} · {statusLabel[selectedTable.status]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {form.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {form.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {form.guests} guests
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-[var(--danger)] hover:text-[var(--danger)] text-xs"
                      onClick={() => update("tableId", "")}
                    >
                      Change table
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <ScrollReveal delay={0.15}>
              <MagneticButton strength={0.3} className="w-full">
                <Button
                  variant="primary"
                  className="w-full py-3.5 text-base"
                  disabled={!valid || submitted}
                  onClick={handleSubmit}
                >
                  {submitted ? "Reserving..." : "Confirm Reservation"}
                </Button>
              </MagneticButton>
            </ScrollReveal>
          </div>

          {/* Right: Table Layout */}
          <div className="lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <Card className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                    Floor Plan
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {(["available", "reserved", "occupied", "cleaning"] as TableStatus[]).map(
                      (s) => (
                        <div key={s} className="flex items-center gap-2">
                          <div className={cn("h-3 w-3 rounded-full", statusColor[s])} />
                          <span className="font-sans text-xs text-[var(--muted-foreground)] capitalize">
                            {s}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Floor plan container */}
                <div className="relative w-full aspect-[4/3] rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 overflow-hidden">
                  {/* Subtle grid */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Bar area */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    Bar
                  </div>

                  {/* Entrance */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    Entrance
                  </div>

                  {/* Tables */}
                  {tables.map((table) => {
                    const isSelected = table.id === form.tableId;
                    const isClickable = table.status === "available";

                    return (
                      <motion.button
                        key={table.id}
                        type="button"
                        onClick={() => selectTable(table)}
                        disabled={!isClickable}
                        className={cn(
                          "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-1 rounded-xl border-2 transition-all duration-300",
                          isClickable
                            ? "cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-[var(--primary)]/10"
                            : "cursor-not-allowed",
                          isSelected
                            ? "border-[var(--primary)] bg-[var(--primary)]/20 shadow-lg shadow-[var(--primary)]/20 scale-110"
                            : cn("border-transparent", statusColor[table.status], "bg-current/10"),
                        )}
                        style={{
                          left: `${table.x}%`,
                          top: `${table.y}%`,
                          width: table.capacity <= 2 ? 56 : table.capacity <= 4 ? 68 : 80,
                          height: table.capacity <= 2 ? 56 : table.capacity <= 4 ? 68 : 80,
                        }}
                        whileHover={isClickable ? { scale: 1.15 } : undefined}
                        whileTap={isClickable ? { scale: 0.95 } : undefined}
                      >
                        <span
                          className={cn(
                            "font-display text-sm font-bold",
                            isSelected ? "text-[var(--primary)]" : "text-[var(--foreground)]",
                          )}
                        >
                          {table.number}
                        </span>
                        <span className="font-sans text-[9px] text-[var(--foreground)]/60">
                          {table.capacity}p
                        </span>

                        {/* Available pulse ring */}
                        {isClickable && !isSelected && (
                          <motion.div
                            className="absolute inset-0 rounded-xl border-2 border-[var(--success)]"
                            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Legend note */}
                <p className="font-sans text-xs text-[var(--muted-foreground)] text-center">
                  Tap a <span className="text-[var(--success)]">green</span> table to select it.
                  Tables that are reserved, occupied, or being cleaned cannot be selected.
                </p>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <Modal open={success} onClose={() => setSuccess(false)} title="Reservation Confirmed">
        <div className="text-center py-6 space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <CheckCircle2 className="h-20 w-20 text-[var(--success)] mx-auto" />
          </motion.div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
              You're All Set!
            </h3>
            <p className="font-sans text-[var(--muted-foreground)]">
              Your table has been reserved. We look forward to seeing you.
            </p>
          </div>

          <Card className="p-4 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Table</span>
              <span className="font-medium text-[var(--foreground)]">
                {selectedTable?.number} ({selectedTable?.capacity} seats)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Date</span>
              <span className="font-medium text-[var(--foreground)]">{form.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Time</span>
              <span className="font-medium text-[var(--foreground)]">{form.time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Guests</span>
              <span className="font-medium text-[var(--foreground)]">{form.guests}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Name</span>
              <span className="font-medium text-[var(--foreground)]">{form.name}</span>
            </div>
            {form.request && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Request</span>
                <span className="font-medium text-[var(--foreground)] text-right max-w-[60%]">
                  {form.request}
                </span>
              </div>
            )}
          </Card>

          <p className="font-sans text-xs text-[var(--muted-foreground)]">
            Reservation ID: {uid("res").toUpperCase()}
          </p>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              setSuccess(false);
              setForm(emptyForm);
              setSubmitted(false);
            }}
          >
            Done
          </Button>
        </div>
      </Modal>
    </PageEntrance>
  );
}
