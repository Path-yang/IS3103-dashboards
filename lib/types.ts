export type Outlet = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  lastTempC: number;
  lastHeartbeatISO: string;
  status: "green" | "red";
};

export type ChillerLevel = {
  ingredientId: string;
  name: string;
  fillPct: number;
  status: "OK" | "LOW";
  refillsToday: number;
};

export type ConsumptionBucket = {
  label: string;
  items: {
    ingredientId: string;
    name: string;
    weightKg: number;
  }[];
};

export type WasteRecord = {
  id: string;
  dateISO: string;
  outletId: string;
  outletName: string;
  ingredientId: string;
  ingredientName: string;
  disposalReason: "expiry" | "leftover_display" | "quality";
  weightKg: number;
};

export type TimeWindow = "24h" | "7d" | "30d";
export type ConsumptionWindow = "daily" | "weekly" | "monthly";

export type ColdChainTimeSeries = {
  timestamp: string;
  abnormalCount: number;
};

export type OutletAbnormalCount = {
  outletId: string;
  outletName: string;
  abnormalCount: number;
};

export type ColdChainSummary = {
  totalAlerts: number;
  avgResponseTimeMinutes: number;
  maxTempSpike: number;
  timeseries: ColdChainTimeSeries[];
  outletBreakdown: OutletAbnormalCount[];
};

export type TempReading = {
  timestamp: string;
  tempC: number;
};

export type ConsumptionResponse = {
  buckets: ConsumptionBucket[];
  topThree: {
    ingredientId: string;
    name: string;
    totalWeight: number;
  }[];
};

export type WasteResponse = {
  timeseries: {
    dateISO: string;
    weightKg: number;
  }[];
  records: WasteRecord[];
};
