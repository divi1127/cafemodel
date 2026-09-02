import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Award,
  UserCog,
  Settings,
  LogOut,
  Package,
  Clock,
  Star,
  ChevronRight,
  Sun,
  Moon,
  Mail,
  Phone,
  Edit3,
} from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { Button } from "@/components/ui/Button";
import { Card, Badge } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { useSessionStore } from "@/stores/sessionStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useOrderStore } from "@/stores/orderStore";
import { customers } from "@/data/customers";
import { cn, formatInr } from "@/lib/utils";

type Tab = "dashboard" | "orders" | "favorites" | "loyalty" | "profile" | "settings";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag size={18} /> },
  { id: "favorites", label: "Favorites", icon: <Heart size={18} /> },
  { id: "loyalty", label: "Loyalty", icon: <Award size={18} /> },
  { id: "profile", label: "Profile", icon: <UserCog size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

const statusColor: Record<string, string> = {
  new: "text-[var(--primary)]",
  confirmed: "text-[var(--primary)]",
  preparing: "text-[var(--primary)]",
  ready: "text-[var(--success)]",
  served: "text-[var(--success)]",
  completed: "text-[var(--success)]",
  cancelled: "text-[var(--danger)]",
};

function DashboardTab({ customer }: { customer: ReturnType<typeof customers.find> }) {
  const favIds = useFavoritesStore((s) => s.ids);
  const orders = useOrderStore((s) => s.orders);

  const stats = [
    { label: "Total Orders", value: customer?.orders ?? 0, icon: <Package size={20} /> },
    { label: "Total Spent", value: formatInr(customer?.spent ?? 0), icon: <ShoppingBag size={20} /> },
    { label: "Loyalty Points", value: customer?.loyaltyPoints ?? 0, icon: <Star size={20} /> },
    { label: "Favorites", value: favIds.length, icon: <Heart size={20} /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">
          Welcome back, {customer?.name.split(" ")[0] ?? "Guest"}
        </h2>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Here's your account overview
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 0.08}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {s.label}
                </p>
                <span className="text-[var(--primary)]">{s.icon}</span>
              </div>
              <p className="font-display text-3xl text-[var(--foreground)]">{s.value}</p>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {customer && (
        <ScrollReveal>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-[var(--primary)]"
              />
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold">{customer.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{customer.email}</p>
              </div>
              <Badge>{customer.tier}</Badge>
            </div>
          </Card>
        </ScrollReveal>
      )}
    </div>
  );
}

function OrdersTab() {
  const sessionName = useSessionStore((s) => s.name);
  const orders = useOrderStore((s) => s.orders);
  const filtered = orders
    .filter((o) => o.customerName === sessionName)
    .slice(0, 10);

  const display = filtered.length > 0 ? filtered : orders.slice(0, 3);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Your Orders</h2>
      {display.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="font-display text-2xl">No orders yet</p>
          <p className="mt-2 text-[var(--muted-foreground)]">Place your first order to get started</p>
          <Button asChild variant="line" className="mt-6">
            <Link to="/menu">Browse Menu</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {display.map((order, i) => (
            <ScrollReveal key={order.id} delay={i * 0.06}>
              <Card className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg font-bold">#{order.number}</h3>
                      <span className={cn("text-xs uppercase tracking-wider font-medium", statusColor[order.status])}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {order.items.map((it) => `${it.quantity}× ${it.name}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-lg font-bold text-[var(--primary)]">
                      {formatInr(order.total)}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 justify-end mt-1">
                      <Clock size={12} />
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

function FavoritesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Your Favorites</h2>
        <Button asChild variant="line" size="sm">
          <Link to="/favorites">View All</Link>
        </Button>
      </div>
      <Card className="p-12 text-center">
        <p className="font-display text-2xl">Manage your favorites</p>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Tap the heart on any item to add it here
        </p>
        <Button asChild variant="line" className="mt-6">
          <Link to="/favorites">
            View Favorites
            <ChevronRight size={16} />
          </Link>
        </Button>
      </Card>
    </div>
  );
}

function LoyaltyTab() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Loyalty Program</h2>
      <Card className="p-12 text-center">
        <p className="font-display text-2xl">Your Coffee Club Status</p>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Earn points with every purchase and unlock exclusive rewards
        </p>
        <Button asChild variant="line" className="mt-6">
          <Link to="/loyalty">
            View Loyalty Program
            <ChevronRight size={16} />
          </Link>
        </Button>
      </Card>
    </div>
  );
}

function ProfileTab({ customer }: { customer: ReturnType<typeof customers.find> }) {
  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Edit Profile</h2>
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <img
            src={customer?.avatar ?? "https://i.pravatar.cc/120"}
            alt="Avatar"
            className="h-20 w-20 rounded-full object-cover border-2 border-[var(--primary)]"
          />
          <div>
            <h3 className="font-display text-xl font-bold">{customer?.name}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Member since {customer?.joinedAt ? new Date(customer.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "2024"}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full Name">
            <div className="relative">
              <Input value={name} onChange={(e) => setName(e.target.value)} className="pr-10" />
              <Edit3 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            </div>
          </Field>
          <Field label="Email">
            <div className="relative">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pr-10" />
              <Mail size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            </div>
          </Field>
          <Field label="Phone">
            <div className="relative">
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pr-10" />
              <Phone size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            </div>
          </Field>
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}

function SettingsTab() {
  const logout = useSessionStore((s) => s.logout);
  const [dark, setDark] = useState(true);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Settings</h2>
      <Card className="divide-y divide-[var(--border)]">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            {dark ? <Moon size={18} className="text-[var(--primary)]" /> : <Sun size={18} className="text-[var(--primary)]" />}
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-[var(--muted-foreground)]">{dark ? "Dark mode" : "Light mode"}</p>
            </div>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              dark ? "bg-[var(--primary)]" : "bg-[var(--border)]"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                dark ? "translate-x-5.5" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
        <div className="p-5">
          <Button variant="danger" onClick={logout}>
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function Account() {
  const role = useSessionStore((s) => s.role);
  const name = useSessionStore((s) => s.name);
  const email = useSessionStore((s) => s.email);
  const logout = useSessionStore((s) => s.logout);
  const [active, setActive] = useState<Tab>("dashboard");

  if (role === "guest") {
    return (
      <PageEntrance className="min-h-[70vh] flex items-center justify-center px-6 py-24">
        <EntranceItem className="w-full max-w-md text-center">
          <Card className="p-10 space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-[var(--muted)] grid place-items-center">
              <UserCog size={32} className="text-[var(--muted-foreground)]" />
            </div>
            <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">
              <TextReveal text="Sign In Required" />
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Please sign in to access your account dashboard
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full py-3">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="line" className="w-full py-3">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </Card>
        </EntranceItem>
      </PageEntrance>
    );
  }

  const customer = customers.find(
    (c) => c.email === email || c.name === name
  );

  const tabContent: Record<Tab, React.ReactNode> = {
    dashboard: <DashboardTab customer={customer} />,
    orders: <OrdersTab />,
    favorites: <FavoritesTab />,
    loyalty: <LoyaltyTab />,
    profile: <ProfileTab customer={customer} />,
    settings: <SettingsTab />,
  };

  return (
    <PageEntrance className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <EntranceItem>
          <div className="mb-12">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              My Account
            </p>
            <h1 className="mt-3 font-display text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
              <TextReveal text="Your Dashboard" />
            </h1>
          </div>
        </EntranceItem>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <EntranceItem>
            <nav className="space-y-1 lg:sticky lg:top-24 lg:self-start">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                    active === t.id
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "text-[var(--muted-foreground)] hover:bg-white/5 hover:text-[var(--foreground)]"
                  )}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
              <div className="pt-2 border-t border-[var(--border)]">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10 transition"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </nav>
          </EntranceItem>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {tabContent[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageEntrance>
  );
}
