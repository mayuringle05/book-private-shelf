"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchModal } from "@/components/ui/search-modal";
import AnimatedButton from "@/components/ui/animated-button";
import type { BookWithProgress } from "@/lib/types";

export function LibrarySearch({ books }: { books: BookWithProgress[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  useEffect(() => { if (params.get("search") === "1") setOpen(true); }, [params]);
  return <><AnimatedButton onClick={() => setOpen(true)} className="!rounded-full !border-white/10 !bg-white/[.04] !px-5 !py-2.5"><Search className="mr-2 h-4 w-4" /> Search shelf <span className="ml-3 text-[10px] opacity-40">⌘K</span></AnimatedButton><SearchModal modal open={open} onOpenChange={setOpen} hotkey="k" placeholder="Search titles, themes, promises…" tags={[{ label: "Confidence" }, { label: "Attraction" }, { label: "Dating" }, { label: "Relationships" }]} results={books.map((book) => ({ name: book.title, meta: book.positioning, href: `/books/${book.slug}` }))} quickActions={[]} files={[]} onSelectResult={(result) => { setOpen(false); if (result.href) router.push(result.href); }} /></>;
}
