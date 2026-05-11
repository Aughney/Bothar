import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { trips } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  try {
    const query = wallet
      ? getDb().select().from(trips).where(eq(trips.passengerWallet, wallet)).orderBy(desc(trips.createdAt))
      : getDb().select().from(trips).orderBy(desc(trips.createdAt));
    const rows = await query;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/trips", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passengerWallet, from, to, date, time, note } = body;

    if (!passengerWallet || !from || !to || !date || !time) {
      return NextResponse.json({ error: "missing required fields" }, { status: 400 });
    }

    const [row] = await getDb()
      .insert(trips)
      .values({ passengerWallet, from, to, date, time, note: note ?? "" })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("POST /api/trips", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
