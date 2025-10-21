import { NextRequest, NextResponse } from "next/server";
import { generateOrders } from "@/data/orders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dimension = searchParams.get("dimension") || "soup";
  const window = searchParams.get("window") || "30d";
  const outletIds = searchParams.get("outletIds")?.split(",") || [];

  const allOrders = generateOrders();
  const now = Date.now();
  
  let cutoffTime = now;
  if (window === "24h") cutoffTime = now - 86400000;
  else if (window === "7d") cutoffTime = now - 7 * 86400000;
  else cutoffTime = now - 30 * 86400000;

  let filteredOrders = allOrders.filter(
    (order) => new Date(order.tsISO).getTime() >= cutoffTime
  );

  if (outletIds.length > 0) {
    filteredOrders = filteredOrders.filter((order) =>
      outletIds.includes(order.outletId)
    );
  }

  if (dimension === "soup") {
    // Count soup base distribution
    const soupCounts: Record<string, number> = {};
    filteredOrders.forEach((order) => {
      soupCounts[order.soupBase] = (soupCounts[order.soupBase] || 0) + 1;
    });

    const data = Object.entries(soupCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json(data);
  } else if (dimension === "spice") {
    // Count spice level distribution
    const spiceCounts: Record<string, number> = {};
    filteredOrders.forEach((order) => {
      spiceCounts[order.spiceLevel] = (spiceCounts[order.spiceLevel] || 0) + 1;
    });

    const data = Object.entries(spiceCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json(data);
  }

  return NextResponse.json([]);
}

