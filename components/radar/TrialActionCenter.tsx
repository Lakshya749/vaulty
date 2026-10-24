"use client";

import React from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { Subscription } from "@/lib/calc";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/format";
import { Clock, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TrialActionCenterProps {
  trials: Subscription[];
  onCancelTrial: (id: string) => Promise<void>;
}

export const TrialActionCenter: React.FC<TrialActionCenterProps> = ({
  trials,
  onCancelTrial,
}) => {
  return (
    <BentoCard colSpan={2} className="p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            <h2 className="text-base font-bold text-text-primary">Free Trial Autopilot</h2>
          </div>
          <p className="text-xs text-text-muted">
            Pre-empt trial auto-conversions before your card gets charged.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
          {trials.length} Active Trial{trials.length === 1 ? "" : "s"}
        </span>
      </div>

      {trials.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-surface-base border border-border-subtle/50 space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">No Impending Auto-Charges</h3>
          <p className="text-xs text-text-muted max-w-xs mx-auto">
            You don&apos;t have any active free trials approaching billing thresholds.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trials.map((trial) => {
            const endDate = trial.trial_end_date || trial.next_billing_date;
            return (
              <div
                key={trial.id}
                className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/30 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md"
                      style={{ backgroundColor: trial.color || "#8B5CF6" }}
                    >
                      {trial.service_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        {trial.service_name}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 animate-pulse">
                          Auto-renews in {formatRelativeTime(endDate)}
                        </span>
                      </h4>
                      <p className="text-xs text-text-muted">
                        Expires {formatDate(endDate)} &bull; Will charge{" "}
                        <strong className="text-white font-mono">
                          {formatCurrency(trial.cost)}/{trial.billing_cycle}
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-base/80 border border-border-subtle text-xs text-text-secondary flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>
                    Cancelling now will <strong>not</strong> revoke current access. Most platforms allow you to enjoy full benefits until {formatDate(endDate)}.
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {trial.cancel_url && (
                    <a
                      href={trial.cancel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Cancel Portal
                    </a>
                  )}

                  <button
                    onClick={async () => {
                      await onCancelTrial(trial.id);
                      toast.success(`Cancelled ${trial.service_name} trial.`);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-base hover:bg-surface-hover border border-border-subtle text-text-secondary hover:text-white text-xs font-medium transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Mark as Terminated
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </BentoCard>
  );
};
