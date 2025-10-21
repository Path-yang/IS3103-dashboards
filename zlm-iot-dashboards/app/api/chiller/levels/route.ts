import { NextResponse } from "next/server";
import { generateChillerLevels } from "@/data/chiller";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const outletId = searchParams.get("outletId") || "outlet-1";

  const levels = generateChillerLevels(outletId);
  return NextResponse.json(levels);
}
