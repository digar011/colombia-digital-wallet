import { redirect } from 'next/navigation';

/**
 * Root landing page.
 *
 * Redirects to /login by default.
 * In production with Supabase configured, this would check auth state
 * and redirect to /dashboard if authenticated.
 */
export default function RootPage() {
  redirect('/login');
}
