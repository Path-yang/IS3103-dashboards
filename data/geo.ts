import type { OutletPerf, CompetitorPin, PopulationHeatBucket } from "@/lib/types";
import { generateOutlets } from "./outlets";

export function generateOutletPerformance(): OutletPerf[] {
  const outlets = generateOutlets();
  
  return outlets.map((outlet) => {
    const revenue = 50000 + Math.random() * 150000; // $50k-$200k monthly
    const footfall = 1000 + Math.floor(Math.random() * 4000); // 1k-5k monthly
    const aov = revenue / footfall;
    const satisfaction = 3.5 + Math.random() * 1.5; // 3.5-5.0 rating
    
    // Generate 7-day trend
    const trendSeries = [];
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 86400000);
      const value = revenue / 30 + (Math.random() - 0.5) * (revenue / 60);
      trendSeries.push({
        tsISO: date.toISOString(),
        value: Math.round(value),
      });
    }

    return {
      id: outlet.id,
      name: outlet.name,
      lat: outlet.lat,
      lng: outlet.lng,
      revenue: Math.round(revenue),
      footfall,
      aov: Math.round(aov * 100) / 100,
      satisfaction: Math.round(satisfaction * 10) / 10,
      repeatRate: Math.round((30 + Math.random() * 40) * 10) / 10, // 30-70%
      competitorsNearby: Math.floor(Math.random() * 5),
      trendSeries,
    };
  });
}

export function getCompetitorPins(): CompetitorPin[] {
  // Mock competitor locations around Singapore
  return [
    { id: "comp-1", name: "Hot Pot Paradise", lat: 1.290, lng: 103.850, type: "hotpot" },
    { id: "comp-2", name: "Sichuan Express", lat: 1.305, lng: 103.840, type: "mala" },
    { id: "comp-3", name: "Spicy Bowl", lat: 1.340, lng: 103.710, type: "mala" },
    { id: "comp-4", name: "Dragon Pot", lat: 1.355, lng: 103.945, type: "hotpot" },
    { id: "comp-5", name: "Chili House", lat: 1.430, lng: 103.835, type: "mala" },
    { id: "comp-6", name: "Fire Pot", lat: 1.265, lng: 103.820, type: "hotpot" },
    { id: "comp-7", name: "Mala King", lat: 1.320, lng: 103.890, type: "mala" },
    { id: "comp-8", name: "Spice Street", lat: 1.345, lng: 103.945, type: "mala" },
  ];
}

export function getPopulationHeatBuckets(): PopulationHeatBucket[] {
  // Mock population density zones
  return [
    { lat: 1.290, lng: 103.850, intensity: 0.9, radius: 1000 }, // Orchard high density
    { lat: 1.280, lng: 103.845, intensity: 0.8, radius: 800 },  // Chinatown
    { lat: 1.340, lng: 103.710, intensity: 0.85, radius: 1200 }, // Jurong
    { lat: 1.355, lng: 103.945, intensity: 0.9, radius: 1000 }, // Tampines
    { lat: 1.300, lng: 103.855, intensity: 0.95, radius: 800 },  // Marina Bay
    { lat: 1.430, lng: 103.835, intensity: 0.75, radius: 1000 }, // Yishun
    { lat: 1.335, lng: 103.745, intensity: 0.7, radius: 900 },   // Clementi
  ];
}

export function getMRTLines() {
  // Simplified MRT stations for display
  return [
    { name: "Orchard", lat: 1.304, lng: 103.832 },
    { name: "City Hall", lat: 1.293, lng: 103.852 },
    { name: "Raffles Place", lat: 1.284, lng: 103.851 },
    { name: "Jurong East", lat: 1.333, lng: 103.742 },
    { name: "Tampines", lat: 1.353, lng: 103.945 },
    { name: "Yishun", lat: 1.429, lng: 103.835 },
    { name: "Ang Mo Kio", lat: 1.370, lng: 103.849 },
  ];
}

