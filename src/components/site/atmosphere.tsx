"use client";

import { FluidMorphBg } from "@/components/ui/fluid-morph-bg";

export function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[.18]">
      <FluidMorphBg
        className="absolute inset-0 h-full w-full"
        duration={12}
        colors={["#3a241b", "#6b3f2d", "#8d5b3f", "#39211a", "#1a1210"]}
        backgroundColor="#090807"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#090807_0%,transparent_30%,transparent_70%,#090807_100%)]" />
    </div>
  );
}
