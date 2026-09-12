"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Scroll-triggered word-split headline: words rise and rotate in individually. */
export function WordSplitReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.07,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: reducedMotion ? 0 : stagger }}
      aria-label={text}
      role="text"
    >
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="mr-[.22em] inline-block will-change-transform"
          variants={{
            hidden: reducedMotion ? { y: 0, rotateX: 0, opacity: 1 } : { y: 34, rotateX: -32, opacity: 0 },
            shown: { y: 0, rotateX: 0, opacity: 1 },
          }}
          transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : delay + index * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default WordSplitReveal;