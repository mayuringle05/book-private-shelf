"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuroraHero } from "@/components/ui/aurora-hero";
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal";
import AnimatedButton from "@/components/ui/animated-button";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b book-hairline">
      <div className="absolute inset-0">
        <AuroraHero title=" " showSwitch={false} className="!h-full !min-h-full" />
      </div>

      <div className="book-shell relative z-10 flex min-h-[100svh] flex-col justify-between pb-8 pt-28 md:pb-12 md:pt-32">
        <div className="flex items-start justify-between gap-6 border-b book-rule pb-5">
          <div className="flex items-center gap-4">
            <span className="book-kicker text-[#f2ebdd]">BOOK</span>
            <span className="text-[10px] uppercase tracking-[.2em] text-white/38">The Private Shelf</span>
          </div>
          <div className="hidden text-right text-[10px] uppercase leading-5 tracking-[.18em] text-white/38 sm:block">
            Three founding volumes<br />A library, not a feed
          </div>
        </div>

        <div className="py-16 md:py-20 lg:py-24">
          <GooeyTextReveal mode="immediate" duration={1.35} stagger={0.12} className="max-w-[1220px]">
            <h1
              data-gooey-reveal-item
              className="book-display text-[clamp(5.1rem,13vw,12.8rem)] leading-[.72] text-[#f4eee4]"
            >
              Attraction is<br />a language.
            </h1>
            <p
              data-gooey-reveal-item
              className="book-display mt-8 max-w-5xl text-[clamp(2.3rem,5.8vw,6.3rem)] leading-[.88] text-[#d39a76]"
            >
              Learn how to read it.
            </p>
          </GooeyTextReveal>
        </div>

        <div className="grid gap-8 border-t book-rule pt-7 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p className="max-w-xl text-sm leading-7 text-white/58 md:text-base md:leading-8">
              Original books on presence, attraction, dating, and relationships. Built to be read slowly, revisited often, and used without turning your life into a performance.
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-7">
            <p className="text-xs leading-6 text-white/38">
              No endless feed. No fake urgency. No fabricated ratings. Just a small, deliberate shelf where every volume has to earn its place.
            </p>
          </div>
          <div className="flex md:col-span-2 md:justify-end">
            <AnimatedButton
              onClick={() => router.push("/library")}
              className="!rounded-full !border-white/15 !bg-[#f2ebdd] !px-7 !py-3 !text-[#17120f] dark:!bg-[#f2ebdd] dark:!text-[#17120f]"
            >
              Enter the shelf <ArrowRight className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-[.22em] text-white/32">
          <ArrowDown className="h-3.5 w-3.5" /> Browse slowly
        </div>
      </div>
    </section>
  );
}
