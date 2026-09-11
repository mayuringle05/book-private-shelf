import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { LibrarySearch } from "@/components/site/library-search";
import { ShelfExperience } from "@/components/site/shelf-experience";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { safeCatalog } from "@/lib/catalog";

export const metadata = { title: "The Collection" };

export default async function LibraryPage() {
  const books = await safeCatalog();

  return (
    <main className="min-h-screen bg-[var(--book-bg)]">
      <SiteNav active={1} />
      <header className="book-shell grid gap-12 border-b book-rule pb-14 pt-32 md:grid-cols-12 md:items-end md:pb-16 md:pt-44">
        <div className="md:col-span-2"><p className="book-kicker">BOOK / Catalogue</p><p className="book-index mt-4 text-[10px] text-white/28">001—003</p></div>
        <div className="md:col-span-7"><h1 className="book-display book-display-xl">The Private<br />Shelf</h1></div>
        <div className="space-y-6 md:col-span-3"><p className="book-copy text-sm">A deliberately small catalogue of original books for people who want clearer judgment, steadier confidence, and healthier connection.</p><Suspense fallback={null}><LibrarySearch books={books} /></Suspense></div>
      </header>

      <ShelfExperience books={books} compact />

      <section className="book-shell py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3"><p className="book-kicker">Catalogue index</p></div>
          <div className="border-t book-rule md:col-span-9">
            {books.map((book) => (
              <Link key={book.id} href={`/books/${book.slug}`} className="group grid gap-4 border-b book-rule py-7 sm:grid-cols-[4rem_1.1fr_1.4fr_auto] sm:items-center">
                <span className="book-index text-[10px] text-white/26">{String(book.sort_order).padStart(2, "0")}</span>
                <span className="book-display text-3xl leading-none text-white/88">{book.title}</span>
                <span className="text-xs leading-6 text-white/38">{book.positioning}</span>
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-white/34">{book.status === "published" ? "Read" : "Preview"}<ArrowUpRight className="h-3.5 w-3.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="book-shell border-t book-rule py-12"><div className="grid gap-4 text-[10px] uppercase tracking-[.18em] text-white/30 sm:grid-cols-3"><span>Small by design</span><span>Publication gated by completion</span><span className="sm:text-right">Reader first, feed never</span></div></section>
      <SiteFooter />
    </main>
  );
}
