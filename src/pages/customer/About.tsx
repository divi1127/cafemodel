import { motion } from "framer-motion";
import { Leaf, Heart, Coffee, Users, Globe, Award } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { cn } from "@/lib/utils";
import { IMG } from "@/lib/images";

const teamMembers = [
  {
    name: "Arjun Mehta",
    role: "Founder & Head Roaster",
    image: IMG.team,
    bio: "With over 15 years in specialty coffee, Arjun founded Aurelia to bring world-class coffee culture to Mumbai.",
  },
  {
    name: "Priya Sharma",
    role: "Head Barista",
    image: IMG.espresso,
    bio: "National latte art champion. Priya's passion for perfection ensures every cup that leaves our bar is exceptional.",
  },
  {
    name: "Kabir Desai",
    role: "Pastry Chef",
    image: IMG.pour,
    bio: "Trained in Paris, Kabir brings French technique to Indian flavors, crafting pastries that pair perfectly with our coffee.",
  },
];

const philosophyValues = [
  {
    icon: Leaf,
    title: "Sustainability First",
    description:
      "Every bean we roast, every cup we serve — we consider the impact. From compostable packaging to direct-trade sourcing, sustainability isn't an afterthought, it's our foundation.",
  },
  {
    icon: Heart,
    title: "Community-Centered",
    description:
      "Aurelia is more than a café. It's a gathering place, a workspace, a sanctuary. We build relationships with our customers, our farmers, and our neighbors.",
  },
  {
    icon: Coffee,
    title: "Relentless Craft",
    description:
      "We never settle. From green bean selection to the final pour, every step is refined, measured, and perfected. Because you deserve nothing less than extraordinary.",
  },
];

export default function About() {
  return (
    <PageEntrance>
      {/* ─── Hero ─── */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <ParallaxImage
            src={IMG.interior}
            alt="Aurelia café interior"
            className="w-full h-full object-cover"
            speed={0.3}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
          <EntranceItem>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              Our Story
            </p>
          </EntranceItem>
          <EntranceItem>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              The Heart Behind <br className="hidden sm:block" />
              <span className="text-[var(--primary)]">Every Cup</span>
            </h1>
          </EntranceItem>
          <EntranceItem>
            <p className="font-sans text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              A journey that started with a single bean, a dream, and an unshakeable
              belief that coffee can bring people together.
            </p>
          </EntranceItem>
        </div>
      </section>

      {/* ─── Our Origin ─── */}
      <section className="py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="space-y-6">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Est. 2018
              </p>
              <TextReveal
                text="Where It All Began"
                className="font-display text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
              <div className="space-y-4 font-sans text-[var(--muted-foreground)] leading-relaxed">
                <p>
                  It was a small corner shop on a rainy Tuesday morning when Arjun Mehta
                  pulled his first perfect espresso. The aroma filled the room, strangers
                  turned into friends, and a seed was planted.
                </p>
                <p>
                  Born from travels through the coffee regions of Ethiopia, Colombia, and
                  Guatemala, Aurelia was created to be more than a café — it was meant to
                  be a bridge between the world's finest coffee farmers and the people who
                  would savor their craft.
                </p>
                <p>
                  Today, from a humble 200 sq ft counter to a thriving community of coffee
                  lovers, our mission remains the same: serve exceptional coffee with
                  genuine warmth, and make every visit matter.
                </p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <ParallaxImage
                src={IMG.pour}
                alt="Coffee being poured"
                className="w-full h-full object-cover"
                speed={0.15}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Our Coffee ─── */}
      <section className="py-24 px-6 lg:px-8" style={{ background: "var(--card)" }}>
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <ParallaxImage
                src={IMG.beans}
                alt="Coffee beans"
                className="w-full h-full object-cover"
                speed={0.2}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15} className="order-1 lg:order-2">
            <div className="space-y-6">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                From Farm to Cup
              </p>
              <TextReveal
                text="Our Coffee, Our Craft"
                className="font-display text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
              <div className="space-y-4 font-sans text-[var(--muted-foreground)] leading-relaxed">
                <p>
                  We work directly with farmers across three continents, ensuring fair
                  wages and sustainable practices at every step. Our beans are sourced from
                  altitude-grown farms in Ethiopia's Yirgacheffe region, Colombia's Huila
                  highlands, and Guatemala's Antigua valley.
                </p>
                <p>
                  Each batch is roasted in our on-site micro-roastery, where our head roaster
                  carefully profiles each origin to bring out its unique character. From bright,
                  fruity African naturals to rich, chocolatey Central American washed coffees —
                  every cup tells the story of its origin.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-6">
                {[
                  { value: "3", label: "Origins" },
                  { value: "12+", label: "Single Origins" },
                  { value: "48hr", label: "Roast to Cup" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display text-2xl font-bold text-[var(--primary)]">{stat.value}</p>
                    <p className="font-sans text-xs text-[var(--muted-foreground)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Philosophy ─── */}
      <section className="py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-20">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Our Philosophy
              </p>
              <TextReveal
                text="What We Stand For"
                className="font-display text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-12">
            {philosophyValues.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.15}>
                <motion.div
                  className="text-center space-y-6 p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30 transition-colors duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                    <value.icon className="h-7 w-7 text-[var(--primary)]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                    {value.title}
                  </h3>
                  <p className="font-sans text-[var(--muted-foreground)] leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team ─── */}
      <section className="py-24 px-6 lg:px-8" style={{ background: "var(--card)" }}>
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-16">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Meet the Makers
              </p>
              <TextReveal
                text="Our Team"
                className="font-display text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-10">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.1}>
                <motion.div
                  className="group rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--background)]"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                      {member.name}
                    </h3>
                    <p className="font-sans text-sm font-medium text-[var(--primary)]">
                      {member.role}
                    </p>
                    <p className="font-sans text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Space ─── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-16">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                The Ambiance
              </p>
              <TextReveal
                text="Our Space"
                className="font-display text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[IMG.interior, IMG.latte, IMG.pastry, IMG.pour, IMG.cold, IMG.espresso].map(
              (src, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <motion.div
                    className={cn(
                      "rounded-xl overflow-hidden aspect-square",
                      i === 0 && "lg:col-span-2 lg:row-span-2 lg:aspect-auto"
                    )}
                    whileHover={{ scale: 0.98 }}
                  >
                    <img
                      src={src}
                      alt={`Aurelia space ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </ScrollReveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── Mission ─── */}
      <section className="relative py-32 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <ParallaxImage
            src={IMG.cup}
            alt="Coffee cup close-up"
            className="w-full h-full object-cover"
            speed={0.2}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-4xl text-center space-y-8">
            <Globe className="h-8 w-8 text-[var(--primary)] mx-auto" />
            <TextReveal
              text="Our Mission"
              className="font-display text-4xl lg:text-5xl font-bold text-white"
            />
            <p className="font-sans text-xl text-white/70 leading-relaxed italic">
              "To craft the world's finest coffee experience — one cup, one
              conversation, one memory at a time — while nurturing the land, the
              farmers, and the communities that make it possible."
            </p>
            <div className="flex items-center justify-center gap-8 pt-8">
              {[
                { icon: Award, label: "Award Winning" },
                { icon: Users, label: "Community Driven" },
                { icon: Leaf, label: "Eco Conscious" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <item.icon className="h-5 w-5 text-[var(--primary)]" />
                  <span className="font-sans text-xs text-white/60">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </PageEntrance>
  );
}
