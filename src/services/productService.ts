import { products } from "@/data/products";
import type { Product, ProductCategory } from "@/types";

const delay = async <T>(value: T, ms = 180): Promise<T> =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(value), ms);
  });

export const productService = {
  async list(category?: ProductCategory) {
    const list = category ? products.filter((p) => p.category === category) : products;
    return delay(list);
  },
  async getById(id: string) {
    return delay(products.find((p) => p.id === id || p.slug === id) ?? null);
  },
  async search(q: string) {
    const n = q.toLowerCase();
    return delay(
      products.filter((p) => p.name.toLowerCase().includes(n) || p.description.toLowerCase().includes(n)),
    );
  },
  popular(): Product[] {
    return products.filter((p) => p.bestseller);
  },
};
