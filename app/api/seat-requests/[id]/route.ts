import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { seatRequests, rides } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { sendRequestDecisionEmail } from "@/app/lib/email";

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

    // Email the passenger using the stored email address
    if (row?.passengerEmail) {
      const [ride] = await getDb().select().from(rides).where(eq(rides.id, row.rideId));
      if (ride) {
        await sendRequestDecisionEmail({
          passengerEmail: row.passengerEmail,
          status: status as "accepted" | "declined",
          rideFrom: ride.from,
          rideTo: ride.to,
          rideDate: ride.date,
          rideTime: ride.time,
        }).catch((err) => console.error("decision email failed", err));
      }
    }

    return NextResponse.json(row);
  } catch (err) {
    console.error("PATCH /api/seat-requests/[id]", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
