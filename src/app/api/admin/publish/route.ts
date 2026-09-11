import { NextResponse } from "next/server";
import { z } from "zod";
import { publishBook } from "@/lib/repository";

export const runtime = "nodejs";

const inputSchema = z.object({ bookId: z.string().min(1) });

export async function POST(request: Request) {
  try {
    const input = inputSchema.parse(await request.json());
    await publishBook(input.bookId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to publish book." }, { status: 409 });
  }
}
