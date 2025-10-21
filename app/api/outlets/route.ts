import { NextResponse } from "next/server";
import { generateOutlets } from "@/data/outlets";

export async function GET() {
  const outlets = generateOutlets();
  return NextResponse.json(outlets);
}
