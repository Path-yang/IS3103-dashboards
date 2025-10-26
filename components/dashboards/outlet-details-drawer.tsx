"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TempTrendSparkline } from "@/components/shared/temp-trend-sparkline";
import { generateOutletTempTrendWithStatus } from "@/data/outlets";
import type { Outlet, TempReading } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface OutletDetailsDrawerProps {
  outlet: Outlet | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OutletDetailsDrawer({ outlet, isOpen, onClose }: OutletDetailsDrawerProps) {
  const [tempHistory, setTempHistory] = useState<TempReading[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (outlet && isOpen) {
      setLoading(true);
      fetch(`/api/outlets/${outlet.id}/temp-history`)
        .then((res) => res.json())
        .then((data) => {
          setTempHistory(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [outlet, isOpen]);

  if (!isOpen || !outlet) return null;

  const tempData = generateOutletTempTrendWithStatus(outlet.id, outlet.status === "red");

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 shadow-xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{outlet.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">Outlet ID: {outlet.id}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Current Temperature
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold">{outlet.lastTempC}°C</span>
                <Badge variant={outlet.status === "green" ? "success" : "destructive"}>
                  {outlet.status === "green" ? "Normal" : "Abnormal"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Last Heartbeat
              </h3>
              <p className="text-sm">{formatDate(outlet.lastHeartbeatISO)}</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Location
              </h3>
              <p className="text-sm">
                Lat: {outlet.lat.toFixed(4)}, Lng: {outlet.lng.toFixed(4)}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                24-Hour Temperature Trend
              </h3>
              {loading ? (
                <div className="h-40 bg-muted animate-pulse rounded" />
              ) : (
                <div className="h-40 border rounded-lg p-4">
                  <TempTrendSparkline data={tempData.trendData} />
                </div>
              )}
            </div>

            {tempHistory.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Temperature Statistics (24h)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Min</p>
                    <p className="text-lg font-semibold">
                      {Math.min(...tempHistory.map((r) => r.tempC)).toFixed(1)}°C
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Avg</p>
                    <p className="text-lg font-semibold">
                      {(
                        tempHistory.reduce((sum, r) => sum + r.tempC, 0) / tempHistory.length
                      ).toFixed(1)}
                      °C
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Max</p>
                    <p className="text-lg font-semibold">
                      {Math.max(...tempHistory.map((r) => r.tempC)).toFixed(1)}°C
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
