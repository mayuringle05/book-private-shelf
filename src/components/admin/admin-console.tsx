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
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  const body = await response.json();
  if (!response.ok && !body.issues) throw new Error(body.error || `Request failed (${response.status})`);
  return body as T;
}

function unitLabel(unit: UnitRecord) {
  if (unit.unit_type === "front_matter") return "Front matter";
  if (unit.unit_type === "back_matter") return "Back matter";
  return `Chapter ${String(unit.unit_number).padStart(2, "0")}`;
}

function compactUnitLabel(unit: UnitRecord) {
  if (unit.unit_type === "front_matter") return "Front";
  if (unit.unit_type === "back_matter") return "Back";
  return `Ch ${String(unit.unit_number).padStart(2, "0")}`;
}

function stateMark(unit: UnitRecord) {
  if (unit.status === "complete") return `✓ ${compactUnitLabel(unit)}`;
  if (unit.status === "partial") return `◐ ${compactUnitLabel(unit)}`;
  return `○ ${compactUnitLabel(unit)}`;
}

export function AdminConsole({ initial }: { initial: DashboardSnapshot }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [payload, setPayload] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const active = snapshot.activeBook;
  const next = snapshot.nextUnit;

  const refresh = async () => {
    setSnapshot(await jsonFetch<DashboardSnapshot>("/api/admin/status"));
  };

  const startBook = async (bookId: string) => {
    setBusy(true);
    setResult(null);
    try {
      await jsonFetch("/api/admin/start", { method: "POST", body: JSON.stringify({ bookId }) });
      await refresh();
      setResult({ type: "success", message: "Production started. The smallest incomplete unit is now the active target." });
    } catch (error) {
      setResult({ type: "error", message: error instanceof Error ? error.message : "Unable to start production." });
    } finally {
      setBusy(false);
    }
  };

  const copyPacket = async () => {
    setBusy(true);
    setResult(null);
    try {
      const packet = await jsonFetch<Record<string, unknown>>("/api/admin/work-packet");
      await navigator.clipboard.writeText(JSON.stringify(packet, null, 2));
      setResult({
        type: "success",
        message: `${String((packet.target_unit as Record<string, unknown>)?.key ?? "Work packet")} copied. Paste it into ChatGPT and return only the requested JSON.`,
      });
    } catch (error) {
      setResult({ type: "error", message: error instanceof Error ? error.message : "Unable to copy work packet." });
    } finally {
      setBusy(false);
    }
  };

  const validate = async () => {
    setBusy(true);
    setResult(null);
    try {
      if (!payload.trim()) throw new Error("Paste the JSON returned by ChatGPT first.");
      const response = await fetch("/api/admin/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });
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
    } catch (error) {
      setResult({ type: "error", message: error instanceof Error ? error.message : "Validation failed." });
    } finally {
      setBusy(false);
    }
  };

  const publish = async (bookId: string) => {
    setBusy(true);
    setResult(null);
    try {
      await jsonFetch("/api/admin/publish", { method: "POST", body: JSON.stringify({ bookId }) });
      await refresh();
      setResult({ type: "success", message: "Published. The next volume is now unlocked for production." });
    } catch (error) {
      setResult({ type: "error", message: error instanceof Error ? error.message : "Unable to publish." });
    } finally {
      setBusy(false);
    }
  };

  const gridRows = useMemo(() => {
    if (!snapshot.activeUnits.length) return [[{ label: "No active unit" }]];
    const chunks: { label: string }[][] = [];
    for (let index = 0; index < snapshot.activeUnits.length; index += 5) {
      chunks.push(snapshot.activeUnits.slice(index, index + 5).map((unit) => ({ label: stateMark(unit) })));
    }
    return chunks;
  }, [snapshot.activeUnits]);

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-5 flex items-end justify-between border-b book-rule pb-4">
          <div>
            <p className="book-kicker">Production queue</p>
            <p className="mt-3 text-xs text-white/36">One active volume. Explicit publish unlocks the next.</p>
          </div>
          <span className="book-index text-[10px] text-white/24">{String(snapshot.books.length).padStart(2, "0")} VOLUMES</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {snapshot.books.map((book) => {
            const canStart = book.status === "queued" && !book.locked && !snapshot.activeBook;
            return (
              <GlowBorderCard
                key={book.id}
                width="100%"
                height="auto"
                aspectRatio="auto"
                colorPreset={book.status === "published" ? "nature" : book.status === "in_progress" ? "sunset" : "custom"}
                paused={book.status === "queued" && book.locked}
                className="!min-h-[270px] !bg-[#0d0b0a] p-6"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <span className="book-index text-[10px] text-white/30">VOL. {String(book.sort_order).padStart(2, "0")}</span>
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[.16em] text-white/40">
                      {book.locked ? <LockKeyhole className="h-3 w-3" /> : null}
                      {book.status.replace("_", " ")}
                    </span>
                  </div>
                  <h2 className="book-display mt-8 text-4xl leading-none">{book.title}</h2>
                  <p className="mt-4 flex-1 text-xs leading-6 text-white/45">{book.positioning}</p>
                  <div className="mt-6 flex items-end justify-between border-t book-rule pt-5">
                    <div>
                      <span className="text-3xl font-light"><AnimatedNumber value={book.progress_percent} /></span>
                      <span className="text-sm text-white/35">%</span>
                    </div>
                    {canStart ? (
                      <AnimatedButton disabled={busy} onClick={() => startBook(book.id)} className="!rounded-full !px-4 !py-2 text-xs">
                        Start production
                      </AnimatedButton>
                    ) : null}
                    {book.status === "complete" ? (
                      <AnimatedButton disabled={busy} onClick={() => publish(book.id)} className="!rounded-full !px-4 !py-2 text-xs">
                        Publish
                      </AnimatedButton>
                    ) : null}
                    {book.status === "published" ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-300/75"><Check className="h-4 w-4" /> Live</span>
                    ) : null}
                  </div>
                </div>
              </GlowBorderCard>
            );
          })}
        </div>
      </section>

      {active ? (
        <section className="grid gap-10 xl:grid-cols-[.76fr_1.24fr]">
          <div>
            <div className="border-b book-rule pb-7">
              <p className="book-kicker">Active production</p>
              <h2 className="book-display mt-4 text-5xl leading-none">{active.title}</h2>
              <div className="mt-7 flex items-end gap-2">
                <span className="text-5xl font-light"><AnimatedNumber value={active.progress_percent} /></span>
                <span className="pb-1 text-sm text-white/35">% complete</span>
              </div>
            </div>

            <div className="mt-6"><HighlightGrid rows={gridRows} /></div>

            <div className="mt-8 border-t book-rule">
              {snapshot.activeUnits.map((unit) => (
                <UnitRow key={unit.id} unit={unit} current={next?.id === unit.id} />
              ))}
            </div>
          </div>

          <GlowBorderCard width="100%" height="auto" aspectRatio="auto" colorPreset="sunset" className="!bg-[#0c0a09] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5 border-b book-rule pb-7">
              <div>
                <p className="book-kicker">Smallest missing unit</p>
                <h3 className="book-display mt-3 text-4xl leading-none">{next ? next.title_hint || unitLabel(next) : "All units complete"}</h3>
                {next ? (
                  <p className="mt-3 text-xs leading-6 text-white/42">
                    {next.status.replace("_", " ")} · minimum {next.min_word_count.toLocaleString()} server-counted words
                  </p>
                ) : null}
              </div>
              {next ? <span className="book-index text-[10px] text-white/28">{next.unit_key}</span> : null}
            </div>

            {next ? (
              <div>
                <section className="grid gap-5 border-b book-rule py-8 md:grid-cols-[8rem_1fr_auto] md:items-center">
                  <div>
                    <span className="book-index text-[10px] text-white/26">ACTION 01</span>
                    <p className="mt-2 text-xs text-white/54">System → ChatGPT</p>
                  </div>
                  <p className="text-sm leading-7 text-white/52">
                    Copy the exact packet for this unit. Partial units include their existing valid content and unresolved gaps.
                  </p>
                  <div className="flex items-center gap-3">
                    <Clipboard className="h-4 w-4 text-white/28" />
                    <GenerateButton hue={24} isGenerating={busy} disabled={busy} onClick={copyPacket} aria-label="Copy Work Packet" />
                  </div>
                </section>

                <section className="py-8">
                  <div className="mb-5 grid gap-4 md:grid-cols-[8rem_1fr]">
                    <div>
                      <span className="book-index text-[10px] text-white/26">ACTION 02</span>
                      <p className="mt-2 text-xs text-white/54">ChatGPT → System</p>
                    </div>
                    <p className="text-sm leading-7 text-white/52">
                      Paste one JSON object. The server validates shape and thresholds, recounts the words, and updates this same production unit.
                    </p>
                  </div>

                  <textarea
                    value={payload}
                    onChange={(event) => setPayload(event.target.value)}
                    spellCheck={false}
                    placeholder={'Paste ChatGPT JSON here…\n{ "chapter_number": 1, ... }'}
                    className="min-h-[340px] w-full resize-y border border-white/10 bg-black/30 p-5 font-mono text-xs leading-6 text-white/72 outline-none transition-colors focus:border-[#d39a76]/60"
                  />

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
                    <p className="max-w-xl text-[11px] leading-5 text-white/30">
                      AI-supplied word counts are ignored. Parseable incomplete submissions are saved as partial and become the next repair packet.
                    </p>
                    <AnimatedButton disabled={busy || !payload.trim()} onClick={validate} className="!rounded-full !px-5 !py-2.5 text-xs">
                      <Send className="mr-2 h-4 w-4" /> Paste &amp; Validate
                    </AnimatedButton>
                  </div>
                </section>
              </div>
            ) : (
              <div className="py-16 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-[#d39a76]" />
                <p className="book-display mt-4 text-3xl">Every unit passed.</p>
                <p className="mt-3 text-sm text-white/40">Publish the completed volume above to unlock the next title.</p>
              </div>
            )}

            {result ? <ResultPanel result={result} /> : null}
          </GlowBorderCard>
        </section>
      ) : (
        <GlowBorderCard width="100%" height="auto" aspectRatio="auto" colorPreset="custom" paused className="!bg-[#0c0a09] p-8 md:p-12">
          <div className="max-w-3xl">
            <p className="book-kicker">Production state</p>
            <h2 className="book-display mt-4 text-5xl leading-[.9]">
              {snapshot.books.some((book) => book.status === "complete")
                ? "A finished volume is waiting to be published."
                : snapshot.books.every((book) => book.status === "published")
                  ? "The founding shelf is published."
                  : "Start the first unlocked volume."}
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/45">Only one volume can be in production. The next remains locked until the previous one is explicitly published.</p>
            {result ? <ResultPanel result={result} /> : null}
          </div>
        </GlowBorderCard>
      )}
    </div>
  );
}

