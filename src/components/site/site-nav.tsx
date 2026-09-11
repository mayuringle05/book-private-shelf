"use client";

import { BookOpen, Home, LibraryBig, LockKeyhole, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { GlassDock } from "@/components/ui/glass-dock";

const items = [
  { label: "Home", href: "/" },
  { label: "The Shelf", href: "/library" },
  { label: "About", href: "/#manifesto" },
  { label: "Admin", href: "/admin" },
];

export function SiteNav({ active = 0 }: { active?: number }) {
  const router = useRouter();
  const go = (href: string) => {
    if (href.includes("#")) window.location.href = href;
    else router.push(href);
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden md:block">
        <div className="pointer-events-auto mx-auto w-fit">
          <SpotlightNavbar items={items} defaultActiveIndex={active} onItemClick={(item) => go(item.href)} />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center md:hidden">
        <GlassDock
          dockClassName="!bg-black/70 !border-white/10"
          items={[
            { title: "Home", icon: Home, onClick: () => go("/") },
            { title: "Blog", icon: LibraryBig, onClick: () => go("/library") },
            { title: "Marker", icon: Search, onClick: () => go("/library?search=1") },
            { title: "Email", icon: BookOpen, onClick: () => go("/#manifesto") },
            { title: "Github", icon: LockKeyhole, onClick: () => go("/admin") },
          ]}
        />
      </div>
    </>
  );
}
