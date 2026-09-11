"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import InteractiveBook, { type BookPage } from "@/components/ui/interactive-book";
import AnimatedButton from "@/components/ui/animated-button";
import type { BookWithProgress, UnitRecord } from "@/lib/types";
import { coverForSlug } from "@/lib/covers";
import { unitSummary, unitTitle } from "@/lib/content-view";

export function BookEntry({ book, units }: { book: BookWithProgress; units: UnitRecord[] }) {
  const router = useRouter();
  const chapterUnits = units.filter((unit) => unit.unit_type === "chapter");
  const pages: BookPage[] = (chapterUnits.length ? chapterUnits.slice(0, 4) : [null, null]).map((unit, index) => ({
    pageNumber: index + 1,
    title: unit ? unitTitle(unit) : index === 0 ? "Inside this volume" : "The private shelf",
    content: unit ? (
      <div className="space-y-3 text-left text-[11px] leading-5 text-neutral-700">
        <p>{unitSummary(unit).slice(0, 420)}</p>
        <p className="uppercase tracking-[.16em] text-neutral-400">Continue in the distraction-free reader</p>
      </div>
    ) : (
      <div className="space-y-4 text-left text-xs leading-5 text-neutral-700">
        <p>{book.positioning}</p>
        <p>This book unlocks for reading only after its complete editorial production pass is explicitly published.</p>
      </div>
    ),
  }));
  const first = chapterUnits[0];

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr]">
      <div className="min-h-[650px] overflow-hidden">
        <InteractiveBook
          coverImage={book.cover_image || coverForSlug(book.slug)}
          bookTitle={book.title}
          bookAuthor={book.author_name}
          pages={pages}
          width={310}
          height={450}
          className="mx-auto origin-center scale-[.78] sm:scale-90 lg:scale-100"
        />
      </div>
      <div className="pb-16 lg:pb-0">
        <p className="book-kicker">{book.status === "published" ? "Published edition" : "Founding edition"}</p>
        <h1 className="book-display mt-5 text-6xl leading-[.9] md:text-8xl">{book.title}</h1>
        <p className="mt-5 max-w-xl text-xl leading-8 text-white/62">{book.subtitle}</p>
        <p className="mt-8 max-w-xl text-sm leading-7 text-white/48">{book.description}</p>
        <div className="mt-10 border-y border-white/10 py-5 text-xs uppercase tracking-[.17em] text-white/40">
          {book.status === "published" ? `${chapterUnits.length} chapters · ready to read` : "Editorial production not yet published"}
        </div>
        <div className="mt-8">
          <AnimatedButton
            disabled={!first || book.status !== "published"}
            onClick={() => first && router.push(`/read/${book.slug}/${first.unit_key}`)}
            className="!rounded-full !px-6 !py-3 disabled:opacity-40"
          >
            {first && book.status === "published" ? <>Begin reading <ArrowRight className="ml-2 h-4 w-4" /></> : <>Reading locked <LockKeyhole className="ml-2 h-4 w-4" /></>}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
