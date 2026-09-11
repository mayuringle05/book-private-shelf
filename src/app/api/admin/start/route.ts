import { NextResponse } from "next/server";
import { z } from "zod";
import { startBookProduction } from "@/lib/repository";

export const runtime = "nodejs";
const inputSchema = z.object({ bookId: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const input = inputSchema.parse(await request.json());
    await startBookProduction(input.bookId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start production.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
