import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, TrendingUp, Refrigerator, Scale, Trash2 } from "lucide-react";

const dashboards = [
  {
    title: "Outlet Cold-Chain Map",
    description: "Real-time temperature monitoring across all Singapore outlets with interactive map",
    href: "/dashboards/outlet-map",
    icon: MapPin,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Cold-Chain Trends & Alerts",
    description: "Abnormal temperature readings, trends analysis, and outlet performance breakdown",
    href: "/dashboards/coldchain-trends",
    icon: TrendingUp,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    title: "Front Chiller Levels",
    description: "Ingredient tray fill levels and refill frequency monitoring",
    href: "/dashboards/chiller-levels",
    icon: Refrigerator,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Consumption Estimation",
    description: "Track ingredient consumption patterns by weight over daily, weekly, monthly periods",
    href: "/dashboards/chiller-consumption",
    icon: Scale,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Food Waste Dashboard",
    description: "Analyze food waste by ingredient type and disposal reason with detailed records",
    href: "/dashboards/food-waste",
    icon: Trash2,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            ZhangLiang MalaTang
          </h1>
          <h2 className="text-3xl font-semibold text-primary mb-4">
            IoT Analytics Dashboards
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive backend analytics platform for monitoring cold-chain integrity,
            ingredient levels, consumption patterns, and waste management across all outlets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            return (
              <Link key={dashboard.href} href={dashboard.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${dashboard.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${dashboard.color}`} />
                    </div>
                    <CardTitle className="text-xl">{dashboard.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {dashboard.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary font-medium">
                      View Dashboard →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Recharts</p>
        </div>
      </div>
    </div>
  );
}
