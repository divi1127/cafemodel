import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useFavoritesStore = create<FavState>()(
  persist(
    (set, get) => ({
      ids: ["p4", "p17"],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "aurelia-favs" },
  ),
);
