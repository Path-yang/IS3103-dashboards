"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { OutletSelect } from "@/components/shared/outlet-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import type { ChillerLevel, Outlet } from "@/lib/types";

export default function ChillerLevelsPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string>("");
  const [levels, setLevels] = useState<ChillerLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/outlets")
      .then((res) => res.json())
      .then((data) => {
        setOutlets(data);
        if (data.length > 0) {
          setSelectedOutlet(data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedOutlet) return;

    setLoading(true);
    fetch(`/api/chiller/levels?outletId=${selectedOutlet}`)
      .then((res) => res.json())
      .then((data) => {
        setLevels(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedOutlet]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  const avgFillPct =
    levels.length > 0
      ? Math.round(levels.reduce((sum, l) => sum + l.fillPct, 0) / levels.length)
      : 0;
  const totalRefills = levels.reduce((sum, l) => sum + l.refillsToday, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Front Chiller Levels & Refill Frequency"
        description="Monitor ingredient tray fill levels and refill activities"
        showBackButton={true}
      />

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Select Outlet</label>
        <OutletSelect
          value={selectedOutlet}
          onValueChange={setSelectedOutlet}
          outlets={outlets}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {levels.map((level) => (
          <Card key={level.ingredientId} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{level.name}</CardTitle>
                <Badge variant={level.status === "OK" ? "success" : "warning"}>
                  {level.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Fill Level</span>
                    <span className="font-semibold">{level.fillPct}%</span>
                  </div>
                  <Progress value={level.fillPct} />
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">Refills Today</div>
                  <div className="text-2xl font-bold mt-1">{level.refillsToday}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-0 bg-background border-t shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Average Fill Level</div>
              <div className="text-3xl font-bold">{avgFillPct}%</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Refills Today</div>
              <div className="text-3xl font-bold">{totalRefills}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