function UnitRow({ unit, current }: { unit: UnitRecord; current: boolean }) {
  return (
    <div className={`grid gap-3 border-b book-rule py-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center ${current ? "text-[#e3b394]" : "text-white/56"}`}>
      <span className="text-xs">{compactUnitLabel(unit)}</span>
      <div>
        <p className="text-xs">{unit.title_hint || unit.unit_key}</p>
        {unit.status === "partial" ? (
          <p className="mt-1 text-[10px] text-amber-200/55">{unit.validation_errors.length} gap{unit.validation_errors.length === 1 ? "" : "s"} · {unit.computed_word_count}/{unit.min_word_count} words</p>
        ) : null}
      </div>
      <span className="book-index text-[9px] text-white/28">{unit.status.replace("_", " ")}</span>
    </div>
  );
}

function ResultPanel({ result }: { result: ActionResult }) {
  return (
    <div className={`mt-6 border-t pt-5 text-xs leading-6 ${result.type === "success" ? "border-emerald-300/20 text-emerald-100/70" : "border-amber-300/20 text-amber-100/70"}`}>
      {result.type === "error" && result.issues?.length ? (
        <ul className="list-disc space-y-1 pl-5">
          {result.issues.map((issue, index) => (
            <li key={`${issue.code}-${issue.path}-${index}`}>
              <span className="font-mono text-[10px] opacity-60">{issue.path || issue.code}</span> — {issue.message}
            </li>
          ))}
        </ul>
      ) : <p>{result.message}</p>}
    </div>
  );
}
