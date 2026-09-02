import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { Tabs } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { reviews } from "@/data/reviews";
import { cn } from "@/lib/utils";

const approved = reviews.filter((r) => r.approved);

const avgRating =
  approved.length > 0
    ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
    : 0;

const distribution = [5, 4, 3, 2, 1].map((stars) => ({
  stars,
  count: approved.filter((r) => r.rating === stars).length,
  pct: approved.length
    ? (approved.filter((r) => r.rating === stars).length / approved.length) * 100
    : 0,
}));

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={cn(
            i < rating
              ? "fill-[var(--primary)] text-[var(--primary)]"
              : "fill-none text-[var(--border)]",
          )}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [filter, setFilter] = useState("All");

  const filterTabs = ["All", "5★", "4★", "3★"];

  const filtered = approved.filter((r) => {
    if (filter === "All") return true;
    const star = parseInt(filter.replace("★", ""));
    return r.rating === star;
  });

  return (
    <PageEntrance>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
          <EntranceItem>
            <div className="space-y-6 mx-auto max-w-3xl">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Genuine Voices
              </p>
              <h1>
                <TextReveal
                  text="What People Say"
                  className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)]"
                />
              </h1>
            </div>
          </EntranceItem>
        </div>
      </section>

      {/* Rating Overview */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <Card className="p-8 sm:p-10">
              <div className="grid sm:grid-cols-[1fr_2fr] gap-10 items-center">
                {/* Left: Average */}
                <div className="text-center sm:text-left space-y-3">
                  <p className="font-display text-6xl font-bold text-[var(--primary)] tabular-nums">
                    {avgRating.toFixed(1)}
                  </p>
                  <StarRating rating={Math.round(avgRating)} size={22} />
                  <p className="font-sans text-sm text-[var(--muted-foreground)]">
                    Based on {approved.length} review{approved.length !== 1 && "s"}
                  </p>
                </div>

                {/* Right: Distribution bars */}
                <div className="space-y-2.5">
                  {distribution.map((d) => (
                    <div key={d.stars} className="flex items-center gap-3">
                      <span className="font-sans text-xs text-[var(--muted-foreground)] w-8 text-right tabular-nums">
                        {d.stars}★
                      </span>
                      <div className="flex-1 h-2.5 rounded-full bg-[var(--border)] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-[var(--primary)]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${d.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        />
                      </div>
                      <span className="font-sans text-xs text-[var(--muted-foreground)] w-6 tabular-nums">
                        {d.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter + Reviews */}
      <section className="pb-32 px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          <ScrollReveal>
            <Tabs tabs={filterTabs} value={filter} onChange={setFilter} />
          </ScrollReveal>

          {filtered.length === 0 ? (
            <ScrollReveal>
              <div className="text-center py-16 space-y-3">
                <Star className="h-10 w-10 text-[var(--muted-foreground)] mx-auto" />
                <p className="font-sans text-[var(--muted-foreground)]">
                  No reviews found for this filter.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((review, i) => (
                <ScrollReveal key={review.id} delay={i * 0.08}>
                  <motion.div
                    className="h-full"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className="p-6 sm:p-8 h-full flex flex-col space-y-4">
                      {/* Rating + Date */}
                      <div className="flex items-center justify-between">
                        <StarRating rating={review.rating} />
                        <span className="font-sans text-xs text-[var(--muted-foreground)]">
                          {new Date(review.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                        {review.title}
                      </h3>

                      {/* Body */}
                      <div className="relative flex-1">
                        <Quote className="absolute -top-1 -left-1 h-5 w-5 text-[var(--primary)]/20" />
                        <p className="font-sans text-sm text-[var(--muted-foreground)] leading-relaxed pl-6">
                          {review.body}
                        </p>
                      </div>

                      {/* Author */}
                      <div className="pt-4 border-t border-[var(--border)]">
                        <p className="font-sans text-sm font-medium text-[var(--foreground)]">
                          {review.customer}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageEntrance>
  );
}
