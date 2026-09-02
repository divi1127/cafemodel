import { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, Copy, Check, Percent, BadgeIndianRupee } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { Badge } from "@/components/ui/Card";
import { offers } from "@/data/offers";
import { cn } from "@/lib/utils";

function OfferValueDisplay({ offer }: { offer: (typeof offers)[number] }) {
  if (offer.value.endsWith("%")) {
    return (
      <div className="flex items-center gap-1">
        <Percent className="h-6 w-6" />
        <span className="font-display text-5xl font-bold">{offer.value}</span>
        <span className="font-sans text-lg text-white/70">OFF</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <BadgeIndianRupee className="h-6 w-6" />
      <span className="font-display text-5xl font-bold">{offer.value}</span>
      <span className="font-sans text-lg text-white/70">OFF</span>
    </div>
  );
}

export default function Offers() {
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredOffers = offers.filter((o) => {
    if (filter === "active") return o.active;
    if (filter === "inactive") return !o.active;
    return true;
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <PageEntrance>
      {/* ─── Hero ─── */}
      <section className="relative py-32 px-6 lg:px-8 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 mx-auto max-w-7xl text-center space-y-6">
          <EntranceItem>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              Exclusive Deals
            </p>
          </EntranceItem>
          <EntranceItem>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)]">
              Special <span className="text-[var(--primary)]">Offers</span>
            </h1>
          </EntranceItem>
          <EntranceItem>
            <p className="font-sans text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
              Treat yourself to something special. Grab our limited-time offers
              before they're gone.
            </p>
          </EntranceItem>
        </div>
      </section>

      {/* ─── Filter ─── */}
      <section className="px-6 lg:px-8 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto max-w-7xl flex gap-4 py-4">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2 rounded-full font-sans text-sm transition-all capitalize",
                filter === f
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {f === "all" ? "All Offers" : f === "active" ? "Active" : "Expired"}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Offers Grid ─── */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filteredOffers.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Tag className="h-12 w-12 text-[var(--muted-foreground)] mx-auto" />
              <p className="font-display text-2xl text-[var(--foreground)]">
                No offers found
              </p>
              <p className="font-sans text-[var(--muted-foreground)]">
                {filter === "active"
                  ? "No active offers right now. Check back soon!"
                  : "No expired offers to show."}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer, i) => (
                <ScrollReveal key={offer.id} delay={i * 0.1}>
                  <motion.div
                    className={cn(
                      "relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] group h-full flex flex-col",
                      !offer.active && "opacity-60"
                    )}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <OfferValueDisplay offer={offer} />
                      </div>
                      {!offer.active && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[var(--danger)] text-white">
                            Expired
                          </Badge>
                        </div>
                      )}
                      {offer.active && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[var(--success)] text-white">
                            Active
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col space-y-4">
                      <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                        {offer.title}
                      </h3>
                      <p className="font-sans text-sm text-[var(--muted-foreground)] leading-relaxed flex-1">
                        {offer.description}
                      </p>

                      {/* Code + Validity */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm bg-[var(--muted)] px-4 py-2 rounded-lg text-[var(--primary)] font-semibold tracking-wider">
                              {offer.code}
                            </code>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyCode(offer.code ?? "", offer.id)}
                              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
                              title="Copy code"
                            >
                              {copiedId === offer.id ? (
                                <Check className="h-4 w-4 text-[var(--success)]" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="font-sans text-xs">
                            Valid until{" "}
                            {new Date(offer.validUntil).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <ScrollReveal>
            <TextReveal
              text="Don't Miss Out"
              className="font-display text-3xl font-bold text-[var(--foreground)]"
            />
            <p className="font-sans text-[var(--muted-foreground)] mt-4">
              Subscribe to our newsletter and be the first to know about exclusive
              deals, new arrivals, and seasonal specials.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </PageEntrance>
  );
}
