import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { rides } from "@/app/db/schema";
import { and, eq } from "drizzle-orm";
import { PrivyAuthError, requirePrivyUserId } from "@/app/lib/privy-auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const driverWallet = requirePrivyUserId(req);
    const { id } = await params;
    await getDb()
      .delete(rides)
      .where(and(eq(rides.id, id), eq(rides.driverWallet, driverWallet)));
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof PrivyAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("DELETE /api/rides/[id]", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
