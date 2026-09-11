import { notFound } from "next/navigation";
import { BookEntry } from "@/components/site/book-entry";
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
    <main className="min-h-screen bg-[#090807]">
      <SiteNav active={1} />
      <section className="book-shell pb-12 pt-28 md:pt-36">
        <BookEntry book={book} units={units} />
      </section>
      <section className="border-y border-white/10 bg-white/[.018]">
        <div className="book-shell py-20">
          <div className="grid gap-12 md:grid-cols-[.55fr_1.45fr]">
            <div>
              <p className="book-kicker">Contents</p>
              <p className="mt-5 max-w-xs text-sm leading-7 text-white/45">The reading surface is generated directly from validated production units. No per-book page work exists.</p>
            </div>
            <div className="divide-y divide-white/10 border-t border-white/10">
              {chapters.length ? chapters.map((unit, index) => (
                <a key={unit.id} href={`/read/${book.slug}/${unit.unit_key}`} className="group grid gap-3 py-6 md:grid-cols-[4rem_1fr_auto] md:items-center">
                  <span className="text-xs tracking-[.16em] text-white/30">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 className="book-display text-2xl text-white/85 transition-colors group-hover:text-[#d59a74]">{unitTitle(unit)}</h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/38">{unitSummary(unit)}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[.16em] text-white/30">Read →</span>
                </a>
              )) : (
                <div className="py-14 text-sm leading-7 text-white/40">Contents remain private until this volume reaches <code className="text-white/65">published</code>.</div>
              )}
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
