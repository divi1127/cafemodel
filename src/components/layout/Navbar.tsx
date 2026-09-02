import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },

  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const count = useCartStore((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const favCount = useFavoritesStore((s) => s.ids.length);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-500",
        scrolled ? "border-b border-[var(--border)] bg-[var(--background)]/70 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl tracking-[0.18em]">
          AURELIA
        </Link>
        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn("tracking-wide text-[var(--muted-foreground)] hover:text-[var(--foreground)]", isActive && "text-[var(--primary)]")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/menu"
            className="hidden items-center rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-medium tracking-wide whitespace-nowrap text-[var(--primary-foreground)] transition hover:brightness-110 sm:inline-flex"
          >
            Order Now
          </Link>
          <Link
            to="/favorites"
            className="relative grid h-10 w-10 place-items-center rounded-full text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Wishlist"
          >
            <Heart size={18} />
            {favCount > 0 ? (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--primary)] px-1 text-[10px] text-[var(--primary-foreground)]">
                {favCount}
              </span>
            ) : null}
          </Link>
          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {count > 0 ? (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--primary)] px-1 text-[10px] text-[var(--primary-foreground)]">
                {count}
              </span>
            ) : null}
          </Link>
          <Link
            to="/account"
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Profile"
          >
            <User size={18} />
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)] lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 bg-[var(--background)] lg:hidden"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-display text-2xl tracking-[0.18em]">AURELIA</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-6 px-8 pt-8 font-display text-4xl">
              {links.map((l) => (
                <Link key={l.to} to={l.to}>
                  {l.label}
                </Link>
              ))}
              <Link to="/reservation">Reserve</Link>
              <Link to="/login">Login</Link>
              <Link to="/favorites">Favorites</Link>
              <Link
                to="/menu"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-6 py-4 text-base font-medium tracking-wide text-[var(--primary-foreground)] transition hover:brightness-110"
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
