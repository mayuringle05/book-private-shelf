"use client";

import { ArrowDown, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuroraHero } from "@/components/ui/aurora-hero";
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal";
import AnimatedButton from "@/components/ui/animated-button";

export function Hero() {
  const router = useRouter();
  return (
    <section className="book-noise relative min-h-[820px] overflow-hidden border-b book-hairline md:min-h-[900px]">
      <div className="absolute inset-0 opacity-70"><AuroraHero title=" " className="!h-full !min-h-full opacity-60" /></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,8,7,.2),rgba(9,8,7,.72)_70%,#090807)]" />
      <div className="book-shell relative z-10 flex min-h-[820px] flex-col justify-end pb-20 pt-32 md:min-h-[900px] md:pb-28">
        <div className="mb-10 flex items-center gap-4"><span className="book-kicker">BOOK / The Private Shelf</span><span className="h-px w-16 bg-white/20" /><span className="text-xs text-white/45">Vol. 001</span></div>
        <GooeyTextReveal mode="immediate" duration={1.35} stagger={0.12} className="max-w-5xl">
          <h1 data-gooey-reveal-item className="book-display text-[clamp(4.4rem,11vw,10.8rem)] leading-[.78] text-[#f5efe6]">Attraction is<br />a language.</h1>
          <p data-gooey-reveal-item className="book-display mt-8 max-w-3xl text-[clamp(2rem,5vw,5rem)] leading-[.95] text-[#d59a74]">Learn how to read it.</p>
        </GooeyTextReveal>
        <div className="mt-12 flex max-w-2xl flex-col gap-6 border-t border-white/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm leading-7 text-white/55 md:text-base">Original books on confidence, dating, attraction, and relationships—built as a quiet private library, not an attention feed.</p>
          <AnimatedButton onClick={() => router.push("/library")} className="!rounded-full !border-white/15 !bg-[#f1e8da] !px-7 !py-3 !text-[#191512] dark:!bg-[#f1e8da] dark:!text-[#191512]">Enter the shelf <ArrowRight className="ml-2 h-4 w-4" /></AnimatedButton>
        </div>
        <div className="mt-14 flex items-center gap-2 text-[11px] uppercase tracking-[.22em] text-white/35"><ArrowDown className="h-3.5 w-3.5" /> Scroll to browse</div>
      </div>
    </section>
  );
}
