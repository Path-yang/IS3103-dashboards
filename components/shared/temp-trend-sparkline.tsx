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
  
  // Create path segments
  const segments: { path: string; color: string }[] = [];
  let currentSegment: { x: number; y: number; isAbnormal: boolean }[] = [];
  let currentColor = points[0].isAbnormal ? "#ef4444" : "#22c55e";
  
  points.forEach((point, index) => {
    const pointColor = point.isAbnormal ? "#ef4444" : "#22c55e";
    
    if (pointColor !== currentColor) {
      // Color changed, save current segment
      if (currentSegment.length > 1) {
        const path = currentSegment.reduce((path, point, i) => {
          return i === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
        }, '');
        segments.push({ path, color: currentColor });
      }
      currentSegment = [point];
      currentColor = pointColor;
    } else {
      currentSegment.push(point);
    }
    
    // If this is the last point, save the segment
    if (index === points.length - 1) {
      if (currentSegment.length > 1) {
        const path = currentSegment.reduce((path, point, i) => {
          return i === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
        }, '');
        segments.push({ path, color: currentColor });
      }
    }
  });
  
  return (
    <div className="w-full h-10">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            stroke={segment.color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </div>
  );
}
