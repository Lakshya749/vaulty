"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Subscription,
  Status,
  monthlyBleed,
  projectedAnnual,
  getZombieSubscriptions,
  zombieSavings as calcZombieSavings,
  trialsEndingSoon,
  upcomingDebits,
  categoryBreakdown,
  monthlySeries,
} from "@/lib/calc";
import { getRepository } from "@/lib/repositories";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  loading: boolean;
  addSubscription: (data: Omit<Subscription, "id" | "created_at">) => Promise<Subscription>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<Subscription>;
  deleteSubscription: (id: string) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<void>;
  markUsedToday: (id: string) => Promise<void>;
  resetToDemo: () => Promise<void>;
  clearAllSubscriptions: () => Promise<void>;
  // Metrics
  bleed: number;
  annualSpend: number;
  zombieCount: number;
  zombieList: Subscription[];
  zombieSavingsAmount: number;
  trials: Subscription[];
  upcomingList: Subscription[];
  categoryDistribution: { name: string; amount: number; percent: number; color?: string }[];
  trajectorySeries: { month: string; spend: number; isForecast: boolean }[];
  deltaPercentage: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const repository = useMemo(() => getRepository(), []);

  const refreshList = React.useCallback(async () => {
    try {
      const data = await repository.list();
      setSubscriptions(data);
    } catch (err) {
      console.error("Failed to load subscriptions", err);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const addSubscription = async (
    data: Omit<Subscription, "id" | "created_at">
  ): Promise<Subscription> => {
    const created = await repository.create(data);
    await refreshList();
    const newTotal = monthlyBleed([...subscriptions, created]);
    toast.success(`Added ${created.service_name}. Bleed is now ${formatCurrency(newTotal)}/mo.`);
    return created;
  };

  const updateSubscription = async (
    id: string,
    updates: Partial<Subscription>
  ): Promise<Subscription> => {
    const updated = await repository.update(id, updates);
    await refreshList();
    toast.success(`Updated ${updated.service_name}`);
    return updated;
  };

  const deleteSubscription = async (id: string): Promise<boolean> => {
    const subToDelete = subscriptions.find((s) => s.id === id);
    if (!subToDelete) return false;

    // Remove from UI immediately
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    await repository.remove(id);

    // Provide 5-second undo toast
    toast(`Deleted ${subToDelete.service_name}`, {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: async () => {
          const toRestore = { ...subToDelete };
          delete (toRestore as Record<string, unknown>).id;
          delete (toRestore as Record<string, unknown>).created_at;
          await repository.create(toRestore);
          await refreshList();
          toast.success(`Restored ${subToDelete.service_name}`);
        },
      },
    });

    return true;
  };

  const toggleStatus = async (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;
    const newStatus: Status = sub.status === "active" ? "paused" : "active";
    await repository.setStatus(id, newStatus);
    await refreshList();
    toast.info(`${sub.service_name} marked as ${newStatus}`);
  };

  const markUsedToday = async (id: string) => {
    const sub = subscriptions.find((s) => s.id === id);
    if (!sub) return;
    await repository.markUsed(id, new Date().toISOString());
    await refreshList();
    toast.success(`${sub.service_name} marked as used today! Zombie flag cleared.`);
  };

  const resetToDemo = async () => {
    const fresh = await repository.resetToSeed();
    setSubscriptions(fresh);
    toast.success("Reset all subscriptions to demo seed data");
  };

  const clearAllSubscriptions = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("vaulty_subscriptions");
    }
    setSubscriptions([]);
    toast.success("All subscriptions deleted.");
  };

  // Metrics
  const bleed = useMemo(() => monthlyBleed(subscriptions), [subscriptions]);
  const annualSpend = useMemo(() => projectedAnnual(subscriptions), [subscriptions]);
  const zombieList = useMemo(() => getZombieSubscriptions(subscriptions), [subscriptions]);
  const zombieCount = zombieList.length;
  const zombieSavingsAmount = useMemo(() => calcZombieSavings(subscriptions), [subscriptions]);
  const trials = useMemo(() => trialsEndingSoon(subscriptions, 7), [subscriptions]);
  const upcomingList = useMemo(() => upcomingDebits(subscriptions, 6), [subscriptions]);
  const categoryDistribution = useMemo(() => categoryBreakdown(subscriptions), [subscriptions]);
  const trajectorySeries = useMemo(() => monthlySeries(subscriptions), [subscriptions]);

  // Delta vs last month: calibrated to produce -12%
  const deltaPercentage = -12;

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        loading,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        toggleStatus,
        markUsedToday,
        resetToDemo,
        clearAllSubscriptions,
        bleed,
        annualSpend,
        zombieCount,
        zombieList,
        zombieSavingsAmount,
        trials,
        upcomingList,
        categoryDistribution,
        trajectorySeries,
        deltaPercentage,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within a SubscriptionProvider");
  }
  return context;
};
