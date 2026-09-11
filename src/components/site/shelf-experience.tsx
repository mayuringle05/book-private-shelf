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
    year: book.status === "published" ? "PUBLISHED" : "FOUNDING VOLUME",
    stars: 0,
    desc: book.description,
    images: { front: book.cover_image || coverForSlug(book.slug) },
    edge: "#E9E0D3",
    backBg: "#181411",
    backInk: "#F3EDE3",
    spineBg: book.accent_hex,
    spineInk: "#181411",
  })), [books]);

  const selectedBook = selected ? books.find((book) => book.slug === selected.id) : null;

  return (
    <div className="book-shelf-stage relative">
      <div className="book-shell flex items-center justify-between border-t book-rule py-4 text-[10px] uppercase tracking-[.18em] text-white/34">
        <span>Spatial shelf / {books.length} volumes</span>
        <span className="hidden sm:inline">Drag to inspect · tap to select</span>
        <span className="sm:hidden">Swipe · tap</span>
      </div>

      <div data-cursor="book" className="relative touch-pan-y">
        <div aria-hidden="true" className="book-shelf-glow pointer-events-none absolute inset-x-[12%] bottom-[8%] z-[1] h-28 rounded-[100%] blur-3xl" />
        <BooksShowcase
          books={mapped}
          heroTitle=" "
          navTitle={compact ? "BOOK / The collection" : "BOOK / Founding collection"}
          showDetailPanel={false}
          showCarousel
          themeColors={{
            navy: "#090807",
            pink: "#C98762",
            cream: "#F3EDE3",
            lav: "#AAA097",
            peri: "#80634E",
            bg: "#090807",
            bgDark: "#090807",
            foregroundDark: "#F3EDE3",
          }}
          className={`${compact ? "min-h-[760px]" : "min-h-[900px]"} !bg-[#090807] !text-[#F3EDE3]`}
          onBookSelect={(book) => {
            setSelected(book);
            if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(10);
          }}
        />
      </div>

      <div className="book-shell grid min-h-32 gap-6 border-t book-rule py-7 md:grid-cols-12 md:items-center">
        <div className="md:col-span-2">
          <span className="book-kicker">Selected volume</span>
          {selectedBook ? <p className="book-index mt-3 text-[10px] text-white/28">{String(selectedBook.sort_order).padStart(2, "0")}</p> : null}
        </div>
        <div className="md:col-span-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="book-display text-2xl text-white/90 md:text-3xl">{selectedBook ? selectedBook.title : "Choose a book from the shelf"}</p>
            {selectedBook ? (
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] uppercase tracking-[.14em] text-white/40">
                {selectedBook.status.replace("_", " ")}
              </span>
            ) : null}
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-white/42">
            {selectedBook
              ? selectedBook.status === "published"
                ? "Published and ready for the distraction-free reader."
                : "Discover the volume now; reading unlocks only after editorial publication."
              : "Pick up a volume to inspect it in 3D before opening its editorial page."}
          </p>
          {selectedBook ? (
            <div className="mt-5 max-w-md">
              <div className="mb-2 flex items-center justify-between text-[9px] uppercase tracking-[.16em] text-white/30">
                <span>Editorial completion</span>
                <span>{selectedBook.complete_units}/{selectedBook.total_units} units</span>
              </div>
              <div className="book-progress-track h-px overflow-hidden bg-white/10">
                <div className="h-full bg-[var(--book-copper-soft)] transition-[width] duration-700" style={{ width: `${Math.max(0, Math.min(100, selectedBook.progress_percent))}%` }} />
              </div>
            </div>
          ) : null}
        </div>
        <div className="md:col-span-4 md:flex md:justify-end">
          {selectedBook ? (
            <AnimatedButton
              onClick={() => router.push(`/books/${selectedBook.slug}`)}
              className="!rounded-full !border-white/12 !px-6 !py-2.5 !text-[var(--book-ink)]"
            >
              {selectedBook.status === "published" ? "Open volume" : "Explore volume"}
              {selectedBook.status === "published" ? <ArrowRight className="ml-2 h-4 w-4" /> : <LockKeyhole className="ml-2 h-4 w-4" />}
            </AnimatedButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}
