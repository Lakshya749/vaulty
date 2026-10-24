"use client";

import React from "react";
import { format } from "date-fns";

interface GreetingHeaderProps {
  firstName?: string;
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({
  firstName = "Arjun",
}) => {
  const currentMonthYear = format(new Date(), "MMMM yyyy").toUpperCase();

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-6 border-b border-border-subtle/50 mb-6">
      <div>
        <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-text-muted mb-1">
          MONEY HQ · {currentMonthYear}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Yo, {firstName} — here&apos;s the damage.
        </h1>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>Synced 2m ago</span>
      </div>
    </div>
  );
};
