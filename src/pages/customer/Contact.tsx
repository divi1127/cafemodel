import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Camera,
  MessageSquare,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";

const infoItems = [
  {
    icon: MapPin,
    title: "Address",
    lines: ["42 Arabica Lane, Coffee District", "Mumbai, Maharashtra 400001"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+91 22 4567 8900", "+91 90000 12345"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["hello@aurelia.cafe", "events@aurelia.cafe"],
  },
  {
    icon: Clock,
    title: "Hours",
    lines: ["Tue – Sun: 8:00 AM – 10:00 PM", "Monday: Closed"],
  },
];

const socials = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: MessageSquare, label: "Twitter", href: "#" },
  { icon: Globe, label: "Facebook", href: "#" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  }

  const valid = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <PageEntrance>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 text-center">
          <EntranceItem>
            <div className="space-y-6 mx-auto max-w-3xl">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                We'd Love to Hear From You
              </p>
              <h1>
                <TextReveal
                  text="Get in Touch"
                  className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)]"
                />
              </h1>
              <p className="font-sans text-lg text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed">
                Questions, feedback, or just want to say hello? We're here for all of it.
              </p>
            </div>
          </EntranceItem>
        </div>
      </section>

      {/* Two Column Content */}
      <section className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div className="space-y-10">
            <ScrollReveal>
              <div className="space-y-8">
                {infoItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="h-11 w-11 rounded-full bg-[var(--primary)]/15 grid place-items-center shrink-0">
                        <Icon className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-[var(--foreground)] mb-1">
                          {item.title}
                        </h3>
                        {item.lines.map((line, i) => (
                          <p key={i} className="font-sans text-sm text-[var(--muted-foreground)]">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* Social Icons */}
            <ScrollReveal delay={0.1}>
              <div>
                <p className="font-sans text-xs tracking-[0.18em] uppercase text-[var(--muted-foreground)] mb-4">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <motion.a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="h-10 w-10 rounded-full border border-[var(--border)] grid place-items-center text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-colors"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* Map placeholder */}
            <ScrollReveal delay={0.15}>
              <div className="relative rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 aspect-[16/9] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <div className="relative flex flex-col items-center gap-3">
                  <MapPin className="h-8 w-8 text-[var(--primary)]/50" />
                  <span className="font-sans text-sm text-[var(--muted-foreground)]">Map</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Form */}
          <div>
            <ScrollReveal delay={0.1}>
              <Card className="p-8 space-y-6">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 space-y-6"
                  >
                    <CheckCircle2 className="h-16 w-16 text-[var(--success)] mx-auto" />
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                        Message Sent
                      </h3>
                      <p className="font-sans text-[var(--muted-foreground)]">
                        We'll get back to you within 24 hours. Thank you, {form.name}!
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", subject: "general", message: "" });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
                      Send a Message
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <Field label="Your Name">
                        <Input
                          placeholder="Full name"
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          required
                        />
                      </Field>
                      <Field label="Email">
                        <Input
                          type="email"
                          placeholder="you@email.com"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          required
                        />
                      </Field>
                    </div>

                    <Field label="Subject">
                      <Select
                        value={form.subject}
                        onChange={(e) => update("subject", e.target.value)}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="reservation">Reservation</option>
                        <option value="events">Events & Private Dining</option>
                        <option value="feedback">Feedback</option>
                        <option value="catering">Catering</option>
                        <option value="press">Press & Media</option>
                      </Select>
                    </Field>

                    <Field label="Message">
                      <Textarea
                        placeholder="Tell us what's on your mind..."
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        required
                        className="min-h-32"
                      />
                    </Field>

                    <MagneticButton strength={0.3}>
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-3"
                        disabled={!valid}
                      >
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </MagneticButton>
                  </form>
                )}
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageEntrance>
  );
}
