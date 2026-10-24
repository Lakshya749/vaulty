"use client";

import React from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { formatCurrency } from "@/lib/format";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface BurnRateCardProps {
  series: { month: string; spend: number; isForecast: boolean }[];
}

export const BurnRateCard: React.FC<BurnRateCardProps> = ({ series }) => {
  const currentMonthIdx = new Date().getMonth();

  // Split into actual series and forecast series for solid vs dashed curves
  const chartData = series.map((item, idx) => ({
    ...item,
    actualSpend: idx <= currentMonthIdx ? item.spend : null,
    forecastSpend: idx >= currentMonthIdx ? item.spend : null,
  }));

  const decForecast = series[series.length - 1]?.spend || 4120;

  return (
    <BentoCard colSpan={2} className="flex flex-col justify-between">
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-text-muted">
            Burn Rate Flow
          </span>
          <p className="text-xs text-text-secondary mt-0.5">Your monthly spend trajectory</p>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            DEC FORECAST
          </div>
          <div className="text-sm font-bold text-violet-400 tabular-nums">
            {formatCurrency(decForecast)}
          </div>
        </div>
      </div>

      {/* Trajectory AreaChart */}
      <div className="h-52 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="burnRateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B6D80", fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].payload.spend;
                  const month = payload[0].payload.month;
                  const isForecast = payload[0].payload.isForecast;
                  return (
                    <div className="glass-panel px-3 py-1.5 rounded-xl text-xs shadow-card">
                      <div className="text-text-muted text-[10px]">
                        {month} {isForecast ? "(Forecast)" : "(Actual)"}
                      </div>
                      <div className="text-sm font-bold text-text-primary tabular-nums">
                        {formatCurrency(val)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Actual curve: solid */}
            <Area
              type="monotone"
              dataKey="actualSpend"
              stroke="#8B5CF6"
              strokeWidth={3}
              fill="url(#burnRateGrad)"
              connectNulls={false}
            />
            {/* Forecast curve: dashed */}
            <Area
              type="monotone"
              dataKey="forecastSpend"
              stroke="#EC4899"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              fill="none"
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </BentoCard>
  );
};
