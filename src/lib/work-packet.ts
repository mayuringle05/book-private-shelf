import { getActiveProductionTarget, getBookUnits } from "@/lib/repository";

function shortSentence(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return (match?.[0] ?? trimmed).slice(0, 260).trim();
}

export async function buildNextWorkPacket() {
  const target = await getActiveProductionTarget();
  if (!target) throw new Error("No book is currently in production.");
  if (!target.unit) throw new Error("The active book has no incomplete units.");
  const units = await getBookUnits(target.book.id);
  const prior = units.filter((unit) => unit.sequence < target.unit!.sequence && unit.status === "complete");
  const summaryParts = prior.flatMap((unit) => [shortSentence(unit.content?.summary), shortSentence(unit.content?.closing_note), shortSentence(unit.content?.opening_note)]).filter((x): x is string => Boolean(x)).slice(-3);
  return {
    task: target.unit.status === "partial" ? "repair_unit_gaps" : target.unit.unit_type === "chapter" ? "generate_chapter_content" : `generate_${target.unit.unit_type}`,
    book: { id:target.book.id,title:target.book.title,positioning:target.book.positioning,voice_guide:target.book.voice_guide,target_reader:target.book.target_reader },
    already_complete_summary: summaryParts.length ? summaryParts.join(" ") : "No prior production unit is complete yet. Establish the book voice from the supplied positioning and voice guide.",
    target_unit: { type:target.unit.unit_type,key:target.unit.unit_key,number:target.unit.unit_number,title_hint:target.unit.title_hint,required_fields:target.unit.required_fields,min_word_count:target.unit.min_word_count,current_status:target.unit.status,existing_partial_content:target.unit.status==="partial"?target.unit.content:null,validation_gaps:target.unit.status==="partial"?target.unit.validation_errors:[] },
    output_schema: target.unit.output_schema,
    instructions: "Return ONLY valid JSON matching output_schema exactly. No prose outside the JSON. Make every structural and creative decision yourself and do not ask clarifying questions. If existing_partial_content is provided, treat this as a repair task: preserve every valid field, change only what is needed to resolve validation_gaps, and return the complete repaired unit JSON. word_count is informational only: the server will recompute it and overwrite your value."
  };
}
