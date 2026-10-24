import { Subscription, Status } from "../calc";
import { ISubscriptionRepository } from "./types";
import { createSeedSubscriptions } from "../seed";

const STORAGE_KEY = "subtrack_subscriptions_v1";

export class LocalRepository implements ISubscriptionRepository {
  private getStorage(): Subscription[] {
    if (typeof window === "undefined") {
      return createSeedSubscriptions();
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createSeedSubscriptions();
      this.setStorage(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      const initial = createSeedSubscriptions();
      this.setStorage(initial);
      return initial;
    }
  }

  private setStorage(subs: Subscription[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
    }
  }

  async list(): Promise<Subscription[]> {
    return this.getStorage();
  }

  async getById(id: string): Promise<Subscription | null> {
    const subs = this.getStorage();
    return subs.find((s) => s.id === id) || null;
  }

  async create(data: Omit<Subscription, "id" | "created_at">): Promise<Subscription> {
    const subs = this.getStorage();
    const newSub: Subscription = {
      ...data,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    subs.unshift(newSub);
    this.setStorage(subs);
    return newSub;
  }

  async update(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    const subs = this.getStorage();
    const idx = subs.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Subscription with id ${id} not found`);
    }
    const updated = { ...subs[idx], ...updates };
    subs[idx] = updated;
    this.setStorage(subs);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const subs = this.getStorage();
    const filtered = subs.filter((s) => s.id !== id);
    if (filtered.length === subs.length) return false;
    this.setStorage(filtered);
    return true;
  }

  async markUsed(id: string, date: string = new Date().toISOString()): Promise<Subscription> {
    return this.update(id, { last_used_at: date });
  }

  async setStatus(id: string, status: Status): Promise<Subscription> {
    return this.update(id, { status });
  }

  async resetToSeed(): Promise<Subscription[]> {
    const freshSeed = createSeedSubscriptions();
    this.setStorage(freshSeed);
    return freshSeed;
  }
}
