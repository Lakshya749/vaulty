"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./SidebarPill";
import { useSubscriptions } from "@/components/providers/SubscriptionProvider";

export const MobileTabBar: React.FC = () => {
  const pathname = usePathname();
  const { trials, zombieCount } = useSubscriptions();
  const hasAlerts = trials.length > 0 || zombieCount > 0;

  return (
    <div className="md:hidden fixed bottom-4 inset-x-4 h-16 rounded-[28px] glass-panel bg-elevated/90 flex items-center justify-around px-2 z-40 shadow-card border border-border-subtle">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className="relative flex flex-col items-center justify-center w-12 h-12 rounded-full"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-glow-violet"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.hasBadge && hasAlerts && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 shadow-glow-pink" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
