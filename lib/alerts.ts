import { Subscription, isZombie } from "./calc";
import { formatCurrency, formatDate, formatRelativeTime } from "./format";
import { differenceInDays, parseISO } from "date-fns";

export type AlertType = "trial_expiry" | "renewal_due" | "zombie_detected" | "price_hike";

export interface AlertItem {
  id: string;
  sub_id: string;
  type: AlertType;
  title: string;
  message: string;
  alert_date: string;
  is_read: boolean;
  service_name: string;
  color?: string;
  action_url?: string;
}

/**
 * Generates actionable in-app alerts based on PRD Section 8 rules:
 * 1. Trial Ending: within 7 days (urgent style under 48 hrs)
 * 2. Renewal Soon: next_billing_date within reminder_days
 * 3. Zombie: unused for 30+ days
 * 4. Price Hike: market price inflation
 */
export const generateAlerts = (
  subscriptions: Subscription[],
  readAlertIds: Set<string> = new Set()
): AlertItem[] => {
  const alerts: AlertItem[] = [];
  const now = new Date();

  subscriptions.forEach((sub) => {
    // 1. Free Trial Alerts
    if (sub.is_free_trial) {
      const trialEnd = sub.trial_end_date || sub.next_billing_date;
      if (trialEnd) {
        const daysLeft = differenceInDays(parseISO(trialEnd), now);
        if (daysLeft >= 0 && daysLeft <= 7) {
          const id = `trial-${sub.id}-${trialEnd.split("T")[0]}`;
          alerts.push({
            id,
            sub_id: sub.id,
            type: "trial_expiry",
            title: "Free Trial Expiring Soon",
            message: `${sub.service_name} trial ends in ${formatRelativeTime(trialEnd)}. Cancel now or you'll be debited ${formatCurrency(sub.cost)}.`,
            alert_date: trialEnd,
            is_read: readAlertIds.has(id),
            service_name: sub.service_name,
            color: sub.color || "#F59E0B",
            action_url: sub.cancel_url || undefined,
          });
        }
      }
    }

    // 2. Renewal Due Alerts (Active subscriptions)
    if (sub.status === "active" && !sub.is_free_trial) {
      const renewalDays = differenceInDays(parseISO(sub.next_billing_date), now);
      const reminderWindow = sub.reminder_days || 3;
      if (renewalDays >= 0 && renewalDays <= reminderWindow) {
        const id = `renewal-${sub.id}-${sub.next_billing_date.split("T")[0]}`;
        alerts.push({
          id,
          sub_id: sub.id,
          type: "renewal_due",
          title: "Upcoming Debit",
          message: `${sub.service_name} renews on ${formatDate(sub.next_billing_date)} for ${formatCurrency(sub.cost)}.`,
          alert_date: sub.next_billing_date,
          is_read: readAlertIds.has(id),
          service_name: sub.service_name,
          color: sub.color || "#8B5CF6",
        });
      }
    }

    // 3. Zombie Alerts (Active, unused 30+ days)
    if (isZombie(sub)) {
      const id = `zombie-${sub.id}`;
      alerts.push({
        id,
        sub_id: sub.id,
        type: "zombie_detected",
        title: "Zombie Subscription Detected",
        message: `You haven't used ${sub.service_name} in 30+ days. Terminating it saves ${formatCurrency(sub.cost)}/mo.`,
        alert_date: sub.last_used_at || sub.created_at,
        is_read: readAlertIds.has(id),
        service_name: sub.service_name,
        color: "#EC4899",
      });
    }
  });

  return alerts;
};
