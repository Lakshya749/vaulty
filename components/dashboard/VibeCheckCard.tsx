"use client";

import React from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { formatCurrency } from "@/lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryItem {
  name: string;
  amount: number;
  percent: number;
  color?: string;
}

interface VibeCheckCardProps {
  categories: CategoryItem[];
  total: number;
}

const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  Streaming: "#8B5CF6",
  "Gym/Health": "#EC4899",
  Cloud: "#34D399",
  Gaming: "#475569",
  "AI Tools": "#22D3EE",
  Work: "#F59E0B",
  Utilities: "#94A3B8",
  Other: "#64748B",
};

export const VibeCheckCard: React.FC<VibeCheckCardProps> = ({
  categories,
  total,
}) => {
  const chartData = categories.map((c) => ({
    ...c,
    fill: c.color || DEFAULT_CATEGORY_COLORS[c.name] || "#8B5CF6",
  }));

  return (
    <BentoCard colSpan={1} className="flex flex-col justify-between">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-wider uppercase text-text-muted">
          Vibe Check
        </span>
        <p className="text-xs text-text-secondary mt-0.5">Category split</p>
      </div>

      {/* Donut Chart with Center Total */}
      <div className="relative h-44 w-full flex items-center justify-center my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as CategoryItem;
                  return (
                    <div className="glass-panel px-2.5 py-1 rounded-lg text-xs font-bold">
                      {data.name}: {formatCurrency(data.amount)} ({data.percent}%)
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              innerRadius={54}
              outerRadius={70}
              paddingAngle={3}
              dataKey="amount"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-base font-extrabold text-text-primary tabular-nums">
            {formatCurrency(total)}
          </span>
          <span className="text-[10px] text-text-muted">per month</span>
        </div>
      </div>

      {/* Category Legend */}
      <div className="space-y-1.5 pt-2 border-t border-border-subtle/50 max-h-24 overflow-y-auto scrollbar-thin">
        {chartData.slice(0, 4).map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.fill }} />
              <span className="text-text-secondary truncate">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2 font-medium shrink-0">
              <span className="text-text-muted tabular-nums">{cat.percent}%</span>
              <span className="text-text-primary font-bold tabular-nums">
                {formatCurrency(cat.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
};
