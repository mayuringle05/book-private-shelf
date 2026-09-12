"use client";

import { useSyncExternalStore } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import InteractiveBook, { type BookPage } from "@/components/ui/interactive-book";
import AnimatedButton from "@/components/ui/animated-button";
import type { BookWithProgress, UnitRecord } from "@/lib/types";
import { coverForSlug, sessionCoverVariantCached } from "@/lib/covers";
import { unitSummary, unitTitle } from "@/lib/content-view";

const subscribeNoop = () => () => {};

export function BookEntry({ book, units }: { book: BookWithProgress; units: UnitRecord[] }) {
  const router = useRouter();
  // Collector's-edition cover: a stable random variant per browser session
  const coverVariant = useSyncExternalStore(subscribeNoop, () => sessionCoverVariantCached(book.slug), () => 1);
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
        <p>This volume becomes readable only after its complete editorial production pass is explicitly published.</p>
      </div>
    ),
  }));
  const first = chapterUnits[0];

  return (
    <div className="grid min-h-[760px] items-center gap-12 lg:grid-cols-12 lg:gap-8">
      <div className="order-2 pb-14 lg:order-1 lg:col-span-5 lg:pb-0">
        <div className="flex items-center gap-4">
          <span className="book-index text-[10px] text-white/30">VOL. {String(book.sort_order).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-white/16" />
          <span className="book-kicker">{book.status === "published" ? "Published edition" : "Founding edition"}</span>
        </div>

        <h1 className="book-display book-display-xl mt-7">{book.title}</h1>
        <p className="mt-7 max-w-xl text-xl leading-8 text-white/64 md:text-2xl md:leading-9">{book.subtitle}</p>
        <p className="book-copy mt-8 max-w-xl">{book.description}</p>

        <div className="mt-10 grid grid-cols-2 gap-6 border-y book-rule py-6 text-[10px] uppercase tracking-[.16em] text-white/36">
          <div><span className="block text-white/68">Status</span><span className="mt-2 block">{book.status === "published" ? "Ready to read" : "Editorial production"}</span></div>
          <div><span className="block text-white/68">Reading surface</span><span className="mt-2 block">{book.status === "published" ? `${chapterUnits.length} chapters` : "Locked until publish"}</span></div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <AnimatedButton
            disabled={!first || book.status !== "published"}
            onClick={() => first && router.push(`/read/${book.slug}/${first.unit_key}`)}
            className="!rounded-full !px-6 !py-3 disabled:opacity-40"
          >
            {first && book.status === "published" ? <>Begin reading <ArrowRight className="ml-2 h-4 w-4" /></> : <>Reading locked <LockKeyhole className="ml-2 h-4 w-4" /></>}
          </AnimatedButton>
        </div>
      </div>

      <div className="order-1 min-h-[620px] overflow-hidden lg:order-2 lg:col-span-7 lg:min-h-[760px]">
        <InteractiveBook
          coverImage={book.cover_image || coverForSlug(book.slug, coverVariant)}
          bookTitle={book.title}
          bookAuthor={book.author_name}
          pages={pages}
          width={340}
          height={500}
          className="mx-auto origin-center scale-[.72] sm:scale-[.88] lg:scale-100"
        />
      </div>
    </div>
  );
}
