"use client";

import React from "react";
import { Subscription } from "@/lib/calc";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/format";
import { isZombie } from "@/lib/calc";
import { Ghost, ExternalLink, MoreVertical, CheckCircle, Trash2, Edit2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onMarkUsed: (id: string) => void;
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  onEdit,
  onDelete,
  onToggleStatus,
  onMarkUsed,
}) => {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [subToDelete, setSubToDelete] = React.useState<Subscription | null>(null);

  return (
    <div className="w-full overflow-x-auto rounded-[20px] glass-panel border border-border-subtle">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-hover/50 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-border-subtle">
          <tr>
            <th className="py-3.5 px-4">Service</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4 text-right">Cost</th>
            <th className="py-3.5 px-4">Cycle</th>
            <th className="py-3.5 px-4">Next Renewal</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle/40">
          {subscriptions.map((sub) => {
            const zombie = isZombie(sub);
            const isMenuOpen = activeMenuId === sub.id;

            return (
              <tr
                key={sub.id}
                className="hover:bg-surface-hover/80 transition-colors group"
              >
                {/* Service Name & Brand Icon */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: sub.color || "#8B5CF6" }}
                    >
                      {sub.service_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary flex items-center gap-2">
                        <span>{sub.service_name}</span>
                        {zombie && (
                          <span
                            title="Zombie: Unused for 30+ days"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-400 bg-pink-500/15 border border-pink-500/30 px-1.5 py-0.2 rounded-full"
                          >
                            <Ghost className="w-3 h-3" /> Zombie
                          </span>
                        )}
                        {sub.is_free_trial && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.2 rounded-full">
                            Trial
                          </span>
                        )}
                      </div>
                      {sub.notes && (
                        <div className="text-xs text-text-muted truncate max-w-xs">{sub.notes}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 border border-border-subtle text-text-secondary">
                    {sub.category}
                  </span>
                </td>

                {/* Cost */}
                <td className="py-3.5 px-4 text-right font-bold text-text-primary tabular-nums">
                  {formatCurrency(sub.cost)}
                </td>

                {/* Cycle */}
                <td className="py-3.5 px-4 text-xs font-medium text-text-secondary capitalize">
                  {sub.billing_cycle}
                </td>

                {/* Next Renewal */}
                <td className="py-3.5 px-4">
                  <div className="text-xs font-medium text-text-primary">
                    {formatDate(sub.next_billing_date)}
                  </div>
                  <div className="text-[11px] text-text-muted">
                    {formatRelativeTime(sub.next_billing_date)}
                  </div>
                </td>

                {/* Status Switch Toggle */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={sub.status === "active"}
                    onClick={() => onToggleStatus(sub.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      sub.status === "active" ? "bg-violet-500 shadow-glow-violet" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        sub.status === "active" ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </td>

                {/* Actions Menu */}
                <td className="py-3.5 px-4 text-right relative">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="Actions"
                      onClick={() => setActiveMenuId(isMenuOpen ? null : sub.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Actions Dropdown */}
                  {isMenuOpen && (
                    <div className="absolute right-4 top-12 z-30 w-44 rounded-xl glass-panel bg-elevated border border-border-subtle p-1.5 shadow-card text-xs text-left animate-in fade-in zoom-in-95">
                      <button
                        onClick={() => {
                          onEdit(sub.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-violet-400" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        onClick={() => {
                          onMarkUsed(sub.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark Used Today</span>
                      </button>

                      {sub.cancel_url && (
                        <a
                          href={sub.cancel_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setActiveMenuId(null)}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
                          <span>Cancel Portal</span>
                        </a>
                      )}

                      <div className="h-px bg-border-subtle my-1" />

                      <button
                        onClick={() => {
                          setSubToDelete(sub);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
