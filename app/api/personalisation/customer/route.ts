import { NextRequest, NextResponse } from "next/server";
import { generateCustomers } from "@/data/customers";
import { generateOrders } from "@/data/orders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const customerId = searchParams.get("id");

  if (!customerId) {
    return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
  }

  const customers = generateCustomers();
  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  // Get customer's order history for category breakdown
  const allOrders = generateOrders();
  const customerOrders = allOrders.filter((order) => order.customerId === customerId);

  // Calculate category counts
  const categoryCounts: Record<string, number> = {
    protein: 0,
    veg: 0,
    noodles: 0,
    addons: 0,
  };

  customerOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (categoryCounts[item.category] !== undefined) {
        categoryCounts[item.category] += item.qty;
      }
    });
  });

  const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count,
  }));

  return NextResponse.json({
    profile: customer,
    orderHistory: categoryData,
    totalOrders: customerOrders.length,
  });
}

