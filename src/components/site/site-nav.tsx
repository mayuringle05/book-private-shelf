"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Compass, Home, LibraryBig, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { GlassDock } from "@/components/ui/glass-dock";

const items = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/library" },
  { label: "Philosophy", href: "/#philosophy" },
];

export function SiteNav({ active = 0 }: { active?: number }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const nextY = window.scrollY;
      if (nextY < 100) setVisible(true);
      else if (nextY > lastY.current + 8) setVisible(false);
      else if (nextY < lastY.current - 8) setVisible(true);
      lastY.current = nextY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
    if (href.includes("#")) window.location.href = href;
    else router.push(href);
  };

  const transition = reducedMotion ? { duration: 0 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <>
          <motion.div
            key="desktop-nav"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={transition}
            className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden pt-4 md:block"
          >
            <div className="book-nav-halo pointer-events-auto mx-auto w-fit rounded-full p-[1px]">
              <SpotlightNavbar items={items} defaultActiveIndex={active} onItemClick={(item) => go(item.href)} />
            </div>
          </motion.div>

          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={transition}
            className="fixed inset-x-0 bottom-4 z-50 flex justify-center md:hidden"
          >
            <GlassDock
              dockClassName="!border-white/10 !bg-black/75 !shadow-[0_16px_60px_rgba(0,0,0,.42)]"
              items={[
                { title: "Home", icon: Home, onClick: () => go("/") },
                { title: "Collection", icon: LibraryBig, onClick: () => go("/library") },
                { title: "Search", icon: Search, onClick: () => go("/library?search=1") },
                { title: "Philosophy", icon: Compass, onClick: () => go("/#philosophy") },
              ]}
            />
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
