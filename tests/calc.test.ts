import { describe, it, expect } from "vitest";
import {
  toMonthly,
  monthlyBleed,
  isZombie,
  rollForward,
  percentChange,
  trialsEndingSoon,
  categoryBreakdown,
  Subscription,
} from "../lib/calc";
import { createSeedSubscriptions } from "../lib/seed";
import { subDays, addDays } from "date-fns";

describe("lib/calc.ts mathematical logic suite", () => {
  it("toMonthly correctly normalizes all four billing cycles", () => {
    // weekly: (100 * 52) / 12 = 433.333...
    expect(Math.round(toMonthly(100, "weekly"))).toBe(433);
    // monthly: 500
    expect(toMonthly(500, "monthly")).toBe(500);
    // quarterly: 900 / 3 = 300
    expect(toMonthly(900, "quarterly")).toBe(300);
    // yearly: 1200 / 12 = 100
    expect(toMonthly(1200, "yearly")).toBe(100);
    // zero or negative
    expect(toMonthly(0, "monthly")).toBe(0);
    expect(toMonthly(-50, "monthly")).toBe(0);
  });

  it("monthlyBleed excludes paused and cancelled subscriptions", () => {
    const dummySubs: Subscription[] = [
      {
        id: "1",
        service_name: "Active Sub",
        category: "Streaming",
        cost: 500,
        currency: "INR",
        billing_cycle: "monthly",
        next_billing_date: new Date().toISOString(),
        status: "active",
        is_free_trial: false,
        reminder_days: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        service_name: "Paused Sub",
        category: "Gym",
        cost: 1000,
        currency: "INR",
        billing_cycle: "monthly",
        next_billing_date: new Date().toISOString(),
        status: "paused",
        is_free_trial: false,
        reminder_days: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        service_name: "Cancelled Sub",
        category: "Cloud",
        cost: 300,
        currency: "INR",
        billing_cycle: "monthly",
        next_billing_date: new Date().toISOString(),
        status: "cancelled",
        is_free_trial: false,
        reminder_days: 3,
        created_at: new Date().toISOString(),
      },
      {
        id: "4",
        service_name: "Active Free Trial",
        category: "Streaming",
        cost: 299,
        currency: "INR",
        billing_cycle: "monthly",
        next_billing_date: new Date().toISOString(),
        status: "active",
        is_free_trial: true,
        trial_end_date: addDays(new Date(), 2).toISOString(),
        reminder_days: 3,
        created_at: new Date().toISOString(),
      },
    ];

    expect(monthlyBleed(dummySubs)).toBe(500);
  });

  it("isZombie enforces the exact 30-day boundary threshold", () => {
    const now = new Date("2026-10-14T12:00:00Z");

    const sub29Days: Subscription = {
      id: "z1",
      service_name: "29 Days Sub",
      category: "Streaming",
      cost: 200,
      currency: "INR",
      billing_cycle: "monthly",
      next_billing_date: now.toISOString(),
      status: "active",
      is_free_trial: false,
      reminder_days: 3,
      last_used_at: subDays(now, 29).toISOString(),
      created_at: subDays(now, 60).toISOString(),
    };

    const sub30Days: Subscription = {
      id: "z2",
      service_name: "30 Days Sub",
      category: "Streaming",
      cost: 200,
      currency: "INR",
      billing_cycle: "monthly",
      next_billing_date: now.toISOString(),
      status: "active",
      is_free_trial: false,
      reminder_days: 3,
      last_used_at: subDays(now, 30).toISOString(),
      created_at: subDays(now, 60).toISOString(),
    };

    const paused35Days: Subscription = {
      ...sub30Days,
      status: "paused",
      last_used_at: subDays(now, 35).toISOString(),
    };

    expect(isZombie(sub29Days, now)).toBe(false);
    expect(isZombie(sub30Days, now)).toBe(true);
    // Non-active should never be flagged as active zombie
    expect(isZombie(paused35Days, now)).toBe(false);
  });

  it("rollForward advances past renewal dates across month-ends into future", () => {
    const now = new Date("2026-10-14T12:00:00Z");

    // Past date: 31 Jan 2026, monthly cycle
    const pastDate = new Date("2026-01-31T12:00:00Z");
    const rolled = rollForward(pastDate, "monthly", now);

    expect(rolled.getTime()).toBeGreaterThanOrEqual(now.getTime());
  });

  it("percentChange calculates delta correctly and handles zero without NaN", () => {
    expect(percentChange(100, 50)).toBe(100); // 100% up
    expect(percentChange(80, 100)).toBe(-20); // 20% down
    expect(percentChange(500, 0)).toBe(100);
    expect(percentChange(0, 0)).toBe(0);
  });

  it("trialsEndingSoon isolates trials ending within target window", () => {
    const now = new Date("2026-10-14T12:00:00Z");

    const subs: Subscription[] = [
      {
        id: "t1",
        service_name: "Prime (48h trial)",
        category: "Streaming",
        cost: 299,
        currency: "INR",
        billing_cycle: "monthly",
        next_billing_date: now.toISOString(),
        status: "active",
        is_free_trial: true,
        trial_end_date: addDays(now, 2).toISOString(),
        reminder_days: 3,
        created_at: now.toISOString(),
      },
      {
        id: "t2",
        service_name: "Trial 15 Days Away",
        category: "Cloud",
        cost: 500,
        currency: "INR",
        billing_cycle: "monthly",
        next_billing_date: now.toISOString(),
        status: "active",
        is_free_trial: true,
        trial_end_date: addDays(now, 15).toISOString(),
        reminder_days: 3,
        created_at: now.toISOString(),
      },
    ];

    const alerts = trialsEndingSoon(subs, 7, now);
    expect(alerts.length).toBe(1);
    expect(alerts[0].service_name).toBe("Prime (48h trial)");
  });

  it("calibrated seed data produces exact target bleed of ₹3,849", () => {
    const seed = createSeedSubscriptions();
    expect(monthlyBleed(seed)).toBe(3849);
  });
});
