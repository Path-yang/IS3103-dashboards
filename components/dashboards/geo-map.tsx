"use client";

import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { TinySparkline } from "@/components/shared/tiny-sparkline";
import type { OutletPerf } from "@/lib/types";
import "leaflet/dist/leaflet.css";

interface GeoMapProps {
  outlets: OutletPerf[];
  layers: string[];
}

export default function GeoMap({ outlets, layers: _layers }: GeoMapProps) {
  const getMarkerColor = (revenue: number) => {
    if (revenue > 120000) return "#22c55e"; // green
    if (revenue > 80000) return "#3b82f6"; // blue
    return "#f59e0b"; // orange
  };

  const getMarkerRadius = (revenue: number) => {
    const scale = revenue / 200000;
    return Math.max(10, Math.min(20, 10 + scale * 10));
  };

  // Center on Singapore
  const center: [number, number] = [1.35, 103.85];

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {outlets.map((outlet) => {
          const radius = getMarkerRadius(outlet.revenue);
          const color = getMarkerColor(outlet.revenue);

          return (
            <CircleMarker
              key={outlet.id}
              center={[outlet.lat, outlet.lng]}
              radius={radius}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.8,
                color: "#fff",
                weight: 3,
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-2">{outlet.name}</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-semibold">${outlet.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Footfall:</span>
                      <span className="font-semibold">{outlet.footfall.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AOV:</span>
                      <span className="font-semibold">${outlet.aov.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Satisfaction:</span>
                      <span className="font-semibold">{outlet.satisfaction}/5.0</span>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-gray-600 mb-1">7-Day Trend:</p>
                      <TinySparkline data={outlet.trendSeries.map((t) => ({ value: t.value }))} />
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
