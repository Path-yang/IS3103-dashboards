"use client";

import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface TinySparklineProps {
  data: { value: number }[];
  color?: string;
}

export function TinySparkline({ data, color = "#3b82f6" }: TinySparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
