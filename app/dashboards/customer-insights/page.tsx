"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { KPIStat } from "@/components/shared/kpi-stat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, DollarSign, Users, Star } from "lucide-react";
import type { TimeWindow } from "@/lib/types";
import { generateOutlets } from "@/data/outlets";
import { generateOrders } from "@/data/orders";
import { formatShortDate } from "@/lib/utils";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

export default function CustomerInsightsPage() {
  const [window, setWindow] = useState<TimeWindow>("30d");
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);
  const [kpis, setKpis] = useState<{
    totalOrders: number;
    avgOrderValue: number;
    repeatCustomerPct: number;
    mostPopularIngredient: string;
  } | null>(null);
  const [topIngredients, setTopIngredients] = useState<{ ingredientId: string; name: string; count: number }[]>([]);
  const [ordersByHour, setOrdersByHour] = useState<{ hour: string; count: number }[]>([]);
  const [soupDistribution, setSoupDistribution] = useState<{ name: string; value: number }[]>([]);
  const [spiceDistribution, setSpiceDistribution] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const outlets = generateOutlets();
  const outletOptions = outlets.map((o) => ({ id: o.id, name: o.name }));

  useEffect(() => {
    setLoading(true);
    const outletParam = selectedOutlets.length > 0 ? `&outletIds=${selectedOutlets.join(",")}` : "";

    Promise.all([
      fetch(`/api/insights/kpis?window=${window}${outletParam}`).then((r) => r.json()),
      fetch(`/api/insights/top-ingredients?window=${window}${outletParam}`).then((r) => r.json()),
      fetch(`/api/insights/orders-by-hour?window=${window}${outletParam}`).then((r) => r.json()),
      fetch(`/api/insights/distribution?dimension=soup&window=${window}${outletParam}`).then((r) => r.json()),
      fetch(`/api/insights/distribution?dimension=spice&window=${window}${outletParam}`).then((r) => r.json()),
    ])
      .then(([kpisData, topIngredientsData, ordersByHourData, soupData, spiceData]) => {
        setKpis(kpisData);
        setTopIngredients(topIngredientsData);
        setOrdersByHour(ordersByHourData);
        setSoupDistribution(soupData);
        setSpiceDistribution(spiceData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [window, selectedOutlets]);

  if (loading || !kpis) {
    return (
      <div className="container mx-auto py-8 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  // Get recent orders for table
  const allOrders = generateOrders();
  const recentOrders = allOrders.slice(0, 20);

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Customer Insights"
        description="Operational trends and customer behavior analysis"
        showBackButton={true}
      />

      <Tabs value={window} onValueChange={(v) => setWindow(v as TimeWindow)} className="mb-6">
        <TabsList>
          <TabsTrigger value="24h">Today</TabsTrigger>
          <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">Filter by Outlets</label>
          <MultiSelect
            options={outletOptions}
            selected={selectedOutlets}
            onChange={setSelectedOutlets}
            placeholder="All outlets"
          />
        </div>

        <TabsContent value={window} className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPIStat
              label="Total Orders"
              value={kpis.totalOrders}
              icon={ShoppingCart}
              variant="default"
            />
            <KPIStat
              label="Avg Order Value"
              value={`$${kpis.avgOrderValue}`}
              icon={DollarSign}
              variant="success"
            />
            <KPIStat
              label="Repeat Customer %"
              value={`${kpis.repeatCustomerPct}%`}
              icon={Users}
              variant="default"
            />
            <KPIStat
              label="Most Popular"
              value={kpis.mostPopularIngredient}
              icon={Star}
              variant="warning"
            />
          </div>

          {/* Top Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Ingredients by Sales Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topIngredients} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Quantity Sold" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Orders by Hour */}
          <Card>
            <CardHeader>
              <CardTitle>Orders by Hour of Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ordersByHour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Soup Base Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={soupDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {soupDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spice Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={spiceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {spiceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Outlet</TableHead>
                    <TableHead>Items Count</TableHead>
                    <TableHead>Spend</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.customerId}</TableCell>
                      <TableCell>{order.outletName}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell className="font-semibold">${order.spend.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatShortDate(order.tsISO)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

