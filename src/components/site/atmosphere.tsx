"use client";

import { FluidMorphBg } from "@/components/ui/fluid-morph-bg";

export function Atmosphere({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 opacity-[.24]">
        <FluidMorphBg
          className="absolute inset-0 h-full w-full"
          duration={17}
          colors={["#24130f", "#682f2d", "#80634e", "#3c2119", "#4d2d24", "#2a1d18", "#c98762"]}
          backgroundColor="#090807"
        />
      </div>
      <div className="book-atmosphere-mesh absolute inset-[-12%] opacity-75" />
      <div className="book-light-leak absolute inset-0 opacity-55" />
      <div className="book-grain absolute inset-0 opacity-[.12]" />
      <div className="book-vignette absolute inset-0" />
    </div>
  );
}
