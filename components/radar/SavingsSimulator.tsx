"use client";

import React, { useState, useMemo } from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Subscription, toMonthly, isZombie } from "@/lib/calc";
import { formatCurrency } from "@/lib/format";
import { Sparkles, Calculator, Check, Ghost } from "lucide-react";
import { toast } from "sonner";

interface SavingsSimulatorProps {
  subscriptions: Subscription[];
  currentBleed: number;
  onApplyPlan: (cancelledIds: string[]) => Promise<void>;
}

export const SavingsSimulator: React.FC<SavingsSimulatorProps> = ({
  subscriptions,
  currentBleed,
  onApplyPlan,
}) => {
  // Pre-select zombies by default
  const [selectedToCancel, setSelectedToCancel] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    subscriptions.forEach((sub) => {
      if (isZombie(sub) && sub.status === "active") {
        initial.add(sub.id);
      }
    });
    return initial;
  });

  const [isApplying, setIsApplying] = useState(false);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedToCancel);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedToCancel(next);
  };

  // Calculate simulated monthly savings
  const simulatedMonthlySavings = useMemo(() => {
    let savings = 0;
    subscriptions.forEach((sub) => {
      if (selectedToCancel.has(sub.id) && sub.status === "active") {
        savings += toMonthly(sub.cost, sub.billing_cycle);
      }
    });
    return Math.round(savings);
  }, [subscriptions, selectedToCancel]);

  const simulatedAnnualSavings = simulatedMonthlySavings * 12;
  const newBleed = Math.max(0, currentBleed - simulatedMonthlySavings);
  const percentSaved =
    currentBleed > 0 ? Math.round((simulatedMonthlySavings / currentBleed) * 100) : 0;

  const handleApply = async () => {
    if (selectedToCancel.size === 0) {
      toast.info("Select at least one subscription to simulate cancellation.");
      return;
    }
    setIsApplying(true);
    try {
      await onApplyPlan(Array.from(selectedToCancel));
      toast.success(
        `Action plan executed! Saved ${formatCurrency(simulatedMonthlySavings)}/mo.`,
        {
          description: `Updated ${selectedToCancel.size} subscriptions in your vault.`,
        }
      );
    } catch {
      toast.error("Failed to apply savings plan.");
    } finally {
      setIsApplying(false);
    }
  };

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active");

  return (
    <BentoCard colSpan={2} className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-text-primary">Interactive Savings Simulator</h2>
          </div>
          <p className="text-xs text-text-muted">
            Select subscriptions you can live without to simulate instant burn reduction.
          </p>
        </div>

        <button
          onClick={() => {
            const allZombies = new Set<string>();
            subscriptions.forEach((s) => {
              if (isZombie(s) && s.status === "active") allZombies.add(s.id);
            });
            setSelectedToCancel(allZombies);
          }}
          className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1.5"
        >
          <Ghost className="w-3.5 h-3.5" />
          Select Zombies Only
        </button>
      </div>

      {/* Simulator Results Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
        <div>
          <span className="text-[11px] text-text-muted font-medium">Monthly Savings</span>
          <div className="mt-1 text-2xl font-black text-emerald-400">
            +{formatCurrency(simulatedMonthlySavings)}
            <span className="text-xs font-normal text-text-muted">/mo</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-text-muted font-medium">Annual Capital Retained</span>
          <div className="mt-1 text-2xl font-black text-emerald-400">
            +{formatCurrency(simulatedAnnualSavings)}
            <span className="text-xs font-normal text-text-muted">/yr</span>
          </div>
        </div>

        <div>
          <span className="text-[11px] text-text-muted font-medium">New Adjusted Bleed</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-text-primary">
              {formatCurrency(newBleed)}
            </span>
            {percentSaved > 0 && (
              <span className="text-xs font-bold text-emerald-400">
                (-{percentSaved}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* List with checkboxes */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-none">
        {activeSubscriptions.map((sub) => {
          const isSelected = selectedToCancel.has(sub.id);
          const zombie = isZombie(sub);
          const monthly = Math.round(toMonthly(sub.cost, sub.billing_cycle));

          return (
            <div
              key={sub.id}
              onClick={() => toggleSelect(sub.id)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                isSelected
                  ? "bg-emerald-500/10 border-emerald-500/40"
                  : "bg-surface-base border-border-subtle hover:bg-surface-hover"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    isSelected
                      ? "bg-emerald-500 border-emerald-400 text-black"
                      : "border-border-subtle bg-surface-base"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
                  style={{ backgroundColor: sub.color || "#8B5CF6" }}
                >
                  {sub.service_name.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-primary">
                      {sub.service_name}
                    </span>
                    {zombie && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Zombie (30d+ unused)
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-text-muted">{sub.category}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-text-primary">
                  {formatCurrency(monthly)}/mo
                </span>
                <div className="text-[10px] text-text-muted capitalize">
                  {sub.billing_cycle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs text-text-muted">
          {selectedToCancel.size} service{selectedToCancel.size === 1 ? "" : "s"} selected for termination
        </span>
        <GradientButton
          onClick={handleApply}
          disabled={selectedToCancel.size === 0 || isApplying}
          size="sm"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          {isApplying ? "Applying..." : "Execute Savings Plan"}
        </GradientButton>
      </div>
    </BentoCard>
  );
};
