"use client";

import React from "react";
import { Subscription, isZombie } from "@/lib/calc";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/format";
import { BentoCard } from "@/components/ui/BentoCard";
import { Ghost, ExternalLink, Edit2, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface SubscriptionGridProps {
  subscriptions: Subscription[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const SubscriptionGrid: React.FC<SubscriptionGridProps> = ({
  subscriptions,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [subToDelete, setSubToDelete] = React.useState<Subscription | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((sub) => {
        const zombie = isZombie(sub);

        return (
          <BentoCard
            key={sub.id}
            colSpan={1}
            className="flex flex-col justify-between p-5 space-y-4 hover:border-violet-500/40"
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 shadow-md"
                  style={{ backgroundColor: sub.color || "#8B5CF6" }}
                >
                  {sub.service_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-sm truncate max-w-[140px]">
                    {sub.service_name}
                  </h3>
                  <span className="text-[11px] text-text-muted">{sub.category}</span>
                </div>
              </div>

              {/* Status Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={sub.status === "active"}
                onClick={() => onToggleStatus(sub.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  sub.status === "active" ? "bg-violet-500" : "bg-white/20"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    sub.status === "active" ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {zombie && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-400 bg-pink-500/15 border border-pink-500/30 px-2 py-0.5 rounded-full">
                  <Ghost className="w-3 h-3" /> Zombie Sub
                </span>
              )}
              {sub.is_free_trial && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  Free Trial
                </span>
              )}
            </div>

            {/* Middle: Cost & Cycle */}
            <div className="pt-2 border-t border-border-subtle/50">
              <div className="text-xl font-extrabold text-text-primary tabular-nums">
                {formatCurrency(sub.cost)}
                <span className="text-xs font-normal text-text-muted"> / {sub.billing_cycle}</span>
              </div>
              <div className="text-xs text-text-secondary mt-1 flex items-center justify-between">
                <span>Renews {formatDate(sub.next_billing_date)}</span>
                <span className="text-text-muted">{formatRelativeTime(sub.next_billing_date)}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(sub.id)}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSubToDelete(sub)}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {sub.cancel_url && (
                <a
                  href={sub.cancel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-secondary hover:text-pink-400 transition-colors"
                >
                  <span>Cancel Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </BentoCard>
        );
      })}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(subToDelete)}
        onClose={() => setSubToDelete(null)}
        onConfirm={() => {
          if (subToDelete) {
            onDelete(subToDelete.id);
            setSubToDelete(null);
          }
        }}
        title={`Delete ${subToDelete?.service_name}?`}
        description="This can't be undone after 5 seconds."
        confirmLabel="Delete"
        cancelLabel="Keep"
        isDestructive={true}
      />
    </div>
  );
};
