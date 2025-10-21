import { NextResponse } from "next/server";
import { generateTempReadings24h } from "@/data/outlets";

export async function GET() {
  const readings = generateTempReadings24h();
  return NextResponse.json(readings);
}
