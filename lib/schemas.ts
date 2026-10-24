import { z } from "zod";

export const billingCycleEnum = z.enum(["weekly", "monthly", "quarterly", "yearly"]);
export const statusEnum = z.enum(["active", "paused", "cancelled"]);

export const subscriptionSchema = z.object({
  id: z.string().optional(),
  service_name: z.string().min(1, "Service name is required").max(60, "Name too long"),
  category: z.string().min(1, "Category is required"),
  cost: z.number().positive("Cost must be greater than 0"),
  currency: z.string(),
  billing_cycle: billingCycleEnum,
  first_bill_date: z.string().optional(),
  next_billing_date: z.string().min(1, "Next billing date is required"),
  status: statusEnum,
  is_free_trial: z.boolean(),
  trial_end_date: z.string().nullable().optional(),
  reminder_days: z.number().int().min(1).max(30),
  cancel_url: z.string().url("Must be a valid URL").or(z.literal("")).nullable().optional(),
  notes: z.string().max(300, "Notes too long").nullable().optional(),
  color: z.string().optional(),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export const userSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  currency_pref: z.string(),
  default_reminder_days: z.number().int().min(1).max(30),
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
