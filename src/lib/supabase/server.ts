import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types/database';

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers (anywhere that runs on the server within Next.js).
 *
 * Usage in a Server Component:
 *   import { createClient } from '@/lib/supabase/server';
 *   export default async function Page() {
 *     const supabase = createClient();
 *     const { data } = await supabase.from('citizens').select('*');
 *     return <div>{JSON.stringify(data)}</div>;
 *   }
 *
 * This client reads and writes cookies through Next.js `cookies()` API
 * to maintain auth sessions across requests.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // The `setAll` method is called from a Server Component where
            // cookies cannot be set. This is safe to ignore if you have
            // middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase admin client using the service role key.
 * This client bypasses RLS and should ONLY be used for
 * server-side admin operations (e.g., creating users, bulk operations).
 *
 * WARNING: Never expose this client or the service role key to the browser.
 */
export function createAdminClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
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
            // Safe to ignore in Server Components
          }
        },
      },
    }
  );
}
