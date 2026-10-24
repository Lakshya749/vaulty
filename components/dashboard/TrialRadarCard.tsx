"use client";

import React from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { Radar, Clock, AlertTriangle } from "lucide-react";
import { Subscription } from "@/lib/calc";
import { formatCurrency, formatRelativeTime } from "@/lib/format";

interface TrialRadarCardProps {
  trials: Subscription[];
}

export const TrialRadarCard: React.FC<TrialRadarCardProps> = ({ trials }) => {
  const activeTrial = trials.length > 0 ? trials[0] : null;

  return (
    <BentoCard colSpan={1} className="flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider uppercase text-text-muted">
          Trial Trap Radar
        </span>
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-glow-violet">
          <Radar className="w-4 h-4" />
        </div>
      </div>

      {/* Center Radar Sweep Animation */}
      <div className="relative flex items-center justify-center my-4 h-36">
        {/* Concentric Circles */}
        <div className="absolute w-32 h-32 rounded-full border border-violet-500/20" />
        <div className="absolute w-24 h-24 rounded-full border border-violet-500/30" />
        <div className="absolute w-14 h-14 rounded-full border border-violet-500/40" />

        {/* Center Dot */}
        <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-glow-violet z-10" />

        {/* Radar Sweeper */}
        <div
          className="absolute w-32 h-32 rounded-full pointer-events-none animate-radar"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(139, 92, 246, 0.4) 0deg, rgba(139, 92, 246, 0) 60deg, transparent 60deg)",
          }}
        />

        {/* Detected Trial Blip */}
        {activeTrial && (
          <div className="absolute top-9 right-11 flex items-center justify-center">
            <span className="absolute w-4 h-4 rounded-full bg-pink-500/50 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-glow-pink" />
          </div>
        )}
      </div>

      {/* Bottom Alert Pill */}
      <div>
        {activeTrial ? (
          <div
            title={`Cancel before ${formatCurrency(activeTrial.cost)} auto-debit`}
            className="group relative flex items-center justify-between px-3 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs font-semibold text-pink-400 transition-all hover:bg-pink-500/20"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 shrink-0 text-pink-500" />
              <span className="truncate">
                {activeTrial.service_name} ends{" "}
                <span className="font-bold text-text-primary">
                  {formatRelativeTime(activeTrial.trial_end_date || new Date())}
                </span>
              </span>
            </div>

            <span className="shrink-0 text-[10px] bg-pink-500/25 px-1.5 py-0.5 rounded text-pink-300 font-bold">
              {formatCurrency(activeTrial.cost)}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-text-muted">
            <AlertTriangle className="w-3.5 h-3.5 text-text-muted" />
            <span>No trials lurking. Radar is clear.</span>
          </div>
        )}
      </div>
    </BentoCard>
  );
};
