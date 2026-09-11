"use client";

import { AnimatedFooter } from "@/components/ui/animated-footer";

export function SiteFooter() {
  return (
    <div className="h-[580px] overflow-hidden border-t border-white/10 md:h-[720px]">
      <AnimatedFooter
        headingLines={["BOOK", "PRIVATE SHELF"]}
        leftImage="/covers/magnetic-presence.svg"
        rightImage="/covers/authentic-attraction.svg"
        background="#080706"
        textColor="#F3EBDD"
        charColor="#7A5139"
        hoverColor="#D59A74"
        hoverCharColor="#140F0C"
        columns={56}
        cellSize={18}
        fontSize={14}
      />
    </div>
  );
}
