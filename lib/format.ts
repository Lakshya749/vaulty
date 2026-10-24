import { format, differenceInDays, differenceInHours } from "date-fns";

/**
 * Formats monetary amounts in Indian Rupee format (or specified currency) with tabular numerals.
 */
export const formatCurrency = (
  amount: number,
  currency: string = "INR"
): string => {
  const rounded = Math.round(amount);
  if (currency === "INR") {
    const formatted = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(rounded);
    return `₹${formatted}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(rounded);
};

/**
 * Standard readable date formatting (e.g. "14 Oct 2026" or "14 Oct").
 */
export const formatDate = (
  date: Date | string,
  pattern: string = "d MMM"
): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern);
};

/**
 * Friendly relative time copy (e.g., "in 48 hrs", "in 3 days", "today", "expired").
 */
export const formatRelativeTime = (
  targetDate: Date | string,
  now: Date = new Date()
): string => {
  const d = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const hoursDiff = differenceInHours(d, now);
  const daysDiff = differenceInDays(d, now);

  if (hoursDiff <= 0) return "Today";
  if (hoursDiff <= 48) return `in ${hoursDiff} hrs`;
  if (daysDiff === 1) return "Tomorrow";
  return `in ${daysDiff} days`;
};

/**
 * Capitalizes cycle name cleanly for badge display.
 */
export const formatCycleLabel = (cycle: string): string => {
  switch (cycle.toLowerCase()) {
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    case "quarterly":
      return "Quarterly";
    case "yearly":
      return "Yearly";
    default:
      return cycle;
  }
};
