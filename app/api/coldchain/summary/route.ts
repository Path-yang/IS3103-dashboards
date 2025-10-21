import { NextResponse } from "next/server";
import { generateColdChainSummary } from "@/data/coldchain";
import type { TimeWindow } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const window = (searchParams.get("window") || "24h") as TimeWindow;

  const summary = generateColdChainSummary(window);
  return NextResponse.json(summary);
}
