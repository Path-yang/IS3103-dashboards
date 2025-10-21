import type {
  ColdChainSummary,
  ColdChainTimeSeries,
  OutletAbnormalCount,
  TimeWindow,
} from "@/lib/types";
import { generateOutlets } from "./outlets";

function generateTimeSeries(window: TimeWindow): ColdChainTimeSeries[] {
  const series: ColdChainTimeSeries[] = [];
  const now = Date.now();

  let intervals: number;
  let intervalMs: number;
  let maxAbnormal: number;

  switch (window) {
    case "24h":
      intervals = 24;
      intervalMs = 3600000; // 1 hour
      maxAbnormal = 1; // 0-1 per hour
      break;
    case "7d":
      intervals = 7;
      intervalMs = 86400000; // 1 day
      maxAbnormal = 1; // 0-1 per day
      break;
    case "30d":
      intervals = 30;
      intervalMs = 86400000; // 1 day
      maxAbnormal = 2; // 0-2 per day
      break;
  }

  for (let i = intervals - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * intervalMs).toISOString();
    // Most times 0, occasionally 1-max
    const abnormalCount = Math.random() > 0.7 ? Math.floor(Math.random() * maxAbnormal) + 1 : 0;

    series.push({
      timestamp,
      abnormalCount,
    });
  }

  return series;
}

function generateOutletBreakdown(): OutletAbnormalCount[] {
  const outlets = generateOutlets();
  return outlets.map((outlet) => ({
    outletId: outlet.id,
    outletName: outlet.name,
    // Most outlets have 0-5 alerts, a few have more
    abnormalCount: Math.random() > 0.3 ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 8) + 3,
  }));
}

export function generateColdChainSummary(window: TimeWindow): ColdChainSummary {
  const timeseries = generateTimeSeries(window);
  const outletBreakdown = generateOutletBreakdown();

  const totalAlerts = timeseries.reduce((sum, item) => sum + item.abnormalCount, 0);

  return {
    totalAlerts,
    avgResponseTimeMinutes: Math.floor(Math.random() * 20) + 10, // 10-30 mins
    maxTempSpike: Math.round((6 + Math.random() * 4) * 10) / 10, // 6-10°C
    timeseries,
    outletBreakdown: outletBreakdown.sort((a, b) => b.abnormalCount - a.abnormalCount),
  };
}
