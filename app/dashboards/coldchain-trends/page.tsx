"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KPIStat } from "@/components/shared/kpi-stat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ColdChainSummary, TimeWindow } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

export default function ColdChainTrendsPage() {
  const [window, setWindow] = useState<TimeWindow>("24h");
  const [data, setData] = useState<ColdChainSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/coldchain/summary?window=${window}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [window]);

  if (loading || !data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  const timeseriesData = data.timeseries.map((item) => ({
    time: formatShortDate(item.timestamp),
    count: item.abnormalCount,
  }));

  const outletData = data.outletBreakdown.slice(0, 10).map((item) => ({
    name: item.outletName,
    count: item.abnormalCount,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Cold-Chain Trends & Alerts"
        description="Abnormal temperature readings and outlet performance analysis"
      />

      <Tabs value={window} onValueChange={(v) => setWindow(v as TimeWindow)} className="mb-6">
        <TabsList>
          <TabsTrigger value="24h">Last 24 Hours</TabsTrigger>
          <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
        </TabsList>

        <TabsContent value={window} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPIStat
              label="Total Alerts"
              value={data.totalAlerts}
              icon={AlertTriangle}
              variant="danger"
            />
            <KPIStat
              label="Avg Response Time"
              value={`${data.avgResponseTimeMinutes} min`}
              icon={Clock}
            />
            <KPIStat
              label="Max Temp Spike"
              value={`${data.maxTempSpike}°C`}
              icon={TrendingUp}
              variant="warning"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Abnormal Reading Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeseriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Abnormal Readings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 Outlets by Abnormal Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={outletData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#f59e0b" name="Abnormal Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
