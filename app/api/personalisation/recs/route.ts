import { NextRequest, NextResponse } from "next/server";
import { getCustomerRecommendations } from "@/data/customers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const customerId = searchParams.get("id");

  if (!customerId) {
    return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
  }

  const recommendations = getCustomerRecommendations(customerId);

  return NextResponse.json(recommendations);
}

