import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { reservations as seedReservations } from "@/data/reservations";
import { tables as allTables } from "@/data/tables";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Field, Select, Textarea } from "@/components/ui/Input";
import { Modal, Drawer } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Toast";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { useOrderStore } from "@/stores/orderStore";
import type { Reservation } from "@/types";

type ResStatus = Reservation["status"];

const statusTone: Record<ResStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/40",
  confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  seated: "bg-sky-500/15 text-sky-400 border-sky-500/40",
  completed: "bg-white/8 text-[var(--muted-foreground)] border-[var(--border)]",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/40",
};

const filterTabs = ["All", "Pending", "Confirmed", "Seated", "Completed", "Cancelled"];

export default function Reservations() {
  const [data, setData] = useState<Reservation[]>(seedReservations);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const pushToast = useOrderStore((s) => s.pushToast);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    tableId: allTables[0]?.id ?? "",
    request: "",
  });

  const filtered = filter === "All" ? data : data.filter((r) => r.status === filter.toLowerCase() as ResStatus);

  const updateStatus = (id: string, status: ResStatus) => {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    pushToast("Status updated", `Reservation set to ${status}`);
  };

  const handleSubmit = () => {
    if (!form.name || !form.date || !form.time) return;
    const newRes: Reservation = {
      id: `r-${Date.now()}`,
      name: form.name,
      phone: form.phone,
      date: form.date,
      time: form.time,
      guests: form.guests,
      tableId: form.tableId,
      status: "pending",
      request: form.request || undefined,
    };
    setData((prev) => [newRes, ...prev]);
    setModalOpen(false);
    setForm({ name: "", phone: "", date: "", time: "", guests: 2, tableId: allTables[0]?.id ?? "", request: "" });
    pushToast("Reservation created", `${newRes.name} — ${newRes.date} at ${newRes.time}`);
  };

  const tableNumber = (tableId: string) => allTables.find((t) => t.id === tableId)?.number ?? "—";

  const actionsForStatus = (r: Reservation) => {
    const map: Partial<Record<ResStatus, { label: string; next: ResStatus }[]>> = {
      pending: [{ label: "Confirm", next: "confirmed" }],
      confirmed: [{ label: "Seat", next: "seated" }],
      seated: [{ label: "Complete", next: "completed" }],
    };
    return (map[r.status] ?? []).concat(r.status !== "cancelled" && r.status !== "completed" ? [{ label: "Cancel", next: "cancelled" }] : []);
  };

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
                Reservations
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Manage bookings and table assignments
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} /> New Reservation
            </Button>
          </div>
        </EntranceItem>

        <EntranceItem>
          <Tabs tabs={filterTabs} value={filter} onChange={setFilter} />
        </EntranceItem>

        <EntranceItem>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-[var(--muted)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Guests</th>
                    <th className="px-4 py-3 font-medium">Table</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Request</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className="border-t border-[var(--border)] transition hover:bg-white/4 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">{r.name}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.phone}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.date}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.time}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.guests}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{tableNumber(r.tableId)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-medium",
                            statusTone[r.status],
                          )}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)] max-w-[160px] truncate">
                        {r.request ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          {actionsForStatus(r).slice(0, 2).map((a) => (
                            <button
                              key={a.label}
                              onClick={() => updateStatus(r.id, a.next)}
                              className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-[var(--muted-foreground)]">
                        No reservations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </EntranceItem>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Reservation Details">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-medium",
                  statusTone[selected.status],
                )}
              >
                {selected.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Name</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{selected.name}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Phone</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{selected.phone}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Date</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{selected.date}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Time</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{selected.time}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Guests</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{selected.guests}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Table</p>
                <p className="mt-1 font-medium text-[var(--foreground)]">{tableNumber(selected.tableId)}</p>
              </div>
            </div>

            {selected.request && (
              <div className="border border-[var(--border)] bg-[var(--muted)]/40 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Special Request</p>
                <p className="mt-1 text-sm italic text-[var(--foreground)]">&ldquo;{selected.request}&rdquo;</p>
              </div>
            )}

            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Actions</p>
              <div className="flex flex-wrap gap-2">
                {actionsForStatus(selected).map((a) => (
                  <Button
                    key={a.label}
                    variant={a.label === "Cancel" ? "danger" : "primary"}
                    onClick={() => updateStatus(selected.id, a.next)}
                  >
                    {a.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Reservation">
        <div className="space-y-4">
          <Field label="Guest Name">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+91 ..."
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </Field>
            <Field label="Time">
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Guests">
              <Input
                type="number"
                min={1}
                max={20}
                value={form.guests}
                onChange={(e) => setForm((f) => ({ ...f, guests: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Table">
              <Select
                value={form.tableId}
                onChange={(e) => setForm((f) => ({ ...f, tableId: e.target.value }))}
              >
                {allTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.number} (cap {t.capacity}) — {t.status}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Special Request">
            <Textarea
              value={form.request}
              onChange={(e) => setForm((f) => ({ ...f, request: e.target.value }))}
              placeholder="Optional notes..."
              rows={3}
            />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Reservation</Button>
          </div>
        </div>
      </Modal>
    </PageEntrance>
  );
}
