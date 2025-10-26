import type { Outlet, TempReading } from "@/lib/types";

const SINGAPORE_LOCATIONS = [
  { name: "Chinatown Point", lat: 1.2838, lng: 103.8437 },
  { name: "Jurong Point", lat: 1.3399, lng: 103.7063 },
  { name: "Tampines Mall", lat: 1.3527, lng: 103.9445 },
  { name: "Bugis Junction", lat: 1.2991, lng: 103.8553 },
  { name: "Marina Square", lat: 1.2915, lng: 103.8572 },
  { name: "Orchard Central", lat: 1.3009, lng: 103.8396 },
  { name: "Northpoint City", lat: 1.4293, lng: 103.8356 },
  { name: "Westgate", lat: 1.3341, lng: 103.7431 },
  { name: "Vivo City", lat: 1.2645, lng: 103.8219 },
  { name: "Paya Lebar Square", lat: 1.3184, lng: 103.8926 },
  { name: "Century Square", lat: 1.3445, lng: 103.9443 },
  { name: "Hougang Mall", lat: 1.3713, lng: 103.8926 },
];

export function generateOutlets(): Outlet[] {
  // Randomly select exactly one outlet to be currently abnormal
  const abnormalOutletIndex = Math.floor(Math.random() * SINGAPORE_LOCATIONS.length);

  return SINGAPORE_LOCATIONS.map((location, idx) => {
    const isCurrentlyAbnormal = idx === abnormalOutletIndex;
    const tempData = generateOutletTempTrendWithStatus(`outlet-${idx + 1}`, isCurrentlyAbnormal);
    const lastHeartbeatISO = new Date(
      Date.now() - Math.random() * 3600000
    ).toISOString();

    return {
      id: `outlet-${idx + 1}`,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      lastTempC: tempData.currentTemp,
      lastHeartbeatISO,
      status: tempData.currentStatus,
    };
  });
}

export function generateTempReadings24h(): TempReading[] {
  const readings: TempReading[] = [];
  const now = Date.now();
  const hoursBack = 24;

  for (let i = hoursBack; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000).toISOString();
    const baseTemp = 2.5;
    const variation = Math.random() * 3 - 1; // -1 to +2
    const tempC = Math.max(0, baseTemp + variation);

    readings.push({
      timestamp,
      tempC: Math.round(tempC * 10) / 10,
    });
  }

  return readings;
}

export function generateOutletTempTrend(outletId: string, isCurrentlyAbnormal: boolean): { value: number; isAbnormal: boolean }[] {
  const data = [];
  const baseTemp = 2.5;
  const threshold = 4.0;
  
  // Generate 24 hours of data with reduced fluctuation
  for (let i = 0; i < 24; i++) {
    // Reduced variation for less dramatic fluctuation
    const variation = (Math.random() - 0.5) * 1.5; // -0.75 to +0.75 (was -0.5 to +1.5)
    let temp = baseTemp + variation;
    
    // For currently abnormal outlets, make the last few readings abnormal (at peaks)
    if (isCurrentlyAbnormal && i >= 20) {
      temp = threshold + Math.random() * 2; // 4.0-6.0°C
    }
    
    // For normal outlets, add 1-2 historical anomalies only at peaks
    if (!isCurrentlyAbnormal && Math.random() < 0.1) { // Reduced from 15% to 10%
      // Only create anomalies that exceed threshold (at peaks)
      temp = threshold + Math.random() * 1.5; // 4.0-5.5°C
    }
    
    data.push({
      value: Math.round(Math.max(0, temp) * 10) / 10,
      isAbnormal: temp > threshold,
    });
  }
  
  return data;
}

export function generateOutletTempTrendWithStatus(outletId: string, isCurrentlyAbnormal: boolean): { 
  trendData: { value: number; isAbnormal: boolean }[]; 
  currentTemp: number; 
  currentStatus: "green" | "red" 
} {
  const trendData = generateOutletTempTrend(outletId, isCurrentlyAbnormal);
  
  // Get the last (most recent) temperature reading
  const lastReading = trendData[trendData.length - 1];
  const currentTemp = lastReading.value;
  const currentStatus = lastReading.isAbnormal ? "red" : "green";
  
  return {
    trendData,
    currentTemp,
    currentStatus,
  };
}
