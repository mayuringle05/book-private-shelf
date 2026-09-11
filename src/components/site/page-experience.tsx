"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EliteCursor } from "@/components/ui/elite-cursor";

export function PageExperience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("/#")) return;
      if (anchor.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      setNavigating(true);
      window.setTimeout(() => setNavigating(false), 1400);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <EliteCursor />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-px origin-left bg-gradient-to-r from-[var(--book-copper)] via-[var(--book-ink)] to-transparent"
        initial={false}
        animate={{ scaleX: navigating ? 0.76 : 0, opacity: navigating ? 1 : 0 }}
        transition={{ duration: navigating ? 0.72 : 0.24, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        key={pathname}
        initial={reducedMotion ? false : { opacity: 0.92, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.46, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
