"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TempTrendSparkline } from "@/components/shared/temp-trend-sparkline";
import { generateOutletTempTrend } from "@/data/outlets";
import type { Outlet } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface OutletFallbackListProps {
  outlets: Outlet[];
  onOutletClick: (outlet: Outlet) => void;
}

export function OutletFallbackList({ outlets, onOutletClick }: OutletFallbackListProps) {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">
          Map view is unavailable. Set MAPBOX_TOKEN environment variable to enable interactive map.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {outlets.map((outlet) => {
          const tempTrendData = generateOutletTempTrend(outlet.id, outlet.status === "red");

          return (
            <Card
              key={outlet.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onOutletClick(outlet)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{outlet.name}</CardTitle>
                  <Badge variant={outlet.status === "green" ? "success" : "destructive"}>
                    Current temperature: {outlet.lastTempC}°C
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    Last update: {formatDate(outlet.lastHeartbeatISO)}
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">24h Temperature Trend</p>
                    <TempTrendSparkline data={tempTrendData} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
