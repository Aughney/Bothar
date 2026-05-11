import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { rides } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) {
    return NextResponse.json({ error: "wallet required" }, { status: 400 });
  }
  try {
    const rows = await getDb()
      .select()
      .from(rides)
      .where(eq(rides.driverWallet, wallet))
      .orderBy(rides.createdAt);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/rides", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { driverWallet, driverEmail, from, to, date, time, seats, note } = body;

    if (!driverWallet || !from || !to || !date || !time) {
      return NextResponse.json({ error: "missing required fields" }, { status: 400 });
    }

    const [row] = await getDb()
      .insert(rides)
      .values({ driverWallet, driverEmail: driverEmail ?? "", from, to, date, time, seats: Number(seats) || 1, note: note ?? "" })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/rides", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
