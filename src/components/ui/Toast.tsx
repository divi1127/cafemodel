import { createContext, useContext, type ButtonHTMLAttributes, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOrderStore } from "@/stores/orderStore";

export function ToastViewport() {
  const toasts = useOrderStore((s) => s.toasts);
  const dismiss = useOrderStore((s) => s.dismiss);
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[80] flex w-80 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            className="pointer-events-auto border border-[var(--border)] bg-[var(--card)] p-4 text-left"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
          >
            <p className="text-sm font-medium">{t.title}</p>
            {t.body ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{t.body}</p> : null}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

const TabsContext = createContext<{ value?: string; onValueChange?: (v: string) => void }>({});

type TabsProps = {
  tabs?: string[];
  value?: string;
  onChange?: (v: string) => void;
  onValueChange?: (v: string) => void;
  children?: ReactNode;
  className?: string;
};

function TabsBase({
  tabs,
  value,
  onChange,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const change = (v: string) => {
    if (onValueChange) onValueChange(v);
    if (onChange) onChange(v);
  };

  if (children) {
    return (
      <TabsContext.Provider value={{ value, onValueChange: change }}>
        <div className={className}>{children}</div>
      </TabsContext.Provider>
    );
  }

  if (!tabs) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => change(t)}
          className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition ${
            value === t ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-[var(--border)]"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function TabsList({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={className ?? "flex gap-2 min-w-max pb-1"}>{children}</div>;
}

function TabsTrigger({
  value,
  children,
  className,
  ...rest
}: {
  value: string;
  children?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { value: _active, onValueChange } = useContext(TabsContext);
  return (
    <button
      value={value}
      data-value={value}
      className={className}
      onClick={() => onValueChange?.(value)}
      {...rest}
    >
      {children}
    </button>
  );
}

export const Tabs = Object.assign(TabsBase, { List: TabsList, Trigger: TabsTrigger });
