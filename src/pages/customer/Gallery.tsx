import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { AnimatedBackground } from "@/components/animations/AnimatedBackground";
import { gallery } from "@/data/analytics";
import { cn } from "@/lib/utils";

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () =>
    setLightboxIndex((prev) =>
      prev === null ? null : prev === 0 ? gallery.length - 1 : prev - 1
    );
  const nextImage = () =>
    setLightboxIndex((prev) =>
      prev === null ? null : prev === gallery.length - 1 ? 0 : prev + 1
    );

  return (
    <PageEntrance>
      {/* ─── Hero ─── */}
      <section className="relative py-32 px-6 lg:px-8 overflow-hidden">
        <AnimatedBackground variant="hero" />
        <div className="relative z-10 mx-auto max-w-7xl text-center space-y-6">
          <EntranceItem>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              Visual Journey
            </p>
          </EntranceItem>
          <EntranceItem>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--foreground)]">
              Our <span className="text-[var(--primary)]">Gallery</span>
            </h1>
          </EntranceItem>
          <EntranceItem>
            <p className="font-sans text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
              A visual collection of the moments, craft, and atmosphere that make
              Aurelia unique.
            </p>
          </EntranceItem>
        </div>
      </section>

      {/* ─── Masonry Grid ─── */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {gallery.map((img, i) => (
              <ScrollReveal key={img.id} delay={i * 0.05}>
                <motion.div
                  className={cn(
                    "relative rounded-xl overflow-hidden break-inside-avoid cursor-pointer group"
                  )}
                  whileHover={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openLightbox(i)}
                >
                  <div className={cn(img.tall ? "aspect-[3/4]" : "aspect-square")}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ZoomIn className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-sans text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
                      {img.alt}
                    </span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Lightbox Modal ─── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 sm:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 sm:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl max-h-[85vh] mx-auto px-4 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={gallery[lightboxIndex].src}
                alt={gallery[lightboxIndex].alt}
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="text-center mt-4 space-y-1">
                <p className="font-sans text-sm text-white/80">
                  {gallery[lightboxIndex].alt}
                </p>
                <p className="font-sans text-xs text-white/40">
                  {lightboxIndex + 1} / {gallery.length}
                </p>
              </div>
            </motion.div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2 scrollbar-hide">
              {gallery.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(i);
                  }}
                  className={cn(
                    "w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                    i === lightboxIndex
                      ? "border-[var(--primary)] opacity-100"
                      : "border-transparent opacity-40 hover:opacity-70"
                  )}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageEntrance>
  );
}
