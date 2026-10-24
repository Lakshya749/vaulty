import { Subscription, Status } from "../calc";

export interface ISubscriptionRepository {
  list(): Promise<Subscription[]>;
  getById(id: string): Promise<Subscription | null>;
  create(sub: Omit<Subscription, "id" | "created_at">): Promise<Subscription>;
  update(id: string, updates: Partial<Subscription>): Promise<Subscription>;
  remove(id: string): Promise<boolean>;
  markUsed(id: string, date?: string): Promise<Subscription>;
  setStatus(id: string, status: Status): Promise<Subscription>;
  resetToSeed(): Promise<Subscription[]>;
}
