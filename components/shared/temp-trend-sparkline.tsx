"use client";

import React from "react";

interface TempTrendData {
  value: number;
  isAbnormal: boolean;
}

interface TempTrendSparklineProps {
  data: TempTrendData[];
}

export function TempTrendSparkline({ data }: TempTrendSparklineProps) {
  const width = 200;
  const height = 40;
  const padding = 2;
  
  if (data.length === 0) return <div className="h-10 w-full bg-muted animate-pulse rounded" />;
  
  // Calculate min/max values
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;
  
  // Calculate points
  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = padding + ((maxValue - point.value) / range) * (height - 2 * padding);
    return { x, y, isAbnormal: point.isAbnormal };
  });
  
  // Create one continuous path with gradient stops for color changes
  const pathData = points.reduce((path, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
  }, '');
  
  // Create gradient definition for color changes
  const gradientStops = points.map((point, index) => {
    const offset = (index / (points.length - 1)) * 100;
    const color = point.isAbnormal ? "#ef4444" : "#22c55e";
    return { offset, color };
  });
  
  return (
    <div className="w-full h-10">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops.map((stop, index) => (
              <stop key={index} offset={`${stop.offset}%`} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
        <path
          d={pathData}
          stroke="url(#tempGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
