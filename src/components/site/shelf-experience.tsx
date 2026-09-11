"use client";

import { useMemo, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { BooksShowcase, type BookCfg } from "@/components/ui/books-showcase";
import AnimatedButton from "@/components/ui/animated-button";
import type { BookWithProgress } from "@/lib/types";
import { coverForSlug } from "@/lib/covers";

export function ShelfExperience({ books, compact = false }: { books: BookWithProgress[]; compact?: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<BookCfg | null>(null);
  const mapped = useMemo<BookCfg[]>(() => books.map((book) => ({
    id: book.slug,
    title: book.title,
    author: book.author_name,
    year: book.status === "published" ? "AVAILABLE" : "FOUNDING EDITION",
    stars: 5,
    desc: book.description,
    images: { front: book.cover_image || coverForSlug(book.slug) },
    edge: "#e6ddcf",
    backBg: "#171412",
    backInk: "#f2eadf",
    spineBg: book.accent_hex,
    spineInk: "#140f0c",
  })), [books]);

  const selectedBook = selected ? books.find((b) => b.slug === selected.id) : null;

  return (
    <div className="relative">
      <BooksShowcase
        books={mapped}
        heroTitle={compact ? "The Shelf" : "Three books. One private shelf."}
        navTitle="Founding collection"
        showDetailPanel
        showCarousel
        themeColors={{navy:"#090807",pink:"#D59A74",cream:"#F0E7D9",lav:"#BEB0A7",peri:"#9A7CC1",bg:"#090807",bgDark:"#090807",foregroundDark:"#F5EFE6"}}
        className={compact ? "min-h-[720px]" : "min-h-[880px]"}
        onBookSelect={setSelected}
      />
      {selectedBook ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center px-4 md:bottom-12">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-black/75 p-2 pl-5 shadow-2xl backdrop-blur-xl">
            <span className="hidden text-xs uppercase tracking-[.18em] text-white/55 sm:inline">{selectedBook.status === "published" ? "Now on the shelf" : "Founding collection"}</span>
            <AnimatedButton onClick={() => router.push(`/books/${selectedBook.slug}`)} className="!rounded-full !border-white/10 !px-5 !py-2.5">
              {selectedBook.status === "published" ? "Open book" : "View book"}
              {selectedBook.status === "published" ? <ArrowRight className="ml-2 h-4 w-4" /> : <LockKeyhole className="ml-2 h-4 w-4" />}
            </AnimatedButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
