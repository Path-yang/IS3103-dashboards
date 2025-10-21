import { NextRequest, NextResponse } from "next/server";
import { getCompetitorPins, getPopulationHeatBuckets, getMRTLines } from "@/data/geo";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const layer = searchParams.get("layer");

  if (layer === "competitors") {
    const competitors = getCompetitorPins();
    return NextResponse.json(competitors);
  } else if (layer === "population") {
    const population = getPopulationHeatBuckets();
    return NextResponse.json(population);
  } else if (layer === "transport") {
    const transport = getMRTLines();
    return NextResponse.json(transport);
  }

  return NextResponse.json({ error: "Invalid layer" }, { status: 400 });
}

