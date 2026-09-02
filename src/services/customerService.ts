import { customers } from "@/data/customers";

export const customerService = {
  async list() {
    return customers;
  },
  async get(id: string) {
    return customers.find((c) => c.id === id) ?? customers[0];
  },
  me() {
    return customers[0];
  },
};
