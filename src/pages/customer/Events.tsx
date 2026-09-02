import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, Clock, Sparkles } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Card";
import { events } from "@/data/analytics";
import { cn } from "@/lib/utils";

type Filter = "all" | "upcoming" | "past";

function parseEventDate(dateStr: string) {
  const year = new Date().getFullYear();
  return new Date(`${dateStr} ${year}`);
}

export default function Events() {
  const [filter, setFilter] = useState<Filter>("all");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const enriched = events.map((e) => ({
    ...e,
    parsed: parseEventDate(e.date),
  }));

  const filtered = enriched.filter((e) => {
    if (filter === "upcoming") return e.parsed >= today;
    if (filter === "past") return e.parsed < today;
    return true;
  });

  return (
    <PageEntrance>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
          <EntranceItem>
            <div className="space-y-6 mx-auto max-w-3xl">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Aurelia Experiences
              </p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] text-[var(--foreground)]">
                <TextReveal
                  text="Events"
                  className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)]"
                />
              </h1>
              <p className="font-sans text-lg text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed">
                From intimate cupping sessions to live jazz evenings — discover what's happening at Aurelia.
              </p>
            </div>
          </EntranceItem>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="flex items-center gap-4">
              <span className="font-sans text-xs tracking-[0.18em] uppercase text-[var(--muted-foreground)]">
                View:
              </span>
              {(["all", "upcoming", "past"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.14em] font-medium transition-all duration-300",
                    filter === f
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/40",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Events Grid */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {filtered.length === 0 ? (
            <ScrollReveal>
              <div className="text-center py-20 space-y-4">
                <CalendarDays className="h-12 w-12 text-[var(--muted-foreground)] mx-auto" />
                <h3 className="font-display text-2xl text-[var(--foreground)]">
                  No events to show
                </h3>
                <p className="font-sans text-[var(--muted-foreground)]">
                  {filter === "past"
                    ? "No past events yet."
                    : "Check back soon for upcoming experiences."}
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((event, i) => {
                const isPast = event.parsed < today;
                return (
                  <ScrollReveal key={event.id} delay={i * 0.1}>
                    <motion.div
                      className={cn(
                        "group relative rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden",
                        "transition-all duration-500",
                        isPast && "opacity-60",
                      )}
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Gradient accent top */}
                      <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--copper)] to-[var(--primary)]" />

                      <div className="p-8 space-y-5">
                        {/* Date badge */}
                        <div className="flex items-center justify-between">
                          <Badge tone={isPast ? "muted" : "gold"}>
                            {isPast ? "Past" : "Upcoming"}
                          </Badge>
                          <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="font-sans text-xs">{event.date}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-2xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">
                          {event.title}
                        </h3>

                        {/* Copy */}
                        <p className="font-sans text-[var(--muted-foreground)] leading-relaxed">
                          {event.copy}
                        </p>

                        {/* Decorative divider */}
                        <div className="flex items-center gap-3 pt-2">
                          <div className="h-px flex-1 bg-[var(--border)]" />
                          <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]/40" />
                          <div className="h-px flex-1 bg-[var(--border)]" />
                        </div>

                        {/* CTA */}
                        {!isPast && (
                          <MagneticButton strength={0.2}>
                            <Link to="/reservations">
                              <Button
                                variant="ghost"
                                className="w-full justify-center border border-[var(--border)] group-hover:border-[var(--primary)]/50"
                              >
                                Reserve for this Event
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </Link>
                          </MagneticButton>
                        )}
                      </div>
                    </motion.div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 lg:px-8" style={{ background: "var(--card)" }}>
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <ScrollReveal>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              Host Your Own
            </p>
            <TextReveal
              text="Private Events at Aurelia"
              className="font-display text-3xl lg:text-4xl font-bold text-[var(--foreground)]"
            />
            <p className="font-sans text-[var(--muted-foreground)] mt-4 max-w-lg mx-auto leading-relaxed">
              Looking to host a private gathering, corporate event, or celebration?
              Our spaces are available for intimate parties and bespoke experiences.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <MagneticButton strength={0.3}>
                <Link to="/contact">
                  <Button variant="primary" className="px-8">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageEntrance>
  );
}
