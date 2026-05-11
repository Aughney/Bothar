import { NextResponse } from "next/server";
import { getDb } from "@/app/db";
import { rides } from "@/app/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await getDb().select().from(rides).orderBy(desc(rides.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/rides/all", err);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
