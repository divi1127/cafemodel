import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Coffee,
  Gem,
  Crown,
  Landmark,
  Gift,
  ArrowRight,
  Check,
  Sparkles,
  Star,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { Button } from "@/components/ui/Button";
import { Card, Badge } from "@/components/ui/Card";
import { useSessionStore } from "@/stores/sessionStore";
import { customers } from "@/data/customers";
import { cn } from "@/lib/utils";

const tiers = [
  { name: "Bean", icon: <Coffee size={20} />, min: 0, color: "from-amber-700 to-amber-900", border: "border-amber-700/40", text: "text-amber-400" },
  { name: "Brew", icon: <Gem size={20} />, min: 500, color: "from-amber-500 to-amber-700", border: "border-amber-500/40", text: "text-amber-300" },
  { name: "Reserve", icon: <Crown size={20} />, min: 2000, color: "from-yellow-500 to-amber-500", border: "border-yellow-500/40", text: "text-yellow-300" },
  { name: "Estate", icon: <Landmark size={20} />, min: 5000, color: "from-yellow-300 to-yellow-500", border: "border-yellow-300/40", text: "text-yellow-200" },
];

const rewards = [
  { id: "r1", title: "Free Espresso", points: 200, description: "Any single espresso drink", icon: <Coffee size={20} /> },
  { id: "r2", title: "15% Off Next Order", points: 500, description: "Valid on orders above ₹500", icon: <CreditCard size={20} /> },
  { id: "r3", title: "Free Pastry", points: 350, description: "Any pastry or cake slice", icon: <Gift size={20} /> },
  { id: "r4", title: "Exclusive Blend Tasting", points: 1000, description: "Private cupping session", icon: <Sparkles size={20} /> },
];

const pointsHistory = [
  { id: "h1", date: "2026-08-20", description: "Order #AUR-4821", points: 85, type: "earned" as const },
  { id: "h2", date: "2026-08-15", description: "Free Espresso redeemed", points: -200, type: "redeemed" as const },
  { id: "h3", date: "2026-08-12", description: "Order #AUR-4798", points: 120, type: "earned" as const },
  { id: "h4", date: "2026-08-06", description: "Bonus: Birthday month", points: 200, type: "bonus" as const },
  { id: "h5", date: "2026-07-30", description: "Order #AUR-4755", points: 65, type: "earned" as const },
];

const steps = [
  { icon: <Coffee size={24} />, title: "Order & Earn", desc: "Earn 1 point for every ₹10 spent at Aurelia" },
  { icon: <TrendingUp size={24} />, title: "Climb Tiers", desc: "Reach higher tiers for exclusive perks and priority" },
  { icon: <Gift size={24} />, title: "Redeem Rewards", desc: "Exchange points for free drinks, discounts, and experiences" },
  { icon: <Crown size={24} />, title: "Enjoy Benefits", desc: "Unlock birthday rewards, early access, and member-only events" },
];

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return <span>{value.toLocaleString("en-IN")}</span>;
}

