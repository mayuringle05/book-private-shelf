import { NextResponse } from "next/server";
import { inspectSubmission } from "@/lib/content-schema";
import { getActiveProductionTarget, saveUnitValidation } from "@/lib/repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || typeof body.payload !== "string") {
      return NextResponse.json({ error: "payload must be a JSON string copied from ChatGPT." }, { status: 400 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(body.payload);
    } catch (error) {
      return NextResponse.json({
        ok: false,
        saved: false,
        complete: false,
        issues: [{ code: "invalid_json", message: `Invalid JSON: ${error instanceof Error ? error.message : "parse error"}` }],
      }, { status: 422 });
    }

    const target = await getActiveProductionTarget();
    if (!target?.unit) {
      return NextResponse.json({ error: "There is no incomplete unit in the active book." }, { status: 409 });
    }

    const inspection = inspectSubmission(target.unit, parsed);
    if (!inspection.savable || !inspection.content) {
      return NextResponse.json({ ok: false, saved: false, complete: false, issues: inspection.issues }, { status: 422 });
    }

    await saveUnitValidation({
      unit: target.unit,
      content: inspection.content,
      computedWordCount: inspection.computedWordCount,
      complete: inspection.complete,
      issues: inspection.issues,
    });

    return NextResponse.json({
      ok: inspection.complete,
      saved: true,
      complete: inspection.complete,
      unitKey: target.unit.unit_key,
      computedWordCount: inspection.computedWordCount,
      minimumWordCount: target.unit.min_word_count,
      issues: inspection.issues,
      message: inspection.complete
        ? `${target.unit.unit_key} passed validation and is complete.`
        : `${target.unit.unit_key} was saved as partial. The next work packet will target only this same unit and include these gaps.`,
    }, { status: inspection.complete ? 200 : 422 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Validation failed." }, { status: 500 });
  }
}
