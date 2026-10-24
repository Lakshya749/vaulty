"use client";

import React from "react";
import Link from "next/link";
import { BentoCard } from "@/components/ui/BentoCard";
import { Ghost, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface ZombieCardProps {
  zombieCount: number;
  zombieSavingsAmount: number;
}

export const ZombieCard: React.FC<ZombieCardProps> = ({
  zombieCount,
  zombieSavingsAmount,
}) => {
  return (
    <BentoCard colSpan={1} className="flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider uppercase text-text-muted">
          Zombie Subscriptions
        </span>
        <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-500 shadow-glow-pink">
          <Ghost className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric */}
      <div className="my-3">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-extrabold text-text-primary tabular-nums">
            {zombieCount}
          </span>
          <span className="text-sm font-medium text-text-muted">found lurking</span>
        </div>

        <div className="mt-2 text-xs text-text-secondary flex items-center gap-1.5 flex-wrap">
          <span>Unused in 30+ days.</span>
          <span className="font-bold text-pink-500">
            Save {formatCurrency(zombieSavingsAmount)}?
          </span>
        </div>
      </div>

      {/* Link to Vault */}
      <div className="pt-2 border-t border-border-subtle/50">
        <Link
          href="/vault?filter=zombies"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
        >
          <span>Review the undead</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </BentoCard>
  );
};
