"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscriptionSchema, SubscriptionFormData } from "@/lib/schemas";
import { BRAND_PRESETS, CATEGORIES } from "@/lib/presets";
import { toMonthly, Cycle } from "@/lib/calc";
import { formatCurrency } from "@/lib/format";
import { GradientButton } from "@/components/ui/GradientButton";
import { useSubscriptions } from "@/components/providers/SubscriptionProvider";
import { X, Sparkles, ExternalLink } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSubscriptionId?: string | null;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  editingSubscriptionId,
}) => {
  const { subscriptions, addSubscription, updateSubscription } = useSubscriptions();
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const existingSub = editingSubscriptionId
    ? subscriptions.find((s) => s.id === editingSubscriptionId)
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      service_name: "",
      category: "Streaming",
      cost: 499,
      currency: "INR",
      billing_cycle: "monthly",
      next_billing_date: new Date().toISOString().split("T")[0],
      status: "active",
      is_free_trial: false,
      trial_end_date: null,
      reminder_days: 3,
      cancel_url: "",
      notes: "",
      color: "#8B5CF6",
    },
  });

  const cost = watch("cost") || 0;
  const cycle = (watch("billing_cycle") || "monthly") as Cycle;
  const isFreeTrial = watch("is_free_trial");

  const monthlyEquiv = toMonthly(cost, cycle);
  const yearlyEquiv = monthlyEquiv * 12;

  useEffect(() => {
    if (existingSub) {
      reset({
        service_name: existingSub.service_name,
        category: existingSub.category,
        cost: existingSub.cost,
        currency: existingSub.currency,
        billing_cycle: existingSub.billing_cycle,
        next_billing_date: existingSub.next_billing_date.split("T")[0],
        is_free_trial: existingSub.is_free_trial,
        trial_end_date: existingSub.trial_end_date ? existingSub.trial_end_date.split("T")[0] : null,
        reminder_days: existingSub.reminder_days,
        cancel_url: existingSub.cancel_url || "",
        notes: existingSub.notes || "",
        color: existingSub.color || "#8B5CF6",
      });
      setSelectedPresetId(null);
    } else {
      reset({
        service_name: "",
        category: "Streaming",
        cost: 499,
        currency: "INR",
        billing_cycle: "monthly",
        next_billing_date: new Date().toISOString().split("T")[0],
        is_free_trial: false,
        trial_end_date: null,
        reminder_days: 3,
        cancel_url: "",
        notes: "",
        color: "#8B5CF6",
      });
      setSelectedPresetId(null);
    }
  }, [existingSub, isOpen, reset]);

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: string) => {
    const preset = BRAND_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(preset.id);
    setValue("service_name", preset.name);
    setValue("category", preset.category);
    setValue("cost", preset.defaultCost);
    setValue("billing_cycle", preset.billingCycle);
    setValue("color", preset.color);
    setValue("cancel_url", preset.cancelUrl);
  };

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      if (editingSubscriptionId) {
        await updateSubscription(editingSubscriptionId, data);
      } else {
        await addSubscription(data);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const cycles: Cycle[] = ["weekly", "monthly", "quarterly", "yearly"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-panel bg-elevated rounded-modal p-6 shadow-card border border-border-subtle focus:outline-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">
              {editingSubscriptionId ? "Edit Subscription" : "Add New Subscription"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Brand Presets Scroller */}
        {!editingSubscriptionId && (
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 block">
              Quick Presets
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {BRAND_PRESETS.map((p) => {
                const isSelected = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-violet-500/20 border-violet-500 text-violet-400 shadow-glow-violet"
                        : "bg-surface border-border-subtle text-text-secondary hover:text-text-primary hover:bg-white/5"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Service Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                Service Name *
              </label>
              <input
                {...register("service_name")}
                placeholder="e.g. Netflix, Spotify"
                className="w-full h-11 px-3.5 rounded-input bg-surface border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none transition-colors text-sm"
              />
              {errors.service_name && (
                <p className="text-xs text-red-400 mt-1">{errors.service_name.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                Category *
              </label>
              <select
                {...register("category")}
                className="w-full h-11 px-3.5 rounded-input bg-surface border border-border-subtle text-text-primary focus:border-violet-500 focus:outline-none transition-colors text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name} className="bg-elevated text-text-primary">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost & Billing Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                Recurring Cost (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  step="1"
                  {...register("cost", { valueAsNumber: true })}
                  placeholder="299"
                  className="w-full h-11 pl-8 pr-3.5 rounded-input bg-surface border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none transition-colors text-sm tabular-nums"
                />
              </div>
              {errors.cost && (
                <p className="text-xs text-red-400 mt-1">{errors.cost.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                Billing Cycle *
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 rounded-input bg-surface border border-border-subtle h-11 items-center">
                {cycles.map((c) => {
                  const isSelected = cycle === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue("billing_cycle", c)}
                      className={`h-9 rounded-lg text-xs font-bold capitalize transition-all ${
                        isSelected
                          ? "bg-violet-500 text-text-primary shadow-glow-violet"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      {c.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Next Renewal Date & Reminder Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                Next Billing Date *
              </label>
              <input
                type="date"
                {...register("next_billing_date")}
                className="w-full h-11 px-3.5 rounded-input bg-surface border border-border-subtle text-text-primary focus:border-violet-500 focus:outline-none transition-colors text-sm"
              />
              {errors.next_billing_date && (
                <p className="text-xs text-red-400 mt-1">{errors.next_billing_date.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                Reminder Window
              </label>
              <select
                {...register("reminder_days", { valueAsNumber: true })}
                className="w-full h-11 px-3.5 rounded-input bg-surface border border-border-subtle text-text-primary focus:border-violet-500 focus:outline-none transition-colors text-sm"
              >
                <option value={1} className="bg-elevated">1 day before renewal</option>
                <option value={3} className="bg-elevated">3 days before renewal (Default)</option>
                <option value={7} className="bg-elevated">7 days before renewal</option>
              </select>
            </div>
          </div>

          {/* Free Trial Toggle & End Date */}
          <div className="p-3.5 rounded-input bg-surface border border-border-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-text-primary">Free Trial Plan?</div>
                <div className="text-xs text-text-secondary">Warn me before it converts to paid</div>
              </div>
              <input
                type="checkbox"
                {...register("is_free_trial")}
                className="w-5 h-5 accent-violet-500 rounded cursor-pointer"
              />
            </div>

            {isFreeTrial && (
              <div className="pt-2 border-t border-border-subtle animate-in fade-in">
                <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                  Trial Expiration Date *
                </label>
                <input
                  type="date"
                  {...register("trial_end_date")}
                  className="w-full h-10 px-3.5 rounded-input bg-surface border border-border-subtle text-text-primary focus:border-violet-500 focus:outline-none text-sm"
                />
              </div>
            )}
          </div>

          {/* Cancel URL */}
          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1.5 flex items-center justify-between">
              <span>Direct Cancellation Portal Link (Optional)</span>
              <span className="text-text-muted text-[10px] flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Opens in 1-click
              </span>
            </label>
            <input
              {...register("cancel_url")}
              placeholder="https://..."
              className="w-full h-11 px-3.5 rounded-input bg-surface border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-violet-500 focus:outline-none transition-colors text-sm"
            />
            {errors.cancel_url && (
              <p className="text-xs text-red-400 mt-1">{errors.cancel_url.message}</p>
            )}
          </div>

          {/* Live Preview Strip */}
          <div className="py-2.5 px-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-between text-xs">
            <span className="text-violet-400 font-medium">Equivalence Calculation:</span>
            <span className="text-text-primary font-bold tabular-nums">
              That&apos;s {formatCurrency(yearlyEquiv)}/yr and {formatCurrency(monthlyEquiv)}/mo
            </span>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <GradientButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Subscription"}
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  );
};
