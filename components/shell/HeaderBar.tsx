"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";

interface HeaderBarProps {
  onOpenAddModal?: () => void;
  onOpenSearch?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onOpenAddModal,
  onOpenSearch,
}) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith("/vault")) return "Sub Vault";
    if (pathname.startsWith("/radar")) return "Bleed Radar";
    if (pathname.startsWith("/split")) return "Smart Split";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/admin")) return "Admin Console";
    return "Overview";
  };

  return (
    <header className="flex items-center justify-between gap-4 py-4 mb-6">
      {/* Left: Breadcrumbs & Live Burn Rate chip */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center text-sm font-medium">
          <span className="text-text-muted">Dashboard</span>
          <span className="mx-2 text-text-muted">/</span>
          <span className="text-text-primary font-semibold">{getPageTitle()}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE BURN RATE: ACTIVE</span>
        </div>
      </div>

      {/* Right: Quick Search & + Add New Subs CTA */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSearch}
          aria-label="Quick Search"
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel text-text-secondary hover:text-text-primary hover:border-violet-500/40 transition-all text-xs font-medium"
        >
          <Search className="w-4 h-4 text-text-muted group-hover:text-violet-400" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-text-muted font-mono">
            ⌘K
          </kbd>
        </button>

        <GradientButton size="sm" onClick={onOpenAddModal}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">+ Add New Subs</span>
          <span className="sm:hidden">Add</span>
        </GradientButton>
      </div>
    </header>
  );
};
