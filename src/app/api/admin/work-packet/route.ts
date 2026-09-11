import { NextResponse } from "next/server";
import { buildNextWorkPacket } from "@/lib/work-packet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await buildNextWorkPacket(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to build work packet." }, { status: 409 });
  }
}
