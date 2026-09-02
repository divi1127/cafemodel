import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { faqs } from "@/data/analytics";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIdx((prev) => (prev === i ? null : i));
  }

  return (
    <PageEntrance>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
          <EntranceItem>
            <div className="space-y-6 mx-auto max-w-3xl">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Answers & Insights
              </p>
              <h1>
                <TextReveal
                  text="Frequently Asked Questions"
                  className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)]"
                />
              </h1>
              <p className="font-sans text-lg text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed">
                Everything you need to know before visiting Aurelia.
              </p>
            </div>
          </EntranceItem>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <ScrollReveal key={i} delay={i * 0.06}>
                  <motion.div
                    className="overflow-hidden"
                    layout
                  >
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className={cn(
                        "w-full flex items-center justify-between gap-4 p-5 sm:p-6 rounded-xl border text-left transition-all duration-300",
                        isOpen
                          ? "border-[var(--primary)]/50 bg-[var(--primary)]/5"
                          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30",
                      )}
                    >
                      <span
                        className={cn(
                          "font-sans text-sm sm:text-base font-medium transition-colors",
                          isOpen ? "text-[var(--primary)]" : "text-[var(--foreground)]",
                        )}
                      >
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0"
                      >
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isOpen ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]",
                          )}
                        />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-5 pt-2">
                            <p className="font-sans text-sm text-[var(--muted-foreground)] leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-6 lg:px-8" style={{ background: "var(--card)" }}>
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <ScrollReveal>
            <MessageCircle className="h-10 w-10 text-[var(--primary)] mx-auto" />
            <TextReveal
              text="Still Have Questions?"
              className="font-display text-3xl lg:text-4xl font-bold text-[var(--foreground)]"
            />
            <p className="font-sans text-[var(--muted-foreground)] mt-4 max-w-lg mx-auto leading-relaxed">
              Our team is happy to help with anything not covered here. Reach out and we'll get back
              to you as soon as possible.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <MagneticButton strength={0.3}>
                <Button asChild variant="primary" className="px-8">
                  <Link to="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </MagneticButton>
              <MagneticButton strength={0.3}>
                <Button asChild variant="ghost" className="px-8 border border-[var(--border)]">
                  <a href="tel:+912245678900">Call Us</a>
                </Button>
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageEntrance>
  );
}
