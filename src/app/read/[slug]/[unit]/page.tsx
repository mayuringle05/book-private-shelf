import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { chapterSections, unitTitle } from "@/lib/content-view";
import { getPublishedReaderUnit } from "@/lib/reader-data";

function stringList(value: unknown) { return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : []; }

export default async function ReaderPage({ params }: { params: Promise<{ slug: string; unit: string }> }) {
  const { slug, unit: unitKey } = await params;
  let data = null;
  try { data = await getPublishedReaderUnit(slug, unitKey); } catch { data = null; }
  if (!data) notFound();
  const { book, unit, previous, next, chapterIndex, chapterCount } = data;
  const content = unit.content ?? {};
  const hook = typeof content.hook === "string" ? content.hook : null;
  const sections = chapterSections(unit);
  const examples = stringList(content.examples);
  const summary = typeof content.summary === "string" ? content.summary : null;
  const exercise = content.exercise && typeof content.exercise === "object" ? content.exercise as Record<string, unknown> : null;
  const reflection = exercise ? stringList(exercise.reflection_questions) : [];

  return (
    <main className="reader-paper">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f2eadb]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link href={`/books/${book.slug}`} className="flex items-center gap-2 text-xs uppercase tracking-[.16em] text-black/55"><ArrowLeft className="h-4 w-4" /> {book.title}</Link>
          <span className="text-[10px] uppercase tracking-[.18em] text-black/40">{chapterIndex + 1} / {chapterCount}</span>
        </div>
      </header>
      <article className="mx-auto max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
        <p className="text-[11px] uppercase tracking-[.2em] text-black/45">Chapter {unit.unit_number}</p>
        <h1 className="book-display mt-5 text-[clamp(3.3rem,8vw,6.5rem)] leading-[.88] text-[#211d19]">{unitTitle(unit)}</h1>
        {hook ? <p className="reader-prose mt-10 border-l-2 border-[#a57659] pl-6 text-xl italic leading-9 text-black/65">{hook}</p> : null}
        <div className="reader-prose mt-14">
          {sections.map((section, index) => <section key={`${section.heading}-${index}`}><h2>{section.heading}</h2>{section.body.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}</section>)}
          {examples.length ? <section><h2>Examples</h2>{examples.map((item, i) => <p key={i}>{item}</p>)}</section> : null}
          {exercise ? <section className="my-16 border-y border-black/15 py-8"><p className="mb-3 text-[10px] font-sans uppercase tracking-[.2em] text-black/45">Exercise</p>{typeof exercise.prompt === "string" ? <p>{exercise.prompt}</p> : null}{reflection.length ? <ol className="ml-5 list-decimal">{reflection.map((q,i)=><li key={i}>{q}</li>)}</ol> : null}</section> : null}
          {summary ? <section><h2>Keep this</h2><p>{summary}</p></section> : null}
        </div>
      </article>
      <nav className="mx-auto grid max-w-5xl gap-4 border-t border-black/10 px-5 py-8 sm:grid-cols-2">
        {previous ? <Link href={`/read/${book.slug}/${previous.unit_key}`} className="flex items-center gap-3 text-sm text-black/55"><ArrowLeft className="h-4 w-4" /> Previous chapter</Link> : <span />}
        {next ? <Link href={`/read/${book.slug}/${next.unit_key}`} className="flex items-center justify-end gap-3 text-sm text-black/55">Next chapter <ArrowRight className="h-4 w-4" /></Link> : <Link href={`/books/${book.slug}`} className="text-right text-sm text-black/55">Back to book</Link>}
      </nav>
    </main>
  );
}
