import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { seatRequests } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "status must be accepted or declined" }, { status: 400 });
    }

    const [row] = await getDb()
      .update(seatRequests)
      .set({ status })
      .where(eq(seatRequests.id, id))
      .returning();

    return NextResponse.json(row);
  } catch (err) {
    console.error("PATCH /api/seat-requests/[id]", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
