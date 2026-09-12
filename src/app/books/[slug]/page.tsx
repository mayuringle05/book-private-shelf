import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { BookEntry } from "@/components/site/book-entry";
import { Atmosphere } from "@/components/site/atmosphere";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { safeBook } from "@/lib/public-data";
import { unitSummary, unitTitle } from "@/lib/content-view";

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await safeBook(slug);
  if (!data) notFound();
  const { book, units } = data;
  const chapters = units.filter((unit) => unit.unit_type === "chapter");

  return (
    <main className="min-h-screen bg-[var(--book-bg)]">
      <SiteNav active={1} />
      <section className="relative overflow-hidden border-b book-hairline"><Atmosphere className="opacity-[.14]" /><div className="book-shell relative z-10 pb-10 pt-24 md:pt-28"><BookEntry book={book} units={units} /></div></section>
      <section className="border-b book-hairline">
        <div className="book-shell grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-3"><p className="book-kicker">This volume</p></div>
          <div className="md:col-span-9">
            <p className="book-display book-display-lg max-w-5xl text-white/90">{book.positioning}</p>
            <div className="mt-12 grid gap-8 border-t book-rule pt-8 text-sm leading-7 text-white/48 md:grid-cols-2"><p>{book.description}</p><p>The spatial book is the entrance. Once reading begins, the interface deliberately becomes quieter: stable paper, generous measure, no decorative motion between you and the chapter.</p></div>
          </div>
        </div>
      </section>
      <section>
        <div className="book-shell grid gap-12 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-3"><p className="book-kicker">Contents</p><p className="book-copy mt-5 max-w-xs text-sm">Public chapter content comes directly from validated production units. There is no second manual page-building layer.</p></div>
          <div className="border-t book-rule md:col-span-9">
            {chapters.length ? chapters.map((unit, index) => (
              <Link key={unit.id} href={`/read/${book.slug}/${unit.unit_key}`} className="group grid gap-4 border-b book-rule py-7 md:grid-cols-[4rem_1fr_auto] md:items-center">
                <span className="book-index text-[10px] text-white/28">{String(index + 1).padStart(2, "0")}</span>
                <div><h2 className="book-display text-3xl leading-none text-white/88">{unitTitle(unit)}</h2><p className="mt-3 line-clamp-2 max-w-2xl text-xs leading-6 text-white/38">{unitSummary(unit)}</p></div>
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-white/34">Read <ArrowUpRight className="h-3.5 w-3.5" /></span>
              </Link>
            )) : (
              <div className="border-b book-rule py-14"><p className="book-display text-3xl text-white/76">The contents are still private.</p><p className="book-copy mt-4 max-w-xl text-sm">This founding volume is visible for discovery, but its reader remains locked until the complete editorial pass is validated and explicitly published.</p></div>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
