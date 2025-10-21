"use client";

import React, { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { MapPin } from "lucide-react";
import type { Outlet } from "@/lib/types";
import "mapbox-gl/dist/mapbox-gl.css";

interface OutletMapViewProps {
  outlets: Outlet[];
  onMarkerClick: (outlet: Outlet) => void;
}

export function OutletMapView({ outlets, onMarkerClick }: OutletMapViewProps) {
  const [viewState, setViewState] = useState({
    longitude: 103.8198,
    latitude: 1.3521,
    zoom: 10,
  });

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return null;
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
      >
        <NavigationControl position="top-right" />

        {outlets.map((outlet) => (
          <Marker
            key={outlet.id}
            longitude={outlet.lng}
            latitude={outlet.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onMarkerClick(outlet);
            }}
          >
            <div className="cursor-pointer transform transition-transform hover:scale-110">
              <MapPin
                className={`h-8 w-8 ${
                  outlet.status === "green"
                    ? "text-green-600 fill-green-200"
                    : "text-red-600 fill-red-200"
                }`}
              />
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
