import { Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { TiltCard } from "@/components/animations/TiltCard";
import { Badge } from "@/components/ui/Card";
import { formatInr } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useOrderStore } from "@/stores/orderStore";
import { useUiStore } from "@/stores/uiStore";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const toggle = useFavoritesStore((s) => s.toggle);
  const liked = useFavoritesStore((s) => s.ids.includes(product.id));
  const add = useCartStore((s) => s.add);
  const toast = useOrderStore((s) => s.pushToast);
  const setCursor = useUiStore((s) => s.setCursorLabel);

  return (
    <TiltCard className="group relative">
      <article
        className="overflow-hidden border border-[var(--border)] bg-[var(--card)]"
        onMouseEnter={() => setCursor("VIEW")}
        onMouseLeave={() => setCursor("")}
      >
        <Link to={`/menu/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />
          {product.bestseller ? (
            <span className="absolute left-3 top-3">
              <Badge>Bestseller</Badge>
            </span>
          ) : null}
        </Link>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl leading-tight">{product.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{product.description}</p>
            </div>
            <button aria-label="Favorite" onClick={() => toggle(product.id)} className="mt-1">
              <Heart size={18} fill={liked ? "currentColor" : "none"} className={liked ? "text-[var(--danger)]" : ""} />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-[var(--primary)]">{formatInr(product.price)}</p>
              <p className="text-xs text-[var(--muted-foreground)]">★ {product.rating}</p>
            </div>
            <button
              className="grid h-10 w-10 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]"
              aria-label={`Add ${product.name}`}
              onClick={() => {
                add({ productId: product.id, quantity: 1, addonIds: [] });
                toast("Added to cart", product.name);
              }}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
