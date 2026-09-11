import { Hero } from "@/components/site/hero";
import { SiteNav } from "@/components/site/site-nav";
import { ShelfExperience } from "@/components/site/shelf-experience";
import { SiteFooter } from "@/components/site/site-footer";
import { safeCatalog } from "@/lib/catalog";
import { Atmosphere } from "@/components/site/atmosphere";

export default async function HomePage() {
  const books = await safeCatalog();
  return (
    <main className="overflow-hidden bg-[#090807]">
      <SiteNav active={0} />
      <Hero />
      <section id="shelf" className="relative border-b book-hairline">
        <div className="book-shell py-20 md:py-28">
          <div className="grid gap-8 md:grid-cols-[.85fr_1.15fr] md:items-end">
            <div>
              <p className="book-kicker">The founding collection</p>
              <h2 className="book-display mt-4 max-w-xl text-5xl leading-[.92] md:text-7xl">Books you enter, not content you scroll past.</h2>
            </div>
            <p className="max-w-xl justify-self-end text-sm leading-7 text-white/50 md:text-base">
              Pick a volume from the shelf. The cover opens as an object; the reader then becomes quiet paper. Motion gets you into the book, never between you and the words.
            </p>
          </div>
        </div>
        <ShelfExperience books={books} />
      </section>
      <section id="manifesto" className="relative overflow-hidden py-28 md:py-40">
        <Atmosphere />
        <div className="book-shell relative z-10 grid gap-16 md:grid-cols-[.7fr_1.3fr]">
          <p className="book-kicker pt-2">The premise</p>
          <div>
            <p className="book-display max-w-4xl text-[clamp(2.7rem,6vw,6.4rem)] leading-[.93] text-[#efe6d8]">
              No tricks. No performance persona. No endless feed.
            </p>
            <div className="mt-12 grid gap-8 border-t border-white/15 pt-8 text-sm leading-7 text-white/52 sm:grid-cols-3">
              <p><span className="mb-3 block text-white">Read signals.</span>Learn to notice attention, comfort, reciprocity, boundaries, and compatibility without inventing certainty.</p>
              <p><span className="mb-3 block text-white">Build presence.</span>Confidence becomes useful when it is steady enough to leave room for someone else.</p>
              <p><span className="mb-3 block text-white">Keep agency.</span>Attraction matters. So do honesty, consent, judgment, and the ability to walk away cleanly.</p>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
