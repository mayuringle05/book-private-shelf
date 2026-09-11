"use client";

import { Compass, Home, LibraryBig, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { GlassDock } from "@/components/ui/glass-dock";

const items = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/library" },
  { label: "Philosophy", href: "/#philosophy" },
];

export function SiteNav({ active = 0 }: { active?: number }) {
  const router = useRouter();

  const go = (href: string) => {
    if (href.includes("#")) window.location.href = href;
    else router.push(href);
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden pt-4 md:block">
        <div className="pointer-events-auto mx-auto w-fit">
          <SpotlightNavbar items={items} defaultActiveIndex={active} onItemClick={(item) => go(item.href)} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center md:hidden">
        <GlassDock
          dockClassName="!border-white/10 !bg-black/75"
          items={[
            { title: "Home", icon: Home, onClick: () => go("/") },
            { title: "Collection", icon: LibraryBig, onClick: () => go("/library") },
            { title: "Search", icon: Search, onClick: () => go("/library?search=1") },
            { title: "Philosophy", icon: Compass, onClick: () => go("/#philosophy") },
          ]}
        />
      </div>
    </>
  );
}
