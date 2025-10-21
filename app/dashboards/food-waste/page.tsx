"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { WasteResponse } from "@/lib/types";
import { INGREDIENTS } from "@/data/ingredients";
import { formatShortDate } from "@/lib/utils";

const DISPOSAL_REASONS = [
  { id: "all", name: "All Reasons" },
  { id: "expiry", name: "Expiry" },
  { id: "leftover_display", name: "Leftover from Display" },
  { id: "quality", name: "Quality Issues" },
];

export default function FoodWastePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<string>("all");
  const [data, setData] = useState<WasteResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedIngredients.length > 0) {
      params.set("ingredientIds", selectedIngredients.join(","));
    }
    if (selectedReason !== "all") {
      params.set("reason", selectedReason);
    }
    params.set("window", "30d");

    fetch(`/api/waste?${params.toString()}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedIngredients, selectedReason]);

  if (loading || !data) {
    return (
      <div className="container mx-auto py-8 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  const chartData = data.timeseries.map((item) => ({
    date: formatShortDate(item.dateISO),
    weight: item.weightKg,
  }));

  const totalWaste = data.records.reduce((sum, r) => sum + r.weightKg, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Food Waste Dashboard"
        description="Track and analyze food waste by ingredient type and disposal reason"
        showBackButton={true}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Ingredients</label>
              <MultiSelect
                options={INGREDIENTS}
                selected={selectedIngredients}
                onChange={setSelectedIngredients}
                placeholder="Select ingredients to filter"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Disposal Reason</label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISPOSAL_REASONS.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Waste (Filtered)</p>
              <p className="text-4xl font-bold mt-2">{totalWaste.toFixed(1)} kg</p>
              <p className="text-sm text-muted-foreground mt-1">
                {data.records.length} records
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Waste Over Time (kg)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="weight" fill="#ef4444" name="Weight (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Waste Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Outlet</TableHead>
                <TableHead>Ingredient</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Weight (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.records.slice(0, 50).map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatShortDate(record.dateISO)}</TableCell>
                  <TableCell>{record.outletName}</TableCell>
                  <TableCell>{record.ingredientName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {record.disposalReason.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {record.weightKg.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.records.length > 50 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Showing first 50 of {data.records.length} records
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
