import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Session {
  role: "guest" | "customer" | "staff";
  name: string;
  email: string;
  login: (name: string, email: string, role?: "customer" | "staff") => void;
  logout: () => void;
}

export const useSessionStore = create<Session>()(
  persist(
    (set) => ({
      role: "guest",
      name: "",
      email: "",
      login: (name, email, role = "customer") => set({ name, email, role }),
      logout: () => set({ role: "guest", name: "", email: "" }),
    }),
    { name: "aurelia-session" },
  ),
);
