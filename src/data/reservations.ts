import type { Reservation } from "@/types";

export const reservations: Reservation[] = [
  {
    id: "r1",
    name: "Dev Family",
    phone: "+91 90000 10101",
    date: "2026-08-26",
    time: "19:30",
    guests: 4,
    tableId: "t10",
    status: "confirmed",
    request: "Window if possible",
  },
  {
    id: "r2",
    name: "Priya Nair",
    phone: "+91 90000 20202",
    date: "2026-08-26",
    time: "13:00",
    guests: 2,
    tableId: "t6",
    status: "pending",
  },
  {
    id: "r3",
    name: "Kabir Singh",
    phone: "+91 90000 30303",
    date: "2026-08-27",
    time: "20:00",
    guests: 6,
    tableId: "t7",
    status: "confirmed",
    request: "Birthday dessert",
  },
];
