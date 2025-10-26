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

  // Generate more realistic pattern - most hours/days have 0, occasional spikes
  for (let i = intervals - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * intervalMs).toISOString();
    
    // 85% chance of 0, 10% chance of 1, 5% chance of 2
    let abnormalCount = 0;
    const rand = Math.random();
    if (rand < 0.85) {
      abnormalCount = 0;
    } else if (rand < 0.95) {
      abnormalCount = 1;
    } else {
      abnormalCount = 2;
    }

    series.push({
      timestamp,
      abnormalCount,
    });
  }

  return series;
}

function generateOutletBreakdown(): OutletAbnormalCount[] {
  const outlets = generateOutlets();
  
  // Generate abnormal counts with realistic distribution
  const abnormalCounts: number[] = outlets.map((outlet, index) => {
    // Most outlets (80%) have 0-1 abnormal readings
    if (Math.random() < 0.8) {
      return Math.random() < 0.7 ? 0 : 1;
    }
    // Some outlets (15%) have 2 abnormal readings
    else if (Math.random() < 0.15) {
      return 2;
    }
    // Top outlet (5%) has 3 abnormal readings
    else {
      return 3;
    }
  });
  
  // Ensure the top outlet has exactly 3 abnormal readings
  const maxIndex = abnormalCounts.indexOf(Math.max(...abnormalCounts));
  abnormalCounts[maxIndex] = 3;
  
  return outlets.map((outlet, index) => ({
    outletId: outlet.id,
    outletName: outlet.name,
    abnormalCount: abnormalCounts[index],
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
