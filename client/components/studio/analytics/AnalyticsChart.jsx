"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AnalyticsChart({ data = [], metricLabel = "Views", color = "#3b82f6" }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const chartData = data.length > 0 ? data : [];

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-[#2f2f2f] rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No daily view records recorded yet for this period.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Views are tracked in real-time as users watch your videos.
        </p>
      </div>
    );
  }

  const values = chartData.map((d) => d.views || d.count || 0);
  const maxValue = Math.max(...values, 5);
  const minValue = 0;

  const height = 220;
  const paddingX = 40;
  const paddingY = 25;
  const chartHeight = height - paddingY * 2;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / Math.max(chartData.length - 1, 1)) * (560 - paddingX * 2);
    const val = d.views || d.count || 0;
    const y = paddingY + chartHeight - ((val - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, date: d.date, val };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`
    : "";

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            {metricLabel} Trend
          </span>
        </div>
        {hoveredPoint && (
          <div className="text-xs font-medium bg-gray-900 text-white dark:bg-white dark:text-black px-2.5 py-1 rounded-full shadow-sm">
            <span className="opacity-80">{hoveredPoint.date}: </span>
            <span className="font-bold">{hoveredPoint.val.toLocaleString()} {metricLabel.toLowerCase()}</span>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto hide-scrollbar">
        <svg
          viewBox="0 0 560 250"
          className="w-full h-auto min-w-[500px]"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingY + chartHeight * (1 - pct);
            const valLabel = Math.round(minValue + (maxValue - minValue) * pct);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={560 - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-200 dark:text-[#282828]"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="currentColor"
                  className="text-gray-400 dark:text-gray-500 font-mono"
                >
                  {valLabel}
                </text>
              </g>
            );
          })}

          {areaD && (
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              d={areaD}
              fill={`url(#grad-${color.replace('#', '')})`}
            />
          )}

          {pathD && (
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {points.map((p, idx) => (
            <g key={idx} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.date === p.date ? "6" : "3.5"}
                fill={color}
                className="transition-all duration-150"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="14"
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(p)}
              />
            </g>
          ))}

          {points.length > 0 && (
            <>
              <text
                x={points[0].x}
                y={height + 15}
                textAnchor="start"
                fontSize="10"
                fill="currentColor"
                className="text-gray-400 dark:text-gray-500 font-mono"
              >
                {points[0].date}
              </text>
              {points.length > 2 && (
                <text
                  x={points[Math.floor(points.length / 2)].x}
                  y={height + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill="currentColor"
                  className="text-gray-400 dark:text-gray-500 font-mono"
                >
                  {points[Math.floor(points.length / 2)].date}
                </text>
              )}
              {points.length > 1 && (
                <text
                  x={points[points.length - 1].x}
                  y={height + 15}
                  textAnchor="end"
                  fontSize="10"
                  fill="currentColor"
                  className="text-gray-400 dark:text-gray-500 font-mono"
                >
                  {points[points.length - 1].date}
                </text>
              )}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
