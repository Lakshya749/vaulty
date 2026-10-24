"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useSubscriptions } from "@/components/providers/SubscriptionProvider";
import { formatCurrency } from "@/lib/format";
import {
  Search,
  LayoutGrid,
  CreditCard,
  Radar,
  Users,
  Settings,
  Plus,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface CommandPaletteProps {
  onOpenAddModal?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onOpenAddModal }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { subscriptions, resetToDemo } = useSubscriptions();

  // Listen for ⌘K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleResetData = async () => {
    setOpen(false);
    await resetToDemo();
    toast.success("Reset data to calibrated demo profile.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl rounded-2xl glass-panel bg-[#0F1017]/95 border border-border-subtle shadow-2xl overflow-hidden z-10">
        <Command
          label="Global Search and Command Palette"
          className="w-full flex flex-col"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 border-b border-border-subtle">
            <Search className="w-4 h-4 text-text-muted shrink-0 mr-3" />
            <Command.Input
              placeholder="Search subscriptions, jump to page, or run command..."
              className="w-full bg-transparent py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white/10 text-text-muted rounded font-mono">
              ESC
            </kbd>
          </div>

          {/* List Results */}
          <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-none divide-y divide-border-subtle/30">
            <Command.Empty className="py-8 text-center text-xs text-text-muted">
              No matching subscriptions or actions found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="py-2 text-[11px] font-bold text-text-muted uppercase px-2">
              <Command.Item
                onSelect={() => {
                  setOpen(false);
                  if (onOpenAddModal) onOpenAddModal();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-primary hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4 text-violet-400" />
                <span>+ Add New Subscription</span>
              </Command.Item>

              <Command.Item
                onSelect={handleResetData}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-primary hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Reset Vault to Demo Defaults</span>
              </Command.Item>
            </Command.Group>

            {/* Navigation Group */}
            <Command.Group heading="Navigation" className="py-2 text-[11px] font-bold text-text-muted uppercase px-2">
              <Command.Item
                onSelect={() => navigateTo("/dashboard")}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-primary hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors"
              >
                <LayoutGrid className="w-4 h-4 text-violet-400" />
                <span>Dashboard Overview</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/vault")}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-primary hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors"
              >
                <CreditCard className="w-4 h-4 text-violet-400" />
                <span>Subscription Vault</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/radar")}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-primary hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors"
              >
                <Radar className="w-4 h-4 text-violet-400" />
                <span>Bleed Radar & Intelligence</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/split")}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-primary hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors"
              >
                <Users className="w-4 h-4 text-violet-400" />
                <span>Smart Split</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/settings")}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-primary hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors"
              >
                <Settings className="w-4 h-4 text-violet-400" />
                <span>User Settings</span>
              </Command.Item>
            </Command.Group>

            {/* Subscriptions Group */}
            <Command.Group heading="Your Subscriptions" className="py-2 text-[11px] font-bold text-text-muted uppercase px-2">
              {subscriptions.map((sub) => (
                <Command.Item
                  key={sub.id}
                  onSelect={() => navigateTo("/vault")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-text-primary hover:bg-violet-600/20 hover:text-white cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white shrink-0"
                      style={{ backgroundColor: sub.color || "#8B5CF6" }}
                    >
                      {sub.service_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold">{sub.service_name}</span>
                      <span className="text-[11px] text-text-muted ml-2">
                        {sub.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <span className="font-bold">
                      {formatCurrency(sub.cost)}
                    </span>
                    <span className="text-text-muted text-[10px] capitalize ml-1">
                      /{sub.billing_cycle}
                    </span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 border-t border-border-subtle bg-surface-base/40 flex items-center justify-between text-[11px] text-text-muted">
            <div className="flex items-center gap-2">
              <span>Use arrow keys</span>
              <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px]">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px]">↓</kbd>
              <span>to navigate</span>
            </div>
            <span>Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px]">↵ Enter</kbd> to select</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
