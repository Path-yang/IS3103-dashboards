import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
}

export function PageHeader({ title, description, showBackButton = false }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {showBackButton && (
        <Link href="/" className="inline-block mb-4">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      )}
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
