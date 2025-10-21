import { NextResponse } from "next/server";
import { generateOutletPerformance } from "@/data/geo";

export const dynamic = "force-dynamic";

export async function GET() {
  const outlets = generateOutletPerformance();
  return NextResponse.json(outlets);
}

