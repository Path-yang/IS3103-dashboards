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

  switch (window) {
    case "24h":
      intervals = 24;
      intervalMs = 3600000; // 1 hour
      break;
    case "7d":
      intervals = 7;
      intervalMs = 86400000; // 1 day
      break;
    case "30d":
      intervals = 30;
      intervalMs = 86400000; // 1 day
      break;
  }

  for (let i = intervals - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * intervalMs).toISOString();
    const abnormalCount = Math.floor(Math.random() * 8) + 2; // 2-10 alerts

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
    abnormalCount: Math.floor(Math.random() * 25) + 5, // 5-30 alerts
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
