"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CreditCard, Radar, Users, Settings, Zap } from "lucide-react";
import { useSubscriptions } from "@/components/providers/SubscriptionProvider";

export const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Sub Vault", href: "/vault", icon: CreditCard },
  { label: "Bleed Radar", href: "/radar", icon: Radar, hasBadge: true },
  { label: "Smart Split", href: "/split", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const SidebarPill: React.FC = () => {
  const pathname = usePathname();
  const { trials, zombieCount } = useSubscriptions();
  const hasAlerts = trials.length > 0 || zombieCount > 0;

  return (
    <aside
      className="hidden md:flex fixed left-4 top-4 bottom-4 w-[72px] rounded-[36px] glass-panel bg-elevated/80 flex-col items-center justify-between py-6 z-40 shadow-card"
      aria-label="Primary"
    >
      {/* Top Logo */}
      <Link href="/dashboard" aria-label="SubTrack Overview">
        <div className="w-11 h-11 rounded-[14px] bg-primary-gradient flex items-center justify-center shadow-glow-violet transition-transform duration-200 hover:scale-105">
          <Zap className="w-5 h-5 text-text-primary fill-current" />
        </div>
      </Link>

      {/* Nav Icons */}
      <nav className="flex flex-col gap-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className="group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200"
            >
              {/* Active Indicator bar */}
              {isActive && (
                <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-violet-500 rounded-r-full shadow-glow-violet" />
              )}

              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-violet-500/15 border border-violet-500/40 text-violet-400 shadow-glow-violet"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5" />

                {/* Pink alert dot for Bleed Radar */}
                {item.hasBadge && hasAlerts && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-pink-500 shadow-glow-pink" />
                )}
              </div>

              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute left-16 px-2.5 py-1 rounded-md text-xs font-medium bg-elevated border border-border-subtle text-text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap shadow-card z-50">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Avatar */}
      <div className="group relative flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-surface-hover border border-border-subtle flex items-center justify-center font-bold text-xs text-text-primary relative cursor-pointer">
          AK
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-elevated" />
        </div>

        {/* Hover tag */}
        <span className="pointer-events-none absolute left-16 bottom-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap z-50">
          Free Tier · Arjun
        </span>
      </div>
    </aside>
  );
};
