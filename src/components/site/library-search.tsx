"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchModal } from "@/components/ui/search-modal";
import AnimatedButton from "@/components/ui/animated-button";
import type { BookWithProgress } from "@/lib/types";

export function LibrarySearch({ books }: { books: BookWithProgress[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(() => params.get("search") === "1");

  return (
    <>
      <AnimatedButton
        onClick={() => setOpen(true)}
        className="!rounded-full !border-white/15 !bg-white/[.06] !px-5 !py-2.5 !text-[#F2EBDD]"
      >
        <Search className="mr-2 h-4 w-4" /> Search shelf
        <span className="ml-3 text-[10px] text-white/38">⌘K</span>
      </AnimatedButton>
      <SearchModal
        modal
        open={open}
        onOpenChange={setOpen}
        hotkey="k"
        placeholder="Search titles, themes, promises…"
        tags={[{ label: "Confidence" }, { label: "Attraction" }, { label: "Dating" }, { label: "Relationships" }]}
        results={books.map((book) => ({ name: book.title, meta: book.positioning, href: `/books/${book.slug}` }))}
        quickActions={[]}
        files={[]}
        onSelectResult={(result) => {
          setOpen(false);
          if (result.href) router.push(result.href);
        }}
      />
    </>
  );
}
