"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { User, Award, TrendingUp, Heart } from "lucide-react";
import { generateCustomers } from "@/data/customers";
import type { CustomerProfile, Recommendation } from "@/lib/types";

export default function PersonalisationPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [customerData, setCustomerData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [segment, setSegment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const customers = generateCustomers();

  useEffect(() => {
    if (!selectedCustomer && customers.length > 0) {
      setSelectedCustomer(customers[0].id);
    }
  }, [customers, selectedCustomer]);

  useEffect(() => {
    if (!selectedCustomer) return;

    setLoading(true);
    Promise.all([
      fetch(`/api/personalisation/customer?id=${selectedCustomer}`).then((r) => r.json()),
      fetch(`/api/personalisation/recs?id=${selectedCustomer}`).then((r) => r.json()),
      fetch(`/api/personalisation/segment?id=${selectedCustomer}`).then((r) => r.json()),
    ])
      .then(([customerRes, recsRes, segmentRes]) => {
        setCustomerData(customerRes);
        setRecommendations(recsRes);
        setSegment(segmentRes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCustomer]);

  if (loading || !customerData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <DashboardSkeleton />
      </div>
    );
  }

  const profile: CustomerProfile = customerData.profile;
  const orderHistory = customerData.orderHistory;

  // Prepare radar chart data
  const preferencesData = [
    { category: "Spice", value: profile.preferences.spice * 100 },
    { category: "Protein", value: profile.preferences.protein * 100 },
    { category: "Vegetables", value: profile.preferences.vegetables * 100 },
    { category: "Soup Base", value: profile.preferences.soupBase * 100 },
    { category: "Add-ons", value: profile.preferences.addons * 100 },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "bg-slate-700";
      case "Gold":
        return "bg-yellow-500";
      case "Silver":
        return "bg-gray-400";
      default:
        return "bg-amber-700";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        title="Customer Personalisation"
        description="Tailored insights and recommendations for individual customers"
        showBackButton={true}
      />

      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Select Customer</label>
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.id} ({customer.tier})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer ID</p>
                <p className="font-mono font-semibold">{profile.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membership Tier</p>
                <Badge className={getTierColor(profile.tier)}>{profile.tier}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Spend</p>
                <p className="font-semibold text-lg">${profile.avgSpend.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="font-semibold text-lg">{profile.visits}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-1">Favourite Combo</p>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <p className="font-medium">{profile.favouriteCombo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested for You */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Suggested for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-muted rounded-lg">
                  <p className="font-semibold text-sm">{rec.item}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order History by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Order History by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Items Ordered" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Preference Strengths */}
        <Card>
          <CardHeader>
            <CardTitle>Preference Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={preferencesData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Preference Strength"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customers Like You */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Customers Like You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {segment?.similarCustomers.map((customer: CustomerProfile) => (
              <div key={customer.id} className="p-4 border rounded-lg">
                <p className="font-mono text-sm font-semibold mb-2">{customer.id}</p>
                <Badge className={getTierColor(customer.tier)} variant="secondary">
                  {customer.tier}
                </Badge>
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>{customer.visits} visits</p>
                  <p>${customer.avgSpend.toFixed(2)} avg</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Loves:</p>
                  <p className="text-xs font-medium line-clamp-2">{customer.favouriteCombo}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Based on similar order patterns from {segment?.segmentSize} total customers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

