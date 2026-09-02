import { orders as seed } from "@/data/orders";
import type { Order, OrderStatus } from "@/types";

let memory = [...seed];

export const orderService = {
  async list(status?: OrderStatus | "all") {
    const list = !status || status === "all" ? memory : memory.filter((o) => o.status === status);
    return [...list];
  },
  async get(id: string) {
    return memory.find((o) => o.id === id) ?? null;
  },
  async add(order: Order) {
    memory = [order, ...memory];
    return order;
  },
  async setStatus(id: string, status: OrderStatus) {
    memory = memory.map((o) => (o.id === id ? { ...o, status } : o));
    return memory.find((o) => o.id === id) ?? null;
  },
};
