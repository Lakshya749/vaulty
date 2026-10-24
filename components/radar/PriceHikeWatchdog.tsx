"use client";

import React from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { formatCurrency } from "@/lib/format";
import { Subscription } from "@/lib/calc";
import { AlertTriangle, TrendingUp, ShieldCheck } from "lucide-react";

interface HikeItem {
  id: string;
  service_name: string;
  category: string;
  oldPrice: number;
  newPrice: number;
  hikePercent: number;
  effectiveDate: string;
  tip: string;
  color: string;
}

const MARKET_HIKES: HikeItem[] = [
  {
    id: "yt-hike",
    service_name: "YouTube Premium",
    category: "Streaming",
    oldPrice: 189,
    newPrice: 299,
    hikePercent: 58,
    effectiveDate: "Q3 2024",
    tip: "Family plan rose 58%. Consider individual student plan (₹79/mo) or annual prepay.",
    color: "#EF4444",
  },
  {
    id: "spotify-hike",
    service_name: "Spotify",
    category: "Music",
    oldPrice: 119,
    newPrice: 149,
    hikePercent: 25,
    effectiveDate: "2024",
    tip: "Individual plan price increased. Duo plan (₹179/mo for 2 people) cuts cost to ₹89.5/person.",
    color: "#10B981",
  },
  {
    id: "claude-hike",
    service_name: "Claude Pro",
    category: "AI Tools",
    oldPrice: 1650,
    newPrice: 1800,
    hikePercent: 9,
    effectiveDate: "Ongoing FX",
    tip: "Billed in USD ($20 + 18% GST). Currency fluctuation increases INR billing by ~₹150/mo.",
    color: "#06B6D4",
  },
  {
    id: "hotstar-hike",
    service_name: "Disney+ Hotstar",
    category: "Streaming",
    oldPrice: 299,
    newPrice: 399,
    hikePercent: 33,
    effectiveDate: "2024",
    tip: "Telecom bundled plans (Jio/Airtel recharge) include free Hotstar Super access.",
    color: "#3B82F6",
  },
];

interface PriceHikeWatchdogProps {
  userSubscriptions: Subscription[];
}

export const PriceHikeWatchdog: React.FC<PriceHikeWatchdogProps> = ({
  userSubscriptions,
}) => {
  // Check which market hikes match the user's active subscriptions
  const affectedServices = MARKET_HIKES.map((hike) => {
    const matchingUserSub = userSubscriptions.find(
      (s) =>
        s.service_name.toLowerCase().includes(hike.service_name.toLowerCase()) ||
        hike.service_name.toLowerCase().includes(s.service_name.toLowerCase())
    );
    return {
      ...hike,
      userHasIt: Boolean(matchingUserSub),
      userSub: matchingUserSub,
    };
  });

  const activeAlertCount = affectedServices.filter((s) => s.userHasIt).length;

  return (
    <BentoCard colSpan={2} className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <h2 className="text-base font-bold text-text-primary">Price Hike Watchdog</h2>
          </div>
          <p className="text-xs text-text-muted">
            Tracking subscription inflation and stealth price changes across 2024–2025.
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            activeAlertCount > 0
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {activeAlertCount > 0 ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{activeAlertCount} In Your Vault</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>All Monitored</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {affectedServices.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border transition-all ${
              item.userHasIt
                ? "bg-rose-500/5 border-rose-500/30"
                : "bg-surface-base border-border-subtle hover:border-border-subtle/80"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  {item.service_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary text-xs">
                      {item.service_name}
                    </span>
                    {item.userHasIt && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">
                        Active in your vault
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-text-muted">
                    Effective {item.effectiveDate}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                  +{item.hikePercent}%
                </span>
                <div className="text-[11px] text-text-muted mt-1 font-mono">
                  {formatCurrency(item.oldPrice)} &rarr; {formatCurrency(item.newPrice)}
                </div>
              </div>
            </div>

            <p className="mt-2 text-xs text-text-secondary bg-surface-base/60 p-2 rounded-lg border border-border-subtle/40">
              💡 <span className="font-medium text-text-primary">Optimization tip:</span>{" "}
              {item.tip}
            </p>
          </div>
        ))}
      </div>
    </BentoCard>
  );
};
