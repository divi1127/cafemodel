import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  theme: "dark" | "light";
  sidebarCollapsed: boolean;
  cursorLabel: string;
  toggleTheme: () => void;
  setSidebar: (v: boolean) => void;
  setCursorLabel: (v: string) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "dark",
      sidebarCollapsed: false,
      cursorLabel: "",
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setSidebar: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setCursorLabel: (cursorLabel) => set({ cursorLabel }),
    }),
    { name: "aurelia-ui", partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }) },
  ),
);
