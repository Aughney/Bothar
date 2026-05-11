import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { seatRequests, rides } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { sendSeatRequestEmail } from "@/app/lib/email";

export async function GET(req: NextRequest) {
  const rideId = req.nextUrl.searchParams.get("rideId");
  const passengerWallet = req.nextUrl.searchParams.get("passengerWallet");

  if (!rideId && !passengerWallet) {
    return NextResponse.json({ error: "rideId or passengerWallet required" }, { status: 400 });
  }
  try {
    const rows = await getDb()
      .select()
      .from(seatRequests)
      .where(
        rideId
          ? eq(seatRequests.rideId, rideId)
          : eq(seatRequests.passengerWallet, passengerWallet!)
      );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/seat-requests", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rideId, passengerWallet, passengerEmail, driverEmail, message } = body;

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
      .values({ rideId, passengerWallet, passengerEmail: passengerEmail ?? "", message: message ?? "" })
      .returning();

    // Email the driver if we have their address
    if (driverEmail) {
      const [ride] = await getDb().select().from(rides).where(eq(rides.id, rideId));
      if (ride) {
        await sendSeatRequestEmail({
          driverEmail,
          passengerEmail: passengerEmail ?? passengerWallet,
          rideFrom: ride.from,
          rideTo: ride.to,
          rideDate: ride.date,
          rideTime: ride.time,
          message,
        }).catch((err) => console.error("seat request email failed", err));
      }
    }

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/seat-requests", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
