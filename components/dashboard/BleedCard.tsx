"use client";

import React from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { Pill } from "@/components/ui/Pill";
import { ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

interface BleedCardProps {
  bleed: number;
  deltaPercentage: number;
}

export const BleedCard: React.FC<BleedCardProps> = ({
  bleed,
  deltaPercentage,
}) => {
  // Sparkline data representing last 6 months trajectory
  const sparklineData = [
    { month: "May", spend: Math.round(bleed * 1.15) },
    { month: "Jun", spend: Math.round(bleed * 1.18) },
    { month: "Jul", spend: Math.round(bleed * 1.14) },
    { month: "Aug", spend: Math.round(bleed * 1.12) },
    { month: "Sep", spend: Math.round(bleed * 1.14) },
    { month: "Oct", spend: Math.round(bleed) },
  ];

  return (
    <BentoCard colSpan={2} className="relative overflow-hidden flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider uppercase text-text-muted">
          Monthly Wallet Bleed
        </span>
        <Pill variant="pink">LIVE</Pill>
      </div>

      {/* Main Stat & Sparkline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end mt-4">
        {/* Left: Hero Number & Delta */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight tabular-nums">
              {formatCurrency(bleed)}
            </span>
            <span className="text-base sm:text-lg text-text-muted font-normal">/ mo</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-0.5 font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>{Math.abs(deltaPercentage)}%</span>
            </span>
            <span className="text-text-secondary">from last month, clean vibes!</span>
          </div>
        </div>

        {/* Right: Sparkline Chart */}
        <div className="lg:col-span-6 h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="bleedSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-panel px-2.5 py-1 rounded-lg text-[11px] font-bold text-text-primary">
                        {payload[0].payload.month}: {formatCurrency(Number(payload[0].value))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                fill="url(#bleedSparklineGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </BentoCard>
  );
};
