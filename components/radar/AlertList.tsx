"use client";

import React, { useState, useEffect, useMemo } from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { Subscription } from "@/lib/calc";
import { generateAlerts, AlertItem } from "@/lib/alerts";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Ghost,
  CreditCard,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface AlertListProps {
  subscriptions: Subscription[];
}

export const AlertList: React.FC<AlertListProps> = ({ subscriptions }) => {
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem("vaulty_read_alerts");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [filter, setFilter] = useState<"all" | "unread" | "trial" | "zombie" | "renewal">("all");

  useEffect(() => {
    try {
      localStorage.setItem("vaulty_read_alerts", JSON.stringify(Array.from(readIds)));
    } catch {
      // Ignore localStorage errors
    }
  }, [readIds]);

  const alerts = useMemo(
    () => generateAlerts(subscriptions, readIds),
    [subscriptions, readIds]
  );

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const markAllAsRead = () => {
    const next = new Set(readIds);
    alerts.forEach((a) => next.add(a.id));
    setReadIds(next);
    toast.success("All alerts marked as read.");
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "unread") return !a.is_read;
    if (filter === "trial") return a.type === "trial_expiry";
    if (filter === "zombie") return a.type === "zombie_detected";
    if (filter === "renewal") return a.type === "renewal_due";
    return true;
  });

  const getAlertIcon = (type: AlertItem["type"]) => {
    switch (type) {
      case "trial_expiry":
        return <Clock className="w-4 h-4 text-violet-400" />;
      case "zombie_detected":
        return <Ghost className="w-4 h-4 text-pink-400" />;
      case "renewal_due":
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <BentoCard colSpan={2} className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-violet-400" />
            <h2 className="text-base font-bold text-text-primary">Notification Centre</h2>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted">
            Automated alerts for expiring trials, zombie liabilities, and upcoming renewals.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border-subtle/50 pb-2 text-xs overflow-x-auto">
        {(
          [
            { id: "all", label: `All (${alerts.length})` },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "trial", label: "Trials" },
            { id: "zombie", label: "Zombies" },
            { id: "renewal", label: "Renewals" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === tab.id
                ? "bg-violet-600 text-white shadow-sm"
                : "text-text-secondary hover:text-white hover:bg-surface-hover"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-none">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-surface-base border border-border-subtle/40 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-xs font-semibold text-text-primary">No notifications</h3>
            <p className="text-[11px] text-text-muted">
              {filter === "unread"
                ? "You're all caught up! No unread alerts."
                : "No alerts match the selected filter."}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                alert.is_read
                  ? "bg-surface-base border-border-subtle opacity-75"
                  : "bg-surface-base/90 border-violet-500/40 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${alert.color || "#8B5CF6"}20` }}
                >
                  {getAlertIcon(alert.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">
                      {alert.title}
                    </span>
                    {!alert.is_read && (
                      <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                {alert.action_url && (
                  <a
                    href={alert.action_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-surface-hover hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                    title="Open service cancel page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {!alert.is_read && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="p-1.5 rounded-lg bg-surface-hover hover:bg-white/10 text-text-muted hover:text-emerald-400 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </BentoCard>
  );
};
