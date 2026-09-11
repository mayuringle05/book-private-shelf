import { Suspense } from "react";
import { LibrarySearch } from "@/components/site/library-search";
import { ShelfExperience } from "@/components/site/shelf-experience";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { safeCatalog } from "@/lib/catalog";

export const metadata = { title: "The Shelf" };

export default async function LibraryPage() {
  const books = await safeCatalog();
  return (
    <main className="min-h-screen bg-[#090807]">
      <SiteNav active={1} />
      <header className="book-shell flex flex-col gap-8 border-b border-white/10 pb-12 pt-32 md:flex-row md:items-end md:justify-between md:pt-40">
        <div>
          <p className="book-kicker">BOOK / Catalogue 001—003</p>
          <h1 className="book-display mt-4 text-6xl md:text-8xl">The Private Shelf</h1>
        </div>
        <Suspense fallback={null}><LibrarySearch books={books} /></Suspense>
      </header>
      <ShelfExperience books={books} compact />
      <section className="book-shell border-t border-white/10 py-20 text-xs uppercase tracking-[.2em] text-white/35">
        A small library by design. Each volume earns its place.
      </section>
      <SiteFooter />
    </main>
  );
}
