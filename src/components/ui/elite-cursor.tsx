"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type Ripple = { id: number; x: number; y: number };

export function EliteCursor() {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const trailX = useSpring(x, { stiffness: 420, damping: 38, mass: 0.18 });
  const trailY = useSpring(y, { stiffness: 420, damping: 38, mass: 0.18 });
  const [enabled, setEnabled] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (hover: hover)");
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled || reducedMotion) return;

    document.documentElement.classList.add("elite-cursor-ready");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target instanceof Element ? event.target : null;
      setInteractive(Boolean(target?.closest("a,button,[role='button'],[data-cursor='interactive'],[data-cursor='book']")));
    };

    const onDown = (event: PointerEvent) => {
      const id = Date.now() + Math.round(event.clientX + event.clientY);
      setRipples((current) => [...current.slice(-2), { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => setRipples((current) => current.filter((ripple) => ripple.id !== id)), 620);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      document.documentElement.classList.remove("elite-cursor-ready");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [enabled, reducedMotion, x, y]);

  if (!enabled || reducedMotion) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-[var(--book-ink)] mix-blend-difference"
        style={{ x, y, marginLeft: -3, marginTop: -3 }}
        animate={{ scale: interactive ? 1.65 : 1, opacity: interactive ? 0.95 : 0.78 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[99] h-7 w-7 rounded-full border border-white/40 mix-blend-difference"
        style={{ x: trailX, y: trailY, marginLeft: -14, marginTop: -14 }}
        animate={{ scale: interactive ? 1.38 : 1, opacity: interactive ? 0.7 : 0.42 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            aria-hidden="true"
            className="pointer-events-none fixed z-[98] h-3 w-3 rounded-full border border-[var(--book-copper-soft)]"
            style={{ left: ripple.x - 6, top: ripple.y - 6 }}
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 5.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
