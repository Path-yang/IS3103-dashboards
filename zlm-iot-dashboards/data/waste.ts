import type { WasteRecord, WasteResponse } from "@/lib/types";
import { INGREDIENTS } from "./ingredients";
import { generateOutlets } from "./outlets";

const DISPOSAL_REASONS = ["expiry", "leftover_display", "quality"] as const;

export function generateWasteData(
  ingredientIds?: string[],
  reason?: string,
  window = "30d"
): WasteResponse {
  const outlets = generateOutlets();
  const records: WasteRecord[] = [];

  const daysBack = window === "7d" ? 7 : window === "30d" ? 30 : 7;
  const now = Date.now();

  // Generate 50-100 waste records
  const recordCount = Math.floor(Math.random() * 50) + 50;

  for (let i = 0; i < recordCount; i++) {
    const outlet = outlets[Math.floor(Math.random() * outlets.length)];
    const ingredient = INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)];
    const disposalReason =
      DISPOSAL_REASONS[Math.floor(Math.random() * DISPOSAL_REASONS.length)];

    const daysAgo = Math.floor(Math.random() * daysBack);
    const dateISO = new Date(now - daysAgo * 86400000).toISOString();

    const weightKg = Math.round((Math.random() * 3 + 0.5) * 10) / 10; // 0.5-3.5 kg

    records.push({
      id: `waste-${i + 1}`,
      dateISO,
      outletId: outlet.id,
      outletName: outlet.name,
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      disposalReason,
      weightKg,
    });
  }

  // Filter by ingredientIds if provided
  let filteredRecords = records;
  if (ingredientIds && ingredientIds.length > 0) {
    filteredRecords = filteredRecords.filter((r) => ingredientIds.includes(r.ingredientId));
  }

  // Filter by reason if provided
  if (reason && reason !== "all") {
    filteredRecords = filteredRecords.filter((r) => r.disposalReason === reason);
  }

  // Sort by date descending
  filteredRecords.sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );

  // Create timeseries aggregation by day
  const timeseriesMap: Record<string, number> = {};

  filteredRecords.forEach((record) => {
    const dateOnly = record.dateISO.split("T")[0];
    timeseriesMap[dateOnly] = (timeseriesMap[dateOnly] || 0) + record.weightKg;
  });

  const timeseries = Object.entries(timeseriesMap)
    .map(([dateISO, weightKg]) => ({
      dateISO: `${dateISO}T00:00:00.000Z`,
      weightKg: Math.round(weightKg * 10) / 10,
    }))
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());

  return {
    timeseries,
    records: filteredRecords,
  };
}
