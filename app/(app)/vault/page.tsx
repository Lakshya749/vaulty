"use client";

import React, { useState, useMemo } from "react";
import { useSubscriptions } from "@/components/providers/SubscriptionProvider";
import { SubscriptionTable } from "@/components/vault/SubscriptionTable";
import { SubscriptionGrid } from "@/components/vault/SubscriptionGrid";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { GradientButton } from "@/components/ui/GradientButton";
import { formatCurrency } from "@/lib/format";
import { isZombie, toMonthly } from "@/lib/calc";
import {
  Search,
  Download,
  Plus,
  LayoutGrid,
  LayoutList,
  Ghost,
  Clock,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";

type ViewMode = "table" | "grid";
type SortOption = "cost-desc" | "cost-asc" | "renewal" | "name" | "status";

export default function VaultPage() {
  const {
    subscriptions,
    loading,
    bleed,
    zombieCount,
    zombieSavingsAmount,
    trials,
    deleteSubscription,
    toggleStatus,
    markUsedToday,
  } = useSubscriptions();

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("cost-desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Available categories for filter pills
  const categories = [
    "All",
    "Streaming",
    "AI Tools",
    "Gym / Fitness",
    "Cloud & Storage",
    "Gaming",
    "Music",
    "Productivity",
    "Zombies",
    "Trials",
  ];

  // Filtering and sorting logic
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (sub) =>
          sub.service_name.toLowerCase().includes(q) ||
          sub.category.toLowerCase().includes(q) ||
          (sub.notes && sub.notes.toLowerCase().includes(q))
      );
    }

    // Category / Special filter
    if (selectedCategory === "Zombies") {
      result = result.filter((sub) => isZombie(sub));
    } else if (selectedCategory === "Trials") {
      result = result.filter((sub) => sub.is_free_trial);
    } else if (selectedCategory !== "All") {
      result = result.filter(
        (sub) => sub.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "cost-desc") {
        return toMonthly(b.cost, b.billing_cycle) - toMonthly(a.cost, a.billing_cycle);
      }
      if (sortBy === "cost-asc") {
        return toMonthly(a.cost, a.billing_cycle) - toMonthly(b.cost, b.billing_cycle);
      }
      if (sortBy === "name") {
        return a.service_name.localeCompare(b.service_name);
      }
      if (sortBy === "renewal") {
        return new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime();
      }
      if (sortBy === "status") {
        if (a.status === b.status) return 0;
        return a.status === "active" ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [subscriptions, searchQuery, selectedCategory, sortBy]);

  // CSV Export handler
  const handleExportCSV = () => {
    if (subscriptions.length === 0) return;

    const headers = [
      "ID",
      "Service Name",
      "Category",
      "Cost",
      "Billing Cycle",
      "Monthly Normalized Cost",
      "Currency",
      "Next Renewal Date",
      "Status",
      "Is Trial",
      "Trial End Date",
      "Last Used Date",
      "Cancel URL",
    ];

    const rows = subscriptions.map((s) => [
      `"${s.id}"`,
      `"${s.service_name.replace(/"/g, '""')}"`,
      `"${s.category.replace(/"/g, '""')}"`,
      s.cost,
      `"${s.billing_cycle}"`,
      toMonthly(s.cost, s.billing_cycle),
      `"${s.currency}"`,
      `"${s.next_billing_date}"`,
      `"${s.status}"`,
      s.is_free_trial ? "true" : "false",
      s.trial_end_date ? `"${s.trial_end_date}"` : '""',
      s.last_used_at ? `"${s.last_used_at}"` : '""',
      s.cancel_url ? `"${s.cancel_url.replace(/"/g, '""')}"` : '""',
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `vaulty_subscriptions_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Action Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
            Subscription Vault
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {subscriptions.length} Tracked
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage your digital liabilities, renewal dates, and optimize your monthly burn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-text-secondary bg-surface-base hover:bg-surface-hover border border-border-subtle hover:text-white transition-all shadow-sm"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <GradientButton onClick={handleAddNew} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Subscription
          </GradientButton>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl glass-panel border border-border-subtle flex flex-col justify-between">
          <span className="text-xs text-text-muted font-medium">Total Monthly Bleed</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl lg:text-2xl font-black text-text-primary tracking-tight">
              {formatCurrency(bleed)}
            </span>
            <span className="text-[11px] text-text-muted">/mo</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-border-subtle flex flex-col justify-between">
          <span className="text-xs text-text-muted font-medium">Active Services</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl lg:text-2xl font-black text-emerald-400">
              {subscriptions.filter((s) => s.status === "active").length}
            </span>
            <span className="text-[11px] text-text-muted">of {subscriptions.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Zombies Detected</span>
            <Ghost className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl lg:text-2xl font-black text-amber-400">
              {zombieCount}
            </span>
            <span className="text-[11px] text-text-muted">
              Save {formatCurrency(zombieSavingsAmount)}/mo
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Trials Pending</span>
            <Clock className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl lg:text-2xl font-black text-violet-400">
              {trials.length}
            </span>
            <span className="text-[11px] text-text-muted">
              {trials.length > 0 ? "Action required" : "All clean"}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-3 p-4 rounded-2xl glass-panel border border-border-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name, category, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-base border border-border-subtle rounded-xl pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-surface-base border border-border-subtle rounded-xl px-3 py-1.5 text-xs text-text-secondary">
              <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort subscriptions"
                className="bg-transparent border-none text-text-primary text-xs focus:outline-none cursor-pointer"
              >
                <option value="cost-desc" className="bg-[#12131A] text-white">
                  Cost: High to Low
                </option>
                <option value="cost-asc" className="bg-[#12131A] text-white">
                  Cost: Low to High
                </option>
                <option value="renewal" className="bg-[#12131A] text-white">
                  Renewal: Soonest First
                </option>
                <option value="name" className="bg-[#12131A] text-white">
                  Name: A to Z
                </option>
                <option value="status" className="bg-[#12131A] text-white">
                  Status: Active First
                </option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-surface-base border border-border-subtle rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-text-muted hover:text-white"
                }`}
                title="Table View"
                aria-label="Switch to table view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-text-muted hover:text-white"
                }`}
                title="Grid View"
                aria-label="Switch to grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                  isSelected
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
                    : "bg-surface-base/80 text-text-secondary hover:text-white hover:bg-surface-hover border border-border-subtle/50"
                }`}
              >
                {cat === "Zombies" && "🧟 "}
                {cat === "Trials" && "⏳ "}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {loading ? (
        <div className="py-20 text-center text-text-muted animate-pulse">
          Loading subscription vault...
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <div className="py-16 text-center rounded-[20px] glass-panel border border-border-subtle space-y-3">
          <div className="w-12 h-12 rounded-full bg-surface-hover mx-auto flex items-center justify-center text-text-muted">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">No subscriptions found</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            We couldn&apos;t find any subscriptions matching your filter or search criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium pt-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        </div>
      ) : viewMode === "table" ? (
        <SubscriptionTable
          subscriptions={filteredSubscriptions}
          onEdit={handleEdit}
          onDelete={deleteSubscription}
          onToggleStatus={toggleStatus}
          onMarkUsed={markUsedToday}
        />
      ) : (
        <SubscriptionGrid
          subscriptions={filteredSubscriptions}
          onEdit={handleEdit}
          onDelete={deleteSubscription}
          onToggleStatus={toggleStatus}
        />
      )}

      {/* Subscription Add / Edit Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
        editingSubscriptionId={editingId}
      />
    </div>
  );
}
