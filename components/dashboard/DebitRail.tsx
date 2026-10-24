"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BentoCard } from "@/components/ui/BentoCard";
import { Subscription } from "@/lib/calc";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/format";
import { ExternalLink, CreditCard, ArrowRight, X } from "lucide-react";

interface DebitRailProps {
  upcomingList: Subscription[];
  onMarkCancelled?: (id: string) => void;
}

export const DebitRail: React.FC<DebitRailProps> = ({
  upcomingList,
  onMarkCancelled,
}) => {
  const [selectedSubForCancel, setSelectedSubForCancel] = useState<Subscription | null>(null);

  const handleOpenCancelModal = (sub: Subscription) => {
    setSelectedSubForCancel(sub);
  };

  const handleProceedCancel = () => {
    if (!selectedSubForCancel) return;
    if (selectedSubForCancel.cancel_url) {
      window.open(selectedSubForCancel.cancel_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <BentoCard colSpan={2} className="flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold tracking-wider uppercase text-text-muted">
              Upcoming Debits
            </span>
          </div>
          <Link
            href="/vault"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Scroll Snap Rail */}
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin">
          {upcomingList.map((sub) => (
            <div
              key={sub.id}
              className="shrink-0 w-52 p-4 rounded-[20px] glass-panel bg-surface border border-border-subtle flex flex-col justify-between snap-start hover:border-violet-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: sub.color || "#8B5CF6" }}
                >
                  {sub.service_name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[10px] font-semibold text-text-muted bg-white/5 px-2 py-0.5 rounded-full border border-border-subtle shrink-0">
                  {formatRelativeTime(sub.next_billing_date)}
                </span>
              </div>

              <div className="my-2">
                <h4 className="text-sm font-bold text-text-primary truncate">
                  {sub.service_name}
                </h4>
                <div className="text-xs text-text-muted mt-0.5">
                  Renews {formatDate(sub.next_billing_date)}
                </div>
                <div className="text-sm font-extrabold text-text-primary mt-1.5 tabular-nums">
                  {formatCurrency(sub.cost)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCancelModal(sub)}
                className="w-full mt-1 py-1.5 px-2.5 rounded-full text-[11px] font-semibold text-text-secondary border border-border-subtle hover:text-pink-400 hover:border-pink-500/30 hover:bg-pink-500/10 transition-all flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Cancel Link</span>
              </button>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Cancellation Modal Confirmation Dialog */}
      {selectedSubForCancel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
        >
          <div className="glass-panel bg-elevated rounded-modal p-6 max-w-md w-full shadow-card border border-border-subtle">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-text-primary">
                Open {selectedSubForCancel.service_name}&apos;s Cancellation Page?
              </h3>
              <button
                onClick={() => setSelectedSubForCancel(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              We can&apos;t cancel for you automatically, but we&apos;ll take you straight to{" "}
              <strong className="text-text-primary">{selectedSubForCancel.service_name}&apos;s</strong>{" "}
              cancellation portal.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setSelectedSubForCancel(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-text-secondary hover:bg-white/5"
              >
                Nevermind
              </button>

              {onMarkCancelled && (
                <button
                  type="button"
                  onClick={() => {
                    onMarkCancelled(selectedSubForCancel.id);
                    setSelectedSubForCancel(null);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white/10 text-text-primary hover:bg-white/15"
                >
                  Mark as Cancelled
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  handleProceedCancel();
                  setSelectedSubForCancel(null);
                }}
                className="px-4 py-2 rounded-full text-xs font-bold bg-pink-500 text-white shadow-glow-pink hover:bg-pink-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Continue to Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
