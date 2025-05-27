import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const allSites = await db.query.sites.findMany();
  if (!allSites) {
    return NextResponse.json({ message: "No sites found" }, { status: 404 });
  }
  return NextResponse.json(allSites);
}

export async function POST() {
  return NextResponse.json(
    { message: "Site created successfully" },
    { status: 201 }
  );
}
