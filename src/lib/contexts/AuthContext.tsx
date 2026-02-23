'use client';

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, type UserProfile, type RegisterData } from '@/lib/hooks/useAuth';

// ─── Context shape ──────────────────────────────────────────────────────────

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Public routes that do not require authentication ───────────────────────

const PUBLIC_ROUTES = ['/login', '/register', '/verify', '/'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

// ─── Provider ───────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect logic:
  // - Not authenticated + protected route -> go to login
  // - Authenticated + auth route (except /verify when unverified) -> go to dashboard
  useEffect(() => {
    if (auth.isLoading) return;

    const onPublicRoute = isPublicRoute(pathname);

    if (!auth.isAuthenticated && !onPublicRoute) {
      router.replace('/login');
    }

    if (auth.isAuthenticated && onPublicRoute && pathname !== '/') {
      // Allow /verify page if user is not yet verified
      const isOnVerify = pathname === '/verify' || pathname.startsWith('/verify/');
      const isUnverified = auth.user && !auth.user.verified;

      if (isOnVerify && isUnverified) {
        // Stay on verify page
        return;
      }

      router.replace('/dashboard');
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.user, pathname, router]);

  const value: AuthContextType = {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    verifyOtp: auth.verifyOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      'useAuthContext() must be used within an <AuthProvider>. ' +
        'Wrap your component tree (e.g. in app/layout.tsx) with <AuthProvider>.'
    );
  }
  return ctx;
}

export default AuthContext;
