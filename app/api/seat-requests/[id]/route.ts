import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { seatRequests, rides } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { sendRequestDecisionEmail } from "@/app/lib/email";

const VALID_STATUSES = ["accepted", "declined", "completed", "disputed"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const [row] = await getDb()
      .update(seatRequests)
      .set({ status })
      .where(eq(seatRequests.id, id))
      .returning();

    // Only email the passenger on accept/decline decisions
    if (["accepted", "declined"].includes(status) && row?.passengerEmail) {
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
