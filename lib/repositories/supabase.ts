import { ISubscriptionRepository } from "./types";
import { Subscription, Status } from "../calc";
import { createClient } from "../supabase/client";
import { LocalRepository } from "./local";

export class SupabaseRepository implements ISubscriptionRepository {
  private localFallback = new LocalRepository();

  private getClient() {
    return createClient();
  }

  async list(): Promise<Subscription[]> {
    const supabase = this.getClient();
    if (!supabase) {
      return this.localFallback.list();
    }

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("cost", { ascending: false });

      if (error || !data || data.length === 0) {
        return this.localFallback.list();
      }

      return data as Subscription[];
    } catch {
      return this.localFallback.list();
    }
  }

  async getById(id: string): Promise<Subscription | null> {
    const supabase = this.getClient();
    if (!supabase) return this.localFallback.getById(id);

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return this.localFallback.getById(id);
      return data as Subscription;
    } catch {
      return this.localFallback.getById(id);
    }
  }

  async create(sub: Omit<Subscription, "id" | "created_at">): Promise<Subscription> {
    const supabase = this.getClient();
    if (!supabase) return this.localFallback.create(sub);

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert([sub])
        .select()
        .single();

      if (error || !data) return this.localFallback.create(sub);
      return data as Subscription;
    } catch {
      return this.localFallback.create(sub);
    }
  }

  async update(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    const supabase = this.getClient();
    if (!supabase) return this.localFallback.update(id, updates);

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error || !data) return this.localFallback.update(id, updates);
      return data as Subscription;
    } catch {
      return this.localFallback.update(id, updates);
    }
  }

  async remove(id: string): Promise<boolean> {
    const supabase = this.getClient();
    if (!supabase) return this.localFallback.remove(id);

    try {
      const { error } = await supabase.from("subscriptions").delete().eq("id", id);
      if (error) return this.localFallback.remove(id);
      return true;
    } catch {
      return this.localFallback.remove(id);
    }
  }

  async markUsed(id: string, date?: string): Promise<Subscription> {
    const last_used_at = date || new Date().toISOString();
    return this.update(id, { last_used_at });
  }

  async setStatus(id: string, status: Status): Promise<Subscription> {
    return this.update(id, { status });
  }

  async resetToSeed(): Promise<Subscription[]> {
    return this.localFallback.resetToSeed();
  }
}
