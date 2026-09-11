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
    edge: "#e8dfd1",
    backBg: "#151210",
    backInk: "#f2ebdd",
    spineBg: book.accent_hex,
    spineInk: "#120e0c",
  })), [books]);

  const selectedBook = selected ? books.find((book) => book.slug === selected.id) : null;

  return (
    <div>
      <BooksShowcase
        books={mapped}
        heroTitle={compact ? "The collection" : "Three volumes. One shelf."}
        navTitle="BOOK / Founding collection"
        showDetailPanel={false}
        showCarousel
        themeColors={{
          navy: "#080706",
          pink: "#D39A76",
          cream: "#F2EBDD",
          lav: "#B9AFA4",
          peri: "#8F7BAE",
          bg: "#080706",
          bgDark: "#080706",
          foregroundDark: "#F2EBDD",
        }}
        className={compact ? "min-h-[760px]" : "min-h-[900px]"}
        onBookSelect={setSelected}
      />

      <div className="book-shell grid min-h-28 gap-5 border-t book-rule py-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-2">
          <span className="book-kicker">Selected volume</span>
        </div>
        <div className="md:col-span-6">
          <p className="book-display text-2xl text-white/86 md:text-3xl">
            {selectedBook ? selectedBook.title : "Choose a book from the shelf"}
          </p>
          <p className="mt-2 text-xs leading-5 text-white/38">
            {selectedBook
              ? selectedBook.status === "published"
                ? "Published and ready for the distraction-free reader."
                : "Discover the volume now; reading unlocks only after editorial publication."
              : "Pick up a volume to inspect it in 3D before opening its editorial page."}
          </p>
        </div>
        <div className="md:col-span-4 md:flex md:justify-end">
          {selectedBook ? (
            <AnimatedButton
              onClick={() => router.push(`/books/${selectedBook.slug}`)}
              className="!rounded-full !border-white/12 !px-6 !py-2.5"
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
