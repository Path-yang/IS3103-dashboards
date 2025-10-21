import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIStatProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function KPIStat({ label, value, icon: Icon, variant = "default", className }: KPIStatProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    danger: "border-red-200 bg-red-50",
  };

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
          {Icon && <Icon className="h-8 w-8 text-muted-foreground opacity-50" />}
        </div>
      </CardContent>
    </Card>
  );
}
