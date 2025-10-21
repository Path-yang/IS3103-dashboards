"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TinySparkline } from "@/components/shared/tiny-sparkline";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { MapPin, Users, DollarSign, TrendingUp } from "lucide-react";
import type { OutletPerf } from "@/lib/types";

// Dynamically import map component with no SSR
const GeoMap = dynamic(() => import("@/components/dashboards/geo-map"), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-muted animate-pulse rounded-lg" />,
});

export default function GeospatialPage() {
  const [outlets, setOutlets] = useState<OutletPerf[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof OutletPerf>("revenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const hasMapbox = !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    fetch("/api/geo/outlets")
      .then((res) => res.json())
      .then((data) => {
        setOutlets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  const handleSort = (field: keyof OutletPerf) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedOutlets = [...outlets].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const getPerformanceBadge = (outlet: OutletPerf) => {
    if (outlet.satisfaction >= 4.5 && outlet.revenue > 120000) {
      return <Badge className="bg-green-500">High</Badge>;
    } else if (outlet.satisfaction >= 4.0 || outlet.revenue > 80000) {
      return <Badge className="bg-blue-500">Medium</Badge>;
    } else {
      return <Badge className="bg-orange-500">Needs Attention</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Geospatial Analytics"
        description="Outlet performance and competitive landscape across Singapore"
        showBackButton={true}
      />

      {/* Map or Fallback */}
      {hasMapbox ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Outlet Performance Map</CardTitle>
              <Tabs value={selectedLayers.join(",")} onValueChange={(v) => setSelectedLayers(v.split(",").filter(Boolean))}>
                <TabsList>
                  <TabsTrigger value="">Base Map</TabsTrigger>
                  <TabsTrigger value="population">+ Population</TabsTrigger>
                  <TabsTrigger value="competitors">+ Competitors</TabsTrigger>
                  <TabsTrigger value="transport">+ Transport</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <GeoMap outlets={outlets} layers={selectedLayers} />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <p className="text-sm text-yellow-800">
              Map view is unavailable. Set <code className="px-1 py-0.5 bg-yellow-100 rounded">MAPBOX_TOKEN</code> environment variable to enable interactive map.
              Showing table view below.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Insights Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-orange-500 mt-1" />
              <div>
                <p className="font-semibold text-sm">High Competition Zone</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Jurong East has 3+ competitors within 500m radius
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-500 mt-1" />
              <div>
                <p className="font-semibold text-sm">Top Performer</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Orchard Central leads with ${Math.max(...outlets.map(o => o.revenue)).toLocaleString()} monthly revenue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-500 mt-1" />
              <div>
                <p className="font-semibold text-sm">Growth Opportunity</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tampines shows high footfall with room for revenue optimization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outlet Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Outlet Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outlet</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("revenue")}>
                  Revenue {sortField === "revenue" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("footfall")}>
                  Footfall {sortField === "footfall" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("aov")}>
                  AOV {sortField === "aov" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("satisfaction")}>
                  Rating {sortField === "satisfaction" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("repeatRate")}>
                  Repeat % {sortField === "repeatRate" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Competitors</TableHead>
                <TableHead>7-Day Trend</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOutlets.map((outlet) => (
                <TableRow key={outlet.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {outlet.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">${outlet.revenue.toLocaleString()}</TableCell>
                  <TableCell>{outlet.footfall.toLocaleString()}</TableCell>
                  <TableCell>${outlet.aov.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{outlet.satisfaction}</span>
                      <span className="text-muted-foreground">/5.0</span>
                    </div>
                  </TableCell>
                  <TableCell>{outlet.repeatRate}%</TableCell>
                  <TableCell>
                    <Badge variant="outline">{outlet.competitorsNearby}</Badge>
                  </TableCell>
                  <TableCell>
                    <TinySparkline data={outlet.trendSeries.map(t => ({ value: t.value }))} />
                  </TableCell>
                  <TableCell>{getPerformanceBadge(outlet)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

