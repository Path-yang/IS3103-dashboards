"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { OutletMapView } from "@/components/dashboards/outlet-map-view";
import { OutletFallbackList } from "@/components/dashboards/outlet-fallback-list";
import { OutletDetailsDrawer } from "@/components/dashboards/outlet-details-drawer";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import type { Outlet } from "@/lib/types";

export default function OutletMapPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/outlets")
      .then((res) => res.json())
      .then((data) => {
        setOutlets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleMarkerClick = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  const greenCount = outlets.filter((o) => o.status === "green").length;
  const redCount = outlets.filter((o) => o.status === "red").length;
  const hasMapbox = !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Outlet Cold-Chain Map"
        description="Real-time temperature monitoring across all outlet locations"
        showBackButton={true}
      />

      <div className="mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-sm">
                  Normal (≤4°C): <strong>{greenCount} outlets</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-sm">
                  Abnormal ({">"}4°C): <strong>{redCount} outlets</strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {hasMapbox ? (
        <OutletMapView outlets={outlets} onMarkerClick={handleMarkerClick} />
      ) : (
        <OutletFallbackList outlets={outlets} onOutletClick={handleMarkerClick} />
      )}

      <OutletDetailsDrawer
        outlet={selectedOutlet}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
