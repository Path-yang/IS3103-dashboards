import { NextRequest, NextResponse } from "next/server";
import { generateOrders } from "@/data/orders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
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

  // Count orders by hour (10am - 11pm)
  const hourCounts: Record<number, number> = {};
  for (let h = 10; h <= 23; h++) {
    hourCounts[h] = 0;
  }

  filteredOrders.forEach((order) => {
    const hour = new Date(order.tsISO).getHours();
    if (hour >= 10 && hour <= 23) {
      hourCounts[hour]++;
    }
  });

  const data = Object.entries(hourCounts).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count,
  }));

  return NextResponse.json(data);
}

