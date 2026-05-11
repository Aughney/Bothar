import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { seatRequests } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rideId, passengerWallet, message } = body;

    if (!rideId || !passengerWallet) {
      return NextResponse.json({ error: "missing required fields" }, { status: 400 });
    }

    // Prevent duplicate requests from the same passenger for the same ride
    const existing = await getDb()
      .select()
      .from(seatRequests)
      .where(
        and(
          eq(seatRequests.rideId, rideId),
          eq(seatRequests.passengerWallet, passengerWallet)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json({ error: "already_requested" }, { status: 409 });
    }

    const [row] = await getDb()
      .insert(seatRequests)
      .values({ rideId, passengerWallet, message: message ?? "" })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/seat-requests", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
