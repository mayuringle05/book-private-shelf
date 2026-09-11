import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { chapterSections, unitTitle } from "@/lib/content-view";
import { getPublishedReaderUnit } from "@/lib/reader-data";

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

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
  const progress = chapterCount > 0 ? ((chapterIndex + 1) / chapterCount) * 100 : 0;

  return (
    <main className="reader-paper">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f1e8d9]/95 backdrop-blur-sm">
        <div className="h-[2px] bg-black/8">
          <div className="h-full bg-[#9a684d]" style={{ width: `${progress}%` }} />
        </div>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Link href={`/books/${book.slug}`} className="flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-black/52">
            <ArrowLeft className="h-3.5 w-3.5" /> {book.title}
          </Link>
          <span className="text-[10px] uppercase tracking-[.2em] text-black/36">{chapterIndex + 1} / {chapterCount}</span>
        </div>
      </header>

      <article className="mx-auto max-w-[780px] px-6 pb-28 pt-16 md:px-8 md:pt-24">
        <div className="flex items-center justify-between border-b border-black/10 pb-5 text-[10px] uppercase tracking-[.2em] text-black/38">
          <span>Chapter {unit.unit_number}</span>
          <span>{unit.computed_word_count.toLocaleString()} words</span>
        </div>

        <h1 className="book-display mt-9 text-[clamp(3.8rem,8vw,7.2rem)] leading-[.82] text-[#201c18]">{unitTitle(unit)}</h1>

        {hook ? (
          <p className="reader-prose mt-12 border-l border-[#9a684d] pl-7 text-xl italic leading-9 text-black/64 md:text-2xl md:leading-10">
            {hook}
          </p>
        ) : null}

        <div className="reader-prose mt-16">
          {sections.map((section, index) => (
            <section key={`${section.heading}-${index}`}>
              <h2>{section.heading}</h2>
              {section.body.split(/\n\n+/).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            </section>
          ))}

          {examples.length ? (
            <section>
              <h2>Examples</h2>
              {examples.map((item, index) => <p key={index}>{item}</p>)}
            </section>
          ) : null}

          {exercise ? (
            <section className="my-16 border-y border-black/14 py-9">
              <p className="mb-5 font-sans text-[10px] uppercase tracking-[.2em] text-black/42">Practice / reflection</p>
              {typeof exercise.prompt === "string" ? <p>{exercise.prompt}</p> : null}
              {reflection.length ? (
                <ol className="ml-5 list-decimal">
                  {reflection.map((question, index) => <li key={index}>{question}</li>)}
                </ol>
              ) : null}
            </section>
          ) : null}

          {summary ? (
            <section className="border-t border-black/10 pt-1">
              <h2>Keep this</h2>
              <p>{summary}</p>
            </section>
          ) : null}
        </div>
      </article>

      <nav className="mx-auto grid max-w-6xl gap-5 border-t border-black/10 px-5 py-9 md:grid-cols-2 md:px-8">
        {previous ? (
          <Link href={`/read/${book.slug}/${previous.unit_key}`} className="flex items-center gap-3 text-sm text-black/54">
            <ArrowLeft className="h-4 w-4" /> Previous chapter
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/read/${book.slug}/${next.unit_key}`} className="flex items-center justify-end gap-3 text-sm text-black/54">
            Next chapter <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link href={`/books/${book.slug}`} className="text-right text-sm text-black/54">Back to volume</Link>
        )}
      </nav>
    </main>
  );
}
