import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Root landing page.
 *
 * - If the user is authenticated, redirect to /dashboard.
 * - If not authenticated, redirect to /login.
 *
 * This is a server component that performs the check before rendering.
 */
export default async function RootPage() {
  let isAuthenticated = false;

  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    isAuthenticated = !!session;
  } catch {
    // If supabase client fails (e.g., missing env vars during development),
    // fall back to unauthenticated state.
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
