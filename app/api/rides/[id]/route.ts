import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { rides } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await getDb().delete(rides).where(eq(rides.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/rides/[id]", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
