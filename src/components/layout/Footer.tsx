import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-16 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        <div className="col-span-2 sm:col-span-2 md:col-span-1">
          <p className="font-display text-3xl tracking-[0.16em]">AURELIA</p>
          <p className="mt-3 max-w-xs text-sm text-[var(--muted-foreground)]">
            A cup. A moment. A memory. Crafted in the city, roasted with patience.
          </p>
        </div>
        <div className="col-span-2 sm:col-span-2 md:col-span-1 md:pr-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Visit</p>
          <p className="mt-3 text-sm">12 Chapel Lane, Colaba</p>
          <p className="text-sm">Mumbai 400001</p>
          <p className="mt-2 text-sm">Tue–Sun · 8:00 – 22:00</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/menu">Menu</Link>
          <Link to="/reservation">Reservations</Link>
          <Link to="/loyalty">Coffee Club</Link>
          <Link to="/careers" className="pointer-events-none opacity-50">
            Careers
          </Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/admin">Staff / Admin</Link>
          <Link to="/pos">POS</Link>
          <Link to="/kitchen">Kitchen</Link>
          <Link to="/reviews">Reviews</Link>
        </div>
      </div>
      <p className="border-t border-[var(--border)] px-5 py-4 text-center text-xs text-[var(--muted-foreground)]">
        © 2026 Aurelia Café. Frontend demonstration — mock data only.
      </p>
    </footer>
  );
}
