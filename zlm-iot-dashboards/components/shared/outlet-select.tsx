"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OutletSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  outlets: { id: string; name: string }[];
}

export function OutletSelect({ value, onValueChange, outlets }: OutletSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select outlet" />
      </SelectTrigger>
      <SelectContent>
        {outlets.map((outlet) => (
          <SelectItem key={outlet.id} value={outlet.id}>
            {outlet.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
