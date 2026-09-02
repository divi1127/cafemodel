import { Outlet } from "react-router-dom";
import { ToastViewport } from "@/components/ui/Toast";

export function OpsLayout({ title }: { title: string }) {
  return (
    <div className="flex min-h-svh flex-col bg-[#0c0a08] text-[#f4ead8]">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="font-display text-2xl tracking-[0.16em]">AURELIA · {title}</p>
        <p className="text-xs uppercase tracking-[0.18em] text-white/50">Fast mode · reduced motion</p>
      </header>
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      <ToastViewport />
    </div>
  );
}

export function PosLayout() {
  return <OpsLayout title="POS" />;
}

export function KitchenLayout() {
  return <OpsLayout title="KDS" />;
}
