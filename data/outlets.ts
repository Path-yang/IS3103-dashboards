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
  return SINGAPORE_LOCATIONS.map((location, idx) => {
    const isAbnormal = Math.random() > 0.92; // ~8% abnormal (0-1 outlets usually)
    const lastTempC = isAbnormal ? 4.5 + Math.random() * 3 : 1.5 + Math.random() * 2;
    const lastHeartbeatISO = new Date(
      Date.now() - Math.random() * 3600000
    ).toISOString();

    return {
      id: `outlet-${idx + 1}`,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      lastTempC: Math.round(lastTempC * 10) / 10,
      lastHeartbeatISO,
      status: lastTempC > 4 ? "red" : "green",
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
