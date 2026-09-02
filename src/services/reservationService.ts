import { reservations as seed } from "@/data/reservations";
import type { Reservation } from "@/types";

let memory = [...seed];

export const reservationService = {
  async list() {
    return [...memory];
  },
  async create(payload: Reservation) {
    memory = [payload, ...memory];
    return payload;
  },
};
