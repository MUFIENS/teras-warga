import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';
import { fetchWithRetry } from '@/lib/fetchWithRetry';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (...args) => {
          return fetchWithRetry(args[0], {
            ...args[1],
            cache: 'no-store'
          })
        }
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Metode `setAll` dipanggil dari Komponen Server.
            // Ini bisa diabaikan jika Anda memiliki middleware yang menyegarkan
            // sesi pengguna.
          }
        },
      },
    }
  );
}