export default function Loyalty() {
  const name = useSessionStore((s) => s.name);
  const email = useSessionStore((s) => s.email);
  const customer = customers.find((c) => c.email === email || c.name === name);

  const points = customer?.loyaltyPoints ?? 2480;
  const tier = customer?.tier ?? "Reserve";
  const tierIndex = tiers.findIndex((t) => t.name === tier);

  const nextTier = tiers[tierIndex + 1];
  const progressToNext = nextTier ? ((points - tiers[tierIndex].min) / (nextTier.min - tiers[tierIndex].min)) * 100 : 100;
  const pointsToNext = nextTier ? nextTier.min - points : 0;

  return (
    <PageEntrance className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <EntranceItem>
          <div className="text-center mb-16 space-y-4">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              Loyalty Program
            </p>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-[var(--foreground)]">
              <TextReveal text="The Coffee Club" />
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
              Earn points with every sip. Climb tiers. Unlock experiences reserved for our most devoted members.
            </p>
          </div>
        </EntranceItem>

        {/* Points Display */}
        <ScrollReveal>
          <Card className="p-8 sm:p-12 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  Available Points
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-6xl lg:text-7xl font-bold text-[var(--primary)]">
                    <AnimatedNumber target={points} />
                  </span>
                  <span className="text-[var(--muted-foreground)] text-sm">pts</span>
                </div>
                {nextTier && (
                  <div className="space-y-2 max-w-md">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">
                        {pointsToNext} points to {nextTier.name}
                      </span>
                      <span className="text-[var(--primary)]">{Math.min(progressToNext, 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-yellow-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center md:text-right">
                <Badge>Current Tier</Badge>
                <div className="mt-3 flex items-center gap-2 justify-center md:justify-end">
                  <span className={cn("text-[var(--primary)]", tiers[tierIndex]?.text)}>
                    {tiers[tierIndex]?.icon}
                  </span>
                  <span className="font-display text-3xl font-bold text-[var(--foreground)]">{tier}</span>
                </div>
              </div>
            </div>
          </Card>
        </ScrollReveal>

        {/* Tier Cards */}
        <ScrollReveal>
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-[var(--foreground)] mb-8 text-center">
              Membership Tiers
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map((t, i) => {
                const isActive = t.name === tier;
                const isUnlocked = i <= tierIndex;
                return (
                  <ScrollReveal key={t.name} delay={i * 0.1}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className={cn(
                        "relative rounded-xl border p-6 transition-all overflow-hidden",
                        isActive
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                          : isUnlocked
                          ? "border-[var(--border)] bg-[var(--card)]"
                          : "border-[var(--border)] bg-[var(--card)] opacity-50"
                      )}
                    >
                      {isActive && (
                        <div className="absolute top-3 right-3">
                          <Badge>Current</Badge>
                        </div>
                      )}
                      <div className={cn(
                        "mb-4 h-12 w-12 rounded-xl bg-gradient-to-br grid place-items-center text-white",
                        t.color
                      )}>
                        {t.icon}
                      </div>
                      <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">{t.name}</h3>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {t.min === 0 ? "Starting tier" : `${t.min.toLocaleString()}+ points`}
                      </p>
                      <div className="mt-4 space-y-2">
                        {[
                          i >= 0 ? "1× point multiplier" : null,
                          i >= 1 ? "Free birthday drink" : null,
                          i >= 2 ? "Priority seating" : null,
                          i >= 3 ? "Private tastings" : null,
                        ]
                          .filter(Boolean)
                          .slice(0, i + 1)
                          .map((perk) => (
                            <div key={perk} className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                              <Check size={12} className="text-[var(--success)] shrink-0" />
                              {perk}
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Available Rewards */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">
                Available Rewards
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rewards.map((reward, i) => {
                const canRedeem = points >= reward.points;
                return (
                  <ScrollReveal key={reward.id} delay={i * 0.08}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className={cn(
                        "rounded-xl border bg-[var(--card)] p-6 space-y-4 transition-all",
                        canRedeem ? "border-[var(--primary)]/40" : "border-[var(--border)] opacity-60"
                      )}
                    >
                      <div className="h-12 w-12 rounded-xl bg-[var(--primary)]/10 grid place-items-center text-[var(--primary)]">
                        {reward.icon}
                      </div>
                      <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                        {reward.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {reward.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-[var(--primary)]">
                          {reward.points.toLocaleString()} pts
                        </span>
                        <Button
                          variant={canRedeem ? "primary" : "ghost"}
                          size="sm"
                          disabled={!canRedeem}
                          className="text-xs"
                        >
                          {canRedeem ? "Redeem" : `${reward.points - points} more`}
                        </Button>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Points History */}
        <ScrollReveal>
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-[var(--foreground)] mb-8">
              Points History
            </h2>
            <Card className="divide-y divide-[var(--border)]">
              {pointsHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-full grid place-items-center",
                      entry.type === "earned"
                        ? "bg-[var(--success)]/10 text-[var(--success)]"
                        : entry.type === "redeemed"
                        ? "bg-[var(--danger)]/10 text-[var(--danger)]"
                        : "bg-[var(--primary)]/10 text-[var(--primary)]"
                    )}>
                      {entry.type === "earned" ? (
                        <TrendingUp size={16} />
                      ) : entry.type === "redeemed" ? (
                        <Gift size={16} />
                      ) : (
                        <Sparkles size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{entry.description}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "font-display text-lg font-bold",
                    entry.points > 0 ? "text-[var(--success)]" : "text-[var(--danger)]"
                  )}>
                    {entry.points > 0 ? "+" : ""}{entry.points}
                  </span>
                </div>
              ))}
            </Card>
          </div>
        </ScrollReveal>

        {/* How It Works */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">
                How It Works
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <ScrollReveal key={step.title} delay={i * 0.1}>
                  <div className="text-center space-y-4">
                    <div className="relative mx-auto h-16 w-16 rounded-2xl bg-[var(--primary)]/10 grid place-items-center text-[var(--primary)]">
                      {step.icon}
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold grid place-items-center">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <Card className="p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent" />
            <div className="relative space-y-6">
              <Star className="h-8 w-8 text-[var(--primary)] mx-auto" />
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[var(--foreground)]">
                Start Earning Today
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
                Every cup brings you closer to exclusive rewards. Join the Coffee Club and begin your journey.
              </p>
              <Button className="px-8 py-3">
                Browse Menu
                <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </PageEntrance>
  );
}
