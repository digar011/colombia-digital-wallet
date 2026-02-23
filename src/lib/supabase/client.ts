import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database';

/**
 * Creates a Supabase client for use in browser/client components.
 *
 * Usage:
 *   import { createClient } from '@/lib/supabase/client';
 *   const supabase = createClient();
 *   const { data } = await supabase.from('citizens').select('*');
 *
 * This client automatically handles cookie-based auth sessions
 * via @supabase/ssr. It uses the anon key which respects RLS policies.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
