"use client";

import { GlowBorderCard } from "@/components/ui/glow-border-card";

export function AdminSetup({ message }: { message: string }) {
  return (
    <GlowBorderCard width="100%" height="auto" aspectRatio="auto" colorPreset="sunset" paused className="!bg-[#0c0a09] p-8 md:p-12">
      <p className="book-kicker">Database setup required</p>
      <h2 className="book-display mt-4 text-5xl">The production engine needs PostgreSQL.</h2>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45">{message}</p>
      <pre className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-black/35 p-5 text-xs leading-7 text-white/65">{`cp .env.example .env\ndocker compose up -d\nnpm run db:setup`}</pre>
    </GlowBorderCard>
  );
}
