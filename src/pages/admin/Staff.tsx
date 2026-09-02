import { useState } from "react";
import { Plus, Mail, Phone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { staff as seedStaff } from "@/data/staff";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Field, Select } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { Modal, Drawer } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Toast";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { useOrderStore } from "@/stores/orderStore";
import type { StaffMember, StaffRole } from "@/types";

const roleTabs = ["All", "Super Admin", "Admin", "Manager", "Cashier", "Kitchen Staff", "Waiter", "Delivery Staff"];

const roleTone: Record<StaffRole, string> = {
  "Super Admin": "bg-purple-500/15 text-purple-400 border-purple-500/40",
  Admin: "bg-indigo-500/15 text-indigo-400 border-indigo-500/40",
  Manager: "bg-sky-500/15 text-sky-400 border-sky-500/40",
  Cashier: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  "Kitchen Staff": "bg-amber-500/15 text-amber-400 border-amber-500/40",
  Waiter: "bg-teal-500/15 text-teal-400 border-teal-500/40",
  "Delivery Staff": "bg-orange-500/15 text-orange-400 border-orange-500/40",
};

export default function Staff() {
  const [data, setData] = useState<StaffMember[]>(seedStaff);
  const [roleFilter, setRoleFilter] = useState("All");
  const [selected, setSelected] = useState<StaffMember | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const pushToast = useOrderStore((s) => s.pushToast);

  const [form, setForm] = useState({
    name: "",
    role: "Waiter" as StaffRole,
    email: "",
    phone: "",
    shift: "Morning",
  });

  const filtered = roleFilter === "All" ? data : data.filter((s) => s.role === roleFilter);

  const activeCount = data.filter((s) => s.active).length;
  const avgPerf = Math.round(data.reduce((s, m) => s + m.performance, 0) / data.length);
  const avgAtt = Math.round(data.reduce((s, m) => s + m.attendance, 0) / data.length);

  const toggleActive = (id: string) => {
    setData((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, active: !prev.active } : prev));
  };

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const newMember: StaffMember = {
      id: `s-${Date.now()}`,
      name: form.name,
      role: form.role,
      email: form.email,
      phone: form.phone,
      shift: form.shift,
      attendance: 100,
      performance: 100,
      active: true,
    };
    setData((prev) => [newMember, ...prev]);
    setModalOpen(false);
    setForm({ name: "", role: "Waiter", email: "", phone: "", shift: "Morning" });
    pushToast("Staff added", `${newMember.name} — ${newMember.role}`);
  };

  const barColor = (val: number) =>
    val >= 90 ? "bg-emerald-500" : val >= 75 ? "bg-amber-500" : "bg-red-500";

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)] lg:text-3xl">
                Staff Management
              </h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Team members, shifts, and performance
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Add Staff
            </Button>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Total Staff" value={data.length} />
            <StatCard label="Active" value={activeCount} hint="currently on roster" />
            <StatCard label="Avg Performance" value={`${avgPerf}%`} hint="across team" />
            <StatCard label="Avg Attendance" value={`${avgAtt}%`} hint="this month" />
          </div>
        </EntranceItem>

        <EntranceItem>
          <Tabs tabs={roleTabs} value={roleFilter} onChange={setRoleFilter} />
        </EntranceItem>

        <EntranceItem>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-[var(--muted)] text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Shift</th>
                    <th className="px-4 py-3 font-medium">Attendance</th>
                    <th className="px-4 py-3 font-medium">Performance</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => setSelected(m)}
                      className="border-t border-[var(--border)] transition hover:bg-white/4 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">{m.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-medium",
                            roleTone[m.role] ?? "border-[var(--border)] text-[var(--muted-foreground)]",
                          )}
                        >
                          {m.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{m.email}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{m.phone}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{m.shift}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden bg-white/8">
                            <div
                              className={cn("h-full", barColor(m.attendance))}
                              style={{ width: `${m.attendance}%` }}
                            />
                          </div>
                          <span className="text-xs text-[var(--muted-foreground)]">{m.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden bg-white/8">
                            <div
                              className={cn("h-full", barColor(m.performance))}
                              style={{ width: `${m.performance}%` }}
                            />
                          </div>
                          <span className="text-xs text-[var(--muted-foreground)]">{m.performance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleActive(m.id)}
                            className={cn(
                              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                              m.active ? "bg-emerald-500" : "bg-white/15",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
                                m.active ? "translate-x-[18px]" : "translate-x-[3px]",
                              )}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </EntranceItem>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Staff Profile">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/15 text-xl font-bold text-[var(--primary)]">
                {selected.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">{selected.name}</h3>
                <span
                  className={cn(
                    "mt-1 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] font-medium",
                    roleTone[selected.role] ?? "border-[var(--border)] text-[var(--muted-foreground)]",
                  )}
                >
                  {selected.role}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Mail size={14} /> {selected.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Phone size={14} /> {selected.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Clock size={14} /> {selected.shift} shift
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Attendance</span>
                <span className="text-sm font-medium text-[var(--foreground)]">{selected.attendance}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden bg-white/8">
                <div
                  className={cn("h-full transition-all", barColor(selected.attendance))}
                  style={{ width: `${selected.attendance}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Performance</span>
                <span className="text-sm font-medium text-[var(--foreground)]">{selected.performance}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden bg-white/8">
                <div
                  className={cn("h-full transition-all", barColor(selected.performance))}
                  style={{ width: `${selected.performance}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Status</p>
                <p className={cn("mt-0.5 text-sm font-medium", selected.active ? "text-[var(--success)]" : "text-[var(--muted-foreground)]")}>
                  {selected.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => toggleActive(selected.id)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    selected.active ? "bg-emerald-500" : "bg-white/15",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                      selected.active ? "translate-x-[22px]" : "translate-x-[4px]",
                    )}
                  />
                </button>
              </div>
            </div>

            <Button variant="line" className="w-full" onClick={() => pushToast("Edit mode", "Staff editing coming soon")}>
              Edit Profile
            </Button>
          </div>
        )}
      </Drawer>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <div className="space-y-4">
          <Field label="Full Name">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Staff member name"
            />
          </Field>
          <Field label="Role">
            <Select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as StaffRole }))}
            >
              {(["Super Admin", "Admin", "Manager", "Cashier", "Kitchen Staff", "Waiter", "Delivery Staff"] as StaffRole[]).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="email@aurelia.cafe"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="900..."
            />
          </Field>
          <Field label="Shift">
            <Select
              value={form.shift}
              onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value }))}
            >
              {["Morning", "Evening", "Night", "Split", "Flexible"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Staff</Button>
          </div>
        </div>
      </Modal>
    </PageEntrance>
  );
}
