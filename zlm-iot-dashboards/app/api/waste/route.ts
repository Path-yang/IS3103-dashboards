import { NextResponse } from "next/server";
import { generateWasteData } from "@/data/waste";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ingredientIds = searchParams.get("ingredientIds")?.split(",").filter(Boolean);
  const reason = searchParams.get("reason") || undefined;
  const window = searchParams.get("window") || "30d";

  const wasteData = generateWasteData(ingredientIds, reason, window);
  return NextResponse.json(wasteData);
}
