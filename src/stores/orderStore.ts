import { create } from "zustand";
import { orders as seed } from "@/data/orders";
import { uid } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

interface Toast {
  id: string;
  title: string;
  body?: string;
}

interface OrderState {
  orders: Order[];
  toasts: Toast[];
  addOrder: (order: Order) => void;
  setStatus: (id: string, status: OrderStatus) => void;
  pushToast: (title: string, body?: string) => void;
  dismiss: (id: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: seed,
  toasts: [],
  addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
  setStatus: (id, status) =>
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
  pushToast: (title, body) => {
    const id = uid("toast");
    set((s) => ({ toasts: [...s.toasts, { id, title, body }] }));
    window.setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3800);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
