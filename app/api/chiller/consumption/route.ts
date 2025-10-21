import { NextResponse } from "next/server";
import { generateConsumption } from "@/data/chiller";
import type { ConsumptionWindow } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const outletId = searchParams.get("outletId") || "outlet-1";
  const window = (searchParams.get("window") || "daily") as ConsumptionWindow;

  const consumption = generateConsumption(outletId, window);
  return NextResponse.json(consumption);
}
