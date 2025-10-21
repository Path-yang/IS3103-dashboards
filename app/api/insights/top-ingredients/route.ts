import { NextRequest, NextResponse } from "next/server";
import { generateOrders, getTopIngredients } from "@/data/orders";

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

  const topIngredients = getTopIngredients(filteredOrders, 10);

  return NextResponse.json(topIngredients);
}

