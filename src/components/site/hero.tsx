"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";
import AnimatedButton from "@/components/ui/animated-button";

const particles = Array.from({ length: 26 }, (_, index) => ({
  left: `${(index * 37 + 11) % 97}%`,
  top: `${(index * 53 + 7) % 91}%`,
  size: 1 + (index % 3),
  duration: 9 + (index % 7) * 1.7,
  delay: -((index * 1.37) % 11),
  drift: -18 + (index % 9) * 5,
}));

function RevealWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="book-word-glow mr-[.2em] inline-block"
          initial={reducedMotion ? false : { y: 30, rotateX: -20 }}
          animate={{ y: 0, rotateX: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.82, delay: reducedMotion ? 0 : delay + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

export function Hero({ bookCount, publishedCount }: { bookCount: number; publishedCount: number }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  // Depth parallax: blooms drift fastest — sells the layered atmosphere
  const bloomY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 150]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  const updateSpotlight = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--hero-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--hero-y", `${event.clientY - rect.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      className="book-hero relative min-h-[100svh] overflow-hidden border-b book-hairline"
      onPointerMove={updateSpotlight}
      style={{ "--hero-x": "72%", "--hero-y": "24%" } as CSSProperties}
    >
      <motion.div style={{ y: bloomY, opacity: heroFade }} className="absolute inset-0" aria-hidden="true">
        <div className="book-hero-bloom book-hero-bloom-one" />
        <div className="book-hero-bloom book-hero-bloom-two" />
        <div className="book-hero-bloom book-hero-bloom-three" />
      </motion.div>
      <div aria-hidden="true" className="book-hero-spotlight" />
      <div aria-hidden="true" className="book-light-leak" />
      <div aria-hidden="true" className="book-grain absolute inset-0 z-[4] opacity-[.16]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="book-particle absolute rounded-full bg-white/55"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              "--particle-duration": `${particle.duration}s`,
              "--particle-delay": `${particle.delay}s`,
              "--particle-drift": `${particle.drift}px`,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="book-shell relative z-10 flex min-h-[100svh] flex-col justify-between pb-28 pt-28 md:pb-12 md:pt-32">
        <div className="flex items-start justify-between gap-6 border-b book-rule pb-5">
          <div className="flex items-center gap-4">
            <span className="book-kicker text-[var(--book-ink)]">BOOK</span>
            <span className="text-[10px] uppercase tracking-[.2em] text-white/42">The Private Shelf</span>
          </div>
          <div className="hidden text-right text-[10px] uppercase leading-5 tracking-[.18em] text-white/42 sm:block">
            {bookCount} founding {bookCount === 1 ? "volume" : "volumes"}<br />{publishedCount} published · a library, not a feed
          </div>
        </div>

        <div className="py-14 md:py-20 lg:py-24 [perspective:900px]">
          <h1 className="book-display book-display-hero max-w-[1240px] text-[var(--book-ink)]">
            <span className="block"><RevealWords text="Attraction is" delay={0.08} /></span>
            <span className="block"><RevealWords text="a language." delay={0.32} /></span>
          </h1>
          <motion.p
            className="book-display book-display-lg mt-8 max-w-5xl text-[var(--book-copper-soft)]"
            initial={reducedMotion ? false : { y: 18 }}
            animate={{ y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Learn how to read it.
          </motion.p>
          <motion.div
            aria-hidden="true"
            className="mt-5 h-px max-w-[16rem] origin-left bg-gradient-to-r from-[var(--book-copper)] via-[var(--book-copper-soft)] to-transparent"
            initial={reducedMotion ? false : { scaleX: 0, opacity: 0.35 }}
            animate={{ scaleX: 1, opacity: 0.8 }}
            transition={{ duration: reducedMotion ? 0 : 1.1, delay: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="grid gap-8 border-t book-rule pt-7 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p className="max-w-xl text-sm leading-7 text-white/62 md:text-base md:leading-8">
              Original books on presence, attraction, dating, and relationships. Built to be read slowly, revisited often, and used without turning your life into a performance.
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-7">
            <p className="text-xs leading-6 text-white/42">
              No endless feed. No fake urgency. No fabricated ratings. Just a small, deliberate shelf where every volume has to earn its place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 md:col-span-2 md:justify-end">
            <a data-book-link href="#shelf" className="book-kicker text-[var(--book-ink)]">Browse first</a>
            <AnimatedButton
              onClick={() => router.push("/library")}
              className="!rounded-full !border-white/15 !bg-[var(--book-ink)] !px-7 !py-3 !text-[var(--book-paper-ink)] dark:!bg-[var(--book-ink)] dark:!text-[var(--book-paper-ink)]"
            >
              Enter the shelf <ArrowRight className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </div>
        </div>

        <div className="mt-8 hidden items-center gap-2 text-[10px] uppercase tracking-[.22em] text-white/36 sm:flex">
          <motion.span animate={reducedMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown className="h-3.5 w-3.5" />
          </motion.span>
          Browse slowly
        </div>
      </div>
    </section>
  );
}
