"use client";

import { AnimatedFooter } from "@/components/ui/animated-footer";

export function SiteFooter() {
  return (
    <div className="h-[580px] overflow-hidden border-t border-white/10 md:h-[720px]">
      <AnimatedFooter
        headingLines={["BOOK", "PRIVATE SHELF"]}
        leftImage="/covers/magnetic-presence.svg"
        rightImage="/covers/authentic-attraction.svg"
        background="#090807"
        textColor="#F3EDE3"
        charColor="#80634E"
        hoverColor="#C98762"
        hoverCharColor="#181411"
        columns={56}
        cellSize={18}
        fontSize={14}
      />
    </div>
  );
}
