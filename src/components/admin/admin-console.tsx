"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, LockKeyhole, Send, Sparkles } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import AnimatedButton from "@/components/ui/animated-button";
import { GenerateButton } from "@/components/ui/generate-button";
import { GlowBorderCard } from "@/components/ui/glow-border-card";
import { HighlightGrid } from "@/components/ui/highlight-grid";
import type { DashboardSnapshot, UnitRecord, ValidationIssue } from "@/lib/types";

interface ActionResult {
  type: "success" | "error" | "info";
  message: string;
  issues?: ValidationIssue[];
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }, cache: "no-store" });
  const body = await response.json();
  if (!response.ok && !body.issues) throw new Error(body.error || `Request failed (${response.status})`);
  return body as T;
}

function unitLabel(unit: UnitRecord) {
  if (unit.unit_type === "front_matter") return "Front";
  if (unit.unit_type === "back_matter") return "Back";
  return `Ch ${String(unit.unit_number).padStart(2, "0")}`;
}

function stateMark(unit: UnitRecord) {
  if (unit.status === "complete") return `✓ ${unitLabel(unit)}`;
  if (unit.status === "partial") return `◐ ${unitLabel(unit)}`;
  return `○ ${unitLabel(unit)}`;
}

export function AdminConsole({ initial }: { initial: DashboardSnapshot }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [payload, setPayload] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const active = snapshot.activeBook;
  const next = snapshot.nextUnit;

  const refresh = async () => {
    const latest = await jsonFetch<DashboardSnapshot>("/api/admin/status");
    setSnapshot(latest);
  };

  const startBook = async (bookId: string) => {
    setBusy(true); setResult(null);
    try {
      await jsonFetch("/api/admin/start", { method: "POST", body: JSON.stringify({ bookId }) });
      await refresh();
      setResult({ type: "success", message: "Production started. The first smallest missing unit is now the only target." });
    } catch (error) { setResult({ type: "error", message: error instanceof Error ? error.message : "Unable to start." }); }
    finally { setBusy(false); }
  };

  const copyPacket = async () => {
    setBusy(true); setResult(null);
    try {
      const packet = await jsonFetch<Record<string, unknown>>("/api/admin/work-packet");
      const text = JSON.stringify(packet, null, 2);
      await navigator.clipboard.writeText(text);
      setResult({ type: "success", message: `${String((packet.target_unit as Record<string, unknown>)?.key ?? "Work packet")} copied. Paste it into ChatGPT; return only the resulting JSON.` });
    } catch (error) { setResult({ type: "error", message: error instanceof Error ? error.message : "Unable to copy packet." }); }
    finally { setBusy(false); }
  };

  const validate = async () => {
    setBusy(true); setResult(null);
    try {
      if (!payload.trim()) throw new Error("Paste the JSON returned by ChatGPT first.");
      const response = await fetch("/api/admin/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payload }) });
      const body = await response.json();
      if (body.saved) {
        setPayload("");
        await refresh();
      }
      setResult({
        type: body.complete ? "success" : "error",
        message: body.message || body.error || (body.saved ? "Saved as partial." : "Validation failed."),
        issues: body.issues,
      });
    } catch (error) { setResult({ type: "error", message: error instanceof Error ? error.message : "Validation failed." }); }
    finally { setBusy(false); }
  };

  const publish = async (bookId: string) => {
    setBusy(true); setResult(null);
    try {
      await jsonFetch("/api/admin/publish", { method: "POST", body: JSON.stringify({ bookId }) });
      await refresh();
      setResult({ type: "success", message: "Published. The next book is now physically unlocked for production." });
    } catch (error) { setResult({ type: "error", message: error instanceof Error ? error.message : "Unable to publish." }); }
    finally { setBusy(false); }
  };

  const gridRows = useMemo(() => {
    if (!snapshot.activeUnits.length) return [[{ label: "No active unit" }]];
    const chunks: { label: string }[][] = [];
    for (let i = 0; i < snapshot.activeUnits.length; i += 5) chunks.push(snapshot.activeUnits.slice(i, i + 5).map((unit) => ({ label: stateMark(unit) })));
    return chunks;
  }, [snapshot.activeUnits]);

  return (
    <div className="space-y-10">
      <section className="grid gap-4 lg:grid-cols-3">
        {snapshot.books.map((book) => {
          const canStart = book.status === "queued" && !book.locked && !snapshot.activeBook;
          return (
            <GlowBorderCard key={book.id} width="100%" height="auto" aspectRatio="auto" colorPreset={book.status === "published" ? "nature" : book.status === "in_progress" ? "sunset" : "custom"} paused={book.status === "queued" && book.locked} className="!min-h-[270px] !bg-[#0d0b0a] p-6">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span className="book-kicker">{String(book.sort_order).padStart(2, "0")}</span>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[.16em] text-white/40">{book.locked ? <LockKeyhole className="h-3 w-3" /> : null}{book.status.replace("_", " ")}</span>
                </div>
                <h2 className="book-display mt-8 text-4xl leading-none">{book.title}</h2>
                <p className="mt-4 flex-1 text-xs leading-6 text-white/45">{book.positioning}</p>
                <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
                  <div><span className="text-3xl font-light"><AnimatedNumber value={book.progress_percent} duration={1} /></span><span className="text-sm text-white/35">%</span></div>
                  {canStart ? <AnimatedButton disabled={busy} onClick={() => startBook(book.id)} className="!rounded-full !px-4 !py-2 text-xs">Start production</AnimatedButton> : null}
                  {book.status === "complete" ? <AnimatedButton disabled={busy} onClick={() => publish(book.id)} className="!rounded-full !px-4 !py-2 text-xs">Publish</AnimatedButton> : null}
                  {book.status === "published" ? <span className="flex items-center gap-1.5 text-xs text-emerald-300/75"><Check className="h-4 w-4" /> Live</span> : null}
                </div>
              </div>
            </GlowBorderCard>
          );
        })}
      </section>

      {active ? (
        <section className="grid gap-8 xl:grid-cols-[.78fr_1.22fr]">
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-6">
              <p className="book-kicker">Active production</p>
              <h2 className="book-display mt-4 text-5xl">{active.title}</h2>
              <div className="mt-6 flex items-end gap-2"><span className="text-5xl font-light"><AnimatedNumber value={active.progress_percent} duration={1.2} /></span><span className="pb-1 text-sm text-white/35">% complete</span></div>
            </div>
            <HighlightGrid rows={gridRows} />
            <div className="grid gap-3 sm:grid-cols-2">
              {snapshot.activeUnits.map((unit) => <UnitCard key={unit.id} unit={unit} current={next?.id === unit.id} />)}
            </div>
          </div>

          <GlowBorderCard width="100%" height="auto" aspectRatio="auto" colorPreset="sunset" className="!bg-[#0c0a09] p-6 md:p-8">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 pb-6">
                <div>
                  <p className="book-kicker">Smallest missing unit</p>
                  <h3 className="book-display mt-3 text-4xl">{next ? next.title_hint || unitLabel(next) : "All units complete"}</h3>
                  {next ? <p className="mt-3 text-xs leading-6 text-white/42">{next.status.replace("_", " ")} · server minimum {next.min_word_count.toLocaleString()} words</p> : null}
                </div>
                {next ? <div className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[.15em] text-white/40">{next.unit_key}</div> : null}
              </div>

              {next ? (
                <div className="mt-7 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
                    <p className="mb-4 text-[10px] uppercase tracking-[.18em] text-white/35">Action 01 / system → ChatGPT</p>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="max-w-md text-sm leading-6 text-white/55">Generate the exact JSON + prompt bundle for this unit only, including any partial content and unresolved validation gaps.</p>
                      <div className="flex items-center gap-3">
                        <Clipboard className="h-4 w-4 text-white/30" />
                        <GenerateButton hue={24} isGenerating={busy} disabled={busy} onClick={copyPacket} aria-label="Copy Work Packet" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[.025] p-5">
                    <p className="mb-4 text-[10px] uppercase tracking-[.18em] text-white/35">Action 02 / ChatGPT → system</p>
                    <textarea
                      value={payload}
                      onChange={(event) => setPayload(event.target.value)}
                      spellCheck={false}
                      placeholder={'Paste ChatGPT JSON here…\n{ "chapter_number": 1, ... }'}
                      className="min-h-[330px] w-full resize-y rounded-xl border border-white/10 bg-black/35 p-4 font-mono text-xs leading-6 text-white/70 outline-none transition focus:border-[#d59a74]/55"
                    />
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-xs leading-5 text-white/35">The server ignores the AI&apos;s word-count claim, recounts content, validates shape, and overwrites this same unit instead of creating a duplicate.</p>
                      <AnimatedButton disabled={busy || !payload.trim()} onClick={validate} className="!rounded-full !px-5 !py-2.5 text-xs">
                        <Send className="mr-2 h-4 w-4" /> Paste &amp; Validate
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-14 text-center"><Sparkles className="mx-auto h-6 w-6 text-[#d59a74]" /><p className="book-display mt-4 text-3xl">Every unit passed.</p><p className="mt-3 text-sm text-white/40">The book has moved to complete. Publish it above to unlock the next title.</p></div>
              )}

              {result ? <ResultPanel result={result} /> : null}
            </div>
          </GlowBorderCard>
        </section>
      ) : (
        <GlowBorderCard width="100%" height="auto" aspectRatio="auto" colorPreset="custom" paused className="!bg-[#0c0a09] p-8 md:p-12">
          <div className="max-w-3xl">
            <p className="book-kicker">Production queue</p>
            <h2 className="book-display mt-4 text-5xl">{snapshot.books.some((book) => book.status === "complete") ? "A finished book is waiting to be published." : snapshot.books.every((book) => book.status === "published") ? "The founding shelf is published." : "Start the first unlocked book."}</h2>
            <p className="mt-5 text-sm leading-7 text-white/45">Only one book can be in production. Book N+1 remains locked until Book N is explicitly published.</p>
            {result ? <ResultPanel result={result} /> : null}
          </div>
        </GlowBorderCard>
      )}
    </div>
  );
}

function UnitCard({ unit, current }: { unit: UnitRecord; current: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${current ? "border-[#d59a74]/55 bg-[#d59a74]/[.07]" : "border-white/8 bg-white/[.018]"}`}>
      <div className="flex items-center justify-between gap-3"><span className="text-xs text-white/60">{unitLabel(unit)}</span><span className="text-[9px] uppercase tracking-[.13em] text-white/30">{unit.status.replace("_", " ")}</span></div>
      <p className="mt-2 line-clamp-1 text-[11px] text-white/35">{unit.title_hint || unit.unit_key}</p>
      {unit.status === "partial" ? <p className="mt-2 text-[10px] text-amber-200/55">{unit.validation_errors.length} gap{unit.validation_errors.length === 1 ? "" : "s"} · {unit.computed_word_count}/{unit.min_word_count} words</p> : null}
    </div>
  );
}

function ResultPanel({ result }: { result: ActionResult }) {
  return (
    <div className={`mt-6 rounded-xl border p-4 text-xs leading-6 ${result.type === "success" ? "border-emerald-300/20 bg-emerald-300/[.05] text-emerald-100/70" : "border-amber-300/20 bg-amber-300/[.05] text-amber-100/70"}`}>
      {result.type === "error" && result.issues?.length ? (
        <ul className="list-disc space-y-1 pl-5">{result.issues.map((issue, index) => <li key={`${issue.code}-${issue.path}-${index}`}><span className="font-mono text-[10px] opacity-60">{issue.path || issue.code}</span> — {issue.message}</li>)}</ul>
      ) : <p>{result.message}</p>}
    </div>
  );
}
