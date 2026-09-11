import { z } from "zod";
import type { UnitRecord, ValidationIssue } from "@/lib/types";
import { recomputeWordCount } from "@/lib/word-count";

const nonEmpty = z.string().trim().min(1);
const chapterSchema = z.object({ chapter_number:z.number().int().positive(), title:nonEmpty, hook:nonEmpty, sections:z.array(z.object({heading:nonEmpty,body:nonEmpty})).min(1), examples:z.array(nonEmpty).min(1), exercise:z.object({prompt:nonEmpty,reflection_questions:z.array(nonEmpty).min(1)}), summary:nonEmpty, word_count:z.number().int().nonnegative() }).strict();
const frontSchema = z.object({ title:nonEmpty, opening_note:nonEmpty, reader_promise:nonEmpty, how_to_use_this_book:nonEmpty, word_count:z.number().int().nonnegative() }).strict();
const backSchema = z.object({ title:nonEmpty, closing_note:nonEmpty, next_steps:z.array(nonEmpty).min(1), reflection_questions:z.array(nonEmpty).min(1), word_count:z.number().int().nonnegative() }).strict();

function schemaFor(unit: UnitRecord) { if (unit.unit_type === "chapter") return chapterSchema; if (unit.unit_type === "front_matter") return frontSchema; return backSchema; }
function isEmpty(value: unknown) { if (value == null) return true; if (typeof value === "string") return value.trim().length === 0; if (Array.isArray(value)) return value.length === 0; if (typeof value === "object") return Object.keys(value as object).length === 0; return false; }

export function inspectSubmission(unit: UnitRecord, input: unknown) {
  const issues: ValidationIssue[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) return { savable:false, complete:false, content:null, computedWordCount:0, issues:[{code:"invalid_json_shape",message:"Top-level JSON must be an object."}] } as const;
  const raw = { ...(input as Record<string, unknown>) };
  for (const field of unit.required_fields) if (!(field in raw) || isEmpty(raw[field])) issues.push({ code:"missing_required_field", path:field, message:`${field} is required and must be non-empty.` });
  const parsed = schemaFor(unit).safeParse(raw);
  if (!parsed.success) for (const error of parsed.error.issues) issues.push({ code:"schema_mismatch", path:error.path.join("."), message:error.message });
  if (unit.unit_type === "chapter" && unit.unit_number != null && raw.chapter_number !== unit.unit_number) issues.push({ code:"chapter_number_mismatch", path:"chapter_number", message:`chapter_number must be ${unit.unit_number}.` });
  const computedWordCount = recomputeWordCount(raw); raw.word_count = computedWordCount;
  if (computedWordCount < unit.min_word_count) issues.push({ code:"word_count_below_minimum", path:"word_count", message:`Server count is ${computedWordCount}; minimum is ${unit.min_word_count}.` });
  const deduped = Array.from(new Map(issues.map((issue) => [`${issue.code}:${issue.path ?? ""}:${issue.message}`, issue])).values());
  return { savable:true, complete:deduped.length === 0, content:raw, computedWordCount, issues:deduped } as const;
}
