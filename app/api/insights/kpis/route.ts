import { NextRequest, NextResponse } from "next/server";
import { generateOrders, getTopIngredients } from "@/data/orders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const window = searchParams.get("window") || "30d";
  const outletIds = searchParams.get("outletIds")?.split(",") || [];

  const allOrders = generateOrders();
  const now = Date.now();
  
  // Filter by time window
  let cutoffTime = now;
  if (window === "24h") cutoffTime = now - 86400000;
  else if (window === "7d") cutoffTime = now - 7 * 86400000;
  else cutoffTime = now - 30 * 86400000;

  let filteredOrders = allOrders.filter(
    (order) => new Date(order.tsISO).getTime() >= cutoffTime
  );

  // Filter by outlets if specified
  if (outletIds.length > 0) {
    filteredOrders = filteredOrders.filter((order) =>
      outletIds.includes(order.outletId)
    );
  }

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.spend, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate repeat customers
  const customerCounts: Record<string, number> = {};
  filteredOrders.forEach((order) => {
    customerCounts[order.customerId] = (customerCounts[order.customerId] || 0) + 1;
  });
  const repeatCustomers = Object.values(customerCounts).filter((count) => count > 1).length;
  const repeatCustomerPct = totalOrders > 0 
    ? (repeatCustomers / Object.keys(customerCounts).length) * 100 
    : 0;

  // Most popular ingredient
  const topIngredients = getTopIngredients(filteredOrders, 1);
  const mostPopular = topIngredients[0]?.name || "N/A";

  return NextResponse.json({
    totalOrders,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    repeatCustomerPct: Math.round(repeatCustomerPct * 10) / 10,
    mostPopularIngredient: mostPopular,
  });
}

