"use client";

import React from "react";
import { formatCurrency } from "@/lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BentoCard } from "@/components/ui/BentoCard";
import { PieChart as PieIcon, ShieldAlert, Award } from "lucide-react";

interface CategoryDistributionItem {
  name: string;
  amount: number;
  percent: number;
  color?: string;
}

interface CategoryBreakdownCardProps {
  categories: CategoryDistributionItem[];
  totalBleed: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Streaming: "#8B5CF6", // violet-500
  "AI Tools": "#06B6D4", // cyan-500
  "Gym / Fitness": "#F43F5E", // rose-500
  "Cloud & Storage": "#3B82F6", // blue-500
  Gaming: "#10B981", // emerald-500
  Music: "#EC4899", // pink-500
  Productivity: "#F59E0B", // amber-500
  Other: "#6B7280",
};

export const CategoryBreakdownCard: React.FC<CategoryBreakdownCardProps> = ({
  categories,
  totalBleed,
}) => {
  const chartData = categories.map((cat) => ({
    name: cat.name,
    value: Math.round(cat.amount),
    percent: cat.percent,
    color: cat.color || CATEGORY_COLORS[cat.name] || "#8B5CF6",
  }));

  // Top category
  const topCategory = categories.length > 0 ? categories[0] : null;

  // Efficiency score: 100 minus proportion of unmonitored / heavy bleed
  const efficiencyScore = Math.max(35, Math.min(95, 100 - (topCategory ? topCategory.percent : 0) / 2));

  return (
    <BentoCard colSpan={2} className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-violet-400" />
            <h2 className="text-base font-bold text-text-primary">Burn Distribution by Category</h2>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Where your monthly cash flow is concentrated across subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-base px-3 py-1.5 rounded-xl border border-border-subtle text-xs">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-text-muted">Health Index:</span>
          <span className="font-bold text-emerald-400">{Math.round(efficiencyScore)}/100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Donut Chart */}
        <div className="relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={88}
                paddingAngle={4}
                stroke="#090A0F"
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#12131A] border border-border-subtle p-3 rounded-xl shadow-2xl text-xs space-y-1">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: data.color }}
                          />
                          {data.name}
                        </div>
                        <div className="text-violet-400 font-mono font-bold">
                          {formatCurrency(data.value)}/mo ({data.percent}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              Total Bleed
            </span>
            <span className="text-xl font-black text-white tracking-tight">
              {formatCurrency(totalBleed)}
            </span>
            <span className="text-[10px] text-text-muted">/month</span>
          </div>
        </div>

        {/* Category List Progress Bars */}
        <div className="space-y-3">
          {categories.slice(0, 5).map((cat) => {
            const color = cat.color || CATEGORY_COLORS[cat.name] || "#8B5CF6";
            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text-primary flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: color }}
                    />
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-text-primary font-semibold">
                      {formatCurrency(cat.amount)}
                    </span>
                    <span className="text-text-muted text-[11px]">({cat.percent}%)</span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-surface-base rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {topCategory && topCategory.percent >= 40 && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Concentration Warning:</strong> {topCategory.name} accounts for {topCategory.percent}% of your total burn. Diversifying or auditing this category could yield immediate savings.
          </span>
        </div>
      )}
    </BentoCard>
  );
};
