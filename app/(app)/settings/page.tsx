"use client";

import React, { useState } from "react";
import { useSubscriptions } from "@/components/providers/SubscriptionProvider";
import { BentoCard } from "@/components/ui/BentoCard";
import { GradientButton } from "@/components/ui/GradientButton";
import {
  Settings as SettingsIcon,
  User,
  GraduationCap,
  Bell,
  Database,
  RotateCcw,
  Download,
  CheckCircle,
  Info,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function SettingsPage() {
  const { subscriptions, resetToDemo, clearAllSubscriptions } = useSubscriptions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [displayName, setDisplayName] = useState("Arjun");
  const [currency, setCurrency] = useState("INR");
  const [reminderDays, setReminderDays] = useState(3);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Preferences updated successfully!");
  };

  const handleResetData = async () => {
    await resetToDemo();
    toast.success("Reset data to calibrated demo profile (₹3,849/mo bleed).");
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(subscriptions, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vaulty_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Exported subscriptions backup JSON.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
            <SettingsIcon className="w-4 h-4" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-text-primary">
            Settings & Submission Profile
          </h1>
        </div>
        <p className="text-sm text-text-muted mt-1">
          Manage your personal preferences, notification thresholds, and examine project submission credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Preferences Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Preferences */}
          <BentoCard colSpan={2} className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" />
              <h2 className="text-base font-bold text-text-primary">User Profile & Currency</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">
                    Display Name / Persona
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-surface-base border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">
                    Primary Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-surface-base border border-border-subtle rounded-xl px-3.5 py-2.5 text-xs text-text-primary focus:outline-none focus:border-violet-500"
                  >
                    <option value="INR" className="bg-[#12131A] text-white">
                      INR (₹) - Indian Rupee
                    </option>
                    <option value="USD" className="bg-[#12131A] text-white">
                      USD ($) - US Dollar
                    </option>
                    <option value="EUR" className="bg-[#12131A] text-white">
                      EUR (€) - Euro
                    </option>
                    <option value="GBP" className="bg-[#12131A] text-white">
                      GBP (£) - British Pound
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Default Renewal Reminder Window
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 7].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setReminderDays(days)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        reminderDays === days
                          ? "bg-violet-600 border-violet-500 text-white shadow-sm"
                          : "bg-surface-base border-border-subtle text-text-secondary hover:text-white"
                      }`}
                    >
                      {days} Day{days > 1 ? "s" : ""} Prior
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-violet-400" />
                  <div>
                    <span className="text-xs font-semibold text-text-primary block">
                      Browser Renewal Alerts
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Notify before recurring debit dates
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationsEnabled}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    notificationsEnabled ? "bg-violet-500" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      notificationsEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="pt-3">
                <GradientButton type="submit" size="sm">
                  Save Preferences
                </GradientButton>
              </div>
            </form>
          </BentoCard>

          {/* Danger Zone & Data Operations */}
          <BentoCard colSpan={2} className="p-6 space-y-5 border-rose-500/20 bg-rose-500/5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-rose-400" />
              <h2 className="text-base font-bold text-text-primary">Data Management & Engine State</h2>
            </div>
            <p className="text-xs text-text-muted">
              Manage your local storage cache, export data dumps, or restore demo telemetry.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetData}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Arjun Demo Seed
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-base hover:bg-surface-hover text-text-secondary hover:text-white border border-border-subtle transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export Backup (JSON)
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete All Data
              </button>
            </div>

            {/* Typed Confirmation Dialog */}
            <ConfirmDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              onConfirm={async () => {
                await clearAllSubscriptions();
                setIsDeleteDialogOpen(false);
              }}
              title="Delete All Subscription Data?"
              description="This will permanently delete all tracked subscriptions and wipe local cached telemetry. This action cannot be reversed."
              confirmLabel="Permanently Delete All"
              cancelLabel="Cancel"
              isDestructive={true}
              requireTypedPhrase="DELETE"
            />
          </BentoCard>
        </div>

        {/* Right Column: College Project Credentials (1 col) */}
        <BentoCard colSpan={1} className="p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-text-primary">Academic Submission</h2>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-base border border-border-subtle text-xs space-y-2.5">
              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
                  Student Name
                </span>
                <span className="font-bold text-white text-sm">Lakshya Singh</span>
              </div>

              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
                  University Roll Number
                </span>
                <span className="font-mono font-bold text-violet-400 text-sm">
                  240919106122
                </span>
              </div>

              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
                  Institution
                </span>
                <span className="font-semibold text-text-primary">
                  IMS Noida (CCSU Meerut)
                </span>
              </div>

              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
                  Course & Subject
                </span>
                <span className="font-medium text-text-secondary">
                  BCA 5th Semester &bull; BCA-508 Minor Project
                </span>
              </div>

              <div>
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
                  Student Contact
                </span>
                <span className="text-text-muted font-mono block">
                  lakshyasingh.bcr24224@imsnoida.com
                </span>
                <span className="text-text-muted font-mono block">
                  +91 9891112062
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/25 text-xs text-violet-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-violet-400" />
              <span>
                Verified for viva & practical examination. Documentation report PDF (33 pages) compiled in repository root.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
            <span>Dual Persistence Engine:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Active
            </span>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
