"use client";

import React from "react";
import type { OutletPerf } from "@/lib/types";

interface GeoMapProps {
  outlets: OutletPerf[];
  layers: string[];
}

// Map component disabled for now - requires MAPBOX_TOKEN configuration
// The geospatial dashboard will use the fallback table view
export default function GeoMap({ outlets: _outlets, layers: _layers }: GeoMapProps) {
  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
      <p className="text-muted-foreground">Map view requires MAPBOX_TOKEN environment variable</p>
    </div>
  );
}

