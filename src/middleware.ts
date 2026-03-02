import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/utils/logger';

// Routes that do NOT require citizen authentication
const PUBLIC_PATHS = ['/login', '/register', '/verify', '/'];

// Agency routes that are publicly accessible (portal + login)
const AGENCY_PUBLIC_PATHS = ['/agency', '/agency/login'];

// API routes are always allowed through
const API_PREFIX = '/api';

function isPublicPath(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isAgencyPath(pathname: string): boolean {
  return pathname.startsWith('/agency');
}

function isAgencyPublicPath(pathname: string): boolean {
  return AGENCY_PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}?`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow API routes
  if (pathname.startsWith(API_PREFIX)) {
    logger.debug('Middleware: allowing API route', { pathname });
    return NextResponse.next();
  }

  // Always allow static assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ─── Agency routes: separate auth flow ─────────────────────────────────
  if (isAgencyPath(pathname)) {
    // Agency portal and login pages are always accessible
    if (isAgencyPublicPath(pathname)) {
      logger.debug('Middleware: allowing public agency route', { pathname });
      return NextResponse.next();
    }

    // Protected agency pages require agency-token cookie
    const agencyToken = request.cookies.get('agency-token')?.value;
    if (!agencyToken) {
      logger.info('Middleware: agency auth redirect — no token', { pathname, action: 'redirect', target: '/agency/login' });
      const loginUrl = new URL('/agency/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    logger.debug('Middleware: agency route allowed', { pathname });
    return NextResponse.next();
  }

  // ─── Citizen routes: standard auth flow ───────────────────────────────
  const authToken = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!authToken;
  const isPublic = isPublicPath(pathname);

  // If NOT authenticated and trying to access a protected route -> redirect to login
  if (!isAuthenticated && !isPublic) {
    logger.info('Middleware: unauthenticated access blocked', { pathname, action: 'redirect', target: '/login' });
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access an auth page -> redirect to dashboard
  if (isAuthenticated && isPublic && pathname !== '/') {
    logger.info('Middleware: authenticated user redirected from auth page', { pathname, action: 'redirect', target: '/dashboard' });
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  logger.debug('Middleware: route allowed', { pathname, isAuthenticated });
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
