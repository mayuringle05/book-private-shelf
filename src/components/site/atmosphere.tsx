"use client";

import { FluidMorphBg } from "@/components/ui/fluid-morph-bg";

export function Atmosphere({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden opacity-[.24] ${className}`} aria-hidden="true">
      <FluidMorphBg
        className="absolute inset-0 h-full w-full"
        duration={14}
        colors={["#2a1712", "#5d3528", "#8f6047", "#241715", "#3a2b39", "#19201d", "#6d4a3b"]}
        backgroundColor="#080706"
      />
    </div>
  );
}
