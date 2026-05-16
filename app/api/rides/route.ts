import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { rides } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { PrivyAuthError, requirePrivyUserId } from "@/app/lib/privy-auth";

export async function GET(req: NextRequest) {
  try {
    const driverWallet = requirePrivyUserId(req);
    const rows = await getDb()
      .select()
      .from(rides)
      .where(eq(rides.driverWallet, driverWallet))
      .orderBy(rides.createdAt);
    return NextResponse.json(rows);
  } catch (err) {
    if (err instanceof PrivyAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("GET /api/rides", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const driverWallet = requirePrivyUserId(req);
    const body = await req.json();
    const { from, to, date, time, seats, note } = body;

    if (!from || !to || !date || !time) {
      return NextResponse.json(
        { error: "missing required fields" },
        { status: 400 },
      );
    }

    const [row] = await getDb()
      .insert(rides)
      .values({
        driverWallet,
        from,
        to,
        date,
        time,
        seats: Number(seats) || 1,
        note: note ?? "",
      })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    if (err instanceof PrivyAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/rides", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
