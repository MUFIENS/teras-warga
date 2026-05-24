import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

/**
 * Public Supabase Client (No Cookies)
 * 
 * This client is used exclusively for fetching public data inside
 * `unstable_cache` or other scenarios where `cookies()` cannot be used.
 * It uses the anonymous key and therefore only has access to data that is
 * publicly readable via Row Level Security (RLS).
 */
export function createPublicClient() {
  // Using createBrowserClient here even on the server because we don't want 
  // to pass any cookies or Next.js headers to it. It simply acts as a standard
  // fetch client.
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
