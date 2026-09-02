import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Star, MapPin, Clock, ChevronDown, Sparkles } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { MicroInteraction } from "@/components/animations/MicroInteraction";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { Badge } from "@/components/ui/Card";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { offers } from "@/data/offers";
import { gallery } from "@/data/analytics";
import { reviews } from "@/data/reviews";
import { cn } from "@/lib/utils";
import { IMG } from "@/lib/images";
import heroVideo from "@/assets/hero-video.mp4";

gsap.registerPlugin(ScrollTrigger);

const popularProducts = products.filter((p) => p.bestseller).slice(0, 4);
const activeOffers = offers.filter((o) => o.active).slice(0, 4);
const previewGallery = gallery.slice(0, 4);
const approvedReviews = reviews.filter((r) => r.approved).slice(0, 3);

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [scrollHint, setScrollHint] = useState(false);

  const handleVideoEnd = () => {
    setScrollHint(true);
  };

  useGSAP(
    () => {
      const hero = heroRef.current;
      const video = videoRef.current;
      const content = heroContentRef.current;
      if (!hero || !video || !content) return;

      video.play().catch(() => {});

      const pauseSt = ScrollTrigger.create({
        trigger: hero,
        start: "top 35%",
        end: "bottom top",
        onLeave: () => {
          if (!video.paused) video.pause();
        },
        onEnterBack: () => {
          if (video.paused) video.play().catch(() => {});
        },
      });

      const contentFade = gsap.to(content, {
        opacity: 0,
        y: -60,
        ease: "power2.in",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      return () => {
        pauseSt.kill();
        contentFade.scrollTrigger?.kill();
        contentFade.kill();
      };
    },
    { scope: heroRef },
  );

  return (
    <PageEntrance>
      {/* ─── Hero ─── */}
      <section
        ref={heroRef}
        className="relative h-svh min-h-[640px] w-full overflow-hidden flex items-center"
      >
        <video
          ref={videoRef}
          src={heroVideo}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />

        <div
          ref={heroContentRef}
          className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8"
        >
          <div className="max-w-2xl">
            <EntranceItem>
              <div className="space-y-6 sm:space-y-8">
                <p className="font-sans text-[11px] sm:text-xs tracking-[0.3em] uppercase text-white/60">
                  Premium Coffee Experience
                </p>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] text-white">
                  <span className="block text-[var(--primary)]">A CUP.</span>
                  <span className="block">A MOMENT.</span>
                  <span className="block">A MEMORY.</span>
                </h1>
                <p className="font-sans text-base sm:text-lg text-white/70 max-w-md leading-relaxed">
                  Where every bean tells a story, every sip ignites a feeling, and
                  every visit becomes an unforgettable experience.
                </p>
                <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4">
                  <MagneticButton strength={0.3}>
                    <Link to="/menu">
                      <Button variant="primary" className="w-full sm:w-auto px-8 py-5 sm:py-6 text-base">
                        Explore Menu
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </MagneticButton>
                  <MagneticButton strength={0.3}>
                    <Link to="/reservations">
                      <Button variant="ghost" className="w-full sm:w-auto px-8 py-5 sm:py-6 text-base border border-white/30 text-white hover:bg-white/10">
                        Reserve a Table
                      </Button>
                    </Link>
                  </MagneticButton>
                </div>
              </div>
            </EntranceItem>
          </div>
        </div>

        {scrollHint && (
          <motion.div
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-sans tracking-widest uppercase text-white/70">
                Scroll to explore
              </span>
              <ChevronDown className="h-4 w-4 text-white/70" />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* ─── 1. Brand Intro ─── */}
      <section className="py-20 sm:py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal>
            <div className="space-y-6">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Since 2018
              </p>
              <TextReveal
                text="Aurelia Is More Than Just Coffee"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
              <p className="font-sans text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
                Born from a passion for exceptional coffee and warm hospitality,
                Aurelia is where artisan craftsmanship meets modern comfort. We source
                the finest single-origin beans from Ethiopia, Colombia, and Guatemala,
                roast them in small batches, and craft each cup with meticulous care.
              </p>
              <p className="font-sans text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
                Our space is designed to be your sanctuary — a place where time slows
                down, conversations deepen, and every visit feels like coming home.
              </p>
              <div className="flex flex-wrap gap-x-12 gap-y-6 pt-4">
                {[
                  { value: "6+", label: "Years of Craft" },
                  { value: "15K+", label: "Cups Daily" },
                  { value: "4.9", label: "Customer Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-3xl font-bold text-[var(--primary)]">
                      <MicroInteraction>{stat.value}</MicroInteraction>
                    </div>
                    <p className="font-sans text-sm text-[var(--muted-foreground)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <ParallaxImage
                src={IMG.interior}
                alt="Aurelia café interior"
                className="w-full h-full object-cover"
                speed={0.15}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 2. Popular Items ─── */}
      <section className="py-16 sm:py-24 px-6 lg:px-8" style={{ background: "var(--card)" }}>
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-12 sm:mb-16">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Crowd Favorites
              </p>
              <TextReveal
                text="Most Loved Items"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {popularProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="text-center mt-12">
              <Link to="/menu">
                <Button variant="line" className="px-8">
                  View Full Menu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 3. Experience ─── */}
      <section className="py-20 sm:py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <ParallaxImage
                src={IMG.latte}
                alt="Latte art being crafted"
                className="w-full h-full object-cover"
                speed={0.2}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="space-y-6">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                The Experience
              </p>
              <TextReveal
                text="Every Cup Is a Masterpiece"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
              <p className="font-sans text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed">
                Our baristas are artists, trained in the finest traditions of coffee
                craft. From the perfect espresso extraction to intricate latte art,
                every detail matters. We believe that great coffee is not just tasted —
                it's experienced.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: "🌿", title: "Ethically Sourced", desc: "Direct trade relationships" },
                  { icon: "🔥", title: "Small Batch Roasted", desc: "Freshness in every bean" },
                  { icon: "💧", title: "Filtered Perfection", desc: "Triple-filtered water" },
                  { icon: "☕", title: "Hand Crafted", desc: "Made with love, always" },
                ].map((item) => (
                  <div key={item.title} className="space-y-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h4 className="font-sans font-semibold text-[var(--foreground)]">{item.title}</h4>
                    <p className="font-sans text-sm text-[var(--muted-foreground)]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 4. Special Offers ─── */}
      <section className="py-16 sm:py-24 px-6 lg:px-8 overflow-hidden" style={{ background: "var(--card)" }}>
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-12">
              <div className="space-y-4">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                  Limited Time
                </p>
                <TextReveal
                  text="Special Offers"
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
                />
              </div>
              <Link to="/offers">
                <Button variant="line" className="hidden sm:inline-flex self-start sm:self-auto">
                  All Offers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {activeOffers.map((offer, i) => (
              <ScrollReveal key={offer.id} delay={i * 0.1}>
                <motion.div
                  className="min-w-[300px] sm:min-w-[360px] snap-start rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--background)] group cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge>
                        {offer.value}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                      {offer.title}
                    </h3>
                    <p className="font-sans text-sm text-[var(--muted-foreground)] line-clamp-2">
                      {offer.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <code className="font-mono text-xs bg-[var(--muted)] px-3 py-1 rounded text-[var(--primary)]">
                        {offer.code}
                      </code>
                      <span className="font-sans text-xs text-[var(--muted-foreground)]">
                        Valid till {new Date(offer.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. Category Grid ─── */}
      <section className="py-16 sm:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-12 sm:mb-16">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                Discover
              </p>
              <TextReveal
                text="Browse by Category"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.slice(0, 8).map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 0.05}>
                <motion.div
                  className="relative rounded-xl overflow-hidden aspect-square group cursor-pointer"
                  whileHover={{ scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/menu?category=${cat.id}`} className="absolute inset-0">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-display text-lg font-bold text-white">{cat.name}</h3>
                      <p className="font-sans text-xs text-white/70 mt-1 line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Gallery Preview ─── */}
      <section className="py-16 sm:py-24 px-6 lg:px-8" style={{ background: "var(--card)" }}>
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-12">
              <div className="space-y-4">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                  Visual Stories
                </p>
                <TextReveal
                  text="A Glimpse Inside"
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
                />
              </div>
              <Link to="/gallery">
                <Button variant="line" className="hidden sm:inline-flex self-start sm:self-auto">
                  Full Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {previewGallery.map((img, i) => (
              <ScrollReveal key={img.id} delay={i * 0.1}>
                <motion.div
                  className={cn(
                    "relative rounded-xl overflow-hidden group cursor-pointer",
                    img.tall ? "row-span-2 aspect-[3/4]" : "aspect-square"
                  )}
                  whileHover={{ scale: 0.98 }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <span className="font-sans text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {img.alt}
                    </span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. Reviews ─── */}
      <section className="py-16 sm:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center space-y-4 mb-12 sm:mb-16">
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                What People Say
              </p>
              <TextReveal
                text="Loved by Thousands"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
              />
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {approvedReviews.map((review, i) => (
              <ScrollReveal key={review.id} delay={i * 0.1}>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={cn(
                          "h-4 w-4",
                          j < review.rating
                            ? "fill-[var(--primary)] text-[var(--primary)]"
                            : "fill-none text-[var(--border)]"
                        )}
                      />
                    ))}
                  </div>
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    {review.title}
                  </h4>
                  <p className="font-sans text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {review.body}
                  </p>
                  <div className="pt-4 border-t border-[var(--border)]">
                    <p className="font-sans text-sm font-medium text-[var(--foreground)]">
                      {review.customer}
                    </p>
                    <p className="font-sans text-xs text-[var(--muted-foreground)]">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. Reservation CTA ─── */}
      <section className="relative py-20 sm:py-32 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <ParallaxImage
            src={IMG.espresso}
            alt="Coffee atmosphere"
            className="w-full h-full object-cover"
            speed={0.3}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <ScrollReveal>
          <div className="relative z-10 mx-auto max-w-3xl text-center space-y-8">
            <Sparkles className="h-8 w-8 text-[var(--primary)] mx-auto" />
            <TextReveal
              text="Reserve Your Perfect Moment"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
            />
            <p className="font-sans text-base sm:text-lg text-white/70 leading-relaxed">
              Whether it's a quiet morning with your favorite book, an afternoon
              catch-up with friends, or an evening date — secure your spot at Aurelia.
            </p>
            <MagneticButton strength={0.3}>
              <Link to="/reservations">
                <Button variant="primary" className="w-full sm:w-auto px-10 py-5 sm:py-6 text-base">
                  Reserve a Table
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </MagneticButton>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── 9. Location ─── */}
      <section className="py-16 sm:py-24 px-6 lg:px-8" style={{ background: "var(--card)" }}>
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ScrollReveal>
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
                  Find Us
                </p>
                <TextReveal
                  text="Come Visit"
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)]"
                />
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="h-5 w-5 text-[var(--primary)] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-sans font-semibold text-[var(--foreground)]">Address</h4>
                    <p className="font-sans text-[var(--muted-foreground)]">
                      42 Arabica Lane, Coffee District<br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="h-5 w-5 text-[var(--primary)] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-sans font-semibold text-[var(--foreground)]">Hours</h4>
                    <div className="font-sans text-[var(--muted-foreground)] space-y-1">
                      <p>Monday – Friday: 7:00 AM – 10:00 PM</p>
                      <p>Saturday – Sunday: 8:00 AM – 11:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="rounded-2xl overflow-hidden aspect-square border border-[var(--border)]">
              <ParallaxImage
                src={IMG.team}
                alt="Aurelia team"
                className="w-full h-full object-cover"
                speed={0.1}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageEntrance>
  );
}
