import type { CafeTable } from "@/types";

export const tables: CafeTable[] = [
  { id: "t1", number: "T1", capacity: 2, status: "occupied", x: 8, y: 18, customer: "Nina Kapoor", orderId: "o3" },
  { id: "t2", number: "T2", capacity: 2, status: "occupied", x: 28, y: 18, customer: "Sara Ali", orderId: "o7" },
  { id: "t3", number: "T3", capacity: 4, status: "available", x: 48, y: 18 },
  { id: "t4", number: "T4", capacity: 4, status: "occupied", x: 68, y: 18, customer: "Meera Shah", orderId: "o1" },
  { id: "t5", number: "T5", capacity: 2, status: "cleaning", x: 8, y: 48 },
  { id: "t6", number: "T6", capacity: 4, status: "reserved", x: 28, y: 48, customer: "Walk-in hold", reservationId: "r2" },
  { id: "t7", number: "T7", capacity: 6, status: "occupied", x: 52, y: 48, customer: "Rahul Iyer", orderId: "o5" },
  { id: "t8", number: "T8", capacity: 2, status: "available", x: 78, y: 48 },
  { id: "t9", number: "T9", capacity: 8, status: "available", x: 18, y: 74 },
  { id: "t10", number: "T10", capacity: 4, status: "reserved", x: 58, y: 74, reservationId: "r1", customer: "Dev Family" },
];
