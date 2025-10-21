"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { OutletSelect } from "@/components/shared/outlet-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ConsumptionResponse, ConsumptionWindow, Outlet } from "@/lib/types";
import { Trophy } from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#a855f7",
];

export default function ChillerConsumptionPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string>("");
  const [window, setWindow] = useState<ConsumptionWindow>("daily");
  const [chartType, setChartType] = useState<"stacked" | "grouped">("stacked");
  const [data, setData] = useState<ConsumptionResponse | null>(null);
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
    fetch(`/api/chiller/consumption?outletId=${selectedOutlet}&window=${window}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedOutlet, window]);

  if (loading || !data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  const chartData = data.buckets.map((bucket) => {
    const dataPoint: Record<string, string | number> = { label: bucket.label };
    bucket.items.forEach((item) => {
      dataPoint[item.name] = item.weightKg;
    });
    return dataPoint;
  });

  const ingredientNames = data.buckets[0]?.items.map((item) => item.name) || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Consumption Estimation (Weight Taken)"
        description="Track ingredient consumption patterns over time"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Outlet</label>
          <OutletSelect
            value={selectedOutlet}
            onValueChange={setSelectedOutlet}
            outlets={outlets}
          />
        </div>
        <div className="flex items-end">
          <Button
            variant={chartType === "stacked" ? "default" : "outline"}
            onClick={() => setChartType("stacked")}
            className="mr-2"
          >
            Stacked
          </Button>
          <Button
            variant={chartType === "grouped" ? "default" : "outline"}
            onClick={() => setChartType("grouped")}
          >
            Grouped
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top 3 Ingredients This Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {data.topThree.map((item, idx) => (
                <Badge key={item.ingredientId} variant="secondary" className="text-base py-2 px-4">
                  #{idx + 1} {item.name} - {item.totalWeight} kg
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={window} onValueChange={(v) => setWindow(v as ConsumptionWindow)}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value={window}>
          <Card>
            <CardHeader>
              <CardTitle>Consumption by Ingredient (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {ingredientNames.map((name, idx) => (
                    <Bar
                      key={name}
                      dataKey={name}
                      stackId={chartType === "stacked" ? "a" : undefined}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
