import { ISubscriptionRepository } from "./types";
import { LocalRepository } from "./local";
import { SupabaseRepository } from "./supabase";

let repoInstance: ISubscriptionRepository | null = null;

export const getRepository = (): ISubscriptionRepository => {
  if (!repoInstance) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      repoInstance = new SupabaseRepository();
    } else {
      repoInstance = new LocalRepository();
    }
  }
  return repoInstance;
};
