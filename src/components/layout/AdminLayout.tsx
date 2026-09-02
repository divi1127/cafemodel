import {
  BarChart3,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Table2,
  Users,
  Wallet,
  Megaphone,
  Star,
  Boxes,
  Percent,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ToastViewport } from "@/components/ui/Toast";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/sales", label: "Sales", icon: BarChart3 },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/pos", label: "POS", icon: Store },
  { to: "/kitchen", label: "Kitchen", icon: ChefHat },
  { to: "/admin/menu", label: "Menu", icon: Menu },
  { to: "/admin/categories", label: "Categories", icon: Boxes },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/tables", label: "Tables", icon: Table2 },
  { to: "/admin/reservations", label: "Reservations", icon: Table2 },
  { to: "/admin/inventory", label: "Inventory", icon: Package },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/staff", label: "Staff", icon: Users },
  { to: "/admin/offers", label: "Offers", icon: Percent },
  { to: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { to: "/admin/finance", label: "Finance", icon: Wallet },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setSidebar = useUiStore((s) => s.setSidebar);
  const [mobile, setMobile] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto scrollbar-thin px-2 py-3">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setMobile(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-white/5 hover:text-[var(--foreground)]",
              isActive && "bg-white/8 text-[var(--primary)]",
              collapsed && "justify-center px-2",
            )
          }
        >
          <Icon size={16} />
          {!collapsed || mobile ? <span>{label}</span> : null}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-svh bg-[var(--background)] text-[var(--foreground)]">
      <aside
        className={cn(
          "hidden border-r border-[var(--border)] bg-[var(--card)] md:flex md:flex-col",
          collapsed ? "w-[72px]" : "w-60",
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-4">
          <Link to="/" className="font-display text-xl tracking-[0.14em]">
            {collapsed ? "A" : "AURELIA"}
          </Link>
        </div>
        {nav}
        <button className="border-t border-[var(--border)] px-3 py-3 text-xs" onClick={() => setSidebar(!collapsed)}>
          {collapsed ? "»" : "Collapse"}
        </button>
      </aside>
      {mobile ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button className="flex-1 bg-black/50" onClick={() => setMobile(false)} aria-label="Close" />
          <aside className="flex w-64 flex-col bg-[var(--card)]">{nav}</aside>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <button className="md:hidden" onClick={() => setMobile(true)} aria-label="Open sidebar">
            <Menu size={18} />
          </button>
          <p className="text-sm text-[var(--muted-foreground)]">Operations · live mock data</p>
          <Link to="/" className="text-sm text-[var(--primary)]">
            View café
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
      <ToastViewport />
    </div>
  );
}
