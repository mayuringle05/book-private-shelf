"use client";

import { motion, useReducedMotion } from "framer-motion";

export function CinematicSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={`relative overflow-hidden ${className}`}
      initial={reducedMotion ? false : { opacity: 0.78, y: 42, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {!reducedMotion ? (
        <motion.div
          aria-hidden="true"
          className="book-cinematic-fog pointer-events-none absolute inset-0 z-[1]"
          initial={{ opacity: 0.52 }}
          whileInView={{ opacity: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.25, ease: "easeOut" }}
        />
      ) : null}
      <div className="relative z-[2]">{children}</div>
    </motion.section>
  );
}
