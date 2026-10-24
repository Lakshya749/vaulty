"use client";

import React from "react";
import { useSubscriptions } from "@/components/providers/SubscriptionProvider";
import { CategoryBreakdownCard } from "@/components/radar/CategoryBreakdownCard";
import { PriceHikeWatchdog } from "@/components/radar/PriceHikeWatchdog";
import { SavingsSimulator } from "@/components/radar/SavingsSimulator";
import { TrialActionCenter } from "@/components/radar/TrialActionCenter";
import { AlertList } from "@/components/radar/AlertList";
import { formatCurrency } from "@/lib/format";
import { Radio, ShieldAlert, Sparkles, Zap, Flame } from "lucide-react";

export default function RadarPage() {
  const {
    subscriptions,
    loading,
    bleed,
    annualSpend,
    zombieSavingsAmount,
    trials,
    categoryDistribution,
    updateSubscription,
  } = useSubscriptions();

  // Handler for applying savings simulator plan: marks selected subs as cancelled
  const handleApplyPlan = async (cancelledIds: string[]) => {
    for (const id of cancelledIds) {
      await updateSubscription(id, { status: "cancelled" });
    }
  };

  const handleCancelTrial = async (id: string) => {
    await updateSubscription(id, { status: "cancelled" });
  };

  const dailyBurn = Math.round(bleed / 30);
  const annualSavingsPotential = zombieSavingsAmount * 12;

  if (loading) {
    return (
      <div className="py-24 text-center text-text-muted animate-pulse">
        Calibrating bleed radar and market intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-text-primary">
              Bleed Radar
            </h1>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Real-time threat detection, category velocity, market price hikes, and burn reduction engine.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-base border border-border-subtle text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-text-primary">RADAR SCANNER ACTIVE</span>
        </div>
      </div>

      {/* Top Threat & Velocity Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl glass-panel border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Daily Burn Velocity</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl lg:text-2xl font-black text-rose-400 tracking-tight">
              {formatCurrency(dailyBurn)}
            </span>
            <span className="text-[11px] text-text-muted">/day</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Annual Run-Rate</span>
            <Zap className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl lg:text-2xl font-black text-text-primary tracking-tight">
              {formatCurrency(annualSpend)}
            </span>
            <span className="text-[11px] text-text-muted">/year</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Reclaimable Capital</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl lg:text-2xl font-black text-emerald-400 tracking-tight">
              {formatCurrency(annualSavingsPotential)}
            </span>
            <span className="text-[11px] text-text-muted">/year</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Trial Defense Status</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl lg:text-2xl font-black text-amber-400 tracking-tight">
              {trials.length > 0 ? "1 Critical" : "Guarded"}
            </span>
            <span className="text-[11px] text-text-muted">
              {trials.length > 0 ? "48h window" : "0 alerts"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Breakdown (2 cols) */}
        <CategoryBreakdownCard
          categories={categoryDistribution}
          totalBleed={bleed}
        />

        {/* Price Hike Watchdog (2 cols) */}
        <PriceHikeWatchdog userSubscriptions={subscriptions} />

        {/* Savings Simulator (2 cols) */}
        <SavingsSimulator
          subscriptions={subscriptions}
          currentBleed={bleed}
          onApplyPlan={handleApplyPlan}
        />

        {/* Trial Action Center (2 cols) */}
        <TrialActionCenter
          trials={trials}
          onCancelTrial={handleCancelTrial}
        />

        {/* Notification Centre (Full Width / 4 cols) */}
        <div className="lg:col-span-4">
          <AlertList subscriptions={subscriptions} />
        </div>
      </div>
    </div>
  );
}
