import type { ChillerLevel, ConsumptionBucket, ConsumptionResponse, ConsumptionWindow } from "@/lib/types";
import { INGREDIENTS } from "./ingredients";

export function generateChillerLevels(outletId: string): ChillerLevel[] {
  return INGREDIENTS.map((ingredient) => {
    const fillPct = Math.floor(Math.random() * 100);
    const status = fillPct < 30 ? "LOW" : "OK";
    const refillsToday = Math.floor(Math.random() * 8);

    return {
      ingredientId: ingredient.id,
      name: ingredient.name,
      fillPct,
      status,
      refillsToday,
    };
  });
}

export function generateConsumption(
  outletId: string,
  window: ConsumptionWindow
): ConsumptionResponse {
  let bucketCount: number;
  let labelFormat: (index: number) => string;

  const now = new Date();

  switch (window) {
    case "daily":
      bucketCount = 7; // Last 7 days
      labelFormat = (i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (bucketCount - 1 - i));
        return date.toLocaleDateString("en-SG", { month: "short", day: "numeric" });
      };
      break;
    case "weekly":
      bucketCount = 4; // Last 4 weeks
      labelFormat = (i) => `Week ${bucketCount - i}`;
      break;
    case "monthly":
      bucketCount = 6; // Last 6 months
      labelFormat = (i) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (bucketCount - 1 - i));
        return date.toLocaleDateString("en-SG", { month: "short", year: "numeric" });
      };
      break;
  }

  const buckets: ConsumptionBucket[] = [];
  const ingredientTotals: Record<string, number> = {};

  for (let i = 0; i < bucketCount; i++) {
    const items = INGREDIENTS.map((ingredient) => {
      const weightKg = Math.round((Math.random() * 15 + 5) * 10) / 10; // 5-20 kg
      ingredientTotals[ingredient.id] = (ingredientTotals[ingredient.id] || 0) + weightKg;

      return {
        ingredientId: ingredient.id,
        name: ingredient.name,
        weightKg,
      };
    });

    buckets.push({
      label: labelFormat(i),
      items,
    });
  }

  // Get top 3 ingredients
  const topThree = Object.entries(ingredientTotals)
    .map(([ingredientId, totalWeight]) => ({
      ingredientId,
      name: INGREDIENTS.find((i) => i.id === ingredientId)?.name ?? "Unknown",
      totalWeight: Math.round(totalWeight * 10) / 10,
    }))
    .sort((a, b) => b.totalWeight - a.totalWeight)
    .slice(0, 3);

  return {
    buckets,
    topThree,
  };
}
