"use client";

import React from "react";
import { GreetingHeader } from "@/components/shell/GreetingHeader";
import { BleedCard } from "@/components/dashboard/BleedCard";
import { ZombieCard } from "@/components/dashboard/ZombieCard";
import { TrialRadarCard } from "@/components/dashboard/TrialRadarCard";
import { BurnRateCard } from "@/components/dashboard/BurnRateCard";
import { VibeCheckCard } from "@/components/dashboard/VibeCheckCard";
import { DebitRail } from "@/components/dashboard/DebitRail";
import { useSubscriptions } from "@/components/providers/SubscriptionProvider";

export default function DashboardPage() {
  const {
    bleed,
    deltaPercentage,
    zombieCount,
    zombieSavingsAmount,
    trials,
    trajectorySeries,
    categoryDistribution,
    upcomingList,
    toggleStatus,
  } = useSubscriptions();

  return (
    <div className="space-y-6">
      {/* Dynamic Greeting */}
      <GreetingHeader firstName="Arjun" />

      {/* 3-Column Bento Grid matching Figma prototype */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Row 1: Monthly Wallet Bleed (2) + Zombie Subs (1) */}
        <BleedCard bleed={bleed} deltaPercentage={deltaPercentage} />
        <ZombieCard
          zombieCount={zombieCount}
          zombieSavingsAmount={zombieSavingsAmount}
        />

        {/* Row 2: Trial Trap Radar (1) + Burn Rate Flow (2) */}
        <TrialRadarCard trials={trials} />
        <BurnRateCard series={trajectorySeries} />

        {/* Row 3: Vibe Check Donut (1) + Upcoming Debits Rail (2) */}
        <VibeCheckCard
          categories={categoryDistribution}
          total={bleed}
        />
        <DebitRail
          upcomingList={upcomingList}
          onMarkCancelled={(id) => toggleStatus(id)}
        />
      </div>
    </div>
  );
}
