import React from 'react';

interface SparklineProps {
  value2023: number;
  value2024: number;
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({ 
  value2023, 
  value2024, 
  width = 60, 
  height = 20,
  color = "#22c55e"
}: SparklineProps) {
  const min = Math.min(value2023, value2024) - 0.1;
  const max = Math.max(value2023, value2024) + 0.1;
  const range = max - min;
  
  // Normalize values to SVG coordinates
  const x1 = width * 0.2;
  const x2 = width * 0.8;
  const y1 = height - ((value2023 - min) / range) * height;
  const y2 = height - ((value2024 - min) / range) * height;
  
  const isUp = value2024 > value2023;
  const isDown = value2024 < value2023;
  
  return (
    <div className="inline-flex items-center gap-1.5">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid line */}
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#374151"
          strokeWidth="0.5"
          opacity="0.3"
        />
        
        {/* Trend line */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isUp ? "#22c55e" : isDown ? "#ef4444" : "#6b7280"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Points */}
        <circle
          cx={x1}
          cy={y1}
          r="2"
          fill={color}
          opacity="0.6"
        />
        <circle
          cx={x2}
          cy={y2}
          r="2.5"
          fill={isUp ? "#22c55e" : isDown ? "#ef4444" : "#6b7280"}
        />
      </svg>
      
      {/* Change indicator */}
      <span className={`text-xs font-mono ${
        isUp ? 'text-green-500' : 
        isDown ? 'text-red-500' : 
        'text-gray-500'
      }`}>
        {isUp ? '↑' : isDown ? '↓' : '—'}
        {Math.abs(value2024 - value2023).toFixed(2)}
      </span>
    </div>
  );
}
