"use client";

import { FluidMorphBg } from "@/components/ui/fluid-morph-bg";

export function Atmosphere({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden opacity-[.22] ${className}`} aria-hidden="true">
      <FluidMorphBg
        className="absolute inset-0 h-full w-full"
        duration={14}
        colors={["#24130f", "#682f2d", "#80634e", "#3c2119", "#4d2d24", "#2a1d18", "#c98762"]}
        backgroundColor="#090807"
      />
    </div>
  );
}
