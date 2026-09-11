import { Hero } from "@/components/site/hero";
import { SiteNav } from "@/components/site/site-nav";
import { ShelfExperience } from "@/components/site/shelf-experience";
import { SiteFooter } from "@/components/site/site-footer";
import { Atmosphere } from "@/components/site/atmosphere";
import StatsCounter from "@/components/ui/stats-counter";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { safeCatalog } from "@/lib/catalog";

const principles = [
  { index: "01", title: "Read signals, not fantasies.", body: "Attention, comfort, reciprocity, boundaries, and compatibility are observable. The goal is better judgment, not certainty where none exists." },
  { index: "02", title: "Build presence without performing.", body: "Useful confidence is steady enough to leave room for another person. It should make you more honest, not more theatrical." },
  { index: "03", title: "Keep agency on both sides.", body: "Attraction matters. So do consent, self-respect, timing, and the ability to walk away cleanly when the fit is not there." },
];

const faq = [
  { question: "Why is the shelf intentionally small?", answer: "Because BOOK is designed as a library, not a feed. A title is added only when its full editorial production pass is complete and explicitly published." },
  { question: "Are unpublished books available to read?", answer: "No. You can discover a founding volume before publication, but chapter content stays private until every required unit passes validation and the book is manually published." },
  { question: "What happens when I open a published book?", answer: "The spatial motion ends and the interface becomes a quiet paper-like reader. The book should feel immersive on entry and invisible while you are actually reading." },
  { question: "Is this built around manipulation or dating scripts?", answer: "No. The editorial system is explicitly written around observation, communication, consent, self-respect, and useful judgment rather than coercion, tricks, or pickup tactics." },
];

export default async function HomePage() {
  const books = await safeCatalog();

  return (
    <main className="overflow-hidden bg-[var(--book-bg)]">
      <SiteNav active={0} />
      <Hero />

      <section id="shelf" className="border-b book-hairline">
        <div className="book-shell py-20 md:py-32">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-2">
              <p className="book-kicker">The collection</p>
              <p className="book-index mt-4 text-[10px] uppercase text-white/28">001—003</p>
            </div>
            <div className="lg:col-span-6">
              <h2 className="book-display book-display-xl">Books you enter,<br />not content you scroll past.</h2>
            </div>
            <div className="lg:col-span-4 lg:pl-10">
              <p className="book-copy max-w-lg">Pick up a volume in 3D. Inspect it as an object. Once you start reading, the interface gets out of the way and leaves you with the words.</p>
            </div>
          </div>
        </div>
        <ShelfExperience books={books} />
      </section>

      <section className="border-b book-hairline">
        <div className="book-shell grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-3"><p className="book-kicker">Designed with restraint</p></div>
          <div className="grid gap-px border-y book-rule md:col-span-9 md:grid-cols-3">
            <div className="border-b book-rule py-8 md:border-b-0 md:border-r md:pr-8"><div className="book-display text-6xl md:text-7xl"><StatsCounter value={3} duration={1.2} /></div><p className="mt-3 text-xs uppercase tracking-[.16em] text-white/36">Founding volumes</p></div>
            <div className="border-b book-rule py-8 md:border-b-0 md:border-r md:px-8"><div className="book-display text-6xl md:text-7xl"><StatsCounter value={10} duration={1.35} /></div><p className="mt-3 text-xs uppercase tracking-[.16em] text-white/36">Required units per volume</p></div>
            <div className="py-8 md:pl-8"><div className="book-display text-6xl md:text-7xl"><StatsCounter value={1} duration={1.5} /></div><p className="mt-3 text-xs uppercase tracking-[.16em] text-white/36">Book in production at a time</p></div>
          </div>
        </div>
      </section>

      <section id="philosophy" className="relative overflow-hidden border-b book-hairline py-24 md:py-40">
        <Atmosphere />
        <div className="book-shell relative z-10">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3"><p className="book-kicker">The philosophy</p></div>
            <div className="lg:col-span-9"><p className="book-display book-display-xl max-w-5xl text-[var(--book-ink)]">No tricks. No performance persona. No endless feed.</p></div>
          </div>
          <div className="mt-20 border-t book-rule">
            {principles.map((item) => (
              <div key={item.index} className="grid gap-5 border-b book-rule py-8 md:grid-cols-12 md:items-start md:py-10">
                <div className="book-index text-xs text-white/30 md:col-span-1">{item.index}</div>
                <h3 className="book-display text-3xl leading-none text-white/88 md:col-span-5 md:text-4xl">{item.title}</h3>
                <p className="book-copy max-w-2xl md:col-span-6">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b book-hairline">
        <div className="book-shell grid gap-12 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-4"><p className="book-kicker">How the shelf earns trust</p><h2 className="book-display book-display-md mt-5">One book at a time.</h2></div>
          <div className="md:col-span-8">
            {[
              ["01", "Produce", "A single active volume moves through front matter, eight chapters, and closing integration."],
              ["02", "Validate", "Every unit is checked for structure, completeness, and a server-recomputed minimum word count. Partial work is repaired, not discarded."],
              ["03", "Publish", "Only a fully complete book can be manually published. Publishing unlocks the next title in the queue."],
              ["04", "Read", "The public site maps directly to validated content. There is no second manual page-building step that can drift from editorial truth."],
            ].map(([index, title, body]) => (
              <div key={index} className="grid gap-4 border-t book-rule py-7 sm:grid-cols-[4rem_10rem_1fr] sm:items-start"><span className="book-index text-[10px] text-white/28">{index}</span><span className="text-sm text-white/82">{title}</span><p className="book-copy max-w-2xl text-sm">{body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b book-hairline py-24 md:py-32">
        <div className="book-shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><p className="book-kicker">Before you enter</p><h2 className="book-display book-display-md mt-5 max-w-sm">A few useful answers.</h2></div>
          <div className="lg:col-span-8"><FaqAccordion items={faq} title="" className="!mx-0 !max-w-none !py-0" /></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
