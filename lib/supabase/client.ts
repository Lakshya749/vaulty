import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates an isomorphic Supabase browser client.
 * If credentials are not configured in environment variables, returns null
 * to signal graceful fallback to LocalRepository (offline demo mode).
 */
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
